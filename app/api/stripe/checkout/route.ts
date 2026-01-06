import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyUser();
    if (!auth.success || !auth.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const user = auth.user;

    const body = await req.json();
    const { planId } = body;


    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({  success: false, message: 'Invalid Plan' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id }
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(plan.price) * 100),
      currency: 'inr',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      description: plan.description || `Purchase of ${plan.name}`,
      
      metadata: {
        userId: user.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret }, { status: 200 });

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}