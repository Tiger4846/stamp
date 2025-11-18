import { NextRequest } from 'next/server';
import { getCurrentUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return unauthorizedResponse();
    }

    // Return QR code URL from JWT payload or fetch from DB
    return Response.json({
      qrCode: currentUser.qrCode || `Generated QR for ${currentUser.phone}`,
      phone: currentUser.phone,
    });

  } catch (error) {
    console.error('Get QR code error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
