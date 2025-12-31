import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import crypto from 'crypto';

const registerValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character"),
});

interface UserPayload {
  userId: string;
  role: string;
  email: string;
}

function generateApiKey() {
  return crypto.randomBytes(24).toString('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = registerValidation.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password, name } = validationResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let freePlan = await prisma.plan.findUnique({ where: { name: 'Free' } });
      
    if (!freePlan) {
      freePlan = await prisma.plan.create({
        data: {
          name: 'Free',
          price: 0,
          stripePriceId: '',
          monthlyCredits: 100, 
          maxProjects: 1
        }
      });
    }

    const user = await prisma.user.create({ data: { email, name, password: hashedPassword } });

    await prisma.apiKey.create({ data: { userId: user.id, key: generateApiKey(), balance: freePlan.monthlyCredits, isActive: true } });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: freePlan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      }
    });

    await prisma.subscriptionUsage.create({
      data: { userId: user.id, creditsUsed: 0, projectsAdded: 0 }
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const payload: UserPayload = {
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

    return NextResponse.json({ success: true, message: 'User registered successfully', user: restData }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}