/**
 * Summer 2026 Seed Endpoint
 * GET /api/sys/seed-summer
 *
 * Seeds:
 *  1. Sohib-V1 (Crimson Petal) — flagship A/B test product
 *  2. Gold Evening Clutch       — Scout Upsell 1
 *  3. Crystal Stiletto Heels   — Scout Upsell 2
 *  4. Minimalist Gold Jewelry  — Scout Upsell 3
 *
 * Run once after deploy (or call from Admin dashboard).
 */

import { NextResponse } from 'next/server';
import { EmpireSeeder } from '@/lib/empire-seeder';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await EmpireSeeder.seedSummerCollection();

    await prisma.systemLog.create({
      data: {
        level: 'SUCCESS',
        source: 'api/sys/seed-summer',
        message: `Summer 2026 seed complete — ${count} products (Crimson Petal + 3 Scout upsells)`,
        metadata: JSON.stringify({ count, season: 'Summer 2026', triggeredAt: new Date().toISOString() }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `✅ Summer 2026 — ${count} منتج تم إضافته`,
      products: [
        'Sohib-V1 (Crimson Petal) — flagship',
        'Gold Evening Clutch — Scout Upsell',
        'Crystal Stiletto Heels — Scout Upsell',
        'Minimalist Gold Jewelry Set — Scout Upsell',
      ],
      nextStep: 'افتح /products/<id> لرؤية Crimson Petal مع A/B engine',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
