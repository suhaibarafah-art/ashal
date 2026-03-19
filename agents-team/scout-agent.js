/**
 * SCOUT AGENT — The Hunter
 * Connects to CJ Dropshipping & AliExpress APIs to discover
 * high-potential luxury fashion, jewelry, and premium tech products.
 * Filters by margin potential, shipping speed, and luxury viability.
 */

import axios from 'axios';
import { createAgentLogger } from './logger.js';
import 'dotenv/config';

const log = createAgentLogger('Scout Agent');

// ── CJ Dropshipping API ──────────────────────────────────────────────────────

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
let cjAccessToken = null;
let cjTokenExpiry = 0;

async function getCJToken() {
  if (cjAccessToken && Date.now() < cjTokenExpiry) return cjAccessToken;

  const res = await axios.post(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    email: process.env.CJ_EMAIL,
    password: process.env.CJ_PASSWORD,
  });

  if (res.data.result !== true) throw new Error(`CJ Auth failed: ${res.data.message}`);

  cjAccessToken = res.data.data.accessToken;
  cjTokenExpiry = Date.now() + (res.data.data.accessTokenExpiryDate - 60) * 1000;
  log.info('CJ access token refreshed');
  return cjAccessToken;
}

async function fetchCJProducts({ category, pageNum = 1, pageSize = 30 }) {
  const token = await getCJToken();
  const res = await axios.get(`${CJ_BASE_URL}/product/list`, {
    headers: { 'CJ-Access-Token': token },
    params: {
      categoryId: category,
      pageNum,
      pageSize,
      orderBy: 'ORDER_COUNT',
      orderType: 'DESC',
    },
  });

  if (res.data.result !== true) {
    log.warn(`CJ product fetch returned non-success: ${res.data.message}`);
    return [];
  }

  return res.data.data.list || [];
}

async function getCJProductDetail(pid) {
  const token = await getCJToken();
  const res = await axios.get(`${CJ_BASE_URL}/product/query`, {
    headers: { 'CJ-Access-Token': token },
    params: { pid },
  });
  return res.data.result === true ? res.data.data : null;
}

// ── Luxury Category IDs (CJ Dropshipping) ───────────────────────────────────
// Mapped to: Jewelry, Watches, Fashion Accessories, Premium Tech
const LUXURY_CJ_CATEGORIES = [
  { id: '2435', name: 'Jewelry & Accessories' },
  { id: '2438', name: 'Watches' },
  { id: '2547', name: 'Fashion Bags & Wallets' },
  { id: '2236', name: 'Premium Sunglasses' },
  { id: '2185', name: 'Smart Tech Accessories' },
];

// ── Scoring & Filtering ───────────────────────────────────────────────────────

const LUXURY_KEYWORDS_AR = ['ذهب', 'فضة', 'ألماس', 'كريستال', 'جلد', 'حرير', 'فاخر'];
const LUXURY_KEYWORDS_EN = ['gold', 'silver', 'diamond', 'crystal', 'leather', 'silk', 'luxury', 'premium', 'genuine', '18k', '925', 'sterling', 'sapphire', 'titanium'];
const REJECT_KEYWORDS = ['cheap', 'plastic', 'toy', 'kids', 'baby', 'fake', 'imitation', 'replica'];

function scoreLuxuryPotential(product) {
  const text = `${product.productNameEn || ''} ${product.description || ''} ${product.categoryName || ''}`.toLowerCase();

  let score = 0;

  // Luxury keyword match
  for (const kw of LUXURY_KEYWORDS_EN) {
    if (text.includes(kw)) score += 15;
  }

  // Hard reject
  for (const kw of REJECT_KEYWORDS) {
    if (text.includes(kw)) return -999;
  }

  // Margin analysis
  const cost = parseFloat(product.sellPrice || product.productPrice || 0);
  const suggestedRetail = cost * 3.5; // Luxury markup target
  if (cost >= 8 && cost <= 120) score += 20;  // Sweet spot: not too cheap, not too risky
  if (suggestedRetail >= 99) score += 15;

  // Shipping
  if (product.shippingTime && parseInt(product.shippingTime) <= 10) score += 10;

  // Reviews & sales
  if (product.reviewCount > 50) score += 10;
  if (product.reviewScore >= 4.5) score += 15;
  if (product.salesCount > 100) score += 10;

  // Has variants (sizes/colors = real product)
  if (product.variants?.length > 1) score += 5;

  // Image quality signal (has multiple images)
  if (product.productImage?.includes(',') || product.productImageSet?.length > 3) score += 10;

  return score;
}

// ── AliExpress Affiliate API (fallback) ──────────────────────────────────────

async function fetchAliExpressProducts(keyword, targetCurrency = 'SAR') {
  if (!process.env.ALIEXPRESS_APP_KEY || !process.env.ALIEXPRESS_APP_SECRET) {
    log.info('AliExpress keys not configured, skipping');
    return [];
  }

  try {
    // AliExpress Affiliate API — product search
    const res = await axios.post('https://api-sg.aliexpress.com/sync', {
      method: 'aliexpress.affiliate.product.query',
      app_key: process.env.ALIEXPRESS_APP_KEY,
      sign_method: 'sha256',
      timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
      keywords: keyword,
      target_currency: targetCurrency,
      target_language: 'AR',
      page_no: 1,
      page_size: 20,
      sort: 'SALE_PRICE_ASC',
      category_ids: '200000342,200000427,200000343', // Jewelry, Watches, Fashion
    });

    return res.data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product || [];
  } catch (err) {
    log.warn(`AliExpress fetch failed: ${err.message}`);
    return [];
  }
}

// ── Main Scout Execution ──────────────────────────────────────────────────────

export async function runScoutAgent({ maxProducts = 10, minScore = 50 } = {}) {
  log.info('🔍 Scout Agent activated — hunting luxury products...');

  const candidates = [];

  // 1. Hunt CJ Dropshipping
  for (const category of LUXURY_CJ_CATEGORIES) {
    try {
      log.info(`Scanning CJ category: ${category.name}`);
      const products = await fetchCJProducts({ category: category.id, pageSize: 20 });

      for (const p of products) {
        const score = scoreLuxuryPotential(p);
        if (score >= minScore) {
          log.info(`✓ Found candidate: ${p.productNameEn} (score: ${score})`);

          // Fetch full detail
          let detail = null;
          try {
            detail = await getCJProductDetail(p.pid);
          } catch { /* use basic data */ }

          candidates.push({
            source: 'cj_dropshipping',
            pid: p.pid,
            productNameEn: p.productNameEn || p.productName,
            description: detail?.description || p.description || '',
            cost: parseFloat(detail?.sellPrice || p.sellPrice || p.productPrice || 0),
            images: detail?.productImageSet || [p.productImage].filter(Boolean),
            categoryName: category.name,
            shippingTime: p.shippingTime,
            variants: detail?.variants || [],
            reviewScore: parseFloat(p.reviewScore || 0),
            reviewCount: parseInt(p.reviewCount || 0),
            salesCount: parseInt(p.salesCount || 0),
            luxuryScore: score,
            supplierSku: p.pid,
            url: `https://app.cjdropshipping.com/product-detail.html?id=${p.pid}`,
          });
        }
      }
    } catch (err) {
      log.error(`Failed to scan CJ category ${category.name}: ${err.message}`);
    }
  }

  // 2. Hunt AliExpress
  const aliKeywords = ['luxury gold necklace', 'premium leather wallet', 'diamond bracelet women', 'titanium watch men'];
  for (const kw of aliKeywords) {
    try {
      const products = await fetchAliExpressProducts(kw);
      for (const p of products) {
        const cost = parseFloat(p.target_sale_price || p.sale_price || 0);
        if (cost < 5 || cost > 150) continue;
        candidates.push({
          source: 'aliexpress',
          pid: p.product_id,
          productNameEn: p.product_title,
          description: p.product_detail_url,
          cost,
          images: [p.product_main_image_url, ...(p.product_small_image_urls?.string || [])].filter(Boolean),
          categoryName: 'AliExpress Luxury',
          shippingTime: '7-15',
          variants: [],
          reviewScore: parseFloat(p.evaluate_rate || 0) / 20,
          reviewCount: parseInt(p.lastest_volume || 0),
          salesCount: parseInt(p.lastest_volume || 0),
          luxuryScore: scoreLuxuryPotential({ productNameEn: p.product_title, sellPrice: cost }),
          supplierSku: String(p.product_id),
          url: p.product_detail_url,
        });
      }
    } catch (err) {
      log.warn(`AliExpress kw "${kw}" failed: ${err.message}`);
    }
  }

  // 3. Sort by luxury score, deduplicate, return top N
  const sorted = candidates
    .filter((p, i, arr) => arr.findIndex(x => x.pid === p.pid) === i) // dedupe
    .sort((a, b) => b.luxuryScore - a.luxuryScore)
    .slice(0, maxProducts);

  log.info(`🏆 Scout complete. ${sorted.length} high-potential products identified from ${candidates.length} scanned.`);
  return sorted;
}

// ── CLI execution ─────────────────────────────────────────────────────────────
if (process.argv[1].endsWith('scout-agent.js')) {
  runScoutAgent({ maxProducts: 5 })
    .then(products => {
      console.log('\n=== SCOUT RESULTS ===');
      console.log(JSON.stringify(products, null, 2));
    })
    .catch(err => {
      log.error(`Scout fatal: ${err.message}`);
      process.exit(1);
    });
}
