import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { z } from 'zod';

const scrapeRequestSchema = z.object({
  url: z.string().url("Invalid URL format"),
  apiKey: z.string().min(1, "API Key is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = scrapeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Validation Error", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { url, apiKey: providedKey } = validation.data;

    // base64 decoding
    let decodedApiKey: string;
    try {
      decodedApiKey = Buffer.from(providedKey, 'base64').toString('utf-8');
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid API Key encoding" }, { status: 400 });
    }

    const apiKey = await prisma.apiKey.findUnique({ where: { key: decodedApiKey }, include: { user: true }});

    if (!apiKey || !apiKey.isActive) {
      return NextResponse.json({ success: false, message: "Invalid or inactive API Key" }, { status: 401 });
    }

    const user = apiKey.user;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      include: { plan: true }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, message: "No active subscription" }, { status: 403 });
    }

    const activeJobs = await prisma.scrapeJob.count({
      where: {
        userId: user.id,
        status: 'PROCESSING'
      }
    });

    const scrapeCost = activeJobs > 0 ? 1 : 0;

    if (scrapeCost > 0 && apiKey.balance < scrapeCost) {
      return NextResponse.json({ success: false, message: "Concurrent scraping requires 1 token. Insufficient balance" }, { status: 402 });
    }

    const usage = await prisma.subscriptionUsage.findUnique({ where: { userId: user.id } });
    
    // Find or create project
    let project = await prisma.project.findFirst({ where: { userId: user.id, url: url } });

    if (!project) {

      if ((usage?.projectsAdded || 0) >= subscription.plan.maxProjects) {
        return NextResponse.json({ success: false, message: "Project limit reached" }, { status: 400 });
      }

      project = await prisma.project.create({
        data: {
          userId: user.id,
          url,
          name: new URL(url).hostname,
          status: 'PENDING',
        }
      });

      await prisma.subscriptionUsage.upsert({
        where: { userId: user.id },
        update: { projectsAdded: { increment: 1 } },
        create: { userId: user.id, projectsAdded: 1 }
      });
    }
    
    const job = await prisma.scrapeJob.create({
      data: {
        userId: user.id,
        projectId: project.id,
        status: 'PROCESSING',
        cost: scrapeCost,
        log: `Scrape started. Cost: ${scrapeCost} tokens`
      }
    });

    await prisma.project.update({ where: { id: project.id }, data: { status: 'PROCESSING' } });

    try {
      const pythonUrl = process.env.PYTHON_API_URL;
      if (!pythonUrl) {
        throw new Error("PYTHON_API_URL is not defined");
      }

      const res = await axios.post(`${pythonUrl}/scrape`, { url: project.url });

      const { base_dir_base64, session_id, success, file_name, rows } = res.data;

      if (!success || !base_dir_base64 || !session_id) {
        throw new Error("Python API scrape failed");
      }

      // Update Project
      await prisma.project.update({
        where: { id: project.id },
        data: { 
          status: 'COMPLETED',
          csvPath: base_dir_base64,
          lastScrapedAt: new Date()
        }
      });

      // Create Chat Log
      await prisma.chatLog.create({
        data: {
            userId: user.id,
            projectId: project.id,
            sessionId: session_id,
            messageCount: 0, 
            tokensUsed: 0 
        }
      });

      // Update Scrape Job
      await prisma.scrapeJob.update({
        where: { id: job.id },
        data: { 
          status: 'COMPLETED', 
          completedAt: new Date(), 
          log: 'Scrape successful' 
        }
      });

      // Deduct Tokens 
      if (scrapeCost > 0) {
        await prisma.apiKey.update({ where: { userId: user.id }, data: { balance: { decrement: scrapeCost } }});
      }

       await prisma.subscriptionUsage.update({
          where: { userId: user.id },
          data: { creditsUsed: { increment: scrapeCost } }
       });

      return NextResponse.json({ success: true, message: "Scraping completed", base_dir_base64, session_id, file_name, rows }, { status: 200 });

    } catch (error) {
      await prisma.project.update({ where: { id: project.id }, data: { status: 'FAILED' } });
      
      await prisma.scrapeJob.update({ where: { id: job.id },
        data: { 
          status: 'FAILED', 
          completedAt: new Date(), 
          log: error || "Python Scrapping failed"
        }
      });

      return NextResponse.json({ success: false, message: "Scraping failed", error }, { status: 502 });
    }

  } catch (error) {
    console.error("Scrape API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}