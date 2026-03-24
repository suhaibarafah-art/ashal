'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Product {
  id: string;
  titleAr: string;
  descAr: string;
  finalPrice: number;
  imageUrl: string;
  supplier: string;
}

interface HomeClientProps {
  products: Product[];
}

const trustFeatures = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h6l2 3v3h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'توصيل 24-48 ساعة',
    desc: 'من المستودع السعودي لبابك مباشرة — أسرع شحن في المملكة.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'دفع آمن 100%',
    desc: 'بوابة Moyasar المعتمدة — فيزا، ماستر، مدى، آبل باي.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
    title: 'إرجاع مجاني 30 يوم',
    desc: 'غير راضٍ؟ أعد المنتج مجانًا خلال 30 يومًا.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'مستودع سعودي',
    desc: 'منتجاتنا جاهزة للشحن من الرياض — لا انتظار.',
  },
];

export default function HomeClient({ products }: HomeClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main style={{ background: 'var(--bg-primary)' }}>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=2000')` }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,35,102,0.88) 0%, rgba(0,35,102,0.5) 45%, rgba(0,0,0,0.15) 100%)' }} />
        </motion.div>

        <motion.div style={{ opacity: opacityHero }} className="relative z-10 container flex flex-col items-start justify-center py-24">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex items-center gap-3 mb-6">
            <span className="badge-mustard">جديد 2026</span>
            <span className="text-[12px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-montserrat)' }}>New Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="text-5xl md:text-7xl lg:text-[90px] font-black leading-none mb-6"
            style={{ color: '#FFFFFF', fontFamily: 'var(--font-cairo)', letterSpacing: '-0.03em', maxWidth: '700px' }}
          >
            الفخامة<br />
            <span style={{ color: '#FFDB58' }}>السعودية</span><br />
            بلا حدود
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="text-[16px] font-medium mb-10 max-w-md leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-cairo)' }}
          >
            أجود المنتجات، توصيل سريع من المستودع السعودي، وأسعار تنافسية لا تُعرض في أي مكان آخر.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }} className="flex flex-wrap gap-4">
            <a href="#collection">
              <button className="btn-primary text-[16px] px-8 py-4">
                تسوق الآن
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </a>
            <Link href="/admin">
              <button className="px-8 py-4 rounded-md font-bold text-[15px]" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-cairo)', backdropFilter: 'blur(4px)', cursor: 'pointer' }}>
                لوحة التحكم
              </button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-8 flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-cairo)' }}>كود الخصم:</span>
            <span className="coupon-badge" style={{ background: 'rgba(255,219,88,0.18)', borderColor: '#FFDB58', color: '#FFDB58' }}>LUXURY10</span>
            <span className="coupon-badge" style={{ background: 'rgba(255,219,88,0.18)', borderColor: '#FFDB58', color: '#FFDB58' }}>SAVE10</span>
            <span className="coupon-badge" style={{ background: 'rgba(255,219,88,0.18)', borderColor: '#FFDB58', color: '#FFDB58' }}>ROYAL20</span>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-montserrat)' }}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </motion.div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ background: '#002366', borderBottom: '4px solid #FF8C00' }}>
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,140,0,0.2)', color: '#FF8C00' }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: '#FFFFFF', fontFamily: 'var(--font-cairo)' }}>{f.title}</p>
                  <p className="text-[11px] leading-tight hidden md:block" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-cairo)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT GRID ═══ */}
      <section id="collection" style={{ background: 'var(--bg-primary)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">New Arrivals 2026</span>
            <h2 className="section-heading__title">أحدث الإصدارات</h2>
            <div className="section-heading__line" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * (index % 4), duration: 0.55 }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="product-card">
                    <div className="product-card__img relative">
                      <motion.div
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'})` }}
                      />
                      <div className="absolute top-3 right-3">
                        {product.supplier === 'mkhazen' ? (
                          <span className="tag-shipping-local">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            24-48h
                          </span>
                        ) : (
                          <span className="tag-shipping-global">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
                            Global
                          </span>
                        )}
                      </div>
                      <button
                        className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: '#FF8C00' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-[15px] font-bold mb-1 truncate" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>
                        {product.titleAr}
                      </h4>
                      <p className="text-[12px] mb-3 truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                        {product.descAr}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="price-tag">SAR {product.finalPrice.toLocaleString('en-US')}</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-montserrat)' }}>تفاصيل ←</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[16px] font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                جارٍ تحميل المنتجات... شغّل Titan-5 لمزامنة المنتجات.
              </p>
              <a href="/api/cron/master" target="_blank">
                <button className="btn-primary mt-6 text-[14px] px-8 py-4">🤖 تشغيل Titan-5</button>
              </a>
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-14">
            <a href="/collections">
              <button className="btn-secondary text-[15px] px-10 py-4">🛍️ تصفح كل المنتجات</button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">لماذا SaudiLux؟</span>
            <h2 className="section-heading__title">تجربة تسوق لا مثيل لها</h2>
            <div className="section-heading__line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🚚', title: 'توصيل 24-48 ساعة', desc: 'من مستودعنا في الرياض مباشرة إلى بابك. الأسرع في السعودية.', color: '#FF8C00' },
              { icon: '🔒', title: 'دفع آمن ومعتمد', desc: 'فيزا، ماستر، مدى، وآبل باي — مؤمّن بـ Moyasar وفق معايير ZATCA.', color: '#002366' },
              { icon: '↩️', title: 'إرجاع مجاني 30 يوم', desc: 'أعد أي منتج خلال 30 يومًا مجانًا. رضاك هو أولويتنا القصوى.', color: '#FFDB58' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="card-luxury flex flex-col items-center text-center p-10"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6" style={{ background: `${item.color}18`, border: `2px solid ${item.color}40` }}>
                  {item.icon}
                </div>
                <h3 className="text-[20px] font-bold mb-3" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COUPON BANNER ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: '#FF8C00', padding: '48px 0' }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-black mb-2" style={{ fontFamily: 'var(--font-cairo)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>احصل على خصم حصري الآن!</h2>
            <p className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-cairo)' }}>استخدم كود الخصم عند الدفع واستمتع بتوفير يصل إلى 20%</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {['LUXURY10', 'SAVE10', 'ROYAL20'].map(code => (
              <div key={code} className="coupon-badge text-[16px] px-6 py-3" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.6)', color: '#FFFFFF', fontSize: '16px', letterSpacing: '0.2em' }}>
                {code}
              </div>
            ))}
          </div>
          <a href="#collection">
            <button className="px-8 py-4 rounded-md font-bold text-[16px]" style={{ background: '#FFFFFF', color: '#FF8C00', fontFamily: 'var(--font-cairo)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', cursor: 'pointer', border: 'none' }}>
              تسوق الآن
            </button>
          </a>
        </div>
      </motion.section>

    </main>
  );
}
