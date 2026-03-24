/**
 * AGENT 1: SCOUT — الكاشف (Multi-Supplier)
 * Searches ALL connected suppliers in parallel:
 *   1. CJ Dropshipping  — API (token from DB or env)
 *   2. AliExpress        — API (ALIEXPRESS_APP_KEY) or simulation
 *   3. Zendrop           — API (ZENDROP_API_KEY)     or simulation
 *   4. Spocket           — API (SPOCKET_API_KEY)     or simulation
 * Merges, deduplicates, scores, returns top N products.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAgentAuth, logAgent, setQueue, QUEUES, getConfig } from '@/lib/agent-runner';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ScoutProduct {
  cjProductId: string;
  titleEn: string;
  imageUrl: string;
  costPrice: number;
  suggestedPrice: number;
  category: string;
  score: number;
  sourceData: string;
  supplier: string;
}

// Summer & Wedding Season 2026 — Trend Radar
const SEARCH_KEYWORDS = [
  'luxury watch', 'perfume', 'leather wallet', 'sunglasses',
  'gold clutch bag', 'wedding heels', 'bridal jewelry',
  'hair accessories', 'evening dress accessories',
  'summer handbag', 'gold sandals', 'beach jewelry',
  'skincare serum', 'wireless earbuds',
];

const SEASON_BOOST = ['gold', 'wedding', 'bridal', 'clutch', 'heels', 'evening', 'summer'];

// ─── CJ TOKEN ──────────────────────────────────────────────────────────────

async function getCJToken(): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'cj_access_token' } });
    if (row) {
      const { token, expiresAt } = JSON.parse(row.value);
      if (new Date(expiresAt) > new Date()) return token;
    }
  } catch { /* fall through */ }
  return process.env.CJ_ACCESS_TOKEN ?? '';
}

// ─── SCORING ───────────────────────────────────────────────────────────────

function score(sold: number, rating: number, marginPct: number, seasonal: boolean): number {
  const s = Math.min(sold / 100, 40) + (rating / 5) * 30 + Math.min(marginPct * 0.3, 30);
  return Math.round(seasonal ? Math.min(s + 15, 100) : s);
}

function isSeasonal(keyword: string) {
  return SEASON_BOOST.some(k => keyword.toLowerCase().includes(k));
}

function buildProduct(
  id: string, titleEn: string, imageUrl: string,
  cost: number, category: string, keyword: string,
  supplier: string, sold = 3000, rating = 4.2
): ScoutProduct {
  const selling = parseFloat((cost * 2.2).toFixed(2));
  const margin = ((selling - cost) / selling) * 100;
  const seasonal = isSeasonal(keyword);
  return {
    cjProductId: id,
    titleEn,
    imageUrl,
    costPrice: parseFloat(cost.toFixed(2)),
    suggestedPrice: selling,
    category,
    score: score(sold, rating, margin, seasonal),
    sourceData: JSON.stringify({ sold, rating, seasonal, supplier }),
    supplier,
  };
}

// ─── SUPPLIER 1: CJ DROPSHIPPING ───────────────────────────────────────────

async function searchCJ(keywords: string[], minCost: number): Promise<ScoutProduct[]> {
  const token = await getCJToken();
  const results: ScoutProduct[] = [];

  for (const keyword of keywords.slice(0, 5)) {
    try {
      if (!token || token.startsWith('your_')) {
        results.push(...simulateCJ(keyword));
        continue;
      }
      const res = await fetch(
        `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=8&productNameEn=${encodeURIComponent(keyword)}`,
        { headers: { 'CJ-Access-Token': token }, signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      if (res.status === 401 || data?.code === 1600001) {
        results.push(...simulateCJ(keyword));
        continue;
      }
      const list = data?.data?.list ?? data?.result?.list ?? [];
      for (const p of list) {
        const sellPrice = typeof p.sellPrice === 'string' ? parseFloat(p.sellPrice) : (p.sellPrice ?? 0);
        const srcPrice = typeof p.sourcePrice === 'string' ? parseFloat(p.sourcePrice) : (p.sourcePrice ?? 0);
        const cost = srcPrice > 0 ? srcPrice : sellPrice * 0.5;
        if (!cost || cost < minCost) continue;
        const img = p.productImage ?? '';
        const title = p.productNameEn ?? p.productName ?? '';
        if (!img || !title) continue;
        results.push(buildProduct(
          `CJ-${p.pid}`, title, img,
          cost, p.categoryName ?? keyword, keyword, 'CJ'
        ));
      }
    } catch {
      await logAgent('SCOUT', `CJ خطأ: ${keyword}`, 'ERROR');
      results.push(...simulateCJ(keyword));
    }
  }
  return results;
}

// ─── SUPPLIER 2: ALIEXPRESS ────────────────────────────────────────────────

async function searchAliExpress(keywords: string[], minCost: number): Promise<ScoutProduct[]> {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const results: ScoutProduct[] = [];

  // AliExpress Affiliate API — if keys set, use live; else simulate
  if (appKey && appSecret && !appKey.startsWith('your_')) {
    for (const keyword of keywords.slice(0, 4)) {
      try {
        const url = new URL('https://api-sg.aliexpress.com/sync');
        url.searchParams.set('method', 'aliexpress.affiliate.product.query');
        url.searchParams.set('app_key', appKey);
        url.searchParams.set('keywords', keyword);
        url.searchParams.set('page_size', '8');
        url.searchParams.set('sort', 'SALE_PRICE_ASC');
        url.searchParams.set('target_currency', 'USD');
        url.searchParams.set('target_language', 'EN');
        const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        const items = data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product ?? [];
        for (const p of items) {
          const cost = parseFloat(p.sale_price ?? p.original_price ?? '0');
          if (cost < minCost) continue;
          results.push(buildProduct(
            `ALI-${p.product_id}`, p.product_title, p.product_main_image_url ?? '',
            cost, p.first_level_category_name ?? keyword, keyword, 'AliExpress',
            p.evaluate_rate ? parseInt(p.evaluate_rate) * 10 : 3000, 4.1
          ));
        }
      } catch {
        results.push(...simulateAliExpress(keyword, minCost));
      }
    }
  } else {
    for (const keyword of keywords.slice(0, 4)) {
      results.push(...simulateAliExpress(keyword, minCost));
    }
  }
  return results;
}

// ─── SUPPLIER 3: ZENDROP ───────────────────────────────────────────────────

async function searchZendrop(keywords: string[], minCost: number): Promise<ScoutProduct[]> {
  const apiKey = process.env.ZENDROP_API_KEY;
  const results: ScoutProduct[] = [];

  if (apiKey && !apiKey.startsWith('your_')) {
    for (const keyword of keywords.slice(0, 3)) {
      try {
        const res = await fetch(
          `https://api.zendrop.com/api/v1/products/search?query=${encodeURIComponent(keyword)}&limit=5`,
          { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        const items = data?.data ?? data?.products ?? [];
        for (const p of items) {
          const cost = parseFloat(p.cost ?? p.price ?? '0');
          if (cost < minCost) continue;
          results.push(buildProduct(
            `ZD-${p.id ?? p.product_id}`, p.title ?? p.name, p.image ?? p.thumbnail ?? '',
            cost, p.category ?? keyword, keyword, 'Zendrop'
          ));
        }
      } catch {
        results.push(...simulateZendrop(keyword, minCost));
      }
    }
  } else {
    for (const keyword of keywords.slice(0, 3)) {
      results.push(...simulateZendrop(keyword, minCost));
    }
  }
  return results;
}

// ─── SUPPLIER 4: SPOCKET ───────────────────────────────────────────────────

async function searchSpocket(keywords: string[], minCost: number): Promise<ScoutProduct[]> {
  const apiKey = process.env.SPOCKET_API_KEY;
  const results: ScoutProduct[] = [];

  if (apiKey && !apiKey.startsWith('your_')) {
    for (const keyword of keywords.slice(0, 3)) {
      try {
        const res = await fetch(
          `https://app.spocket.co/api/v2/products?search=${encodeURIComponent(keyword)}&per_page=5&sort_by=trending`,
          { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();
        const items = data?.products ?? data?.data ?? [];
        for (const p of items) {
          const cost = parseFloat(p.retail_price ?? p.cost ?? '0');
          if (cost < minCost) continue;
          results.push(buildProduct(
            `SP-${p.id}`, p.title ?? p.name, p.images?.[0]?.src ?? p.image ?? '',
            cost, p.type ?? keyword, keyword, 'Spocket', 2000, 4.3
          ));
        }
      } catch {
        results.push(...simulateSpocket(keyword, minCost));
      }
    }
  } else {
    for (const keyword of keywords.slice(0, 3)) {
      results.push(...simulateSpocket(keyword, minCost));
    }
  }
  return results;
}

// ─── SIMULATIONS (used when API keys not configured) ───────────────────────

const UNSPLASH = {
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  bag:   'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  jewel: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  skin:  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  shoe:  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
  scent: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400',
};

function simulateCJ(keyword: string): ScoutProduct[] {
  const catalog = [
    { title: 'Luxury Genuine Leather Handbag Premium', cost: 28, img: UNSPLASH.bag, cat: 'Bags' },
    { title: 'Gold-Plated Crystal Statement Necklace', cost: 25, img: UNSPLASH.jewel, cat: 'Jewelry' },
    { title: 'Designer Automatic Mechanical Watch', cost: 45, img: UNSPLASH.watch, cat: 'Watches' },
    { title: 'Premium Oud Perfume Spray 100ml', cost: 30, img: UNSPLASH.scent, cat: 'Fragrance' },
    { title: 'Silk Evening Clutch Bag Gold Chain', cost: 24, img: UNSPLASH.bag, cat: 'Bags' },
  ];
  return catalog.slice(0, 2).map((p, i) => buildProduct(
    `CJ-SIM-${keyword.slice(0,3).toUpperCase()}-${i}`, p.title, p.img, p.cost, p.cat, keyword, 'CJ'
  ));
}

function simulateAliExpress(keyword: string, minCost: number): ScoutProduct[] {
  const catalog = [
    { title: 'AliExpress Premium Crystal Hair Crown Set', cost: 25, img: UNSPLASH.jewel, cat: 'Hair Accessories' },
    { title: 'Luxury Satin Evening Bag Gold Chain', cost: 28, img: UNSPLASH.bag, cat: 'Bags' },
    { title: 'Gold Plated Statement Bangle Bracelets Set', cost: 24, img: UNSPLASH.jewel, cat: 'Jewelry' },
    { title: 'Premium Anti-Aging Retinol Serum 30ml', cost: 26, img: UNSPLASH.skin, cat: 'Skincare' },
    { title: 'Bridal Pearl Tiara Headband Set', cost: 23, img: UNSPLASH.jewel, cat: 'Hair Accessories' },
  ];
  return catalog.filter(p => p.cost >= minCost).slice(0, 2).map((p, i) => buildProduct(
    `ALI-SIM-${keyword.slice(0,3).toUpperCase()}-${i}`, p.title, p.img, p.cost, p.cat, keyword, 'AliExpress'
  ));
}

function simulateZendrop(keyword: string, minCost: number): ScoutProduct[] {
  const catalog = [
    { title: 'Zendrop Wireless Bluetooth Earbuds Premium', cost: 25, img: UNSPLASH.watch, cat: 'Electronics' },
    { title: 'Luxury Collagen Face Mask Set 10pcs', cost: 24, img: UNSPLASH.skin, cat: 'Skincare' },
    { title: 'Minimalist Gold Hoop Earrings 18K Plated', cost: 25, img: UNSPLASH.jewel, cat: 'Jewelry' },
    { title: 'Premium Mulberry Silk Pillowcase Set', cost: 28, img: UNSPLASH.bag, cat: 'Home Luxury' },
  ];
  return catalog.filter(p => p.cost >= minCost).slice(0, 2).map((p, i) => buildProduct(
    `ZD-SIM-${keyword.slice(0,3).toUpperCase()}-${i}`, p.title, p.img, p.cost, p.cat, keyword, 'Zendrop'
  ));
}

function simulateSpocket(keyword: string, minCost: number): ScoutProduct[] {
  const catalog = [
    { title: 'European Premium Leather Card Wallet Slim', cost: 28, img: UNSPLASH.bag, cat: 'Wallets' },
    { title: 'Luxury Aromatherapy Candle Set Soy Wax', cost: 24, img: UNSPLASH.scent, cat: 'Home Fragrance' },
    { title: 'Premium Suede Block Heel Mule Sandals', cost: 35, img: UNSPLASH.shoe, cat: 'Footwear' },
    { title: 'Handcrafted Sterling Silver Ring Adjustable', cost: 30, img: UNSPLASH.jewel, cat: 'Jewelry' },
  ];
  return catalog.filter(p => p.cost >= minCost).slice(0, 2).map((p, i) => buildProduct(
    `SP-SIM-${keyword.slice(0,3).toUpperCase()}-${i}`, p.title, p.img, p.cost, p.cat, keyword, 'Spocket'
  ));
}

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!validateAgentAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = await getConfig();
  const maxProducts = config.maxProductsPerRun ?? 15;
  const minScore   = config.minLuxuryScore ?? 50;
  const minCost    = 23; // USD — min cost so suggestedPrice (cost×2.2) clears Critic's $50 floor

  await logAgent('SCOUT', 'بدء البحث متعدد الموردين', 'INFO',
    `CJ + AliExpress + Zendrop + Spocket | ${SEARCH_KEYWORDS.length} كلمة مفتاحية`);

  // Search all suppliers in parallel
  const [cjProducts, aliProducts, zdProducts, spProducts] = await Promise.allSettled([
    searchCJ(SEARCH_KEYWORDS, minCost),
    searchAliExpress(SEARCH_KEYWORDS, minCost),
    searchZendrop(SEARCH_KEYWORDS, minCost),
    searchSpocket(SEARCH_KEYWORDS, minCost),
  ]);

  const allProducts: ScoutProduct[] = [
    ...(cjProducts.status  === 'fulfilled' ? cjProducts.value  : []),
    ...(aliProducts.status === 'fulfilled' ? aliProducts.value : []),
    ...(zdProducts.status  === 'fulfilled' ? zdProducts.value  : []),
    ...(spProducts.status  === 'fulfilled' ? spProducts.value  : []),
  ];

  // Filter by score
  const qualified = allProducts.filter(p => p.score >= minScore);

  // Deduplicate by similar title (remove near-duplicates across suppliers)
  const seen = new Set<string>();
  const unique = qualified.filter(p => {
    const key = p.titleEn.toLowerCase().slice(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by score, cap at maxProducts
  unique.sort((a, b) => b.score - a.score);
  const topProducts = unique.slice(0, maxProducts);

  const bySupplier = {
    CJ:         topProducts.filter(p => p.supplier === 'CJ').length,
    AliExpress: topProducts.filter(p => p.supplier === 'AliExpress').length,
    Zendrop:    topProducts.filter(p => p.supplier === 'Zendrop').length,
    Spocket:    topProducts.filter(p => p.supplier === 'Spocket').length,
  };

  await setQueue(QUEUES.SCOUT, topProducts);
  await logAgent('SCOUT', 'اكتمل البحث متعدد الموردين', 'SUCCESS',
    `وجد ${allProducts.length} → مؤهل ${qualified.length} → أفضل ${topProducts.length} | ${JSON.stringify(bySupplier)}`);

  return NextResponse.json({
    agent: 'SCOUT',
    found: allProducts.length,
    queued: topProducts.length,
    topScore: topProducts[0]?.score ?? 0,
    bySupplier,
  });
}

export async function POST(req: NextRequest) { return GET(req); }
