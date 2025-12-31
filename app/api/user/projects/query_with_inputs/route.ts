import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';
import axios from 'axios';
import { z } from 'zod';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

const chatRequestSchema = z.object({
  projectId: z.string().uuid(),
  query: z.string().min(1, "Query cannot be empty"),
  sessionId: z.string().default(() => crypto.randomUUID()),
  top_k: z.number().optional().default(3)
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

    if (apiKey && apiKey.balance < 1) {
         return NextResponse.json({ success: false, message: "Insufficient tokens." }, { status: 402 });
    }

    const body = await req.json();
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ success: false, errors: validation.error.flatten().fieldErrors }, { status: 400 });
    
    const { projectId, query, sessionId, top_k } = validation.data;

    const project = await prisma.project.findUnique({
        where: { id: projectId, userId: user.id }
    });

    if (!project || project.status !== 'COMPLETED' || !project.csvPath) {
        return NextResponse.json({ success: false, message: "Project not ready." }, { status: 404 });
    }

    const filePath = path.resolve(project.csvPath);
    if (!fs.existsSync(filePath)) return NextResponse.json({ success: false, message: "CSV file missing." }, { status: 500 });

    const form = new FormData();
    form.append('csv_file', fs.createReadStream(filePath));
    form.append('query_json', Buffer.from(JSON.stringify({
        query: query,
        top_k: top_k,
        session_id: sessionId 
    })), { filename: 'query.json', contentType: 'application/json' });

    const startTime = Date.now();

    const pythonUrl = process.env.PYTHON_API_URL; 
    const response = await axios.post(`${pythonUrl}/query_with_inputs`, form, {
        headers: { ...form.getHeaders() }
    });

    const aiData = response.data;
    const latency = Date.now() - startTime; 

    await prisma.chatLog.create({
        data: {
            userId: user.id,
            projectId: project.id,
            sessionId: sessionId, 
            messageCount: 1,     
            tokensUsed: 1,       
            latency: latency,    
            recommendedLinks: aiData.product_links || [] 
        }
    });

    if (apiKey) {
        await prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { balance: { decrement: 1 } }
        });
    }

    return NextResponse.json({ 
        success: true, 
        answer: aiData.final_answer,
        products: aiData.product_links,
        context: aiData.query,
        sessionId: sessionId 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json({ success: false, message: "Failed to process query." }, { status: 500 });
  }
}