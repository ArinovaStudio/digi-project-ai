import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';
import axios from 'axios';
import { z } from 'zod';
 

const scrapeRequestSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export async function POST(req: NextRequest) {
  try {
    let user = null;
    let apiKey = null;

    const providedKey = req.headers.get('x-api-key');

    if (providedKey) {
        apiKey = await prisma.apiKey.findUnique({
            where: { key: providedKey },
            include: { user: true } 
        });

        if (!apiKey || !apiKey.isActive) {
            return NextResponse.json({ success: false, message: "Invalid or inactive API Key" }, { status: 401 });
        }

        user = apiKey.user;
    }

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({ 
        where: { userId: user.id },
        include: { plan: true }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
        return NextResponse.json({ success: false, message: "No active subscription" }, { status: 403 });
    }

    if (!apiKey) {
        return NextResponse.json({ success: false, message: "API Key not found" }, { status: 404 });
    }

    if (apiKey.balance < 1) {
         return NextResponse.json({ success: false, message: `Insufficient tokens.` }, { status: 402 });
    }

    const body = await req.json();
    const validation = scrapeRequestSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ success: false, errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const { url } = validation.data;

    const usage = await prisma.subscriptionUsage.findUnique({ where: { userId: user.id } });
    let project = await prisma.project.findFirst({ where: { userId: user.id, url: url }});

    // Project creation
    if (!project) {
        if ((usage?.projectsAdded || 0) >= subscription.plan.maxProjects) {
            return NextResponse.json({ success: false, message: "Project limit reached." }, { status: 400 });
        }

        project = await prisma.project.create({
            data: {
                userId: user.id,
                url,
                name: new URL(url).hostname,
                status: 'PENDING'
            }
        });

        await prisma.subscriptionUsage.update({
            where: { userId: user.id },
            data: { projectsAdded: { increment: 1 } }
        });
    }

    const job = await prisma.scrapeJob.create({
        data: {
            userId: user.id,
            projectId: project.id,
            status: 'PROCESSING',
            log: `Scrape started`
        }
    });

    await prisma.project.update({ where: { id: project.id }, data: { status: 'PROCESSING' } });

    try {
        const pythonUrl = process.env.PYTHON_API_URL;

        if (!pythonUrl) {
            return NextResponse.json({ success: false, message: "Python API URL not found" }, { status: 500 });
        }

        const apiResponse = await axios.post(`${pythonUrl}/run-scrape`, { url: project.url },
            { responseType: 'arraybuffer' } 
        );

        const savedPath = await saveFile(apiResponse.data, `scrape_${project.id}`);
        
        await prisma.project.update({
            where: { id: project.id },
            data: { 
                status: 'COMPLETED',
                csvPath: savedPath,
                lastScrapedAt: new Date()
            }
        });

        await prisma.scrapeJob.update({
            where: { id: job.id },
            data: { status: 'COMPLETED', completedAt: new Date(), log: 'Scrape successful' }
        });

        await prisma.apiKey.update({
            where: { userId: user.id },
            data: { 
                balance: { decrement: 1 } 
            }
        });

        await prisma.subscriptionUsage.update({
            where: { userId: user.id },
            data: { creditsUsed: { increment: 1 } }
        });

        return NextResponse.json({ success: true, message: "Scraping completed." }, { status: 200 });

    } catch (pythonError: any) {
        console.error("Python Scraper Error:", pythonError.message);

        await prisma.project.update({ where: { id: project.id }, data: { status: 'FAILED' } });
        await prisma.scrapeJob.update({
            where: { id: job.id },
            data: { status: 'FAILED', completedAt: new Date(), log: pythonError.message || "Scrape failed" }
        });

        return NextResponse.json({ success: false, message: "Scraping failed." }, { status: 502 });
    }

  } catch (error) {
    console.error("Scrape API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}