/**
 * TITAN-10 | Agent 4 — Social Strategist
 * Reads PENDING_STRATEGY items.
 * Generates 3 ad captions: TikTok hook, Snap caption, IG caption.
 * Uses Gemini if available — otherwise uses templated fallback.
 * Push to READY_TO_PUBLISH.
 */

import { prisma } from '@/lib/prisma';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

async function generateAdCopy(titleAr: string, titleEn: string, price: number, marginPct: number): Promise<{
  tiktok: string;
  snap: string;
  ig: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    const prompt = `أنت خبير تسويق رقمي للسوق السعودي. المنتج: "${titleAr}" بسعر ${price} ريال.

اكتب 3 منشورات تسويقية قصيرة وفيروسية:
1. TikTok Hook (20-25 كلمة) — جملة افتتاحية تجذب الانتباه فوراً + 3 هاشتاقات
2. Snapchat Caption (15-20 كلمة) — مباشر وعاطفي + إيموجي
3. Instagram Caption (25-35 كلمة) — راقي واحترافي + دعوة للشراء

أجب بـ JSON فقط:
{"tiktok": "...", "snap": "...", "ig": "..."}`;

    try {
      const res  = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 500 },
        }),
      });
      const data = await res.json();
      const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { tiktok?: string; snap?: string; ig?: string };
        if (parsed.tiktok && parsed.snap && parsed.ig) {
          return {
            tiktok: parsed.tiktok.slice(0, 300),
            snap:   parsed.snap.slice(0, 200),
            ig:     parsed.ig.slice(0, 300),
          };
        }
      }
    } catch { /* fall through to template */ }
  }

  // Fallback templates
  return {
    tiktok: `🔥 "${titleAr}" وصل للسعودية! بـ ${price} ريال فقط 💎 لا تفوّت الفرصة — اطلب الآن قبل النفاد ⚡ #السعودية #تسوق #فرصة`,
    snap:   `✨ "${titleAr}" — ${price} ر.س 🇸🇦 توصيل سريع + دفع عند الاستلام 🛍️`,
    ig:     `${titleAr} 🖤\n\nجودة عالمية بسعر ${price} ريال — اختيار مدروس لمن يقدّر الأفضل.\n\n✦ شحن سريع لكل المدن ✦ دفع عند الاستلام ✦ إرجاع مجاني\n\n🛒 اطلب الآن من الرابط في البايو`,
  };
}

export async function runStrategist(): Promise<{ done: number; errors: number }> {
  let done = 0;
  let errors = 0;

  const items = await prisma.agentTaskQueue.findMany({
    where: { status: 'PENDING_STRATEGY' },
    take: 20,
  });

  for (const item of items) {
    try {
      const { calculateLuxuryPrice } = await import('@/lib/pricing-engine');
      const price = calculateLuxuryPrice(item.baseCost, item.shippingCost);
      const { tiktok, snap, ig } = await generateAdCopy(
        item.titleAr || item.titleEn,
        item.titleEn,
        price,
        item.marginPct
      );

      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: {
          adCopyTikTok: tiktok,
          adCopySnap:   snap,
          adCopyIG:     ig,
          status:       'READY_TO_PUBLISH',
          agentNotes:   'Strategist: 3 ad copies generated',
        },
      });
      done++;
    } catch (err) {
      errors++;
      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: { errorLog: String(err).slice(0, 300) },
      });
    }
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/strategist',
      message: `Strategist: ${done} ad kits ready, ${errors} errors`,
      metadata: JSON.stringify({ done, errors }),
    },
  });

  return { done, errors };
}
