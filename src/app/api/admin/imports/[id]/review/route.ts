import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const { rowId, action } = await req.json();

    if (!rowId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'rowId and action (approve|reject) required' }, { status: 400 });
    }

    const row = await prisma.importRow.findUnique({
      where: { id: rowId },
      include: { job: { include: { supplier: true } } },
    });
    if (!row || row.job.id !== jobId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'reject') {
      await prisma.importRow.update({ where: { id: rowId }, data: { status: 'REJECTED', reviewedAt: new Date() } });
      return NextResponse.json({ ok: true, action: 'rejected' });
    }

    // Approve: create a draft product
    const slug = `${(row.titleEn || row.titleAr || row.supplierSku).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const sellingPrice = row.sellingPrice ?? (Number(row.costPrice) * 1.4);

    const product = await prisma.product.create({
      data: {
        slug,
        titleAr: row.titleAr || row.titleEn || row.supplierSku,
        titleEn: row.titleEn || row.titleAr || row.supplierSku,
        sellingPrice,
        costPrice: row.costPrice ?? undefined,
        stock: row.stock ?? 0,
        leadTimeDays: row.leadTimeDays ?? null,
        isActive: false, // draft — admin must activate
        supplierLinks: {
          create: {
            supplierId: row.job.supplierId,
            supplierSku: row.supplierSku,
            costPrice: row.costPrice ?? sellingPrice,
            leadTimeDays: row.leadTimeDays ?? null,
          },
        },
      },
    });

    await prisma.importRow.update({
      where: { id: rowId },
      data: { status: 'APPROVED', productId: product.id, reviewedAt: new Date() },
    });

    return NextResponse.json({ ok: true, action: 'approved', productId: product.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
