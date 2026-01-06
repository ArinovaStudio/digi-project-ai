import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyUser();
    if (!auth.success || !auth.user) {
      return NextResponse.json( { success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.user.id;
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 } );
    }

    return NextResponse.json( { success: true, message: 'Password verified' }, { status: 200 });

  } catch (error) {
    console.error('Password Verification Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}