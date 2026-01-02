import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { z } from 'zod';

const queryRequestSchema = z.object({
  session_id: z.string().min(1, "Session ID is required"),
  query: z.string().min(1, "Query is required"),
  top_k: z.number().optional().default(3),
  end_chat: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const providedKey = req.headers.get('x-api-key');

    if (!providedKey) {
      return NextResponse.json({ success: false, message: "Api Key not provided" }, { status: 401 });
    }

    const apiKey = await prisma.apiKey.findUnique({ where: { key: providedKey }, include: { user: true }});

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

    if (apiKey.balance < 1) {
      return NextResponse.json({ success: false, message: "Insufficient tokens." }, { status: 402 });
    }

    const body = await req.json();
    const validation = queryRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Validation Error", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { session_id, query, top_k, end_chat } = validation.data;

    const chatLog = await prisma.chatLog.findUnique({ where: { sessionId: session_id }, include: { project: true }});

    if (!chatLog) {
      return NextResponse.json({ success: false, message: "Invalid Session ID. Please Scrape first" }, { status: 404 });
    }

    if (chatLog.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized access to this session" }, { status: 403 });
    }

    try {
      const pythonUrl = process.env.PYTHON_API_URL;
      if (!pythonUrl) {
        throw new Error("PYTHON_API_URL is not defined");
      }

      const res = await axios.post(`${pythonUrl}/query`, {
        session_id,
        page_url: chatLog.project.url,
        query: query || "",
        top_k,
        token_init: apiKey.balance,
        end_chat
      });

      const data = res.data;

      if (!data.success) {
        throw new Error("Python API returned failure");
      }
      
      // Extract new links
      const newLinks: string[] = [];
      if (data.top_results && Array.isArray(data.top_results)) {
        data.top_results.forEach((item: any) => {
          if (item.url) newLinks.push(item.url);
        });
      }

      const existingLinks = new Set(chatLog.recommendedLinks);
      newLinks.forEach(link => existingLinks.add(link));
      const updatedLinks = Array.from(existingLinks);

      await prisma.$transaction([

        // Update Chat Log
        prisma.chatLog.update({
          where: { id: chatLog.id },
          data: {
            messageCount: { increment: 1 },
            tokensUsed: { increment: 1 },
            recommendedLinks: updatedLinks,
          }
        }),

        // Deduct Tokens
        prisma.apiKey.update({
          where: { userId: user.id },
          data: { balance: { decrement: 1 } }
        }),

        prisma.subscriptionUsage.update({
          where: { userId: user.id },
          data: { creditsUsed: { increment: 1 } }
        })
      ]);

      return NextResponse.json(data, { status: 200 });

    } catch (pythonError: any) {
      console.error("Query Engine Error:", pythonError.message);
      
      // If end_chat was true, maybe it succeeded even if something else failed? 
      // But generally, if python fails, we return error and DO NOT deduct token.
      
      return NextResponse.json({ 
        success: false, 
        message: "Query processing failed.", 
        details: pythonError.response?.data || pythonError.message 
      }, { status: 502 });
    }

  } catch (error) {
    console.error("Query API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}