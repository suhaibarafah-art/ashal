/**
 * POST /api/sys/repair-products
 * One-time repair: fixes existing products with English in Arabic fields,
 * template descriptions, stockLevel=0, and category="general".
 * Protected by CRON_SECRET.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Same keyword map as copywriter — duplicated here to avoid circular deps
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
    keywords: ['wallet', 'rfid', 'card holder', 'leather wallet'],
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
  {
    keywords: ['perfume', 'diffuser', 'aroma', 'fragrance', 'scent'],
    titleAr: 'جهاز ناشر عطور فاخر بتصميم راقٍ',
    descAr: 'انعم بأجواء عطرة في منزلك مع ناشر عطور فاخر يملأ الفضاء برائحة منعشة. تصميم أنيق يناسب ديكور كل غرفة مع خيارات تحكم سهلة.',
    category: 'home',
  },
  {
    keywords: ['bag', 'backpack', 'handbag', 'purse', 'tote'],
    titleAr: 'حقيبة فاخرة بتصميم عصري أنيق',
    descAr: 'حقيبة فاخرة مصنوعة من أجود الخامات مع تفاصيل دقيقة تعكس الذوق الراقي. مساحة واسعة وجيوب متعددة لتنظيم مقتنياتك بأسلوب.',
    category: 'fashion',
  },
  {
    keywords: ['sunglasses', 'glasses', 'eyewear'],
    titleAr: 'نظارات شمسية فاخرة بحماية UV كاملة',
    descAr: 'نظارات شمسية أنيقة توفر حماية شاملة من الأشعة فوق البنفسجية مع عدسات عالية الجودة. إطار خفيف الوزن متين ومريح للارتداء طوال اليوم.',
    category: 'fashion',
  },
];

// Arabic alphabet detection — if > 30% non-Arabic (Latin chars), consider it "bad"
function hasEnglishLeakage(str: string): boolean {
  if (!str) return true;
  const latinChars = (str.match(/[a-zA-Z]/g) || []).length;
  return latinChars > str.length * 0.15; // more than 15% Latin = bad
}

function isTemplateDesc(desc: string): boolean {
  // Template phrases used in old fallback
  return (
    desc.includes('استمتع بالفخامة المطلقة') ||
    desc.includes('تم اختياره بعناية ليلائم ذوق النخبة السعودية') ||
    (desc.includes('إصدار فاخر حصري') && desc.length < 100)
  );
}

function repairProduct(titleEn: string, titleAr: string, descAr: string, category: string) {
  const lower = titleEn.toLowerCase();
  const needsTitleFix = hasEnglishLeakage(titleAr);
  const needsDescFix = isTemplateDesc(descAr) || hasEnglishLeakage(descAr);
  const needsCategoryFix = !category || category === 'general';

  if (!needsTitleFix && !needsDescFix && !needsCategoryFix) return null;

  let newTitleAr = titleAr;
  let newDescAr = descAr;
  let newCategory = category;

  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      if (needsTitleFix) newTitleAr = entry.titleAr;
      if (needsDescFix) newDescAr = entry.descAr;
      if (needsCategoryFix) newCategory = entry.category;
      break;
    }
  }

  // If no keyword match but still needs fix → generic Arabic fallback
  if (needsTitleFix && newTitleAr === titleAr) {
    newTitleAr = 'منتج فاخر مختار بعناية للسوق السعودي';
  }
  if (needsDescFix && newDescAr === descAr) {
    newDescAr = 'منتج عالي الجودة تم اختياره بمعايير صارمة ليناسب ذوق العميل السعودي الراقي. جودة مضمونة وشحن سريع لجميع مناطق المملكة مع ضمان الرضا التام.';
  }
  if (needsCategoryFix && newCategory === category) {
    newCategory = 'general';
  }

  return { newTitleAr, newDescAr, newCategory };
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-admin-key') ?? req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allProducts = await prisma.product.findMany({
    select: { id: true, titleEn: true, titleAr: true, descAr: true, category: true, stockLevel: true, supplier: true },
  });

  let fixed = 0;
  let skipped = 0;
  const log: string[] = [];

  for (const p of allProducts) {
    const repair = repairProduct(p.titleEn ?? '', p.titleAr, p.descAr, p.category ?? 'general');

    // Also fix stockLevel=0 for CJ products (Guardian will sync real stock later)
    const needsStockFix = p.supplier === 'cj' && (p.stockLevel ?? 0) === 0;

    if (!repair && !needsStockFix) { skipped++; continue; }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        ...(repair ? {
          titleAr:  repair.newTitleAr,
          descAr:   repair.newDescAr,
          category: repair.newCategory,
        } : {}),
        ...(needsStockFix ? { stockLevel: 50 } : {}),
      },
    });

    log.push(`Fixed: [${p.titleEn?.slice(0, 40)}] → title:${!!repair?.newTitleAr} desc:${!!repair?.newDescAr} stock:${needsStockFix}`);
    fixed++;
  }

  await prisma.systemLog.create({
    data: {
      level:   'SUCCESS',
      source:  'sys/repair-products',
      message: `Product repair complete: ${fixed} fixed, ${skipped} skipped`,
      metadata: JSON.stringify({ fixed, skipped, total: allProducts.length }),
    },
  });

  return NextResponse.json({ ok: true, fixed, skipped, total: allProducts.length, log });
}
