/**
 * Saudi Luxury Store - Empire Catalog Seeder
 * محرك التوسعة الإمبراطورية - ملأ المتجر بـ 20 منتجاً 'هبّة' آلياً.
 */

import { prisma } from './prisma';
import { calculateDynamicPrice } from './pricing-engine';

const EMPIRE_TRENDS = [
  { en: "Elite Oud Diffuser", ar: "فواحة العود الملكية الذكية", cost: 120, shipping: 25, materials: "رخام، خشب الأبنوس، نحاس", care: "تنظيف جاف بقطعة قماش ناعمة" },
  { en: "Smart Prayer Wall Clock", ar: "ساعة حائط ذكية بمواقيت الصلاة", cost: 85, shipping: 20, materials: "ألمنيوم مطلي كهرومغناطيسياً، زجاج مقسى", care: "تجنب الرطوبة العالية" },
  { en: "Gold-Leaf Coffee Set", ar: "طقم فناجين قهوة بطلاء الذهب", cost: 45, shipping: 15, materials: "بورسلان نقي، طلاء ذهب عيار 24", care: "غسيل يدوي فقط، لا يوضع في الميكروويف" },
  { en: "Minimalist Desert Abaya", ar: "عباية الصحراء 'مينيمال' فاخرة", cost: 180, shipping: 30, materials: "حرير الكريب الياباني، خيوط كتان", care: "تنظيف جاف احترافي" },
  { en: "Sovereign Marble Coasters", ar: "قواعد أكواب رخام ملكي", cost: 15, shipping: 10, materials: "رخام طبيعي مصقول", care: "تمسح بقطعة مبللة" },
  { en: "Antique Calligraphy Lamp", ar: "مصباح الخط العربي الكلاسيكي", cost: 60, shipping: 20, materials: "حديد مطروق يدوياً، ورق بردي معالج", care: "تأكد من استخدام مصابيح LED باردة" },
  { en: "Royal Sand Hourglass", ar: "ساعة رملية بذهبية رمال العلا", cost: 35, shipping: 12, materials: "زجاج منفوخ، رمال العلا المعالجة", care: "حفظ في مكان مستقر" },
  { en: "Velvet Bedouin Throw", ar: "شرشف مخملي بنقوش بدوية أصيلة", cost: 95, shipping: 25, materials: "مخمل إيطالي، تطريز يدوي", care: "غسيل جاف فقط" },
  { en: "Pure Saffron Mist", ar: "بخاخ الزعفران النقي للغرف", cost: 25, shipping: 8, materials: "زعفران أصلي، زيوت عطرية نقية", care: "يحفظ بعيداً عن ضوء الشمس المباشر" },
  { en: "Onyx Incense Burner", ar: "مبخرة 'أونيكس' سوداء فاخرة", cost: 70, shipping: 18, materials: "حجر الأونيكس الأسود، ستانلس ستيل", care: "تنظيف الحوض بعد كل استخدام" },
  { en: "Saudi Vision 2030 Pen", ar: "قلم الرؤية الإصدار الفاخر", cost: 30, shipping: 10, materials: "معدن مطلي بالكروم، ريشة ببروز ذهبي", care: "استخدام حبر النخبة فقط" },
  { en: "Silk Prayer Rug - Elite", ar: "سجادة صلاة حريرية - طبعة النخبة", cost: 55, shipping: 15, materials: "حرير صناعي عالي الكثافة، قطن", care: "طي رقيق، تنظيف جاف" },
  { en: "Electronic Bakhour Wand", ar: "عصا بخور إلكترونية متنقلة", cost: 40, shipping: 12, materials: "سبائك الزنك، سيراميك مقاوم للحرارة", care: "شحن كامل قبل أول استخدام" },
  { en: "Handcrafted Riyadh Trunk", ar: "صندوق الرياض اليدوي - جلد فاخر", cost: 250, shipping: 50, materials: "جلد إبل معالج، خشب صلب", care: "استخدام مرطب جلود عالي الجودة" },
  { en: "Modern Arabic Wall Art", ar: "لوحة جدارية عصرية بخط الثلث", cost: 110, shipping: 30, materials: "كانفس قطني، طلاء أكريليك ذهبي", care: "تجنب تعليقها تحت أشعة الشمس المباشرة" },
  { en: "Elite Camel Leather Wallet", ar: "محفظة جلد جمل - صناعة يدوية", cost: 65, shipping: 15, materials: "جلد جمل طبيعي", care: "يحفظ بعيداً عن الماء" },
  { en: "Smart Thobe Steamer", ar: "مكواة أثواب ذكية متنقلة", cost: 50, shipping: 15, materials: "بلاستيك مقوى، قاعدة تفلون", care: "تفريغ الماء بعد الاستخدام" },
  { en: "Desert Night Candle Set", ar: "مجموعة شموع 'ليل الصحراء'", cost: 28, shipping: 10, materials: "شمع صويا، زيوت عطرية", care: "لا تترك الشمعة مشتعلة دون رقابة" },
  { en: "Platinum Tea Warmer", ar: "سخان شاي بلمسة بلاتينية", cost: 42, shipping: 12, materials: "خزف معالج، لمسات بلاتين", care: "تنظيف يدوي بقطعة ناعمة" },
  { en: "Nomad Copper Tray", ar: "صينية نحاس 'نوماد' عتيقة", cost: 75, shipping: 25, materials: "نحاس أحمر مطروق يدوياً", care: "تلميع دوري بمنظف النحاس" }
];

export class EmpireSeeder {
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
        update: { finalPrice },
        create: {
          titleEn: t.en,
          titleAr: t.ar,
          descAr: `استمتع بالفخامة المطلقة مع ${t.ar}. تم اختياره بعناية ليلائم ذوق النخبة السعودية في عام 2026. جودة لا تُضاهى وتصميم يجسد هويتنا العريقة بلمسة عصرية عالمية.
          
المواد المستخدمة: ${t.materials}
تعليمات العناية: ${t.care}`,
          baseCost: t.cost,
          shippingCost: t.shipping,
          finalPrice: finalPrice
        }
      });
      seededCount++;
    }
    
    console.log(`✅ EmpireSeeder: ${seededCount} Sovereign products seeded.`);
    return seededCount;
  }
}
