import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAndUploadQRCode } from '@/lib/qrcode';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, role = 'user' } = body;

    // Validate input
    if (!name || !phone) {
      return Response.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return Response.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Generate and upload QR code
    const qrCodeUrl = await generateAndUploadQRCode(phone);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role,
        qrCode: qrCodeUrl,
      },
    });

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
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
