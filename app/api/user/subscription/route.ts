import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await verifyUser();

    if (!auth.success || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message || "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    const [subscription, usage, apiKey] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId: user.id },
        include: { plan: true }
      }),
      
      prisma.subscriptionUsage.findUnique({ where: { userId: user.id } }),

      prisma.apiKey.findUnique({ where: { userId: user.id }, select: { balance: true }})
    ]);

    const responseData = {
      plan: subscription ? {
        name: subscription.plan.name,
        status: subscription.status,
        price: subscription.plan.price,
        renewalDate: subscription.currentPeriodEnd,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
      } : null,
      
      usage: {
        projects: {
          used: usage?.projectsAdded || 0,
          limit: subscription?.plan.maxProjects || 1,
        },
        credits: {
          usedThisMonth: usage?.creditsUsed || 0,
          monthlyAllowance: subscription?.plan.monthlyCredits || 0,
          currentBalance: apiKey?.balance || 0 
        }
      }
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });

  } catch (error) {
    console.error("Fetch Subscription Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}