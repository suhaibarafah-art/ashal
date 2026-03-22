import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLuxuryPrice } from '@/lib/pricing-engine';

/**
 * Phase 2: Supply Chain Sync API
 * Agent 1 (Scout) — pulls from CJ Dropshipping API
 * POST /api/products/sync
 *
 * Calculates: (baseCost + shipping) * 1.30 * 1.15 → .99 rounding
 * Auto-writes new products to DB
 */

interface SupplierProduct {
  supplierSku: string;
  titleEn: string;
  titleAr: string;
  descAr: string;
  imageUrl: string;
  category: string;
  baseCost: number;
  shippingCost: number;
  stockLevel: number;
  weightKg: number;
  dimensions: string;
  supplier: 'mkhazen' | 'cj' | 'zendrop';
}

// ─── CJ Dropshipping real API fetch ────────────────────────────────────────
async function fetchFromCJ(keyword: string): Promise<SupplierProduct[]> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey || apiKey === 'PENDING') {
    console.warn('[Scout] CJ_API_KEY not set — using fallback catalogue');
    return getFallbackProducts('cj');
  }

  try {
    // Step 1: Get bearer token (use CJ_ACCESS_TOKEN if available, else authenticate)
    let token: string = process.env.CJ_ACCESS_TOKEN ?? '';
    if (!token) {
      const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: process.env.CJ_EMAIL ?? '', password: process.env.CJ_PASSWORD ?? '' }),
      });
      const authData = await authRes.json();
      token = authData?.data?.accessToken ?? '';
      if (!token) throw new Error('CJ auth failed');
    }

    // Step 2: Search products
    const searchRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=8`,
      { headers: { 'CJ-Access-Token': token } }
    );
    const data = await searchRes.json();
    const items = data?.data?.list ?? [];

    return items.map((p: Record<string, unknown>) => ({
      supplierSku:  String(p.pid ?? ''),
      titleEn:      String(p.productNameEn ?? p.productName ?? ''),
      titleAr:      String(p.productName ?? ''),
      descAr:       String(p.description ?? '').slice(0, 300),
      imageUrl:     String((p.productImageSet as string[] | undefined)?.[0] ?? p.productImage ?? ''),
      category:     String(p.categoryName ?? ''),
      baseCost:     Number(p.sellPrice ?? p.sourcePrice ?? 0),
      shippingCost: Number(p.shippingPrice ?? 15),
      stockLevel:   Number(p.inventory ?? 0),
      weightKg:     Number(p.productWeight ?? 0),
      dimensions:   `${p.productLength ?? 0}x${p.productWidth ?? 0}x${p.productHeight ?? 0} cm`,
      supplier:     'cj',
    }));
  } catch (err) {
    console.error('[Scout CJ]', err);
    return getFallbackProducts('cj');
  }
}

// ─── Fallback catalogue (used when APIs are not yet configured) ─────────────
function getFallbackProducts(supplier: 'mkhazen' | 'cj'): SupplierProduct[] {
  const mkhazenCatalogue: SupplierProduct[] = [
    {
      supplierSku: 'MK-001', supplier: 'mkhazen',
      titleEn: 'Classic Leather Bag', titleAr: 'حقيبة جلدية كلاسيك',
      descAr: 'حقيبة جلد إيطالي أصلي مع تفاصيل ذهبية — صناعة يدوية حصرية.',
      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=85',
      category: 'حقائب', baseCost: 420, shippingCost: 30,
      stockLevel: 50, weightKg: 0.8, dimensions: '35x25x12 cm',
    },
    {
      supplierSku: 'MK-002', supplier: 'mkhazen',
      titleEn: 'Luxury High Heel', titleAr: 'حذاء كعب عالي فاخر',
      descAr: 'تصميم أنيق للسهرات — جلد ناعم مع نعل مريح.',
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=85',
      category: 'أحذية', baseCost: 180, shippingCost: 20,
      stockLevel: 35, weightKg: 0.6, dimensions: '30x12x10 cm',
    },
    {
      supplierSku: 'MK-003', supplier: 'mkhazen',
      titleEn: 'Diamond Necklace', titleAr: 'قلادة ماسية ذهبية',
      descAr: 'ذهب أبيض 18 قيراط مرصع بالألماس — مثالية لكل مناسبة.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
      category: 'مجوهرات', baseCost: 800, shippingCost: 10,
      stockLevel: 12, weightKg: 0.05, dimensions: '5x5x2 cm',
    },
    {
      supplierSku: 'MK-004', supplier: 'mkhazen',
      titleEn: 'Leather Wallet', titleAr: 'محفظة جلدية رجالية',
      descAr: 'جلد طبيعي ناعم مع مساحات ذكية للبطاقات والأوراق.',
      imageUrl: 'https://images.unsplash.com/photo-1600185906355-6c703e2e8e97?auto=format&fit=crop&w=800&q=85',
      category: 'إكسسوارات', baseCost: 55, shippingCost: 8,
      stockLevel: 120, weightKg: 0.15, dimensions: '12x9x1.5 cm',
    },
  ];

  const cjCatalogue: SupplierProduct[] = [
    {
      supplierSku: 'CJ-001', supplier: 'cj',
      titleEn: 'Oud Royal Perfume', titleAr: 'عطر العود الملكي',
      descAr: 'مزيج فاخر من العود والمسك مع روز داماسكوس — عطر شرقي أصيل.',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=85',
      category: 'عطور', baseCost: 90, shippingCost: 12,
      stockLevel: 200, weightKg: 0.3, dimensions: '8x5x5 cm',
    },
    {
      supplierSku: 'CJ-002', supplier: 'cj',
      titleEn: 'Automatic Swiss Watch', titleAr: 'ساعة أوتوماتيك سويسرية',
      descAr: 'هيكل معدني مصقول، حركة أوتوماتيكية دقيقة، مقاومة للماء.',
      imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a820c56a8cc?auto=format&fit=crop&w=800&q=85',
      category: 'ساعات', baseCost: 1200, shippingCost: 25,
      stockLevel: 8, weightKg: 0.2, dimensions: '5x5x2 cm',
    },
    {
      supplierSku: 'CJ-003', supplier: 'cj',
      titleEn: 'Aviator Sunglasses', titleAr: 'نظارة شمسية آفييتور',
      descAr: 'إطار تيتانيوم خفيف مع عدسات UV400 المعتمدة — أناقة لا تنتهي.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
      category: 'نظارات', baseCost: 70, shippingCost: 10,
      stockLevel: 90, weightKg: 0.08, dimensions: '16x5x4 cm',
    },
    {
      supplierSku: 'CJ-004', supplier: 'cj',
      titleEn: 'Luxury Jewelry Set', titleAr: 'طقم مجوهرات كامل',
      descAr: 'طقم متكامل (قلادة + خاتم + أساور) — هدية مثالية لكل مناسبة.',
      imageUrl: 'https://images.unsplash.com/photo-1550592704-6c76defa99ce?auto=format&fit=crop&w=800&q=85',
      category: 'مجوهرات', baseCost: 1600, shippingCost: 15,
      stockLevel: 5, weightKg: 0.25, dimensions: '15x12x4 cm',
    },
  ];

  return supplier === 'mkhazen' ? mkhazenCatalogue : cjCatalogue;
}

// ─── Main sync handler ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  const startTime = Date.now();
  const logs: string[] = [];

  try {
    const body = await req.json().catch(() => ({})) as { keyword?: string; supplier?: string };
    const keyword = body.keyword ?? 'luxury';
    const supplierFilter = body.supplier ?? 'all';

    logs.push(`[Scout] Starting sync — keyword: "${keyword}", supplier: "${supplierFilter}"`);

    // Collect products from suppliers
    let allProducts: SupplierProduct[] = [];

    if (supplierFilter === 'all' || supplierFilter === 'cj') {
      const cjProducts = await fetchFromCJ(keyword);
      allProducts = [...allProducts, ...cjProducts];
      logs.push(`[Scout] CJ: ${cjProducts.length} products fetched`);
    }

    if (supplierFilter === 'all' || supplierFilter === 'mkhazen') {
      const mkhazenProducts = getFallbackProducts('mkhazen');
      allProducts = [...allProducts, ...mkhazenProducts];
      logs.push(`[Scout] Mkhazen: ${mkhazenProducts.length} products loaded`);
    }

    // Upsert to DB with calculated prices
    let syncedCount = 0;
    const errors: string[] = [];

    for (const p of allProducts) {
      try {
        const finalPrice = calculateLuxuryPrice(p.baseCost, p.shippingCost);

        await prisma.product.upsert({
          where: { titleEn: p.titleEn },
          update: {
            imageUrl:     p.imageUrl,
            stockLevel:   p.stockLevel,
            weightKg:     p.weightKg,
            dimensions:   p.dimensions,
            baseCost:     p.baseCost,
            shippingCost: p.shippingCost,
            finalPrice,
            supplier:     p.supplier,
            supplierSku:  p.supplierSku,
            updatedAt:    new Date(),
          },
          create: {
            titleEn:      p.titleEn,
            titleAr:      p.titleAr,
            descAr:       p.descAr,
            imageUrl:     p.imageUrl,
            category:     p.category,
            baseCost:     p.baseCost,
            shippingCost: p.shippingCost,
            finalPrice,
            supplier:     p.supplier,
            supplierSku:  p.supplierSku,
            stockLevel:   p.stockLevel,
            weightKg:     p.weightKg,
            dimensions:   p.dimensions,
          },
        });

        logs.push(`[Scout] ✓ ${p.titleEn} — SAR ${finalPrice} (${p.supplier})`);
        syncedCount++;
      } catch (err) {
        const msg = `[Scout] ✗ Failed: ${p.titleEn} — ${String(err)}`;
        errors.push(msg);
        logs.push(msg);
      }
    }

    // Write to SystemLog (stealth — no Telegram/Email)
    await prisma.systemLog.create({
      data: {
        level:    errors.length > 0 ? 'WARN' : 'SUCCESS',
        source:   'supply-chain',
        message:  `Sync complete: ${syncedCount}/${allProducts.length} products upserted`,
        metadata: JSON.stringify({ keyword, supplierFilter, durationMs: Date.now() - startTime }),
      },
    }).catch(() => {}); // Non-blocking

    return NextResponse.json({
      success: true,
      synced:  syncedCount,
      total:   allProducts.length,
      errors:  errors.length,
      logs,
      durationMs: Date.now() - startTime,
    });

  } catch (err) {
    console.error('[Scout] Fatal:', err);
    return NextResponse.json({ success: false, error: String(err), logs }, { status: 500 });
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ success: true, count: products.length, products });
}
