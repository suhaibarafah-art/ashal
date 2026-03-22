/**
 * AI Writer API — يولد كابشنات تيك توك من بيانات الموّرد الحقيقية في DB
 * POST /api/marketing/ai-writer
 * Body: { dayIndex?: number, productId?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ContentStudio } from '@/lib/content-studio';

// The 7-day plan structure mirrors TikTokWidget but is used server-side
const DAY_PLAN = [
  { type: 'Unboxing',          goal: 'إثارة الفضول',    hashtags: '#فساتين_مناسبات #أسهل #unboxing' },
  { type: 'The Look',          goal: 'رفع قيمة السلة',  hashtags: '#أسهل_للفخامة #ستايل_خليجي #thelook' },
  { type: 'Detail Shot',       goal: 'إثبات الجودة',    hashtags: '#جودة_فاخرة #أسهل #detailshot' },
  { type: 'Problem / Solution',goal: 'الاستعجال',       hashtags: '#حل_سريع #توصيل_سريع #زواجات_الرياض' },
  { type: 'The Vibe',          goal: 'براندينج',         hashtags: '#أسهل_للفخامة #ستايل_راقي #vibe' },
  { type: 'Behind the Scenes', goal: 'بناء الثقة',      hashtags: '#تقنية_فاخرة #أسهل #bts' },
  { type: 'FAQ / Call to Action', goal: 'الإغلاق',      hashtags: '#جودة_مضمونة #أسهل #عرض_محدود' },
];

/** Use ContentStudio to enrich captions with real product data */
function buildCaptions(product: {
  titleAr: string; titleEn: string; descAr: string;
  finalPrice: number; category: string; supplierSku: string;
}, dayIndex: number): string[] {
  const plan = DAY_PLAN[dayIndex];
  const baseCreative = ContentStudio.generateTikTokAd(product);
  const price = product.finalPrice.toFixed(0);
  const sku   = product.supplierSku || 'CRIMSON';

  const captions: string[] = [
    // Caption 1: hook from ContentStudio (product-aware)
    `${baseCreative.hookAr} ${product.titleAr} الآن بـ ${price} ريال! ${plan.hashtags.split(' ')[0]}`,
    // Caption 2: urgency + supplier delivery
    `${baseCreative.bodyAr.slice(0, 80)}... التوصيل خلال 48 ساعة لكل السعودية 🚀 ${plan.hashtags.split(' ')[1] ?? ''}`,
    // Caption 3: CTA with product category + SKU code for team reference
    `${baseCreative.ctaAr} — ${product.category} — كود: ${sku} ${plan.hashtags}`,
  ];

  return captions;
}

/** Get week start (Sunday) in YYYY-MM-DD */
function getWeekOf(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const dayIndex: number = body.dayIndex ?? new Date().getDay();
    const weekOf = getWeekOf();
    const plan   = DAY_PLAN[dayIndex];

    // 1. Fetch featured product (by productId or first in-stock product)
    let product = body.productId
      ? await prisma.product.findUnique({ where: { id: body.productId } })
      : await prisma.product.findFirst({
          where: { stockLevel: { gt: 0 } },
          orderBy: { updatedAt: 'desc' },
        });

    // Fallback: any product
    if (!product) {
      product = await prisma.product.findFirst({ orderBy: { createdAt: 'desc' } });
    }

    if (!product) {
      return NextResponse.json({ error: 'لا يوجد منتج في قاعدة البيانات' }, { status: 404 });
    }

    // 2. Generate captions using ContentStudio + product data
    const captions = buildCaptions(product, dayIndex);

    // 3. Upsert into MarketingContent (one record per day per week)
    const record = await prisma.marketingContent.upsert({
      where: {
        // composite unique — we'll use a generated string as "id" workaround
        // since Prisma doesn't support @unique on multiple fields without @@unique
        id: `${weekOf}-${dayIndex}`, // use predictable id
      },
      update: {
        captions:    JSON.stringify(captions),
        hashtags:    plan.hashtags,
        productId:   product.id,
        supplierRef: `SKU:${product.supplierSku} | ${product.supplier}`,
        status:      'DRAFT',
        updatedAt:   new Date(),
      },
      create: {
        id:          `${weekOf}-${dayIndex}`,
        dayIndex,
        weekOf,
        contentType: plan.type,
        goal:        plan.goal,
        captions:    JSON.stringify(captions),
        hashtags:    plan.hashtags,
        productId:   product.id,
        supplierRef: `SKU:${product.supplierSku} | ${product.supplier}`,
        status:      'DRAFT',
      },
    });

    return NextResponse.json({
      success: true,
      record,
      product: {
        id: product.id, titleAr: product.titleAr, imageUrl: product.imageUrl,
        finalPrice: product.finalPrice, category: product.category,
        supplier: product.supplier, supplierSku: product.supplierSku,
      },
      captions,
    });
  } catch (err: any) {
    console.error('[ai-writer]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const weekOf   = searchParams.get('weekOf') ?? getWeekOf();
  const dayIndex = searchParams.get('day') ? Number(searchParams.get('day')) : undefined;

  const where: Record<string, unknown> = { weekOf };
  if (dayIndex !== undefined) where.dayIndex = dayIndex;

  const records = await prisma.marketingContent.findMany({
    where,
    include: { product: { select: { titleAr: true, imageUrl: true, finalPrice: true, category: true, supplier: true, supplierSku: true } } },
    orderBy: { dayIndex: 'asc' },
  });

  return NextResponse.json({ records, weekOf });
}
