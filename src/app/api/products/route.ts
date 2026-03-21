/**
 * GET /api/products — list all active products from DB
 * Used by external integrations (Salla, Zid, mobile apps)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);

    const products = await prisma.product.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => {
        const ext = p as unknown as { imageUrl?: string; supplier?: string; category?: string; stockLevel?: number };
        return {
          id: p.id,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          descAr: p.descAr,
          finalPrice: p.finalPrice,
          imageUrl: ext.imageUrl ?? '',
          supplier: ext.supplier ?? 'cj',
          category: ext.category ?? '',
          stockLevel: ext.stockLevel ?? 0,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
