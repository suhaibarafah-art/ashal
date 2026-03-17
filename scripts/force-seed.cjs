const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const EMPIRE_TRENDS = [
  { en: "Elite Oud Diffuser", ar: "فواحة العود الملكية الذكية", cost: 120, shipping: 25, materials: "رخام، خشب الأبنوس، نحاس", care: "تنظيف جاف بقطعة قماش ناعمة", img: "https://images.unsplash.com/photo-1606105001374-e883833b5cda?auto=format&fit=crop&q=80" },
  { en: "Smart Prayer Wall Clock", ar: "ساعة حائط ذكية بمواقيت الصلاة", cost: 85, shipping: 20, materials: "ألمنيوم مطلي كهرومغناطيسياً، زجاج مقسى", care: "تجنب الرطوبة العالية", img: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80" },
  { en: "Gold-Leaf Coffee Set", ar: "طقم فناجين قهوة بطلاء الذهب", cost: 45, shipping: 15, materials: "بورسلان نقي، طلاء ذهب عيار 24", care: "غسيل يدوي فقط، لا يوضع في الميكروويف", img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80" },
  { en: "Minimalist Desert Abaya", ar: "عباية الصحراء 'مينيمال' فاخرة", cost: 180, shipping: 30, materials: "حرير الكريب الياباني، خيوط كتان", care: "تنظيف جاف احترافي", img: "https://images.unsplash.com/photo-1584030638541-b0db09613136?auto=format&fit=crop&q=80" },
  { en: "Sovereign Marble Coasters", ar: "قواعد أكواب رخام ملكي", cost: 15, shipping: 10, materials: "رخام طبيعي مصقول", care: "تمسح بقطعة مبللة", img: "https://images.unsplash.com/photo-1601222881745-f09d2f2c8d28?auto=format&fit=crop&q=80" },
  { en: "Antique Calligraphy Lamp", ar: "مصباح الخط العربي الكلاسيكي", cost: 60, shipping: 20, materials: "حديد مطروق يدوياً، ورق بردي معالج", care: "تأكد من استخدام مصابيح LED باردة", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80" },
  { en: "Royal Sand Hourglass", ar: "ساعة رملية بذهبية رمال العلا", cost: 35, shipping: 12, materials: "زجاج منفوخ، رمال العلا المعالجة", care: "حفظ في مكان مستقر", img: "https://images.unsplash.com/photo-1582210878-292a061b0c00?auto=format&fit=crop&q=80" },
  { en: "Velvet Bedouin Throw", ar: "شرشف مخملي بنقوش بدوية أصيلة", cost: 95, shipping: 25, materials: "مخمل إيطالي، تطريز يدوي", care: "غسيل جاف فقط", img: "https://images.unsplash.com/photo-1522771730849-c4ac19faebf9?auto=format&fit=crop&q=80" },
  { en: "Pure Saffron Mist", ar: "بخاخ الزعفران النقي للغرف", cost: 25, shipping: 8, materials: "زعفران أصلي، زيوت عطرية نقية", care: "يحفظ بعيداً عن ضوء الشمس المباشر", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80" },
  { en: "Onyx Incense Burner", ar: "مبخرة 'أونيكس' سوداء فاخرة", cost: 70, shipping: 18, materials: "حجر الأونيكس الأسود، ستانلس ستيل", care: "تنظيف الحوض بعد كل استخدام", img: "https://images.unsplash.com/photo-1608555855762-2b657eb1c348?auto=format&fit=crop&q=80" },
  { en: "Saudi Vision 2030 Pen", ar: "قلم الرؤية الإصدار الفاخر", cost: 30, shipping: 10, materials: "معدن مطلي بالكروم، ريشة ببروز ذهبي", care: "استخدام حبر النخبة فقط", img: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80" },
  { en: "Silk Prayer Rug - Elite", ar: "سجادة صلاة حريرية - طبعة النخبة", cost: 55, shipping: 15, materials: "حرير صناعي عالي الكثافة، قطن", care: "طي رقيق، تنظيف جاف", img: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?auto=format&fit=crop&q=80" },
  { en: "Electronic Bakhour Wand", ar: "عصا بخور إلكترونية متنقلة", cost: 40, shipping: 12, materials: "سبائك الزنك، سيراميك مقاوم للحرارة", care: "شحن كامل قبل أول استخدام", img: "https://images.unsplash.com/photo-1596431940177-d3eb9e0f39ee?auto=format&fit=crop&q=80" },
  { en: "Handcrafted Riyadh Trunk", ar: "صندوق الرياض اليدوي - جلد فاخر", cost: 250, shipping: 50, materials: "جلد إبل معالج، خشب صلب", care: "استخدام مرطب جلود عالي الجودة", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18a?auto=format&fit=crop&q=80" },
  { en: "Modern Arabic Wall Art", ar: "لوحة جدارية عصرية بخط الثلث", cost: 110, shipping: 30, materials: "كانفس قطني، طلاء أكريليك ذهبي", care: "تجنب تعليقها تحت أشعة الشمس المباشرة", img: "https://images.unsplash.com/photo-1574880345677-78aa0e7d03f0?auto=format&fit=crop&q=80" },
  { en: "Elite Camel Leather Wallet", ar: "محفظة جلد جمل - صناعة يدوية", cost: 65, shipping: 15, materials: "جلد جمل طبيعي", care: "يحفظ بعيداً عن الماء", img: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=80" },
  { en: "Smart Thobe Steamer", ar: "مكواة أثواب ذكية متنقلة", cost: 50, shipping: 15, materials: "بلاستيك مقوى، قاعدة تفلون", care: "تفريغ الماء بعد الاستخدام", img: "https://images.unsplash.com/photo-1581457497127-ec56113bba3f?auto=format&fit=crop&q=80" },
  { en: "Desert Night Candle Set", ar: "مجموعة شموع 'ليل الصحراء'", cost: 28, shipping: 10, materials: "شمع صويا، زيوت عطرية", care: "لا تترك الشمعة مشتعلة دون رقابة", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80" },
  { en: "Platinum Tea Warmer", ar: "سخان شاي بلمسة بلاتينية", cost: 42, shipping: 12, materials: "خزف معالج، لمسات بلاتين", care: "تنظيف يدوي بقطعة ناعمة", img: "https://images.unsplash.com/photo-1576403215982-1af3dd3fed95?auto=format&fit=crop&q=80" },
  { en: "Nomad Copper Tray", ar: "صينية نحاس 'نوماد' عتيقة", cost: 75, shipping: 25, materials: "نحاس أحمر مطروق يدوياً", care: "تلميع دوري بمنظف النحاس", img: "https://images.unsplash.com/photo-1626025219213-aa77eb48a609?auto=format&fit=crop&q=80" }
];

function calculateDynamicPrice(baseCost, shippingCost, metrics) {
  const totalCost = baseCost + shippingCost;
  const minimumMarginPercent = 0.50; // 50% Net Margin target
  
  let targetPrice = totalCost / (1 - minimumMarginPercent);
  
  const scd = metrics.demandScore || 0.5;
  const volatilityPremium = 1 + (scd * 0.3);
  
  targetPrice = targetPrice * volatilityPremium;
  return Math.ceil(targetPrice / 10) * 10 - 1; 
}

async function seed() {
  console.log("🔥 Direct DB Push: Populating live Supabase/Vercel Database!");
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
      update: { 
        finalPrice: finalPrice,
        image: t.img
      },
      create: {
        titleEn: t.en,
        titleAr: t.ar,
        descAr: `استمتع بالفخامة المطلقة مع ${t.ar}. تم اختياره بعناية ليلائم ذوق النخبة السعودية في عام 2026. جودة لا تُضاهى وتصميم يجسد هويتنا العريقة بلمسة عصرية عالمية.\n\nالمواد المستخدمة: ${t.materials}\nتعليمات العناية: ${t.care}`,
        baseCost: t.cost,
        shippingCost: t.shipping,
        finalPrice: finalPrice,
        image: t.img,
        category: 'السيادة (المختارات الملكية)'
      }
    });

    seededCount++;
    console.log(`✅ Seeded: ${t.ar}`);
  }
  
  console.log(`🚀 Successfully seeded ${seededCount} luxury items directly to DB.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
