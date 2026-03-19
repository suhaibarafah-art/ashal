/**
 * DESIGN CRITIC AGENT — The Quality Controller
 * Uses Gemini Vision to analyze product images and descriptions.
 * Enforces strict "Luxury Brand" standards.
 * Rejects anything that looks cheap, generic, or off-brand.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { createAgentLogger } from './logger.js';
import 'dotenv/config';

const log = createAgentLogger('Design Critic');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VISION_MODEL = 'gemini-1.5-pro';

// ── Luxury Standards ──────────────────────────────────────────────────────────

const LUXURY_STANDARDS = {
  minimumImageScore: 65,     // Out of 100
  minimumTextScore: 60,
  minimumOverallScore: 70,
  requiredCriteria: [
    'clean_background',      // White, black, or gradient background
    'professional_lighting', // Even, studio-quality lighting
    'product_clarity',       // Product is the clear focal point
  ],
  hardRejectKeywords: [
    'aliexpress', 'taobao', 'dhgate', 'wholesale', 'factory',
    'cheap', 'budget', 'clone', 'replica', 'fake', 'imitation',
    'chinese brand', 'no brand', 'generic brand',
  ],
  hardRejectImageSigns: [
    'watermark', 'logo_visible', 'cluttered_background',
    'low_resolution', 'blurry', 'plastic_looking',
    'poor_lighting', 'multiple_mixed_products',
  ],
};

// ── Image Fetcher ─────────────────────────────────────────────────────────────

async function fetchImageAsBase64(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const base64 = Buffer.from(res.data).toString('base64');
  const mimeType = res.headers['content-type']?.split(';')[0] || 'image/jpeg';
  return { base64, mimeType };
}

// ── Gemini Vision Analysis ────────────────────────────────────────────────────

async function analyzeProductImage(imageUrl, productName) {
  const model = genAI.getGenerativeModel({ model: VISION_MODEL });

  let imagePart;
  try {
    const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
    imagePart = { inlineData: { data: base64, mimeType } };
  } catch (err) {
    log.warn(`Could not fetch image ${imageUrl}: ${err.message}`);
    return { imageScore: 0, imageIssues: ['image_fetch_failed'], cannotFetchImage: true };
  }

  const prompt = `You are a luxury brand quality controller for a premium Saudi e-commerce store.
Analyze this product image with extreme critical standards — as if you work for Rolex or Cartier.

Product name: ${productName}

Score each criterion from 0-100 and identify issues. Respond in JSON only:
{
  "imageScore": <overall score 0-100>,
  "backgroundQuality": <0-100>,
  "lightingQuality": <0-100>,
  "productClarity": <0-100>,
  "luxuryAppearance": <0-100>,
  "professionalPresentation": <0-100>,
  "hasWatermark": <true|false>,
  "hasVisibleBrandLogo": <true|false>,
  "hasClutteredBackground": <true|false>,
  "isBlurryOrLowRes": <true|false>,
  "looksExpensive": <true|false>,
  "issues": ["list", "of", "identified", "problems"],
  "verdict": "APPROVE" | "REJECT" | "NEEDS_REVIEW",
  "verdictReason": "one sentence explanation"
}`;

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]+\}/);
    if (!match) throw new Error('No JSON in vision response');
    return JSON.parse(match[0]);
  } catch (err) {
    log.warn(`Vision analysis failed for ${imageUrl}: ${err.message}`);
    return { imageScore: 50, issues: ['vision_analysis_failed'], verdict: 'NEEDS_REVIEW', verdictReason: 'Automated review failed' };
  }
}

async function analyzeProductText(product) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  // Check hard reject keywords first
  const combinedText = `${product.productNameEn} ${product.descAr || ''} ${product.descEn || ''} ${product.shortDescAr || ''}`.toLowerCase();
  for (const kw of LUXURY_STANDARDS.hardRejectKeywords) {
    if (combinedText.includes(kw)) {
      return {
        textScore: 0,
        verdict: 'REJECT',
        verdictReason: `Hard reject keyword found: "${kw}"`,
        issues: [`contains_rejected_keyword:${kw}`],
      };
    }
  }

  const prompt = `You are a luxury brand content director. Evaluate this product listing for luxury market standards.

Title AR: ${product.titleAr || product.productNameEn}
Title EN: ${product.titleEn || product.productNameEn}
Short Desc AR: ${product.shortDescAr || ''}
Category: ${product.categoryName}
Price: ${product.pricing?.sellingPrice} SAR
Cost: $${product.cost}

Score and respond in JSON only:
{
  "textScore": <0-100>,
  "arabicQuality": <0-100>,
  "luxuryLanguage": <0-100>,
  "clarityAndPrecision": <0-100>,
  "pricingBelievability": <0-100>,
  "brandConsistency": <0-100>,
  "issues": ["any content issues"],
  "verdict": "APPROVE" | "REJECT" | "NEEDS_REVIEW",
  "verdictReason": "one sentence",
  "suggestedImprovements": ["improvement 1", "improvement 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    log.warn(`Text analysis failed: ${err.message}`);
    return { textScore: 60, verdict: 'NEEDS_REVIEW', issues: ['text_analysis_failed'] };
  }
}

// ── Main Critic Execution ─────────────────────────────────────────────────────

export async function runDesignCriticAgent(products) {
  log.info(`🎨 Design Critic activated — auditing ${products.length} products against luxury standards...`);

  const approved = [];
  const rejected = [];
  const needsReview = [];

  for (const product of products) {
    log.info(`Evaluating: ${product.titleAr || product.productNameEn}`);

    try {
      // Skip already failed products
      if (product.status === 'copy_failed') {
        rejected.push({ ...product, criticVerdict: 'REJECT', criticReason: 'Copy generation failed' });
        continue;
      }

      // Analyze primary image
      const primaryImage = Array.isArray(product.images) ? product.images[0] : product.images;
      let imageAnalysis = { imageScore: 50, verdict: 'NEEDS_REVIEW', issues: [] };

      if (primaryImage) {
        imageAnalysis = await analyzeProductImage(primaryImage, product.titleEn || product.productNameEn);
        await new Promise(r => setTimeout(r, 800));
      } else {
        imageAnalysis.issues.push('no_images_provided');
      }

      // Analyze text content
      const textAnalysis = await analyzeProductText(product);
      await new Promise(r => setTimeout(r, 600));

      // Overall scoring
      const imageScore = imageAnalysis.imageScore || 50;
      const textScore = textAnalysis.textScore || 50;
      const overallScore = Math.round(imageScore * 0.55 + textScore * 0.45);

      const allIssues = [
        ...(imageAnalysis.issues || []),
        ...(textAnalysis.issues || []),
      ];

      // Hard fails
      const hardFail = imageAnalysis.hasWatermark
        || imageAnalysis.isBlurryOrLowRes
        || textAnalysis.verdict === 'REJECT'
        || imageAnalysis.verdict === 'REJECT'
        || imageAnalysis.cannotFetchImage;

      let finalVerdict;
      if (hardFail || overallScore < LUXURY_STANDARDS.minimumOverallScore) {
        finalVerdict = 'REJECT';
      } else if (overallScore >= LUXURY_STANDARDS.minimumOverallScore && overallScore < 80) {
        finalVerdict = 'NEEDS_REVIEW';
      } else {
        finalVerdict = 'APPROVE';
      }

      const criticReport = {
        imageScore,
        textScore,
        overallScore,
        imageAnalysis,
        textAnalysis,
        allIssues,
        finalVerdict,
        auditedAt: new Date().toISOString(),
      };

      const enrichedProduct = { ...product, criticReport, criticVerdict: finalVerdict };

      if (finalVerdict === 'APPROVE') {
        approved.push(enrichedProduct);
        log.info(`✅ APPROVED: ${product.titleAr} (score: ${overallScore}/100)`);
      } else if (finalVerdict === 'NEEDS_REVIEW') {
        needsReview.push(enrichedProduct);
        log.warn(`⚠️  NEEDS REVIEW: ${product.titleAr} (score: ${overallScore}/100) — ${allIssues.join(', ')}`);
      } else {
        rejected.push(enrichedProduct);
        log.warn(`❌ REJECTED: ${product.titleAr} (score: ${overallScore}/100) — ${allIssues.slice(0, 2).join(', ')}`);
      }
    } catch (err) {
      log.error(`Critic failed for ${product.productNameEn}: ${err.message}`);
      needsReview.push({ ...product, criticVerdict: 'NEEDS_REVIEW', criticError: err.message });
    }
  }

  log.info(`\n🏁 Critic Report:`);
  log.info(`   ✅ Approved:      ${approved.length}`);
  log.info(`   ⚠️  Needs Review:  ${needsReview.length}`);
  log.info(`   ❌ Rejected:      ${rejected.length}`);

  return { approved, needsReview, rejected };
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1].endsWith('design-critic-agent.js')) {
  const testProduct = {
    productNameEn: '18K Gold Luxury Bracelet',
    titleAr: 'سوار ذهبي فاخر 18 قيراط',
    titleEn: '18K Gold Luxury Statement Bracelet',
    shortDescAr: 'أناقة لا مثيل لها في كل لحظة',
    descAr: 'وصف تجريبي',
    categoryName: 'Jewelry',
    cost: 18.5,
    images: ['https://via.placeholder.com/600x600.png?text=Gold+Bracelet'],
    pricing: { sellingPrice: 299, compareAtPrice: 399 },
  };

  runDesignCriticAgent([testProduct])
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => { log.error(err.message); process.exit(1); });
}
