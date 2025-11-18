import { NextRequest } from 'next/server';
import { getCurrentUser, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        qrCode: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ user });

  } catch (error) {
    console.error('Get current user error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
