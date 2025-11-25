import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { generateAndUploadQRCode } from '@/lib/qrcode';

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

    // Check if user already exists in User table
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    // If user doesn't exist, check external users table and create new user
    if (!user) {
      // Check if user exists in external users table
      const externalUser = await prisma.externalUser.findFirst({
        where: { phone_number: phone },
      });

      if (!externalUser) {
        return Response.json(
          { error: 'Phone number not found in the system' },
          { status: 404 }
        );
      }

      // Generate and upload QR code
      const qrCodeUrl = await generateAndUploadQRCode(phone);

      // Create user with data from external user
      user = await prisma.user.create({
        data: {
          name: externalUser.fullname || externalUser.nickname || 'User',
          phone: phone,
          role: 'user',
          qrCode: qrCodeUrl,
        },
      });
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
