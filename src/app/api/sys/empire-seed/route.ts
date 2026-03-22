/**
 * Empire Seed API — seeds 20 luxury products into the database
 * GET /api/sys/empire-seed — trigger from Vercel or browser
 * Includes coupon upsert (SAVE10, ROYAL20, VIP15)
 */

import { NextResponse } from 'next/server';
import { EmpireSeeder } from '@/lib/empire-seeder';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const productCount = await EmpireSeeder.seedEmpireCatalog();

    // Also seed coupons
    const coupons = [
      { code: 'SAVE10',    discountPct: 0.10, maxUsage: 10000 },
      { code: 'ROYAL20',   discountPct: 0.20, maxUsage: 1000  },
      { code: 'VIP15',     discountPct: 0.15, maxUsage: 500   },
      { code: 'LUXURY10',  discountPct: 0.10, maxUsage: 5000  }, // TikTok campaign code
    ];
    for (const c of coupons) {
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: { isActive: true },
        create: { code: c.code, discountPct: c.discountPct, isActive: true, maxUsage: c.maxUsage },
      });
    }

    await prisma.systemLog.create({
      data: {
        level: 'SUCCESS',
        source: 'api/sys/empire-seed',
        message: `Empire seed complete — ${productCount} products + 3 coupons`,
        metadata: JSON.stringify({ productCount, coupons: coupons.map(c => c.code) }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `✅ تم بنجاح — ${productCount} منتج + 3 كودات خصم`,
      productsSeeded: productCount,
      couponsSeeded: ['SAVE10', 'ROYAL20', 'VIP15', 'LUXURY10'],
      nextStep: 'افتح / لرؤية المنتجات',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
