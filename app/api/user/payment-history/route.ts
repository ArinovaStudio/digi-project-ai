import { verifyUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const auth = await verifyUser();
        if (!auth.success || !auth.user) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        
        const user = auth.user;

        const payments = await prisma.payment.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, message: 'Payment history', payments }, { status: 200 });
    }
    catch (error) {
        console.error('Get Payment History Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}