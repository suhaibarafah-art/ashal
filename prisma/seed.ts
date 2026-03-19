import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminPw = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ashal.test' },
    update: {},
    create: {
      email: 'admin@ashal.test',
      name: 'Admin',
      password: adminPw,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user:', admin.email);

  // ── Categories ──────────────────────────────────────────────────────────
  const catSmartHome = await prisma.category.upsert({
    where: { slug: 'smart-home' },
    update: {},
    create: {
      slug: 'smart-home',
      nameAr: 'المنزل الذكي',
      nameEn: 'Smart Home',
      descAr: 'منتجات تجعل منزلك أكثر ذكاءً وراحة',
      descEn: 'Products that make your home smarter and more comfortable',
      sortOrder: 1,
    },
  });

  const catProductivity = await prisma.category.upsert({
    where: { slug: 'productivity' },
    update: {},
    create: {
      slug: 'productivity',
      nameAr: 'الإنتاجية',
      nameEn: 'Productivity',
      descAr: 'أدوات تساعدك على العمل بشكل أذكى وأسرع',
      descEn: 'Tools to help you work smarter and faster',
      sortOrder: 2,
    },
  });

  const catCar = await prisma.category.upsert({
    where: { slug: 'car-accessories' },
    update: {},
    create: {
      slug: 'car-accessories',
      nameAr: 'إكسسوارات السيارة',
      nameEn: 'Car Accessories',
      descAr: 'كل ما تحتاجه لرحلة أكثر راحة وأماناً',
      descEn: 'Everything you need for a more comfortable and safe drive',
      sortOrder: 3,
    },
  });
  console.log('✓ Categories created');

  // ── Suppliers ───────────────────────────────────────────────────────────
  const supplier1 = await prisma.supplier.upsert({
    where: { code: 'SAHAL_SUPPLY' },
    update: {},
    create: {
      name: 'أسهل سبلاي',
      code: 'SAHAL_SUPPLY',
      contactEmail: 'supply@ashal.store',
      isActive: true,
    },
  });

  const supplier2 = await prisma.supplier.upsert({
    where: { code: 'GULF_TECH' },
    update: {},
    create: {
      name: 'Gulf Tech Trading',
      code: 'GULF_TECH',
      contactEmail: 'info@gulftech.sa',
      website: 'https://gulftech.sa',
      isActive: true,
    },
  });
  console.log('✓ Suppliers created');

  // ── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      slug: 'desk-cable-organizer',
      titleAr: 'منظم الأسلاك المكتبي',
      titleEn: 'Desk Cable Organizer',
      shortDescAr: 'تخلص من فوضى الأسلاك على مكتبك نهائياً',
      shortDescEn: 'Eliminate cable clutter on your desk permanently',
      descAr: 'منظم أسلاك متعدد الاستخدام مصنوع من مواد عالية الجودة. يتيح لك ترتيب جميع أسلاكك بشكل أنيق وسهل الوصول. مناسب لأسلاك الشاحن والماوس ولوحة المفاتيح وغيرها.',
      descEn: 'Multi-use cable organizer made from high-quality materials. Arrange all your cables neatly and keep them easily accessible. Perfect for charger, mouse, keyboard, and other cables.',
      bulletsAr: ['يدعم حتى 6 أسلاك', 'مادة سيليكون مرنة', 'يلتصق بالمكتب دون خدش', 'سهل التنظيف'],
      bulletsEn: ['Supports up to 6 cables', 'Flexible silicone material', 'Sticks to desk without scratching', 'Easy to clean'],
      sellingPrice: 89,
      comparePrice: 120,
      costPrice: 35,
      stock: 150,
      sku: 'AS-DCO-001',
      categoryId: catProductivity.id,
      isFeatured: true,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Cable+Organizer',
    },
    {
      slug: 'fast-wireless-charger',
      titleAr: 'شاحن لاسلكي سريع 15W',
      titleEn: 'Fast Wireless Charger 15W',
      shortDescAr: 'اشحن هاتفك بأسرع طريقة ممكنة — بدون أسلاك',
      shortDescEn: 'Charge your phone as fast as possible — wirelessly',
      descAr: 'شاحن لاسلكي بقدرة 15 واط يدعم شحن iPhone وAndroid بأعلى سرعة. تصميم أنيق يناسب المكتب والمنزل. مؤشر LED للشحن.',
      descEn: '15W wireless charger supporting fast charge for iPhone and Android at maximum speed. Elegant design for desk and home. LED charging indicator.',
      bulletsAr: ['شحن سريع 15W', 'متوافق مع iPhone وAndroid', 'مؤشر LED', 'يدعم الشحن مع الحافظة حتى 5mm'],
      bulletsEn: ['15W fast charging', 'Compatible with iPhone & Android', 'LED indicator', 'Charges through cases up to 5mm'],
      sellingPrice: 149,
      comparePrice: 199,
      costPrice: 65,
      stock: 80,
      sku: 'AS-WC-001',
      categoryId: catSmartHome.id,
      isFeatured: true,
      leadTimeDays: 2,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Wireless+Charger',
    },
    {
      slug: 'car-phone-holder',
      titleAr: 'حامل الهاتف للسيارة المغناطيسي',
      titleEn: 'Magnetic Car Phone Holder',
      shortDescAr: 'ضع هاتفك في المكان الصحيح أثناء القيادة بأمان',
      shortDescEn: 'Keep your phone in the right place while driving safely',
      descAr: 'حامل هاتف مغناطيسي قوي للسيارة يثبت على فتحة التهوية أو لوحة التحكم. يدعم الدوران 360 درجة للحصول على أفضل زاوية رؤية.',
      descEn: 'Strong magnetic car phone holder that mounts on air vent or dashboard. Supports 360-degree rotation for optimal viewing angle.',
      bulletsAr: ['مغناطيس قوي الشد', 'دوران 360 درجة', 'يناسب جميع الهواتف', 'تركيب سهل على التهوية أو لوحة التحكم'],
      bulletsEn: ['Strong magnetic pull', '360-degree rotation', 'Fits all phones', 'Easy mount on vent or dashboard'],
      sellingPrice: 79,
      comparePrice: 110,
      costPrice: 28,
      stock: 200,
      sku: 'AS-CPH-001',
      categoryId: catCar.id,
      isFeatured: true,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Car+Holder',
    },
    {
      slug: 'fridge-organizer-set',
      titleAr: 'طقم منظم الثلاجة',
      titleEn: 'Fridge Organizer Set',
      shortDescAr: 'نظّم ثلاجتك وعرّف بسهولة ما عندك من مواد',
      shortDescEn: 'Organize your fridge and easily see what you have',
      descAr: 'طقم من 6 صناديق شفافة قابلة للتكديس لتنظيم محتويات الثلاجة. مصنوعة من البلاستيك الآمن للغذاء. تجعل الثلاجة نظيفة ومنظمة وسهلة التنظيف.',
      descEn: 'Set of 6 transparent stackable bins to organize fridge contents. Made from food-safe plastic. Keeps fridge clean, organized, and easy to clean.',
      bulletsAr: ['6 صناديق شفافة', 'بلاستيك آمن للغذاء', 'قابلة للتكديس', 'سهلة التنظيف والغسيل'],
      bulletsEn: ['6 transparent bins', 'Food-safe plastic', 'Stackable design', 'Easy to clean and wash'],
      sellingPrice: 119,
      comparePrice: 159,
      costPrice: 52,
      stock: 120,
      sku: 'AS-FO-001',
      categoryId: catSmartHome.id,
      isFeatured: false,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Fridge+Organizer',
    },
    {
      slug: 'smart-key-finder',
      titleAr: 'تتبع المفاتيح الذكي',
      titleEn: 'Smart Key Finder Tracker',
      shortDescAr: 'لا تضيع مفاتيحك أبداً مرة أخرى',
      shortDescEn: 'Never lose your keys again',
      descAr: 'جهاز تتبع صغير يرتبط بهاتفك عبر Bluetooth. عند ضياع المفاتيح اضغط على التطبيق وسيصدر صوتاً لإرشادك. يمكن تتبعه لمسافة 60 متر.',
      descEn: 'Small tracker that connects to your phone via Bluetooth. When keys are lost, press the app and it emits a sound to guide you. Trackable up to 60 meters.',
      bulletsAr: ['مدى 60 متر Bluetooth', 'صوت عالٍ عند البحث', 'بطارية تدوم سنة', 'خفيف الوزن'],
      bulletsEn: ['60m Bluetooth range', 'Loud beep when searching', 'Battery lasts 1 year', 'Lightweight'],
      sellingPrice: 199,
      comparePrice: 249,
      costPrice: 85,
      stock: 60,
      sku: 'AS-SKF-001',
      categoryId: catSmartHome.id,
      isFeatured: true,
      leadTimeDays: 4,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Key+Finder',
    },
    {
      slug: 'foldable-laptop-stand',
      titleAr: 'حامل اللابتوب القابل للطي',
      titleEn: 'Foldable Laptop Stand',
      shortDescAr: 'ارفع شاشتك إلى المستوى الصحيح للعمل المريح',
      shortDescEn: 'Raise your screen to the right level for comfortable work',
      descAr: 'حامل لابتوب مصنوع من الألومنيوم قابل للطي ويدعم 7 مستويات ارتفاع مختلفة. خفيف الوزن ومثالي للعمل في المكتب والسفر. يمنع ألم الرقبة والظهر.',
      descEn: 'Aluminum foldable laptop stand supporting 7 different height levels. Lightweight and ideal for office work and travel. Prevents neck and back pain.',
      bulletsAr: ['ألومنيوم عالي الجودة', '7 مستويات ارتفاع', 'قابل للطي للسفر', 'يدعم لابتوب حتى 17 بوصة'],
      bulletsEn: ['High-quality aluminum', '7 height levels', 'Foldable for travel', 'Supports laptops up to 17 inches'],
      sellingPrice: 249,
      comparePrice: 319,
      costPrice: 110,
      stock: 45,
      sku: 'AS-FLS-001',
      categoryId: catProductivity.id,
      isFeatured: true,
      leadTimeDays: 4,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Laptop+Stand',
    },
    {
      slug: 'multi-port-usb-hub',
      titleAr: 'موزع USB متعدد المنافذ',
      titleEn: 'Multi-Port USB Hub',
      shortDescAr: 'ابسط تحكمك بجميع أجهزتك من مكان واحد',
      shortDescEn: 'Control all your devices from one place',
      descAr: 'موزع USB بـ 7 منافذ: 3 USB-A، 2 USB-C، قارئ بطاقة SD، وشحن PD بقدرة 100W. تصميم أنيق من الألومنيوم مع كابل طويل.',
      descEn: '7-port USB hub: 3 USB-A, 2 USB-C, SD card reader, and 100W PD charging. Elegant aluminum design with long cable.',
      bulletsAr: ['7 منافذ متنوعة', 'شحن PD 100W', 'قارئ بطاقة SD', 'كابل 1 متر'],
      bulletsEn: ['7 diverse ports', '100W PD charging', 'SD card reader', '1-meter cable'],
      sellingPrice: 179,
      comparePrice: 229,
      costPrice: 79,
      stock: 90,
      sku: 'AS-USB-001',
      categoryId: catProductivity.id,
      isFeatured: false,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=USB+Hub',
    },
    {
      slug: 'desktop-book-stand',
      titleAr: 'حامل الكتب المكتبي القابل للتعديل',
      titleEn: 'Adjustable Desktop Book Stand',
      shortDescAr: 'اقرأ وادرس براحة تامة مع الزاوية الصحيحة',
      shortDescEn: 'Read and study in full comfort at the right angle',
      descAr: 'حامل كتب وأجهزة لوحية للقراءة المريحة. قابل للتعديل بـ 8 زوايا مختلفة. مصنوع من ABS عالي الجودة مع قاع مانع للانزلاق.',
      descEn: 'Book and tablet holder for comfortable reading. Adjustable to 8 different angles. Made from high-quality ABS with non-slip base.',
      bulletsAr: ['8 زوايا قابلة للتعديل', 'قاع مانع للانزلاق', 'مناسب للكتب والأجهزة اللوحية', 'خفيف الوزن'],
      bulletsEn: ['8 adjustable angles', 'Non-slip base', 'Suitable for books and tablets', 'Lightweight'],
      sellingPrice: 139,
      comparePrice: 179,
      costPrice: 58,
      stock: 75,
      sku: 'AS-DBS-001',
      categoryId: catProductivity.id,
      isFeatured: false,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Book+Stand',
    },
    {
      slug: 'car-trunk-organizer',
      titleAr: 'صندوق تنظيم صندوق السيارة',
      titleEn: 'Car Trunk Organizer Box',
      shortDescAr: 'نظّم صندوق سيارتك وضع كل شيء في مكانه',
      shortDescEn: 'Organize your car trunk and keep everything in place',
      descAr: 'صندوق تنظيم قابل للطي لصندوق السيارة. مصنوع من نسيج أكسفورد المقاوم للماء. يحتوي على 3 مقصورات رئيسية وجيوب جانبية.',
      descEn: 'Foldable organizer box for car trunk. Made from water-resistant Oxford fabric. Features 3 main compartments and side pockets.',
      bulletsAr: ['أكسفورد مقاوم للماء', '3 مقصورات رئيسية', 'قابل للطي والحمل', 'يثبت بحزام داخل الصندوق'],
      bulletsEn: ['Water-resistant Oxford', '3 main compartments', 'Foldable and portable', 'Secured with strap in trunk'],
      sellingPrice: 169,
      comparePrice: 219,
      costPrice: 72,
      stock: 85,
      sku: 'AS-CTO-001',
      categoryId: catCar.id,
      isFeatured: false,
      leadTimeDays: 3,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Car+Organizer',
    },
    {
      slug: 'smart-reading-lamp',
      titleAr: 'مصباح القراءة الذكي USB',
      titleEn: 'Smart USB Reading Lamp',
      shortDescAr: 'إضاءة مثالية للقراءة والعمل في أي وقت',
      shortDescEn: 'Perfect lighting for reading and working anytime',
      descAr: 'مصباح LED ذكي بـ 3 درجات إضاءة و5 مستويات سطوع. يتصل عبر USB ويُثبت على الطاولة بمشبك. يحمي العينين من الوهج.',
      descEn: 'Smart LED lamp with 3 light temperatures and 5 brightness levels. Connects via USB and clips onto desk. Eye-protective with no glare.',
      bulletsAr: ['3 درجات حرارة للضوء', '5 مستويات سطوع', 'توصيل USB', 'مشبك ثابت على الطاولة'],
      bulletsEn: ['3 color temperatures', '5 brightness levels', 'USB powered', 'Clips onto desk securely'],
      sellingPrice: 229,
      comparePrice: 289,
      costPrice: 98,
      stock: 55,
      sku: 'AS-SRL-001',
      categoryId: catProductivity.id,
      isFeatured: true,
      leadTimeDays: 4,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Reading+Lamp',
    },
    {
      slug: 'dual-wireless-charging-pad',
      titleAr: 'منصة الشحن اللاسلكي المزدوج',
      titleEn: 'Dual Wireless Charging Pad',
      shortDescAr: 'اشحن هاتفك وسماعاتك في نفس الوقت',
      shortDescEn: 'Charge your phone and earbuds at the same time',
      descAr: 'منصة شحن لاسلكي تدعم جهازين في وقت واحد. القدرة الإجمالية 20 واط. مصنوعة من الجلد الصناعي الفاخر مع إضاءة LED خافتة.',
      descEn: 'Wireless charging pad that supports two devices simultaneously. Total capacity 20W. Made from luxury faux leather with dim LED lighting.',
      bulletsAr: ['شحن جهازين معاً', 'قدرة 20W إجمالية', 'جلد صناعي فاخر', 'LED خافت للليل'],
      bulletsEn: ['Charge 2 devices together', '20W total capacity', 'Luxury faux leather', 'Dim LED for nighttime'],
      sellingPrice: 299,
      comparePrice: 379,
      costPrice: 130,
      stock: 40,
      sku: 'AS-DWC-001',
      categoryId: catSmartHome.id,
      isFeatured: true,
      leadTimeDays: 5,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Dual+Charger',
    },
    {
      slug: 'magnetic-charging-cable',
      titleAr: 'كابل شحن مغناطيسي 3 في 1',
      titleEn: '3-in-1 Magnetic Charging Cable',
      shortDescAr: 'كابل واحد لجميع أجهزتك — بدون عناء التركيب',
      shortDescEn: 'One cable for all your devices — no fumbling',
      descAr: 'كابل شحن مغناطيسي يدعم USB-C وLightning وMicro USB. فقط ضع الهاتف بالقرب والكابل يلتصق تلقائياً. بيانات 480 Mbps.',
      descEn: 'Magnetic charging cable supporting USB-C, Lightning, and Micro USB. Just bring your phone near and the cable attaches automatically. Data transfer 480 Mbps.',
      bulletsAr: ['3 رؤوس في كابل واحد', 'مغناطيسي يلتصق تلقائياً', 'نقل بيانات 480 Mbps', 'متين ومقاوم للالتواء'],
      bulletsEn: ['3 connectors in one cable', 'Auto-attach magnetic', '480 Mbps data transfer', 'Durable and tangle-resistant'],
      sellingPrice: 99,
      comparePrice: 139,
      costPrice: 40,
      stock: 180,
      sku: 'AS-MCC-001',
      categoryId: catProductivity.id,
      isFeatured: false,
      leadTimeDays: 2,
      imageUrl: 'https://placehold.co/600x600/f4daa8/7e4f17?text=Magnetic+Cable',
    },
  ];

  for (const { imageUrl, ...p } of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...p,
          images: {
            create: [{ url: imageUrl, isPrimary: true, sortOrder: 0 }],
          },
        },
      });
    }
  }
  console.log(`✓ ${products.length} products seeded`);

  // ── Coupons ─────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'SAVE10' },
    update: {},
    create: { code: 'SAVE10', type: 'PERCENT', value: 10, isActive: true },
  });
  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: { code: 'FREESHIP', type: 'FIXED', value: 25, isActive: true },
  });
  console.log('✓ Coupons created: SAVE10, FREESHIP');

  // ── Site Settings ───────────────────────────────────────────────────────
  const settings = [
    { key: 'store_name_ar', value: 'أسهل' },
    { key: 'store_name_en', value: 'Ashal' },
    { key: 'contact_email', value: 'hello@ashal.store' },
    { key: 'whatsapp_number', value: '+966500000000' },
    { key: 'shipping_threshold', value: 200 },
    { key: 'shipping_fee', value: 25 },
    { key: 'faqs', value: [
      { q_ar: 'كم مدة التوصيل؟', a_ar: '2–5 أيام عمل في المدن الرئيسية', q_en: 'How long does delivery take?', a_en: '2–5 business days in major cities' },
      { q_ar: 'هل الدفع عند الاستلام متاح؟', a_ar: 'نعم، الدفع عند الاستلام متاح في جميع مناطق السعودية', q_en: 'Is COD available?', a_en: 'Yes, cash on delivery is available across Saudi Arabia' },
      { q_ar: 'كيف أتتبع طلبي؟', a_ar: 'ستصلك رسالة بمعرّف الطلب — يمكنك تتبعه من صفحة تتبع الطلبات', q_en: 'How do I track my order?', a_en: "You'll receive a message with your order ID — track it from the order tracking page" },
      { q_ar: 'ما سياسة الإرجاع؟', a_ar: '14 يوماً من تاريخ الاستلام، المنتج يجب أن يكون في حالته الأصلية', q_en: "What's the return policy?", a_en: '14 days from receipt, product must be in original condition' },
      { q_ar: 'هل الأسعار شاملة ضريبة القيمة المضافة؟', a_ar: 'نعم، جميع الأسعار المعروضة شاملة ضريبة القيمة المضافة 15%', q_en: 'Are prices VAT inclusive?', a_en: 'Yes, all displayed prices include 15% VAT' },
    ]},
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value as any },
      create: { key: s.key, value: s.value as any },
    });
  }
  console.log('✓ Site settings saved');

  // ── Sample Orders ────────────────────────────────────────────────────────
  const firstProduct = await prisma.product.findFirst({ where: { slug: 'fast-wireless-charger' } });
  const secondProduct = await prisma.product.findFirst({ where: { slug: 'desk-cable-organizer' } });

  if (firstProduct && secondProduct) {
    const orderExists = await prisma.order.findFirst({ where: { orderNumber: 'AS-2026-DEMO1' } });
    if (!orderExists) {
      await prisma.order.create({
        data: {
          orderNumber: 'AS-2026-DEMO1',
          guestName: 'محمد العمري',
          guestEmail: 'mohammed@example.com',
          guestPhone: '+966501234567',
          addressSnapshot: { name: 'محمد العمري', phone: '+966501234567', line1: 'شارع الملك فهد، حي النزهة', city: 'الرياض', region: 'الرياض' },
          status: 'DELIVERED',
          paymentMethod: 'COD',
          subtotal: 238,
          shippingFee: 0,
          discount: 0,
          total: 238,
          locale: 'ar',
          items: {
            create: [
              { productId: firstProduct.id, titleAr: firstProduct.titleAr, titleEn: firstProduct.titleEn, quantity: 1, unitPrice: 149, totalPrice: 149 },
              { productId: secondProduct.id, titleAr: secondProduct.titleAr, titleEn: secondProduct.titleEn, quantity: 1, unitPrice: 89, totalPrice: 89 },
            ],
          },
          payment: { create: { method: 'COD', amount: 238, status: 'paid', paidAt: new Date() } },
        },
      });

      await prisma.order.create({
        data: {
          orderNumber: 'AS-2026-DEMO2',
          guestName: 'Sarah Al-Rashid',
          guestEmail: 'sarah@example.com',
          guestPhone: '+966509876543',
          addressSnapshot: { name: 'Sarah Al-Rashid', phone: '+966509876543', line1: 'Al Nakheel District, King Road', city: 'Jeddah', region: 'Jeddah' },
          status: 'PROCESSING',
          paymentMethod: 'CARD_TEST',
          subtotal: 249,
          shippingFee: 0,
          discount: 0,
          total: 249,
          locale: 'en',
          items: {
            create: [
              { productId: firstProduct.id, titleAr: firstProduct.titleAr, titleEn: firstProduct.titleEn, quantity: 1, unitPrice: 249, totalPrice: 249 },
            ],
          },
          payment: { create: { method: 'CARD_TEST', amount: 249, status: 'paid', reference: 'TEST-1234567', paidAt: new Date() } },
        },
      });
    }
  }
  console.log('✓ Sample orders created');

  console.log('\n✅ Seed complete!\n');
  console.log('Admin login: admin@ashal.test / Admin123!');
  console.log('Coupons: SAVE10 (10% off) | FREESHIP (25 SAR off)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
