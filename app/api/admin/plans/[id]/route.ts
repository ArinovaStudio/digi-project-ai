import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';
import { z } from 'zod';

const updatePlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  monthlyCredits: z.number().int().optional(),
  maxProjects: z.number().int().optional(),
  scrapeFrequency: z.enum(['WEEKLY', 'DAILY', 'HOURLY']).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const validation = updatePlanSchema.safeParse(body);
    const { id: planId } = await params;

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const existingPlan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!existingPlan) {
      return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });
    }

    const updatedPlan = await prisma.plan.update({ where: { id: planId }, data: validation.data });

    return NextResponse.json({ success: true, message: 'Plan updated', plan: updatedPlan }, { status: 200 });

  } catch (error) {
    console.error('Update Plan Error:', error);
    return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const response = await verifyUser();
    const user = response.user;

    if (response.success === false || !user) {
      return NextResponse.json({ success: false, message: response.message }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id: planId } = await params;

    const existingPlan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!existingPlan) {
      return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });
    }

    await prisma.plan.delete({ where: { id: planId } });

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete Plan Error:', error);
    return NextResponse.json({ success: false, message: 'Plan not found or linked to active subscriptions' }, { status: 400 });
  }
}