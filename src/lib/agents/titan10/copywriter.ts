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

// Keyword → luxury Arabic content map (no English leakage)
const KEYWORD_MAP: Array<{
  keywords: string[];
  titleAr: string;
  descAr: string;
  category: string;
}> = [
  {
    keywords: ['wireless charger', 'wireless charging', 'charger'],
    titleAr: 'شاحن لاسلكي فائق السرعة بتصميم عصري فاخر',
    descAr: 'شحن لاسلكي سريع يدعم أحدث الأجهزة الذكية بتقنية متقدمة. تصميم أنيق يليق بغرفتك، توافق شامل مع آيفون وأندرويد، وحماية ذكية من السخونة الزائدة.',
    category: 'electronics',
  },
  {
    keywords: ['led desk lamp', 'desk lamp', 'led lamp', 'lamp', 'light'],
    titleAr: 'مصباح مكتب LED ذكي بإضاءة قابلة للتعديل',
    descAr: 'إضاءة مثالية لمكتبك بتقنية LED موفرة للطاقة. ثلاثة أوضاع إضاءة ودرجات حرارة لونية متعددة لراحة عينيك، مثالي للعمل والدراسة في المنزل.',
    category: 'home',
  },
  {
    keywords: ['car organizer', 'car', 'auto', 'vehicle'],
    titleAr: 'منظم سيارة أنيق بسعة تخزين كبيرة',
    descAr: 'حافظ على ترتيب سيارتك بأسلوب راقٍ. مصنوع من خامات متينة عالية الجودة مع تصميم يناسب جميع موديلات السيارات، يجعل رحلاتك أكثر انتظاماً وأناقة.',
    category: 'automotive',
  },
  {
    keywords: ['kitchen gadget', 'kitchen', 'cooking', 'food'],
    titleAr: 'أداة مطبخ ذكية لتجربة طبخ استثنائية',
    descAr: 'ارتقِ بتجربتك في المطبخ مع هذه الأداة الذكية المصنوعة من مواد غذائية آمنة. تصميم عملي يوفر وقتك وجهدك مع نتائج احترافية في كل مرة.',
    category: 'kitchen',
  },
  {
    keywords: ['phone stand', 'phone holder', 'stand', 'holder', 'mount'],
    titleAr: 'حامل هاتف ذكي بتصميم قابل للتعديل',
    descAr: 'حامل هاتف مريح وأنيق يتيح لك رؤية شاشتك بزاوية مثالية. مناسب لجميع أحجام الهواتف، ثابت وقوي مع قاعدة مضادة للانزلاق.',
    category: 'accessories',
  },
  {
    keywords: ['bluetooth earbuds', 'earbuds', 'earphones', 'headphones', 'audio', 'bluetooth'],
    titleAr: 'سماعات بلوتوث لاسلكية بجودة صوت نقية',
    descAr: 'استمتع بصوت نقي واضح مع سماعات لاسلكية توفر عزل رائع للضوضاء. بطارية تدوم طويلاً، اتصال بلوتوث مستقر، ومناسبة للرياضة والسفر.',
    category: 'electronics',
  },
  {
    keywords: ['portable fan', 'fan', 'cooling', 'mini fan'],
    titleAr: 'مروحة محمولة صامتة بأداء تبريد فائق',
    descAr: 'تبريد فوري أينما كنت بمروحة محمولة صامتة وخفيفة الوزن. ثلاث سرعات للهواء وبطارية تشغيل طويلة، مثالية للمكتب والسفر وأوقات الفراغ.',
    category: 'home',
  },
  {
    keywords: ['smart home', 'smart', 'iot', 'wifi', 'remote'],
    titleAr: 'جهاز منزل ذكي يرقى بأسلوب حياتك',
    descAr: 'تحكم في منزلك بذكاء وسهولة مع تقنية متطورة توفر الراحة والأمان. سهل الإعداد ومتوافق مع الأجهزة الذكية الشائعة لتجربة منزل ذكي متكاملة.',
    category: 'electronics',
  },
  {
    keywords: ['wallet', 'rfid', 'card holder'],
    titleAr: 'محفظة جلدية فاخرة بحماية RFID متقدمة',
    descAr: 'محفظة من الجلد الطبيعي الفاخر مع تقنية حماية RFID لأمان بطاقاتك البنكية. تصميم نحيف أنيق يتسع لبطاقاتك وأوراقك بشكل منظم.',
    category: 'accessories',
  },
  {
    keywords: ['watch', 'smartwatch', 'band', 'bracelet'],
    titleAr: 'ساعة ذكية أنيقة بمزايا متقدمة',
    descAr: 'اجمع بين الأناقة والتقنية مع ساعة ذكية تتابع صحتك ونشاطاتك اليومية. شاشة مشرقة، بطارية تدوم أياماً، ومقاومة للماء لمواكبة أسلوب حياتك.',
    category: 'electronics',
  },
];

function detectCategory(titleEn: string): string {
  const lower = titleEn.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.category;
    }
  }
  return 'general';
}

function fallbackLocalize(titleEn: string): { titleAr: string; descAr: string } {
  const lower = titleEn.toLowerCase();

  // Try to match a known keyword
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return { titleAr: entry.titleAr, descAr: entry.descAr };
    }
  }

  // Generic luxury fallback — still full Arabic, no English leakage
  return {
    titleAr: 'منتج فاخر مختار بعناية للسوق السعودي',
    descAr:  'منتج عالي الجودة تم اختياره بمعايير صارمة ليناسب ذوق العميل السعودي الراقي. جودة مضمونة وشحن سريع لجميع مناطق المملكة مع ضمان الرضا التام.',
  };
}

export { detectCategory };

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
