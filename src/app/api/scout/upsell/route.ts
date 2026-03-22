/**
 * Agent Scout — Upsell Seeder
 * GET /api/scout/upsell
 *
 * Commands Agent Scout to scan CJ Dropshipping for the 3 "Complete the Look"
 * upsell categories and persist them to the DB:
 *   1. Gold Evening Clutches  (category: "clutch")
 *   2. Crystal Stiletto Heels (category: "heels")
 *   3. Minimalist Gold Jewelry (category: "jewelry")
 *
 * In production: calls CJ API with real credentials.
 * Fallback: uses curated product specs when CJ token is pending.
 *
 * POST /api/scout/upsell — returns live product list from DB after seeding.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLuxuryPrice } from '@/lib/pricing-engine';

const CJ_API_KEY = process.env.CJ_API_KEY ?? '';

// ── CJ Dropshipping live search ──────────────────────────────────────────────
async function searchCJProducts(keyword: string): Promise<{ name: string; price: number } | null> {
  if (!CJ_API_KEY || CJ_API_KEY === 'PENDING') return null;

  try {
    const authRes = await fetch(
      'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: CJ_API_KEY.split('@')[0] + '@cjdropshipping.com', password: CJ_API_KEY }),
      }
    );
    if (!authRes.ok) return null;
    const { data } = await authRes.json();
    const token = data?.accessToken;
    if (!token) return null;

    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=1`,
      { headers: { 'CJ-Access-Token': token } }
    );
    if (!res.ok) return null;
    const { data: d } = await res.json();
    const product = d?.list?.[0];
    if (!product) return null;
    return { name: product.productNameEn, price: product.sellPrice ?? 0 };
  } catch {
    return null;
  }
}

// ── Curated Scout Specs (used when CJ live API unavailable) ─────────────────
const SCOUT_SPECS = [
  {
    keyword:   'gold evening clutch',
    titleEn:   'Gold Evening Clutch — Scout Pick',
    titleAr:   'حقيبة السهرة الذهبية',
    category:  'clutch',
    baseCost:  55,
    shipping:  18,
    supplier:  'cj',
    stockLevel: 30,
    imageUrl:  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    descAr:    'حقيبة سهرة ذهبية مزيّنة بتفاصيل معدنية راقية — اختارها Agent Scout لتكمل إطلالة بتلة القرمزي في حفلات الأعراس والغالا الصيفية.',
  },
  {
    keyword:   'crystal stiletto heels',
    titleEn:   'Crystal Stiletto Heels — Scout Pick',
    titleAr:   'كعب ستيليتو كريستالي',
    category:  'heels',
    baseCost:  95,
    shipping:  25,
    supplier:  'cj',
    stockLevel: 20,
    imageUrl:  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    descAr:    'كعب ستيليتو مرصّع بكريستال عالي الجودة — خطوة واحدة تغيّر كل شيء. اختارها Agent Scout لمناسبات الصيف الفاخرة.',
  },
  {
    keyword:   'minimalist gold jewelry',
    titleEn:   'Minimalist Gold Jewelry Set — Scout Pick',
    titleAr:   'طقم مجوهرات ذهبية مينيمالي',
    category:  'jewelry',
    baseCost:  65,
    shipping:  15,
    supplier:  'cj',
    stockLevel: 40,
    imageUrl:  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    descAr:    'طقم مجوهرات ذهبي مينيمالي — البساطة هي أعلى مراتب الأناقة. يتناغم مع ألوان بتلة القرمزي ويكمل الإطلالة.',
  },
];

export async function GET() {
  const results: string[] = [];

  for (const spec of SCOUT_SPECS) {
    // Attempt live CJ search first
    const live = await searchCJProducts(spec.keyword);

    const finalPrice = live?.price
      ? Math.floor(live.price * 3.75 * 1.15) + 0.99   // USD → SAR + VAT + .99
      : calculateLuxuryPrice(spec.baseCost, spec.shipping);

    await prisma.product.upsert({
      where: { titleEn: spec.titleEn },
      update: { finalPrice, stockLevel: spec.stockLevel, imageUrl: spec.imageUrl, category: spec.category },
      create: {
        titleEn:    spec.titleEn,
        titleAr:    spec.titleAr,
        descAr:     spec.descAr,
        baseCost:   spec.baseCost,
        shippingCost: spec.shipping,
        finalPrice,
        imageUrl:   spec.imageUrl,
        supplier:   spec.supplier,
        category:   spec.category,
        stockLevel: spec.stockLevel,
        supplierSku: `SCOUT-${spec.category.toUpperCase()}`,
      },
    });

    results.push(`${spec.titleAr} — SAR ${finalPrice} ${live ? '(CJ live)' : '(Scout spec)'}`);
  }

  await prisma.systemLog.create({
    data: {
      level:    'SUCCESS',
      source:   'api/scout/upsell',
      message:  `Agent Scout seeded 3 upsell products (Summer 2026)`,
      metadata: JSON.stringify({ results }),
    },
  }).catch(() => {});

  return NextResponse.json({
    success: true,
    message: '✅ Agent Scout — 3 منتجات Upsell جاهزة',
    products: results,
    display: 'تظهر تلقائياً في قسم "أكملي إطلالتك" على صفحة Crimson Petal',
  });
}
