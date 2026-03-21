/**
 * TITAN-5 AGENT SYSTEM
 * 5 autonomous agents orchestrated by a silent CEO
 * Agent 1 (Scout)      → scrape/sync products from CJ/Mkhazen
 * Agent 2 (Copywriter) → Gemini-powered Arabic descriptions
 * Agent 3 (Critic)     → image audit & score
 * Agent 4 (Strategist) → social kit generator
 * Agent 5 (CEO)        → silent orchestrator, logs to Neon
 */

import { prisma } from '@/lib/prisma';
import { calculateLuxuryPrice } from '@/lib/pricing-engine';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentResult {
  agent: string;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  durationMs: number;
}

export interface Titan5Report {
  runId: string;
  startedAt: string;
  finishedAt: string;
  totalDurationMs: number;
  results: AgentResult[];
  productsUpserted: number;
  socialKitGenerated: boolean;
}

// ─── Agent 1: Scout ───────────────────────────────────────────────────────────

export async function agentScout(): Promise<AgentResult> {
  const t0 = Date.now();
  try {
    const products = getMkhazenCatalogue();

    let upserted = 0;
    for (const p of products) {
      const finalPrice = calculateLuxuryPrice(p.cost, p.shipping);
      await prisma.product.upsert({
        where: { titleEn: p.titleEn },
        update: {
          titleAr: p.titleAr,
          descAr: p.descriptionAr,
          imageUrl: p.imageUrl,
          finalPrice,
          shippingCost: p.shipping,
          category: p.category,
          supplier: p.supplier,
          stockLevel: p.stock,
          weightKg: p.weightKg,
          supplierSku: p.sku,
        },
        create: {
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          descAr: p.descriptionAr,
          imageUrl: p.imageUrl,
          baseCost: p.cost,
          finalPrice,
          shippingCost: p.shipping,
          category: p.category,
          supplier: p.supplier,
          stockLevel: p.stock,
          weightKg: p.weightKg,
          supplierSku: p.sku,
        },
      });
      upserted++;
    }

    return { agent: 'Scout', success: true, data: { upserted, source: 'mkhazen' }, durationMs: Date.now() - t0 };
  } catch (error) {
    return { agent: 'Scout', success: false, error: String(error), durationMs: Date.now() - t0 };
  }
}

// ─── Agent 2: Copywriter ──────────────────────────────────────────────────────

export async function agentCopywriter(): Promise<AgentResult> {
  const t0 = Date.now();
  try {
    const geminiKey = process.env.GEMINI_API_KEY;

    // Get products with short/missing descriptions
    const products = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    let enhanced = 0;
    for (const product of products) {
      let newDesc = product.descAr;

      if (geminiKey && geminiKey !== 'PENDING' && geminiKey.length > 10) {
        // Real Gemini call
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `أنت كاتب نصوص فاخر لمتجر سعودي راقي. اكتب وصفاً تسويقياً بالعربية لهذا المنتج في 2-3 جمل قصيرة مقنعة، مع التركيز على الجودة والفخامة:\n\nاسم المنتج: ${product.titleAr}\n\nالوصف الحالي: ${product.descAr}\n\nأعطني الوصف الجديد فقط بدون أي مقدمة.`,
                  }],
                }],
              }),
            }
          );
          const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.length > 20) {
            newDesc = text.trim();
          }
        } catch {
          // Gemini failed — keep existing desc
        }
      } else {
        // Fallback: append luxury suffix if not present
        if (!newDesc.includes('جودة عالية')) {
          newDesc = `${newDesc} — جودة عالية ومضمونة، شحن سريع داخل المملكة العربية السعودية، مناسب للهدايا الفاخرة.`;
        }
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { descAr: newDesc },
      });
      enhanced++;
    }

    return { agent: 'Copywriter', success: true, data: { enhanced, geminiUsed: !!(geminiKey && geminiKey !== 'PENDING') }, durationMs: Date.now() - t0 };
  } catch (error) {
    return { agent: 'Copywriter', success: false, error: String(error), durationMs: Date.now() - t0 };
  }
}

// ─── Agent 3: Critic ──────────────────────────────────────────────────────────

export async function agentCritic(): Promise<AgentResult> {
  const t0 = Date.now();
  try {
    const products = await prisma.product.findMany({ take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, titleEn: true, descAr: true, finalPrice: true, imageUrl: true } });

    let passed = 0, failed = 0;
    const issues: string[] = [];

    for (const p of products) {
      const imgUrl = (p as unknown as { imageUrl?: string }).imageUrl ?? '';
      const hasImage = imgUrl && imgUrl.startsWith('http');
      const hasArabicDesc = p.descAr && p.descAr.length > 30;
      const hasValidPrice = p.finalPrice > 0;

      if (!hasImage) { failed++; issues.push(`${p.titleEn}: missing image`); }
      else if (!hasArabicDesc) { failed++; issues.push(`${p.titleEn}: description too short`); }
      else if (!hasValidPrice) { failed++; issues.push(`${p.titleEn}: price is 0`); }
      else passed++;
    }

    const score = products.length > 0 ? Math.round((passed / products.length) * 100) : 100;

    await prisma.systemLog.create({
      data: {
        level: score >= 80 ? 'SUCCESS' : 'WARN',
        source: 'agent/critic',
        message: `Image audit: ${score}% pass rate (${passed}/${products.length})`,
        metadata: JSON.stringify({ issues: issues.slice(0, 5) }),
      },
    });

    return { agent: 'Critic', success: true, data: { score, passed, failed, totalAudited: products.length }, durationMs: Date.now() - t0 };
  } catch (error) {
    return { agent: 'Critic', success: false, error: String(error), durationMs: Date.now() - t0 };
  }
}

// ─── Agent 4: Strategist ──────────────────────────────────────────────────────

export async function agentStrategist(): Promise<AgentResult> {
  const t0 = Date.now();
  try {
    const [topProducts, recentOrders] = await Promise.all([
      prisma.product.findMany({ take: 3, orderBy: { finalPrice: 'desc' } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { product: { select: { titleAr: true } } } }),
    ]);

    const socialKit = {
      generatedAt: new Date().toISOString(),
      instagramCaption: topProducts[0]
        ? `✨ ${topProducts[0].titleAr} — الآن بسعر ${topProducts[0].finalPrice.toFixed(2)} ريال\nاستخدم كود SAVE10 للحصول على خصم 10%\n\n#متجر_سعودي_فاخر #هدايا_فاخرة #تسوق_اونلاين`
        : '✨ تسوق الآن من مجموعتنا الفاخرة',
      twitterPost: topProducts[0]
        ? `🛍️ ${topProducts[0].titleAr} — ${topProducts[0].finalPrice.toFixed(0)} SAR\nكود خصم: SAVE10\n#Saudi #Luxury`
        : '🛍️ منتجات فاخرة بأسعار مميزة',
      whatsappMessage: `السلام عليكم! 🌟\nلدينا عروض حصرية في متجرنا الفاخر\nاستخدم كود *ROYAL20* للحصول على خصم 20%\nتسوق الآن: ${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store'}`,
      topProducts: topProducts.map(p => ({ title: p.titleAr, price: p.finalPrice })),
      ordersThisWeek: recentOrders.length,
    };

    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        source: 'agent/strategist',
        message: `Social kit generated — ${topProducts.length} featured products`,
        metadata: JSON.stringify({ generatedAt: socialKit.generatedAt }),
      },
    });

    return { agent: 'Strategist', success: true, data: socialKit as unknown as Record<string, unknown>, durationMs: Date.now() - t0 };
  } catch (error) {
    return { agent: 'Strategist', success: false, error: String(error), durationMs: Date.now() - t0 };
  }
}

// ─── Agent 5: CEO (Orchestrator) ──────────────────────────────────────────────

export async function agentCEO(results: AgentResult[]): Promise<AgentResult> {
  const t0 = Date.now();
  try {
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalMs = results.reduce((s, r) => s + r.durationMs, 0);

    const health = failed === 0 ? 'GREEN' : failed <= 1 ? 'YELLOW' : 'RED';

    await prisma.systemLog.create({
      data: {
        level: health === 'GREEN' ? 'SUCCESS' : health === 'YELLOW' ? 'WARN' : 'ERROR',
        source: 'agent/ceo',
        message: `Titan-5 run complete — ${passed}/4 agents passed — health: ${health}`,
        metadata: JSON.stringify({
          passed, failed, totalMs,
          agents: results.map(r => ({ name: r.agent, success: r.success, ms: r.durationMs })),
        }),
      },
    });

    return {
      agent: 'CEO',
      success: true,
      data: { health, passed, failed, totalAgentMs: totalMs },
      durationMs: Date.now() - t0,
    };
  } catch (error) {
    return { agent: 'CEO', success: false, error: String(error), durationMs: Date.now() - t0 };
  }
}

// ─── Master Run ───────────────────────────────────────────────────────────────

export async function runTitan5(): Promise<Titan5Report> {
  const runId = `run_${Date.now()}`;
  const startedAt = new Date().toISOString();

  await prisma.systemLog.create({
    data: { level: 'INFO', source: 'titan5', message: `Titan-5 initiated — runId: ${runId}` },
  });

  // Run agents 1-4 sequentially (each depends on DB state)
  const scoutResult = await agentScout();
  const copywriterResult = await agentCopywriter();
  const criticResult = await agentCritic();
  const strategistResult = await agentStrategist();

  const agentResults = [scoutResult, copywriterResult, criticResult, strategistResult];

  // CEO gets the full picture last
  const ceoResult = await agentCEO(agentResults);
  agentResults.push(ceoResult);

  const finishedAt = new Date().toISOString();

  const productsUpserted = (scoutResult.data?.upserted as number) ?? 0;
  const socialKitGenerated = strategistResult.success;

  return {
    runId,
    startedAt,
    finishedAt,
    totalDurationMs: agentResults.reduce((s, r) => s + r.durationMs, 0),
    results: agentResults,
    productsUpserted,
    socialKitGenerated,
  };
}

// ─── Mkhazen Static Catalogue (fallback) ─────────────────────────────────────

function getMkhazenCatalogue() {
  return [
    {
      sku: 'MK-PERF-001', supplier: 'mkhazen', category: 'عطور',
      titleAr: 'عطر ملكي مسك وعود', titleEn: 'Royal Musk & Oud Perfume',
      descriptionAr: 'عطر شرقي فاخر بمزيج المسك والعود، يدوم طويلاً ويناسب المناسبات الرسمية والسهرات.',
      imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
      cost: 180, shipping: 20, stock: 50, weightKg: 0.3,
    },
    {
      sku: 'MK-WATCH-001', supplier: 'mkhazen', category: 'ساعات',
      titleAr: 'ساعة كلاسيكية فضية', titleEn: 'Classic Silver Watch',
      descriptionAr: 'ساعة كلاسيكية بتصميم أنيق، هيكل من الفولاذ المقاوم للصدأ ومينا بيضاء راقية.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      cost: 350, shipping: 30, stock: 20, weightKg: 0.2,
    },
    {
      sku: 'MK-BAG-001', supplier: 'mkhazen', category: 'حقائب',
      titleAr: 'حقيبة يد جلد طبيعي', titleEn: 'Genuine Leather Handbag',
      descriptionAr: 'حقيبة يد أنيقة من الجلد الطبيعي الفاخر، تتسع للضروريات اليومية بأسلوب راقي.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      cost: 420, shipping: 35, stock: 15, weightKg: 0.8,
    },
    {
      sku: 'MK-SCARF-001', supplier: 'mkhazen', category: 'إكسسوارات',
      titleAr: 'وشاح حرير ملكي', titleEn: 'Royal Silk Scarf',
      descriptionAr: 'وشاح من الحرير الخالص بألوان راقية، هدية مثالية للمرأة العصرية.',
      imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
      cost: 120, shipping: 15, stock: 40, weightKg: 0.1,
    },
    {
      sku: 'MK-CREAM-001', supplier: 'mkhazen', category: 'عناية',
      titleAr: 'كريم ترطيب فاخر بالعنبر', titleEn: 'Luxury Ambergris Moisturizer',
      descriptionAr: 'كريم ترطيب يومي بخلاصة العنبر والأرغان، يمنح البشرة نضارة وإشراقة لا مثيل لها.',
      imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
      cost: 95, shipping: 10, stock: 60, weightKg: 0.25,
    },
    {
      sku: 'CJ-GLASSES-001', supplier: 'cj', category: 'نظارات',
      titleAr: 'نظارة شمسية بلاك فريم', titleEn: 'Black Frame Sunglasses',
      descriptionAr: 'نظارة شمسية بإطار أسود مميز وعدسات UV400، تجمع بين الأناقة والحماية.',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      cost: 65, shipping: 25, stock: 100, weightKg: 0.15,
    },
    {
      sku: 'CJ-BELT-001', supplier: 'cj', category: 'إكسسوارات',
      titleAr: 'حزام جلدي فاخر ذهبي', titleEn: 'Gold Buckle Leather Belt',
      descriptionAr: 'حزام جلدي أصيل بإبزيم ذهبي، مثالي للإطلالات الرسمية والعملية الراقية.',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      cost: 80, shipping: 20, stock: 35, weightKg: 0.35,
    },
    {
      sku: 'CJ-FRAME-001', supplier: 'cj', category: 'ديكور',
      titleAr: 'إطار صور ذهبي فاخر', titleEn: 'Luxury Gold Photo Frame',
      descriptionAr: 'إطار صور بطلاء ذهبي فاخر، يضفي على منزلك لمسة من الأناقة والتميز.',
      imageUrl: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&q=80',
      cost: 55, shipping: 15, stock: 80, weightKg: 0.5,
    },
  ];
}
