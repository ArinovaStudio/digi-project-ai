import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await verifyUser();

    if (!auth.success || !auth.user) {
      return NextResponse.json( { success: false, message: auth.message || "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, projects }, { status: 200 });

  } catch (error) {
    console.error("Fetch Projects Error:", error);
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 });
  }
}