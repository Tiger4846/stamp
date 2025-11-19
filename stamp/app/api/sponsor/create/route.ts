import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, adminPhone, level, logoUrl } = data;

    if (!name || !level || !adminPhone) {
      return NextResponse.json(
        { error: 'Name, level, and adminPhone are required' },
        { status: 400 }
      );
    }

    // Check if sponsor name already exists
    const existingSponsor = await prisma.sponsor.findFirst({
      where: { name },
    });

    if (existingSponsor) {
      return NextResponse.json(
        { error: 'Sponsor name already exists' },
        { status: 409 }
      );
    }

    // Find admin user by phone
    const adminUser = await prisma.user.findUnique({
      where: { phone: adminPhone },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found with this phone number' },
        { status: 404 }
      );
    }

    // Check if user is admin
    if (adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'User must have admin role to manage sponsor' },
        { status: 403 }
      );
    }

    // Check if admin already owns a sponsor
    const existingAdminSponsor = await prisma.sponsor.findFirst({
      where: { adminId: adminUser.id },
    });

    if (existingAdminSponsor) {
      return NextResponse.json(
        { error: 'This admin already owns a sponsor booth' },
        { status: 409 }
      );
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        phone: null,
        level,
        adminId: adminUser.id,
        logoUrl: logoUrl || null,
      },
    });

    return NextResponse.json(sponsor, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Create sponsor error:', error);
    
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
 