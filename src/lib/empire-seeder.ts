/**
 * Saudi Luxury Store - Empire Catalog Seeder
 * 20 منتجاً فاخراً بصور حقيقية مطابقة لكل منتج
 */

import { prisma } from './prisma';
import { calculateDynamicPrice } from './pricing-engine';

const LUXURY_CATALOG = [
  // ── عباءات وأزياء ──────────────────────────────────────────────────────────
  {
    en: "Crimson Petal Abaya — Wedding Edition",
    ar: "عباءة بتلة القرمزي — إصدار الأعراس",
    cost: 180, shipping: 30,
    supplier: "mkhazen", category: "أزياء",
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=85",
    desc: "عباءة بتلة القرمزي — تصميم حصري لموسم الأعراس 2026. نُسجت من أجود أقمشة الكريب الياباني بخيوط مطرّزة يدوياً. كميات محدودة لأصحاب الذوق الرفيع.",
    materials: "كريب ياباني، خيوط مطرزة يدوياً", care: "تنظيف جاف احترافي فقط",
  },
  {
    en: "Minimalist Desert Abaya — Premium Silk",
    ar: "عباية الصحراء المينيمال — حرير فاخر",
    cost: 160, shipping: 28,
    supplier: "mkhazen", category: "أزياء",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=85",
    desc: "عباءة مينيمالية راقية بخامة الحرير الإيطالي — البساطة هي أعلى مراتب الأناقة. مثالية للمناسبات الرسمية والسهرات الفاخرة.",
    materials: "حرير إيطالي، بطانة ساتان", care: "تنظيف جاف احترافي",
  },

  // ── حقائب ─────────────────────────────────────────────────────────────────
  {
    en: "Gold Evening Clutch — Luxury Edition",
    ar: "حقيبة السهرة الذهبية — إصدار فاخر",
    cost: 55, shipping: 18,
    supplier: "cj", category: "حقائب",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
    desc: "حقيبة سهرة ذهبية مزيّنة بتفاصيل معدنية راقية — تعكس ضوء القمر وتُكمل إطلالتك في حفلات الأعراس والغالا الصيفية.",
    materials: "جلد ذهبي، تفاصيل معدنية", care: "تنظيف بقطعة ناعمة جافة",
  },
  {
    en: "Classic Leather Shoulder Bag",
    ar: "حقيبة كتف جلدية كلاسيكية",
    cost: 120, shipping: 25,
    supplier: "cj", category: "حقائب",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",
    desc: "حقيبة كتف جلدية كلاسيكية بتصميم أنيق يجمع بين العصرية والأصالة — مصنوعة من الجلد الطبيعي الإيطالي بخياطة يدوية محكمة.",
    materials: "جلد إيطالي طبيعي، بطانة قماشية", care: "مرطب جلود دوري",
  },

  // ── أحذية ─────────────────────────────────────────────────────────────────
  {
    en: "Crystal Stiletto Heels — Evening",
    ar: "كعب ستيليتو كريستالي للسهرات",
    cost: 95, shipping: 25,
    supplier: "cj", category: "أحذية",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85",
    desc: "كعب ستيليتو مرصّع بكريستال عالي الجودة — خطوة واحدة تغيّر كل شيء. مثالي للمناسبات الفاخرة وحفلات الأعراس الصيفية.",
    materials: "جلد صناعي مقوى، كريستال سواروفسكي", care: "حفظ في كيس القماش المرفق",
  },

  // ── مجوهرات ───────────────────────────────────────────────────────────────
  {
    en: "Diamond Gold Necklace — 18K",
    ar: "قلادة ماسية ذهبية — عيار 18",
    cost: 380, shipping: 20,
    supplier: "mkhazen", category: "مجوهرات",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85",
    desc: "قلادة ذهبية بعيار 18 مرصّعة بـ 18 قيراط من ألماس أبيض مطابق للمقاييس الدولية — مثالية لكل مناسبة فاخرة.",
    materials: "ذهب عيار 18، ألماس طبيعي", care: "تنظيف دوري بمحلول متخصص",
  },
  {
    en: "Minimalist Gold Jewelry Set",
    ar: "طقم مجوهرات ذهبية مينيمالي",
    cost: 65, shipping: 15,
    supplier: "cj", category: "مجوهرات",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85",
    desc: "طقم مجوهرات ذهبي مينيمالي — البساطة هي أعلى مراتب الأناقة. طوق + حلقتان + خاتم — يتناغم مع كل إطلالة.",
    materials: "ذهب مطلي عيار 18", care: "حفظ بعيداً عن الماء والعطور",
  },

  // ── محافظ ─────────────────────────────────────────────────────────────────
  {
    en: "Elite Camel Leather Wallet",
    ar: "محفظة جلد جمل — صناعة يدوية",
    cost: 65, shipping: 15,
    supplier: "mkhazen", category: "إكسسوارات",
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85",
    desc: "محفظة رجالية من جلد الجمل الطبيعي — صنعة يدوية سعودية أصيلة. 12 فتحة بطاقات + جيب عملات + حجرتان للأوراق.",
    materials: "جلد جمل طبيعي معالج", care: "يحفظ بعيداً عن الماء والحرارة",
  },
  {
    en: "Luxury RFID Blocking Wallet",
    ar: "محفظة فاخرة بحماية RFID",
    cost: 45, shipping: 12,
    supplier: "cj", category: "إكسسوارات",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    desc: "محفظة جلدية فاخرة بتقنية الحماية من سرقة البيانات RFID — تحمي بطاقاتك البنكية مع لمسة من الأناقة والعملية.",
    materials: "جلد إيطالي، تقنية RFID بلوكينج", care: "مسح جاف دوري",
  },

  // ── عطور ومباخر ────────────────────────────────────────────────────────────
  {
    en: "Elite Oud Incense Burner",
    ar: "مبخرة العود الملكية الفاخرة",
    cost: 120, shipping: 25,
    supplier: "mkhazen", category: "عطور",
    img: "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=85",
    desc: "مبخرة ملكية من الأونيكس الأسود والنحاس المطلي — تمنح مجلسك عبقاً من أرقى أنواع العود السعودي. تحفة فنية قبل أن تكون أداة.",
    materials: "حجر الأونيكس، نحاس مطلي بالذهب", care: "تنظيف الحوض بعد كل استخدام",
  },
  {
    en: "Pure Saffron Room Mist",
    ar: "بخاخ الزعفران النقي للغرف",
    cost: 25, shipping: 8,
    supplier: "cj", category: "عطور",
    img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=85",
    desc: "بخاخ الزعفران الملكي — يُضفي على منزلك عطر المملكة الأصيل. مستخلص من أجود أنواع الزعفران الإيراني بزيوت عطرية طبيعية 100%.",
    materials: "زعفران أصلي، زيوت عطرية طبيعية", care: "يحفظ بعيداً عن الشمس المباشرة",
  },

  // ── ديكور ─────────────────────────────────────────────────────────────────
  {
    en: "Sovereign Marble Coasters Set",
    ar: "طقم قواعد أكواب رخام ملكي",
    cost: 15, shipping: 10,
    supplier: "cj", category: "ديكور",
    img: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=800&q=85",
    desc: "طقم من 4 قواعد أكواب من الرخام الطبيعي المصقول — يُضيف لمسة ملكية لطاولة القهوة في مجلسك.",
    materials: "رخام طبيعي مصقول، حواف ذهبية", care: "تمسح بقطعة نظيفة مبللة",
  },
  {
    en: "Arabic Calligraphy Wall Art",
    ar: "لوحة جدارية بخط الثلث العربي",
    cost: 110, shipping: 30,
    supplier: "cj", category: "ديكور",
    img: "https://images.unsplash.com/photo-1547333590-27593d30a61c?auto=format&fit=crop&w=800&q=85",
    desc: "لوحة جدارية بخط الثلث العربي — كلمات من القرآن الكريم بطلاء ذهبي على كانفس قطني فاخر. تُزين أي جدار بإتقان.",
    materials: "كانفس قطني، طلاء أكريليك ذهبي", care: "تجنب الشمس المباشرة والرطوبة",
  },
  {
    en: "Royal Sand Hourglass — Al-Ula Gold",
    ar: "ساعة رملية برمال العلا الذهبية",
    cost: 35, shipping: 12,
    supplier: "cj", category: "ديكور",
    img: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=800&q=85",
    desc: "ساعة رملية بإطار ذهبي ورمال العلا الطبيعية الذهبية — تُضفي على مكتبك أو رفك لمسة من إرث المملكة العريق.",
    materials: "زجاج منفوخ يدوياً، إطار نحاس ذهبي", care: "حفظ في مكان مستقر بعيداً عن الاهتزازات",
  },

  // ── إضاءة ─────────────────────────────────────────────────────────────────
  {
    en: "Smart LED Desk Lamp — Luxury Edition",
    ar: "مصباح مكتب LED ذكي — إصدار فاخر",
    cost: 60, shipping: 18,
    supplier: "cj", category: "إلكترونيات",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
    desc: "مصباح مكتب LED ذكي بإضاءة قابلة للتعديل من ضوء دافئ إلى بارد — يحمي عيونك ويُضيء مساحة عملك بأناقة.",
    materials: "ألمنيوم مطلي، LED عالي الكفاءة", care: "تنظيف بقطعة ناعمة جافة",
  },

  // ── مطبخ ──────────────────────────────────────────────────────────────────
  {
    en: "Gold-Leaf Arabic Coffee Set",
    ar: "طقم فناجين قهوة عربية بطلاء الذهب",
    cost: 45, shipping: 15,
    supplier: "mkhazen", category: "مطبخ",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
    desc: "طقم فناجين قهوة عربية من البورسلان النقي بطلاء ذهب عيار 24 — 6 فناجين + دلة + صينية. هدية فاخرة لكل مناسبة.",
    materials: "بورسلان نقي، طلاء ذهب عيار 24", care: "غسيل يدوي فقط، تجنب الميكروويف",
  },
  {
    en: "Nomad Copper Serving Tray",
    ar: "صينية تقديم نحاس نوماد عتيقة",
    cost: 75, shipping: 25,
    supplier: "mkhazen", category: "مطبخ",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=85",
    desc: "صينية تقديم من النحاس الأحمر المطروق يدوياً — بنقوش إسلامية هندسية دقيقة تعكس عراقة الحرفة العربية الأصيلة.",
    materials: "نحاس أحمر مطروق يدوياً", care: "تلميع دوري بمنظف النحاس",
  },

  // ── مفروشات ───────────────────────────────────────────────────────────────
  {
    en: "Silk Prayer Rug — Elite Edition",
    ar: "سجادة صلاة حريرية — طبعة النخبة",
    cost: 55, shipping: 15,
    supplier: "mkhazen", category: "مفروشات",
    img: "https://images.unsplash.com/photo-1584467735871-8e4f8d6e1218?auto=format&fit=crop&w=800&q=85",
    desc: "سجادة صلاة حريرية بنقوش إسلامية دقيقة — مصنوعة من أجود أنواع الحرير الصناعي عالي الكثافة بألوان غنية تدوم طويلاً.",
    materials: "حرير صناعي عالي الكثافة، قاعدة مطاطية", care: "طي رقيق، تنظيف جاف",
  },
  {
    en: "Velvet Bedouin Throw Blanket",
    ar: "شرشف مخملي بنقوش بدوية أصيلة",
    cost: 95, shipping: 25,
    supplier: "mkhazen", category: "مفروشات",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85",
    desc: "غطاء مخملي فاخر بنقوش بدوية أصيلة مطرّزة يدوياً — يُدفئ ليالي الشتاء ويُزين أريكتك أو سريرك بلمسة تراثية.",
    materials: "مخمل إيطالي 100%، تطريز يدوي", care: "غسيل جاف فقط",
  },

  // ── إكسسوارات ─────────────────────────────────────────────────────────────
  {
    en: "Saudi Vision Luxury Pen",
    ar: "قلم الرؤية — الإصدار الفاخر",
    cost: 30, shipping: 10,
    supplier: "cj", category: "إكسسوارات",
    img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=85",
    desc: "قلم فاخر مطلي بالكروم بريشة برونز ذهبية — يُجسّد رؤية المملكة 2030 في كل كلمة تكتبها. هدية مميزة لأصحاب القرار.",
    materials: "معدن مطلي بالكروم، ريشة برونز ذهبية", care: "استخدام حبر النخبة فقط",
  },
];

export class EmpireSeeder {
  static async seedEmpireCatalog(): Promise<number> {
    console.log("🏛️ EmpireSeeder: seeding luxury catalog...");

    // 1. Delete products that have NO orders (safe — no FK constraint)
    await prisma.product.deleteMany({
      where: { orders: { none: {} } },
    });
    console.log("🗑️ Deleted orphan products (no orders)");

    // 2. Upsert the 20 luxury products (create or update by titleEn)
    let count = 0;
    for (const p of LUXURY_CATALOG) {
      const finalPrice = calculateDynamicPrice(p.cost, p.shipping, {
        demandScore: 0.85 + Math.random() * 0.15,
        supplierStock: 50,
        recentSalesCount: 30,
      });

      await prisma.product.upsert({
        where: { titleEn: p.en },
        update: {
          titleAr: p.ar,
          descAr: `${p.desc}\n\nالمواد: ${p.materials}. العناية: ${p.care}`,
          imageUrl: p.img,
          finalPrice,
          supplier: p.supplier,
          category: p.category,
          stockLevel: 50,
        },
        create: {
          titleEn: p.en,
          titleAr: p.ar,
          descAr: `${p.desc}\n\nالمواد: ${p.materials}. العناية: ${p.care}`,
          baseCost: p.cost,
          shippingCost: p.shipping,
          finalPrice,
          imageUrl: p.img,
          supplier: p.supplier,
          category: p.category,
          stockLevel: 50,
          supplierSku: `LUX-${p.en.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`,
        },
      });
      count++;
    }

    // 3. Fix any remaining old products (those with orders) — replace picsum with luxury image
    await prisma.product.updateMany({
      where: { imageUrl: { contains: 'picsum' } },
      data: { imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85' },
    });

    console.log(`✅ EmpireSeeder: ${count} luxury products seeded.`);
    return count;
  }

  // Legacy — kept for backward compat
  static async seedSummerCollection(): Promise<number> {
    return this.seedEmpireCatalog();
  }
}
