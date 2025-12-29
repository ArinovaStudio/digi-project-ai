import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = loginValidation.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ success: false, message: "Invalid inputs", errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, message: 'Account is disabled. Please contact support.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret){
        throw new Error('JWT_SECRET is not defined');
    }

    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    const { password: _, ...restData } = user;

    return NextResponse.json({ success: true, message: 'Login successful', user: restData }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}