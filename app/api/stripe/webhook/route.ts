import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;
  const planId = paymentIntent.metadata?.planId;

  if (!userId || !planId) {
    throw new Error('Missing metadata in Stripe Webhook');
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan){
    throw new Error('Plan not found');
  }

  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(now.getDate() + 30); // 30 days

  await prisma.$transaction([
    
    // Create Payment Record
    prisma.payment.create({
      data: {
        userId: userId,
        amount: Number(paymentIntent.amount) / 100, 
        currency: paymentIntent.currency || 'inr',
        status: 'COMPLETED',
        description: `Purchase of ${plan.name}`,
        stripePaymentId: paymentIntent.id,
      }
    }),

    // Update User
    prisma.user.update({
      where: { id: userId },
      data: { isActive: true }
    }),

    // Update User Subscription
    prisma.subscription.upsert({
      where: { userId: userId },
      update: {
        status: 'ACTIVE',
        planId: plan.id,
        currentPeriodStart: now,
        currentPeriodEnd: expiryDate,
      },
      create: {
        userId: userId,
        planId: plan.id,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: expiryDate,
      },
    }),

    // Add Tokens to API Key
    prisma.apiKey.update({
      where: { userId: userId },
      data: {
        balance: plan.monthlyCredits,
        isActive: true
      }
    }),

    // Reset Usage Stats
    prisma.subscriptionUsage.upsert({
      where: { userId: userId },
      update: { creditsUsed: 0 },
      create: { userId: userId, creditsUsed: 0, projectsAdded: 0 }
    })
  ]);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = (await headers()).get('stripe-signature') as string;

        const event: Stripe.Event = stripe.webhooks.constructEvent(
            body, signature, process.env.STRIPE_WEBHOOK_SECRET!
        );

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentSuccess(paymentIntent);
        }

        return NextResponse.json({ success: true, message: "Success" }, { status: 200 });
    } catch (error) {
        console.error("Stripe Webhook Error",error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });   
    }
}