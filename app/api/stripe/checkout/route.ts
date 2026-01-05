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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'amazon_pay', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: plan.name,
              description: plan.description || `Subscription for ${plan.name}`,
            },
            unit_amount: Math.round(Number(plan.price) * 100), // in paisa 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      success_url: `${process.env.NEXT_APP_URL}/dashboard?payment_success=true`,
      cancel_url: `${process.env.NEXT_APP_URL}/plans?payment_success=false`,
      customer_email: user.email,

      metadata: {
        userId: user.id,
        planId: plan.id,
      },
      
    //   customer_creation: user.stripeCustomerId ? undefined : 'always',
    //   customer: user.stripeCustomerId || undefined,
    });

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}