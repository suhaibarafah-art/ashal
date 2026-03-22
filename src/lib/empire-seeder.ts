/**
 * Saudi Luxury Store - Empire Catalog Seeder
 * محرك التوسعة الإمبراطورية - ملأ المتجر بـ 20 منتجاً 'هبّة' آلياً.
 */

import { prisma } from './prisma';
import { calculateDynamicPrice } from './pricing-engine';

// ── Summer Wedding Season 2026 — Flagship + Scout Upsells ──────────────────
export const SUMMER_PRODUCTS = [
  // ① Flagship — A/B test product
  {
    en: "Sohib-V1 (Crimson Petal)",
    ar: "صهيب V1 — بتلة القرمزي",
    cost: 180, shipping: 30,
    supplier: "mkhazen", category: "أزياء",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4782?auto=format&fit=crop&w=800&q=85",
    desc: "عباءة بتلة القرمزي — تصميم حصري لموسم الأعراس الصيفي 2026. نُسجت من أجود أقمشة الكريب الياباني بخيوط مطرّزة يدوياً. كميات محدودة.",
    stock: 15,
  },
  // ② Scout Upsell 1 — Gold Evening Clutch
  {
    en: "Gold Evening Clutch — Scout Pick",
    ar: "حقيبة السهرة الذهبية",
    cost: 55, shipping: 18,
    supplier: "cj", category: "clutch",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    desc: "حقيبة سهرة ذهبية مزيّنة بتفاصيل معدنية راقية — اختارها Agent Scout لتكمل إطلالة بتلة القرمزي في حفلات الأعراس والغالا الصيفية.",
    stock: 30,
  },
  // ③ Scout Upsell 2 — Crystal Stiletto Heels
  {
    en: "Crystal Stiletto Heels — Scout Pick",
    ar: "كعب ستيليتو كريستالي",
    cost: 95, shipping: 25,
    supplier: "cj", category: "heels",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    desc: "كعب ستيليتو مرصّع بكريستال عالي الجودة — خطوة واحدة تغيّر كل شيء. اختارها Agent Scout خصيصاً لمناسبات الصيف الفاخرة.",
    stock: 20,
  },
  // ④ Scout Upsell 3 — Minimalist Gold Jewelry
  {
    en: "Minimalist Gold Jewelry Set — Scout Pick",
    ar: "طقم مجوهرات ذهبية مينيمالي",
    cost: 65, shipping: 15,
    supplier: "cj", category: "jewelry",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
    desc: "طقم مجوهرات ذهبي مينيمالي — البساطة هي أعلى مراتب الأناقة. اختارها Agent Scout لتتناغم مع ألوان بتلة القرمزي وتكمل الإطلالة.",
    stock: 40,
  },
];

const EMPIRE_TRENDS = [
  { en: "Elite Oud Diffuser", ar: "فواحة العود الملكية الذكية", cost: 120, shipping: 25, supplier: "mkhazen", category: "ديكور", img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", materials: "رخام، خشب الأبنوس، نحاس", care: "تنظيف جاف بقطعة قماش ناعمة" },
  { en: "Smart Prayer Wall Clock", ar: "ساعة حائط ذكية بمواقيت الصلاة", cost: 85, shipping: 20, supplier: "mkhazen", category: "إلكترونيات", img: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80", materials: "ألمنيوم مطلي، زجاج مقسى", care: "تجنب الرطوبة العالية" },
  { en: "Gold-Leaf Coffee Set", ar: "طقم فناجين قهوة بطلاء الذهب", cost: 45, shipping: 15, supplier: "mkhazen", category: "مطبخ", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", materials: "بورسلان نقي، طلاء ذهب عيار 24", care: "غسيل يدوي فقط" },
  { en: "Minimalist Desert Abaya", ar: "عباية الصحراء 'مينيمال' فاخرة", cost: 180, shipping: 30, supplier: "mkhazen", category: "أزياء", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4782?w=600&q=80", materials: "حرير الكريب الياباني، خيوط كتان", care: "تنظيف جاف احترافي" },
  { en: "Sovereign Marble Coasters", ar: "قواعد أكواب رخام ملكي", cost: 15, shipping: 10, supplier: "cj", category: "ديكور", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", materials: "رخام طبيعي مصقول", care: "تمسح بقطعة مبللة" },
  { en: "Antique Calligraphy Lamp", ar: "مصباح الخط العربي الكلاسيكي", cost: 60, shipping: 20, supplier: "mkhazen", category: "إضاءة", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", materials: "حديد مطروق يدوياً، ورق بردي معالج", care: "استخدم مصابيح LED باردة" },
  { en: "Royal Sand Hourglass", ar: "ساعة رملية برمال العلا الذهبية", cost: 35, shipping: 12, supplier: "cj", category: "ديكور", img: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600&q=80", materials: "زجاج منفوخ، رمال العلا المعالجة", care: "حفظ في مكان مستقر" },
  { en: "Velvet Bedouin Throw", ar: "شرشف مخملي بنقوش بدوية أصيلة", cost: 95, shipping: 25, supplier: "mkhazen", category: "مفروشات", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", materials: "مخمل إيطالي، تطريز يدوي", care: "غسيل جاف فقط" },
  { en: "Pure Saffron Mist", ar: "بخاخ الزعفران النقي للغرف", cost: 25, shipping: 8, supplier: "cj", category: "عطور", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80", materials: "زعفران أصلي، زيوت عطرية نقية", care: "يحفظ بعيداً عن الشمس" },
  { en: "Onyx Incense Burner", ar: "مبخرة أونيكس سوداء فاخرة", cost: 70, shipping: 18, supplier: "mkhazen", category: "عطور", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80", materials: "حجر الأونيكس الأسود، ستانلس ستيل", care: "تنظيف الحوض بعد كل استخدام" },
  { en: "Saudi Vision Luxury Pen", ar: "قلم الرؤية الإصدار الفاخر", cost: 30, shipping: 10, supplier: "cj", category: "إكسسوارات", img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80", materials: "معدن مطلي بالكروم، ريشة بروز ذهبي", care: "استخدام حبر النخبة فقط" },
  { en: "Silk Prayer Rug Elite", ar: "سجادة صلاة حريرية - طبعة النخبة", cost: 55, shipping: 15, supplier: "mkhazen", category: "مفروشات", img: "https://images.unsplash.com/photo-1584467735871-8e4f8d6e1218?w=600&q=80", materials: "حرير صناعي عالي الكثافة، قطن", care: "طي رقيق، تنظيف جاف" },
  { en: "Electronic Bakhour Wand", ar: "عصا بخور إلكترونية متنقلة", cost: 40, shipping: 12, supplier: "cj", category: "عطور", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", materials: "سبائك الزنك، سيراميك مقاوم للحرارة", care: "شحن كامل قبل أول استخدام" },
  { en: "Handcrafted Riyadh Leather Trunk", ar: "صندوق الرياض اليدوي - جلد فاخر", cost: 250, shipping: 50, supplier: "mkhazen", category: "إكسسوارات", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", materials: "جلد إبل معالج، خشب صلب", care: "استخدام مرطب جلود عالي الجودة" },
  { en: "Modern Arabic Wall Art Canvas", ar: "لوحة جدارية عصرية بخط الثلث", cost: 110, shipping: 30, supplier: "cj", category: "فن", img: "https://images.unsplash.com/photo-1547333590-27593d30a61c?w=600&q=80", materials: "كانفس قطني، طلاء أكريليك ذهبي", care: "تجنب الشمس المباشرة" },
  { en: "Elite Camel Leather Wallet", ar: "محفظة جلد جمل - صناعة يدوية", cost: 65, shipping: 15, supplier: "mkhazen", category: "إكسسوارات", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", materials: "جلد جمل طبيعي", care: "يحفظ بعيداً عن الماء" },
  { en: "Smart Thobe Steamer", ar: "مكواة أثواب ذكية متنقلة", cost: 50, shipping: 15, supplier: "cj", category: "إلكترونيات", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", materials: "بلاستيك مقوى، قاعدة تفلون", care: "تفريغ الماء بعد الاستخدام" },
  { en: "Desert Night Candle Set", ar: "مجموعة شموع ليل الصحراء", cost: 28, shipping: 10, supplier: "cj", category: "ديكور", img: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80", materials: "شمع صويا، زيوت عطرية", care: "لا تترك الشمعة دون رقابة" },
  { en: "Platinum Tea Warmer Ceramic", ar: "سخان شاي بلمسة بلاتينية", cost: 42, shipping: 12, supplier: "mkhazen", category: "مطبخ", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80", materials: "خزف معالج، لمسات بلاتين", care: "تنظيف يدوي بقطعة ناعمة" },
  { en: "Nomad Copper Serving Tray", ar: "صينية نحاس نوماد عتيقة", cost: 75, shipping: 25, supplier: "mkhazen", category: "مطبخ", img: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&q=80", materials: "نحاس أحمر مطروق يدوياً", care: "تلميع دوري بمنظف النحاس" }
];

export class EmpireSeeder {
  /** Seeds Summer 2026 flagship + 3 Scout upsell products */
  static async seedSummerCollection(): Promise<number> {
    let count = 0;
    for (const p of SUMMER_PRODUCTS) {
      const finalPrice = calculateDynamicPrice(p.cost, p.shipping, { demandScore: 0.92 });
      await prisma.product.upsert({
        where: { titleEn: p.en },
        update: { finalPrice, imageUrl: p.img, supplier: p.supplier, category: p.category, stockLevel: p.stock },
        create: {
          titleEn: p.en, titleAr: p.ar, descAr: p.desc,
          baseCost: p.cost, shippingCost: p.shipping, finalPrice,
          imageUrl: p.img, supplier: p.supplier, category: p.category,
          stockLevel: p.stock,
          supplierSku: `SUMMER-${p.en.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`,
        },
      });
      count++;
    }
    return count;
  }

  static async seedEmpireCatalog() {
    console.log("🏛️ EmpireSeeder: Initiating sovereign catalog expansion (20 Products)...");
    
    let seededCount = 0;
    for (const t of EMPIRE_TRENDS) {
      const metrics = { 
        demandScore: 0.8 + Math.random() * 0.2, 
        supplierStock: 100, 
        recentSalesCount: 50 
      };
      
      const finalPrice = calculateDynamicPrice(t.cost, t.shipping, metrics);

      await prisma.product.upsert({
        where: { titleEn: t.en },
        update: { finalPrice, imageUrl: t.img, supplier: t.supplier, category: t.category },
        create: {
          titleEn: t.en,
          titleAr: t.ar,
          descAr: `استمتع بالفخامة المطلقة مع ${t.ar}. تم اختياره بعناية ليلائم ذوق النخبة السعودية في عام 2026. جودة لا تُضاهى وتصميم يجسد هويتنا العريقة بلمسة عصرية عالمية.\n\nالمواد: ${t.materials}. العناية: ${t.care}`,
          baseCost: t.cost,
          shippingCost: t.shipping,
          finalPrice: finalPrice,
          imageUrl: t.img,
          supplier: t.supplier,
          category: t.category,
          stockLevel: 50,
          supplierSku: `EMP-${t.en.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`,
        }
      });
      seededCount++;
    }
    
    console.log(`✅ EmpireSeeder: ${seededCount} Sovereign products seeded.`);
    return seededCount;
  }
}
