import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, unauthorizedResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get current user from token
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already claimed
    if (user.isClaimed) {
      return NextResponse.json(
        { error: 'User already claimed' },
        { status: 409 }
      );
    }

    // Update user to claimed
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: { isClaimed: true },
    });

    return NextResponse.json(
      { 
        message: 'User claimed successfully',
        user: updatedUser 
      },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error('Claim user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
