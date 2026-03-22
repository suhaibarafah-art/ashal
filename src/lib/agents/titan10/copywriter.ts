/**
 * TITAN-10 | Agent 2 — Copywriter (Gemini Pro 1.5)
 * Reads PENDING_COPY items.
 * Calls Gemini to generate Saudi Luxury Arabic title + description.
 * Falls back to template if GEMINI_API_KEY is missing.
 * Push to PENDING_STRATEGY.
 */

import { prisma } from '@/lib/prisma';
import { notifyCritical } from './ceo';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

async function geminiLocalize(titleEn: string): Promise<{ titleAr: string; descAr: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return fallbackLocalize(titleEn);
  }

  const prompt = `أنت كاتب محتوى فاخر متخصص في السوق السعودي.
المنتج الإنجليزي: "${titleEn}"

المطلوب:
1. عنوان عربي فاخر (10-15 كلمة) يعكس الجودة والرقي للعميل السعودي
2. وصف عربي راقٍ (40-60 كلمة) بأسلوب متجر أونيكس أو نمشي — يبرز المنفعة والحصرية

أجب بـ JSON فقط:
{"titleAr": "...", "descAr": "..."}`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
    });

    const data = await res.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallbackLocalize(titleEn);

    const parsed = JSON.parse(jsonMatch[0]) as { titleAr?: string; descAr?: string };
    return {
      titleAr: parsed.titleAr?.slice(0, 200) || fallbackLocalize(titleEn).titleAr,
      descAr:  parsed.descAr?.slice(0, 600)  || fallbackLocalize(titleEn).descAr,
    };
  } catch {
    return fallbackLocalize(titleEn);
  }
}

function fallbackLocalize(titleEn: string): { titleAr: string; descAr: string } {
  return {
    titleAr: `${titleEn} — إصدار فاخر حصري`,
    descAr:  `${titleEn} — منتج عالي الجودة مختار بعناية للسوق السعودي. جودة مضمونة، شحن سريع لجميع مناطق المملكة، مع ضمان الرضا التام خلال 14 يوماً.`,
  };
}

export async function runCopywriter(): Promise<{ written: number; fallback: number; errors: number }> {
  let written = 0;
  let fallback = 0;
  let errors = 0;

  const items = await prisma.agentTaskQueue.findMany({
    where: { status: 'PENDING_COPY' },
    take: 20,
  });

  const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  for (const item of items) {
    try {
      const { titleAr, descAr } = await geminiLocalize(item.titleEn);
      const usedFallback = !hasGemini;

      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: {
          titleAr,
          descAr,
          status:     'PENDING_STRATEGY',
          agentNotes: usedFallback ? 'Copywriter: fallback (no Gemini key)' : 'Copywriter: Gemini Pro 1.5',
        },
      });

      usedFallback ? fallback++ : written++;
    } catch (err) {
      errors++;
      await notifyCritical('Copywriter/Gemini', item.titleEn, err);
      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: { errorLog: String(err).slice(0, 300) },
      });
    }
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/copywriter',
      message: `Copywriter: ${written} Gemini, ${fallback} fallback, ${errors} errors`,
      metadata: JSON.stringify({ written, fallback, errors, hasGemini }),
    },
  });

  return { written, fallback, errors };
}
