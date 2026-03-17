'use client';

import React, { useRef } from 'react';
import { SectionHeading, CountdownTimer, MotionFadeIn } from '@/components/DesignSystem';
import Link from 'next/link';
import CategoryNav from '@/components/CategoryNav';
import SmartSearch from '@/components/SmartSearch';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Saudi Luxury Store - Editorial Homepage (Artistic Motion Edition)
 * الإخراج الحركي الفني (Rashof/Asali Style) مع تأثيرات بارالاكس سينمائية ومعدل تمرير فائق النعومة.
 */

// Mock products (in production, fetch server-side and pass as props to this client component, or split into Client/Server components)
const mockProducts = [
  { id: 1, titleAr: 'حقيبة كلاسيك', descAr: 'جلد إيطالي نقي مع تفاصيل ذهبية', finalPrice: '8,450', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80' },
  { id: 2, titleAr: 'حذاء كعب عالي', descAr: 'تصميم أنيق للسهرات والمناسبات', finalPrice: '3,200', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80' },
  { id: 3, titleAr: 'عطر السيادة', descAr: 'مزيج العود الملكي مع روز داماس', finalPrice: '1,850', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80' },
  { id: 4, titleAr: 'ساعة أوتوماتيك', descAr: 'هيكل معدني مصقول بدقة سويسرية', finalPrice: '24,000', img: 'https://images.unsplash.com/photo-1599643478514-4a820c56a8cc?auto=format&fit=crop&q=80' },
  { id: 5, titleAr: 'قلادة ماسية', descAr: 'ذهب أبيض عيار 18 مع ماس نقي', finalPrice: '15,600', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80' },
  { id: 6, titleAr: 'نظارة شمسية', descAr: 'تصميم آفييتور عصري مع حماية UV', finalPrice: '1,450', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80' },
  { id: 7, titleAr: 'محفظة جلدية', descAr: 'صناعة يدوية دقيقة ومساحات ذكية', finalPrice: '980', img: 'https://images.unsplash.com/photo-1600185906355-6c703e2e8e97?auto=format&fit=crop&q=80' },
  { id: 8, titleAr: 'طقم مجوهرات', descAr: 'مجموعة متكاملة لإطلالة تسلب الألباب', finalPrice: '32,000', img: 'https://images.unsplash.com/photo-1550592704-6c76defa99ce?auto=format&fit=crop&q=80' },
];

export default function Home() {
  const heroRef = useRef(null);
  
  // Parallax scroll effects for Hero
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Background moves down slowly
  const yBg = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  // Text scales up and fades out
  const scaleText = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const opacityText = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#EAEAEA]">
      {/* 
        Artistic Motion Parallax Hero Section
      */}
      <section ref={heroRef} className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA] mt-[80px]">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ y: yBg }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.1]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=90&w=2560')`,
              backgroundPosition: '50% 30%'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* Hero Content with scroll-driven scale & fade */}
        <motion.div 
          style={{ scale: scaleText, opacity: opacityText }}
          className="relative z-20 container flex flex-col items-center justify-center text-center mt-32"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-[#555] text-[10px] uppercase tracking-[0.5em] mb-6 font-medium bg-white/80 px-4 py-1"
          >
            New Collection 2026
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-[120px] font-light tracking-tighter leading-none mb-4 text-black mix-blend-multiply"
          >
            <span className="luxury-serif">ELEVATE</span>
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl md:text-4xl font-light mb-12 text-[#222] tracking-wider font-arabic-heading"
          >
            عنوان الأناقة <span className="italic font-serif">السيادية</span>
          </motion.h2>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
            <Link href="#collection">
              <button className="bg-black text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] hover:bg-[#222] transition-colors duration-300">
                تسوق الآن
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <MotionFadeIn delay={0.2} yOffset={30} className="relative z-30">
        <CategoryNav />
      </MotionFadeIn>

      <MotionFadeIn delay={0.4} yOffset={30} className="container mt-16 mb-24">
        <SmartSearch />
      </MotionFadeIn>

      {/* The Collection - 4 Column Editorial Grid with Staggered Motion */}
      <section className="py-20 bg-white" id="collection">
        <div className="container">
          <SectionHeading title="أحدث الإصدارات" subtitle="Just Landed" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
            {mockProducts.map((product, index) => (
              <MotionFadeIn key={product.id} delay={0.1 * (index % 4)} yOffset={40}>
                <Link href={`/products/${product.id}`} className="group cursor-pointer flex flex-col h-full">
                  {/* Image Container - Magnetic slow zoom */}
                  <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden bg-[#F5F5F5]">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.img})` }}
                    />
                    
                    {/* Floating Add to Wishlist Button */}
                    <button 
                      className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 shadow-sm"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigating to product page when clicking wishlist
                        // TODO: Add to wishlist logic
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>

                  {/* Product Details - Stark Minimalist */}
                  <div className="px-1 text-center md:text-right flex flex-col flex-1">
                    <h4 className="text-[13px] font-bold text-black uppercase tracking-widest mb-2 font-arabic-heading group-hover:underline decoration-1 underline-offset-4">
                      {product.titleAr}
                    </h4>
                    <p className="text-[11px] text-[#777] font-light mb-4 line-clamp-1">
                      {product.descAr}
                    </p>
                    <div className="mt-auto pt-2">
                       <span className="text-[13px] text-black font-medium tracking-wider">
                        SAR {product.finalPrice}
                       </span>
                    </div>
                  </div>
                </Link>
              </MotionFadeIn>
            ))}
          </div>

          <MotionFadeIn delay={0.3} yOffset={30} className="flex justify-center mt-20">
             <Link href="/shop">
                <button className="border border-black bg-transparent text-black px-12 py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-colors duration-300">
                  عرض جميع المقتنيات
                </button>
             </Link>
          </MotionFadeIn>
        </div>
      </section>

      {/* Value Proposition / Trust - Animated Entry */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#EAEAEA]">
        <div className="container max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <MotionFadeIn delay={0.1}>
                  <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-3">توصيل ملكي في ساعتين</h4>
                      <p className="text-xs text-[#555] leading-relaxed max-w-xs">متوفر الآن في الرياض. الفخامة لا تنتظر، تصلك في أسرع وقت مع أسطولنا الخاص.</p>
                  </div>
                </MotionFadeIn>
                
                <MotionFadeIn delay={0.3}>
                  <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-3">تغليف فاخر مجاني</h4>
                      <p className="text-xs text-[#555] leading-relaxed max-w-xs">كل قطعة تصلك مغلفة بشريط حريري وصندوق فاخر يحمل ختم السيادة.</p>
                  </div>
                </MotionFadeIn>

                <MotionFadeIn delay={0.5}>
                  <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-3">أمان وضمان (ZATCA)</h4>
                      <p className="text-xs text-[#555] leading-relaxed max-w-xs">معاملات بنكية مشفرة وفواتير ضريبية معتمدة لحماية متكاملة.</p>
                  </div>
                </MotionFadeIn>
            </div>
        </div>
      </section>
    </main>
  );
}
