import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { _count: { select: { productLinks: true, importJobs: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(suppliers);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supplier = await prisma.supplier.create({ data: body });
    return NextResponse.json(supplier, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
