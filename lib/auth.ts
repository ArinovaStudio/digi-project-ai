import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface UserPayload {
  userId: string;
  role: string;
  email: string;
}

export async function verifyUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
       return { success: false, message: 'JWT_SECRET is not defined' };
    }

    const decoded = jwt.verify(token, secret) as UserPayload;
    if (!decoded || !decoded.userId) {
      return { success: false, message: 'Invalid token' };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        stripeCustomerId: true,
      },
    });

    
    if (!user || !user.isActive) {
      return { success: false, message: 'User is not active' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, message: 'Internal Server Error' };
  }
}