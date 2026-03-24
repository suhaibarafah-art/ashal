// Standalone ESM seed — no @/ path aliases
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calcPrice(cost, shipping) {
  const raw = (cost + shipping) * 1.30 * 1.15;
  return Math.floor(raw) + 0.99;
}

// picsum.photos/seed/{word}/600/600 — stable, no auth required, no 503
const PRODUCTS = [
  { en: "Elite Oud Diffuser", ar: "فواحة العود الملكية الذكية", cost: 120, shipping: 25, supplier: "mkhazen", category: "ديكور", img: "https://picsum.photos/seed/oud-diffuser/600/600", desc: "فواحة عود ملكية فاخرة بتصميم معاصر، مزيج من الرخام وخشب الأبنوس. شحن سريع 24-48 ساعة داخل المملكة." },
  { en: "Smart Prayer Wall Clock", ar: "ساعة حائط ذكية بمواقيت الصلاة", cost: 85, shipping: 20, supplier: "mkhazen", category: "إلكترونيات", img: "https://picsum.photos/seed/prayer-clock/600/600", desc: "ساعة حائط ذكية بشاشة LED عالية الوضوح تعرض مواقيت الصلاة والتاريخ الهجري. مثالية للمكاتب والمنازل الفاخرة." },
  { en: "Gold-Leaf Coffee Set", ar: "طقم فناجين قهوة بطلاء الذهب", cost: 45, shipping: 15, supplier: "mkhazen", category: "مطبخ", img: "https://picsum.photos/seed/gold-coffee/600/600", desc: "طقم فناجين قهوة عربية من البورسلان الفاخر بطلاء الذهب عيار 24. هدية مثالية للمناسبات والأعياد." },
  { en: "Minimalist Desert Abaya", ar: "عباية الصحراء مينيمال فاخرة", cost: 180, shipping: 30, supplier: "mkhazen", category: "أزياء", img: "https://picsum.photos/seed/desert-abaya/600/600", desc: "عباية مينيمالية بلمسة صحراوية أصيلة من الكريب الياباني. تناسب كل المناسبات بأسلوب عصري راقٍ." },
  { en: "Sovereign Marble Coasters", ar: "قواعد أكواب رخام ملكي", cost: 15, shipping: 10, supplier: "cj", category: "ديكور", img: "https://picsum.photos/seed/marble-coasters/600/600", desc: "قواعد أكواب من الرخام الطبيعي المصقول. تضيف لمسة من الفخامة على طاولتك." },
  { en: "Antique Calligraphy Lamp", ar: "مصباح الخط العربي الكلاسيكي", cost: 60, shipping: 20, supplier: "mkhazen", category: "إضاءة", img: "https://picsum.photos/seed/calligraphy-lamp/600/600", desc: "مصباح تراثي بنقوش الخط العربي مصنوع يدوياً من الحديد المطروق. يضفي أجواء دافئة ورومانسية." },
  { en: "Royal Sand Hourglass", ar: "ساعة رملية برمال العلا الذهبية", cost: 35, shipping: 12, supplier: "cj", category: "ديكور", img: "https://picsum.photos/seed/sand-hourglass/600/600", desc: "ساعة رملية فريدة برمال العلا الذهبية الأصيلة محفوظة في زجاج مصنوع يدوياً. تحفة فنية وهدية حصرية." },
  { en: "Velvet Bedouin Throw", ar: "شرشف مخملي بنقوش بدوية أصيلة", cost: 95, shipping: 25, supplier: "mkhazen", category: "مفروشات", img: "https://picsum.photos/seed/velvet-throw/600/600", desc: "شرشف من المخمل الإيطالي الفاخر بتطريز يدوي بنقوش بدوية أصيلة. جودة ودفء لا مثيل لهما." },
  { en: "Pure Saffron Mist", ar: "بخاخ الزعفران النقي للغرف", cost: 25, shipping: 8, supplier: "cj", category: "عطور", img: "https://picsum.photos/seed/saffron-mist/600/600", desc: "بخاخ غرف بخلاصة الزعفران الأصلي والزيوت العطرية النقية. يمنح مساحتك رائحة شرقية ساحرة." },
  { en: "Onyx Incense Burner", ar: "مبخرة أونيكس سوداء فاخرة", cost: 70, shipping: 18, supplier: "mkhazen", category: "عطور", img: "https://picsum.photos/seed/onyx-incense/600/600", desc: "مبخرة فاخرة من حجر الأونيكس الأسود مع قاعدة ستانلس ستيل. تضيف فخامة وأناقة لكل مجلس." },
  { en: "Saudi Vision Luxury Pen", ar: "قلم الرؤية الإصدار الفاخر", cost: 30, shipping: 10, supplier: "cj", category: "إكسسوارات", img: "https://picsum.photos/seed/luxury-pen/600/600", desc: "قلم فاخر مطلي بالكروم مع ريشة ذهبية. رمز للطموح والنجاح، هدية مثالية لرجال الأعمال." },
  { en: "Silk Prayer Rug Elite", ar: "سجادة صلاة حريرية طبعة النخبة", cost: 55, shipping: 15, supplier: "mkhazen", category: "مفروشات", img: "https://picsum.photos/seed/prayer-rug/600/600", desc: "سجادة صلاة من الحرير الصناعي عالي الكثافة بتصميم فاخر ومريح. لتجربة روحانية فريدة." },
  { en: "Electronic Bakhour Wand", ar: "عصا بخور إلكترونية متنقلة", cost: 40, shipping: 12, supplier: "cj", category: "عطور", img: "https://picsum.photos/seed/bakhour-wand/600/600", desc: "عصا بخور إلكترونية قابلة للشحن تعمل دون حرق مباشر. آمنة ومريحة للاستخدام في أي مكان." },
  { en: "Handcrafted Riyadh Leather Trunk", ar: "صندوق الرياض اليدوي جلد فاخر", cost: 250, shipping: 50, supplier: "mkhazen", category: "إكسسوارات", img: "https://picsum.photos/seed/leather-trunk/600/600", desc: "صندوق فاخر مصنوع يدوياً من جلد الإبل الأصيل وخشب صلب. يجمع بين الموروث الحضاري والفخامة العصرية." },
  { en: "Modern Arabic Wall Art Canvas", ar: "لوحة جدارية عصرية بخط الثلث", cost: 110, shipping: 30, supplier: "cj", category: "فن", img: "https://picsum.photos/seed/arabic-art/600/600", desc: "لوحة كانفس فاخرة بخط الثلث العربي بطلاء أكريليك ذهبي. تحفة فنية تُزين أي فراغ بأناقة." },
  { en: "Elite Camel Leather Wallet", ar: "محفظة جلد جمل صناعة يدوية", cost: 65, shipping: 15, supplier: "mkhazen", category: "إكسسوارات", img: "https://picsum.photos/seed/camel-wallet/600/600", desc: "محفظة يدوية من جلد الجمل الطبيعي الأصيل. متانة عالية وأناقة لا تتقادم." },
  { en: "Smart Thobe Steamer", ar: "مكواة أثواب ذكية متنقلة", cost: 50, shipping: 15, supplier: "cj", category: "إلكترونيات", img: "https://picsum.photos/seed/thobe-steamer/600/600", desc: "جهاز بخار محمول لكي الأثواب والمشالح بسهولة وسرعة. مثالي للسفر والاستخدام اليومي." },
  { en: "Desert Night Candle Set", ar: "مجموعة شموع ليل الصحراء", cost: 28, shipping: 10, supplier: "cj", category: "ديكور", img: "https://picsum.photos/seed/desert-candle/600/600", desc: "مجموعة شموع عطرية بعبق الصحراء الليلي من شمع الصويا الطبيعي. تخلق أجواء هادئة وفاخرة." },
  { en: "Platinum Tea Warmer Ceramic", ar: "سخان شاي بلمسة بلاتينية", cost: 42, shipping: 12, supplier: "mkhazen", category: "مطبخ", img: "https://picsum.photos/seed/tea-warmer/600/600", desc: "سخان شاي وقهوة من الخزف الفاخر بلمسات بلاتينية. يحافظ على درجة حرارة مثالية لوقت أطول." },
  { en: "Nomad Copper Serving Tray", ar: "صينية نحاس نوماد عتيقة", cost: 75, shipping: 25, supplier: "mkhazen", category: "مطبخ", img: "https://picsum.photos/seed/copper-tray/600/600", desc: "صينية نحاس أحمر مطروقة يدوياً بزخارف عربية تراثية. تضيف لمسة أصيلة لكل مجلس ضيافة." },
];

const COUPONS = [
  { code: 'SAVE10',  discountPct: 0.10, maxUsage: 10000 },
  { code: 'ROYAL20', discountPct: 0.20, maxUsage: 1000  },
  { code: 'VIP15',   discountPct: 0.15, maxUsage: 500   },
];

async function main() {
  console.log('🏛️  Seeding 20 empire products...');

  let count = 0;
  for (const p of PRODUCTS) {
    const finalPrice = calcPrice(p.cost, p.shipping);
    await prisma.product.upsert({
      where: { titleEn: p.en },
      update: { finalPrice, imageUrl: p.img, supplier: p.supplier, category: p.category },
      create: {
        titleEn: p.en,
        titleAr: p.ar,
        descAr: p.desc,
        baseCost: p.cost,
        shippingCost: p.shipping,
        finalPrice,
        imageUrl: p.img,
        supplier: p.supplier,
        category: p.category,
        stockLevel: 50,
        supplierSku: `EMP-${p.en.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`,
      },
    });
    console.log(`  ✅ ${p.ar} — SAR ${finalPrice}`);
    count++;
  }

  console.log('\n🎟️  Seeding coupons...');
  for (const c of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: { isActive: true },
      create: c,
    });
    console.log(`  ✅ ${c.code} (${c.discountPct * 100}% off)`);
  }

  console.log(`\n🚀 Done! ${count} products + ${COUPONS.length} coupons ready.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
