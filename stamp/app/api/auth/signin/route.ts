import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    // Validate input
    if (!phone) {
      return Response.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        qrCode: user.qrCode,
      },
      token,
    });

  } catch (error) {
    console.error('Signin error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
