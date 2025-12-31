import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';
import { z } from 'zod';

const planSchema = z.object({
  name: z.string().min(2, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  stripePriceId: z.string().min(1, "Stripe Price ID is required"),
  monthlyCredits: z.number().int().positive("Credits must be positive"),
  maxProjects: z.number().int().min(1).default(1),
  scrapeFrequency: z.enum(['WEEKLY', 'DAILY', 'HOURLY']).default('WEEKLY'),
});

export async function POST(req: NextRequest) {
  try {
    const response = await verifyUser();
    const user = response.user;

    if (response.success === false || !user) {
      return NextResponse.json({ success: false, message: response.message }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validation = planSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Validation Error", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description, price, stripePriceId, monthlyCredits, maxProjects, scrapeFrequency } = validation.data;
 
    const newPlan = await prisma.plan.create({
      data: { name, description, price, stripePriceId, monthlyCredits, maxProjects, scrapeFrequency }
    });

    return NextResponse.json({ success: true, message: 'Plan created successfully', plan: newPlan }, { status: 201 });
  } catch (error) {
    console.error('Create Plan Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { price: 'asc' }});

    return NextResponse.json({ success: true, plans }, { status: 200 });
  } catch (error) {
    console.error('Get Plans Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch plans' }, { status: 500 });
  }
}