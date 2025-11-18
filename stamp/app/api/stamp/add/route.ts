import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, unauthorizedResponse, requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);
    
    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Only admin can add stamps
    requireAdmin(currentUser);

    const data = await req.json();
    const { phone, amount = 1 } = data;

    if (!phone) {
      return NextResponse.json(
        { error: 'User phone number is required' },
        { status: 400 }
      );
    }

    // Find user by phone (from QR code scan)
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find sponsor managed by current admin
    const sponsor = await prisma.sponsor.findFirst({
      where: { adminId: currentUser.userId },
    });

    if (!sponsor) {
      return NextResponse.json(
        { error: 'No sponsor found for this admin' },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await prisma.stampTransaction.create({
      data: {
        userId: user.id,
        sponsorId: sponsor.id,
        amount,
      },
    });

    // Update or create UserStamp total
    const userStamp = await prisma.userStamp.upsert({
      where: {
        userId_sponsorId: {
          userId: user.id,
          sponsorId: sponsor.id,
        },
      },
      update: {
        total: {
          increment: amount,
        },
      },
      create: {
        userId: user.id,
        sponsorId: sponsor.id,
        total: amount,
      },
    });

    return NextResponse.json({
      transaction,
      newTotal: userStamp.total,
      user: {
        name: user.name,
        phone: user.phone,
      },
      sponsor: {
        name: sponsor.name,
      },
    }, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Add stamp error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
