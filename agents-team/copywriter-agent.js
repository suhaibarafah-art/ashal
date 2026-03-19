/**
 * COPYWRITER AGENT — The Marketer
 * Uses Gemini to rewrite product content into high-end, elegant
 * authentic Saudi dialect Arabic. Focuses on exclusivity, desire,
 * and the emotional language of luxury.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAgentLogger } from './logger.js';
import 'dotenv/config';

const log = createAgentLogger('Copywriter Agent');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL = 'gemini-1.5-pro';

// ── Luxury Copywriting System Prompt ─────────────────────────────────────────

const LUXURY_SYSTEM_PROMPT = `أنت كاتب إبداعي متخصص في منتجات الفخامة والرقي للسوق السعودي.
مهمتك كتابة نصوص تسويقية باللهجة العربية السعودية الأصيلة والراقية.

قواعد لا تحيد عنها أبداً:
1. اكتب بأسلوب راقٍ يشبع الطموح ويُعلي من قيمة المنتج
2. استخدم اللهجة السعودية الحديثة مع الحفاظ على الفصاحة
3. ركّز على الحصرية والتميّز والشعور بالامتلاك الراقي
4. لا تذكر أسماء الموردين أو العلامات التجارية الصينية
5. حوّل كل منتج إلى تجربة رقيّة لا مجرد سلعة
6. استخدم مفردات مثل: "حصري", "للنخبة", "جوهرة", "إرث", "أصالة", "تحفة"
7. الوصف القصير جملة واحدة مشوّقة لا تتجاوز 20 كلمة
8. النقاط تبدأ بـ ✦ وتكون إيجابية وتحفيزية
9. أجب بـ JSON فقط بدون markdown أو أي نص خارج JSON`;

// ── Price Calculator ──────────────────────────────────────────────────────────

function calculateLuxuryPricing(costUSD) {
  const USD_TO_SAR = parseFloat(process.env.USD_TO_SAR_RATE || '3.75');
  const costSAR = costUSD * USD_TO_SAR;

  // Luxury markup tiers
  let markup;
  if (costSAR < 50) markup = 4.5;
  else if (costSAR < 150) markup = 3.5;
  else if (costSAR < 400) markup = 2.8;
  else markup = 2.2;

  const sellingPrice = Math.ceil((costSAR * markup) / 5) * 5; // Round to nearest 5
  const compareAtPrice = Math.ceil((sellingPrice * 1.3) / 5) * 5; // 30% above for "was" price

  return {
    costSAR: Math.round(costSAR * 100) / 100,
    sellingPrice,
    compareAtPrice,
    marginPercent: Math.round(((sellingPrice - costSAR) / sellingPrice) * 100),
    markup: markup.toFixed(1),
  };
}

// ── Slug Generator ────────────────────────────────────────────────────────────

function generateSlug(titleAr, titleEn) {
  const base = titleEn || titleAr || 'luxury-product';
  return base
    .toLowerCase()
    .replace(/[أإآ]/g, 'a').replace(/[ء]/g, '').replace(/[ة]/g, 'h')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    + '-' + Date.now().toString(36);
}

// ── Gemini Copywriting Call ───────────────────────────────────────────────────

async function generateLuxuryCopy(product) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: LUXURY_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.85,
      topP: 0.9,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
اكتب نصًا تسويقيًا فاخرًا لهذا المنتج:

المنتج: ${product.productNameEn}
الوصف الأصلي: ${product.description?.slice(0, 500) || 'منتج فاخر'}
الفئة: ${product.categoryName}
السعر التقديري للمستهلك: ${product.pricing?.sellingPrice} ريال سعودي

المطلوب بالضبط - JSON:
{
  "titleAr": "اسم المنتج بالعربية (موجز وجذاب، لا يزيد 8 كلمات)",
  "titleEn": "Product name in English (concise luxury style, max 6 words)",
  "shortDescAr": "جملة تسويقية واحدة مشوّقة تعكس الفخامة (لا تزيد 20 كلمة)",
  "shortDescEn": "One luxury hook sentence (max 15 words)",
  "descAr": "وصف تفصيلي راقٍ من 3 فقرات (كل فقرة 2-3 جمل) يستثير الرغبة في الامتلاك",
  "descEn": "Detailed luxury description in 2 paragraphs",
  "bulletsAr": ["✦ ميزة 1", "✦ ميزة 2", "✦ ميزة 3", "✦ ميزة 4", "✦ ميزة 5"],
  "bulletsEn": ["✦ Feature 1", "✦ Feature 2", "✦ Feature 3", "✦ Feature 4", "✦ Feature 5"],
  "metaTitleAr": "عنوان SEO بالعربية (max 60 حرف)",
  "metaTitleEn": "SEO title in English (max 60 chars)",
  "metaDescAr": "وصف SEO بالعربية (max 160 حرف)",
  "metaDescEn": "SEO description in English (max 160 chars)",
  "luxuryTag": "تصنيف واحد: 'نادر' أو 'حصري' أو 'مميز' أو 'تحفة فنية' أو 'أيقوني'"
}`;

  log.info(`Generating luxury copy for: ${product.productNameEn}`);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from response
    const match = text.match(/\{[\s\S]+\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Gemini returned invalid JSON for ${product.productNameEn}`);
  }
}

// ── Main Copywriter Execution ─────────────────────────────────────────────────

export async function runCopywriterAgent(products) {
  log.info(`✍️  Copywriter Agent activated — processing ${products.length} products...`);

  const enriched = [];

  for (const product of products) {
    try {
      // Calculate pricing first
      const pricing = calculateLuxuryPricing(product.cost);
      product.pricing = pricing;

      log.info(`Processing: ${product.productNameEn} | Cost: $${product.cost} → ${pricing.sellingPrice} SAR (${pricing.marginPercent}% margin)`);

      // Generate luxury copy
      const copy = await generateLuxuryCopy(product);

      // Small delay to respect Gemini rate limits
      await new Promise(r => setTimeout(r, 1200));

      enriched.push({
        ...product,
        ...copy,
        slug: generateSlug(copy.titleAr, copy.titleEn),
        pricing,
        sellingPrice: pricing.sellingPrice,
        comparePrice: pricing.compareAtPrice,
        costPrice: pricing.costSAR,
        status: 'copywritten',
        processedAt: new Date().toISOString(),
      });

      log.info(`✓ Copy generated for: ${copy.titleAr}`);
    } catch (err) {
      log.error(`Failed to write copy for ${product.productNameEn}: ${err.message}`);
      // Include with flag for manual review
      enriched.push({
        ...product,
        titleAr: product.productNameEn,
        titleEn: product.productNameEn,
        status: 'copy_failed',
        copyError: err.message,
        pricing: calculateLuxuryPricing(product.cost),
      });
    }
  }

  log.info(`✅ Copywriter complete. ${enriched.filter(p => p.status === 'copywritten').length}/${products.length} products written.`);
  return enriched;
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1].endsWith('copywriter-agent.js')) {
  const testProduct = {
    productNameEn: '18K Gold Plated Luxury Bracelet with Crystal Inlay',
    description: 'Premium gold plated bracelet with crystal decorations, perfect for elegant occasions',
    categoryName: 'Jewelry & Accessories',
    cost: 18.5,
  };

  runCopywriterAgent([testProduct])
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => { log.error(err.message); process.exit(1); });
}
