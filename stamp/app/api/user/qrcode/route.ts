import { NextRequest } from 'next/server';
import { getCurrentUser, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Fetch QR code from database
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        qrCode: true,
        phone: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      qrCode: user.qrCode,
      phone: user.phone,
    });

  } catch (error) {
    console.error('Get QR code error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
