import { NextRequest } from 'next/server';
import { getCurrentUser, unauthorizedResponse } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Get all stamps for current user from all sponsors
    const userStamps = await prisma.userStamp.findMany({
      where: {
        userId: currentUser.userId,
      },
      include: {
        sponsor: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: {
        total: 'desc',
      },
    });

    // Calculate total stamps across all sponsors
    const totalStamps = userStamps.reduce((sum: number, stamp: { total: number }) => sum + stamp.total, 0);

    return Response.json({
      stamps: userStamps.map((stamp: { sponsorId: string; sponsor: { name: string; level: string }; total: number }) => ({
        sponsorId: stamp.sponsorId,
        sponsorName: stamp.sponsor.name,
        sponsorLevel: stamp.sponsor.level,
        total: stamp.total,
      })),
      totalStamps,
      sponsorCount: userStamps.length,
    });

  } catch (error) {
    console.error('Get user stamps error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
