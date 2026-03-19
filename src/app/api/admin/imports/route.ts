import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

export async function GET() {
  try {
    const jobs = await prisma.importJob.findMany({
      include: { supplier: true, _count: { select: { rows: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplierId, csvContent, filename } = body;

    if (!supplierId || !csvContent) {
      return NextResponse.json({ error: 'supplierId and csvContent required' }, { status: 400 });
    }

    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });

    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const rows = parsed.data as Record<string, string>[];

    // Check existing SKUs for this supplier
    const existingSkus = await prisma.supplierProductLink.findMany({
      where: { supplierId },
      select: { supplierSku: true },
    });
    const existingSkuSet = new Set(existingSkus.map(s => s.supplierSku));

    const job = await prisma.importJob.create({
      data: {
        supplierId,
        filename: filename || 'import.csv',
        totalRows: rows.length,
        goodRows: 0,
        badRows: 0,
        status: 'PROCESSING',
      },
    });

    let goodRows = 0;
    let badRows = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const supplierSku = (row.supplierSku || row.sku || row.SKU || '').trim();
      const titleAr = (row.titleAr || row.title_ar || '').trim();
      const titleEn = (row.titleEn || row.title_en || row.title || '').trim();
      const costPriceRaw = parseFloat(row.costPrice || row.cost_price || row.cost || '0');
      const sellingPriceRaw = parseFloat(row.sellingPrice || row.selling_price || row.price || '0');
      const stock = parseInt(row.stock || row.quantity || '0') || 0;
      const leadTimeDays = parseInt(row.leadTimeDays || row.lead_time || '0') || null;

      let errorMsg: string | null = null;
      if (!supplierSku) errorMsg = 'Missing supplier SKU';
      else if (!titleAr && !titleEn) errorMsg = 'Missing title (ar or en)';
      else if (!costPriceRaw || costPriceRaw <= 0) errorMsg = 'Invalid cost price';
      else if (existingSkuSet.has(supplierSku)) errorMsg = `Duplicate SKU: ${supplierSku}`;

      if (errorMsg) badRows++;
      else goodRows++;

      await prisma.importRow.create({
        data: {
          jobId: job.id,
          rowNumber: i + 1,
          supplierSku,
          titleAr: titleAr || null,
          titleEn: titleEn || null,
          costPrice: costPriceRaw || null,
          sellingPrice: sellingPriceRaw || null,
          stock,
          leadTimeDays,
          rawData: row,
          status: errorMsg ? 'REJECTED' : 'PENDING',
          errorMsg,
        },
      });
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: { goodRows, badRows, status: 'DONE' },
    });

    return NextResponse.json({ jobId: job.id, totalRows: rows.length, goodRows, badRows });
  } catch (e: any) {
    console.error('[imports]', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
