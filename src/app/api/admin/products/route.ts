import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') ?? '';
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = 20;

    const where = search ? {
      OR: [
        { titleAr: { contains: search } },
        { titleEn: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search } },
      ]
    } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, ...data } = body;

    const product = await prisma.product.create({
      data: {
        ...data,
        slug: data.slug || data.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: images?.length ? {
          create: images.map((url: string, i: number) => ({
            url, isPrimary: i === 0, sortOrder: i,
          })),
        } : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
