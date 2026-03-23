/**
 * PATCH /api/marketing/approve
 * Body: { id, status: 'APPROVED' | 'PUBLISHED' | 'DRAFT', teamNotes?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, teamNotes } = await req.json();

    if (!id || !['DRAFT', 'APPROVED', 'PUBLISHED'].includes(status)) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    const record = await prisma.marketingContent.update({
      where: { id },
      data: {
        status,
        ...(teamNotes !== undefined && { teamNotes }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
