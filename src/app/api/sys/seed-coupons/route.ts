/**
 * GET /api/sys/seed-coupons
 * Seeds all coupon codes without re-seeding products.
 * Safe to run multiple times (upsert).
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALL_COUPONS = [
  { code: 'SAVE10',      discountPct: 0.10, maxUsage: 10000, note: 'General 10% discount' },
  { code: 'ROYAL20',     discountPct: 0.20, maxUsage: 1000,  note: 'VIP 20% discount' },
  { code: 'VIP15',       discountPct: 0.15, maxUsage: 500,   note: 'VIP 15% discount' },
  { code: 'LUXURY10',    discountPct: 0.10, maxUsage: 5000,  note: 'TikTok campaign code' },
  { code: 'SOVEREIGN10', discountPct: 0.10, maxUsage: 5000,  note: 'Abandoned cart recovery' },
];

export async function GET() {
  try {
    const results = [];
    for (const c of ALL_COUPONS) {
      const record = await prisma.coupon.upsert({
        where: { code: c.code },
        update: { isActive: true, maxUsage: c.maxUsage },
        create: { code: c.code, discountPct: c.discountPct, isActive: true, maxUsage: c.maxUsage },
      });
      results.push({ code: record.code, discountPct: record.discountPct, note: c.note });
    }

    await prisma.systemLog.create({
      data: { level: 'SUCCESS', source: 'api/sys/seed-coupons', message: `${results.length} coupons seeded/verified`, metadata: JSON.stringify(results) },
    }).catch(() => {});

    return NextResponse.json({ success: true, coupons: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
