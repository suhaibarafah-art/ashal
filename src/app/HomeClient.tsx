'use client';

/**
 * HomeClient — Summer Luxury Theme · Wedding Guest Collection 2026
 * ─────────────────────────────────────────────────────────────────
 * ACTIVATED:   Summer Gala hero · soft gold accents · wedding banner · countdown
 * DEACTIVATED: Ramadan/Eid banners & blue-dominant palette overrides
 */

import React, { useRef, useEffect, useState } from 'react';
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

// ── Summer Gala Countdown — 15 June 2026 ──────────────────────────────────────
const GALA_DATE = new Date('2026-06-15T20:00:00+03:00'); // KSA time

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

// ── Trust features (Summer edition) ─────────────────────────────────────────
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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'مجموعة حصرية — صيف 2026',
    desc: 'قطع محدودة لحفلات الأعراس والسهرات الراقية.',
  },
];

export default function HomeClient({ products }: HomeClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yBg          = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityHero  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { d, h, m, s } = useCountdown(GALA_DATE);

  return (
    <main style={{ background: 'var(--bg-primary)' }}>

      {/* ══════════════════════ HERO — SUMMER LUXURY ══════════════════════ */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
          {/* High-contrast summer imagery */}
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=90&w=2400')` }}
          />
          {/* Warm gold champagne overlay — SUMMER theme (Ramadan/Eid blue overlay DEACTIVATED) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(42,18,0,0.85) 0%, rgba(90,55,10,0.60) 45%, rgba(0,0,0,0.18) 100%)' }} />
          {/* Soft gold shimmer bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
        </motion.div>

        <motion.div style={{ opacity: opacityHero }} className="relative z-10 container flex flex-col items-start justify-center py-24">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex items-center gap-3 mb-6">
            <span
              className="text-[11px] font-bold px-4 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                color: '#2A1F00',
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.12em',
                boxShadow: '0 2px 12px rgba(201,168,76,0.4)',
              }}
            >
              WEDDING GUEST COLLECTION 2026 ✨
            </span>
          </motion.div>

          {/* Main headline — Summer Luxury */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="text-5xl md:text-7xl lg:text-[90px] font-black leading-none mb-4"
            style={{ color: '#FFFFFF', fontFamily: 'var(--font-cairo)', letterSpacing: '-0.03em', maxWidth: '780px' }}
          >
            مجموعة<br />
            <span style={{ color: '#F5D06E' }}>الصيف</span><br />
            الفاخرة
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="text-[17px] font-medium mb-4 max-w-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-cairo)' }}
          >
            إطلالات استثنائية لحفلات الأعراس وسهرات الغالا — محدودة الكميات، لا تُعرض في أي مكان آخر.
          </motion.p>

          {/* Countdown — Summer Gala Collection Limited Release */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="mb-8 p-4 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#F5D06E', fontFamily: 'var(--font-montserrat)' }}>
              Summer Gala Collection — Limited Release
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            {[{ label: 'يوم', value: d }, { label: 'ساعة', value: h }, { label: 'دقيقة', value: m }, { label: 'ثانية', value: s }].map((unit, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#F5D06E', fontWeight: 700, fontSize: '18px' }}>:</span>}
                <div className="flex flex-col items-center">
                  <span className="text-[22px] font-black" style={{ color: '#F5D06E', fontFamily: 'var(--font-montserrat)', lineHeight: 1 }}>{pad(unit.value)}</span>
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(245,208,110,0.7)', fontFamily: 'var(--font-montserrat)' }}>{unit.label}</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }} className="flex flex-wrap gap-4">
            <a href="#collection">
              <button
                className="text-[16px] px-8 py-4 rounded-md font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                  color: '#2A1F00',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-cairo)',
                  boxShadow: '0 4px 24px rgba(201,168,76,0.5)',
                  transition: 'all 0.3s ease',
                }}
              >
                تسوقي الآن
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </a>
            <Link href="/admin">
              <button className="px-8 py-4 rounded-md font-bold text-[15px]" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(245,208,110,0.4)', fontFamily: 'var(--font-cairo)', backdropFilter: 'blur(4px)', cursor: 'pointer' }}>
                لوحة التحكم
              </button>
            </Link>
          </motion.div>

          {/* Coupon codes */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-8 flex items-center gap-3">
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-cairo)' }}>كود الخصم:</span>
            {['SAVE10', 'ROYAL20', 'VIP15'].map(code => (
              <span key={code} className="text-[12px] font-bold px-3 py-1.5 rounded" style={{ background: 'rgba(201,168,76,0.2)', border: '1px dashed rgba(245,208,110,0.6)', color: '#F5D06E', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.1em' }}>
                {code}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: 'rgba(245,208,110,0.6)', fontFamily: 'var(--font-montserrat)' }}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245,208,110,0.6)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </motion.div>
      </section>

      {/* ══════════════════════ TRUST STRIP ══════════════════════ */}
      {/* Trust strip keeps navy base — gold accent border replaces orange (Summer theme) */}
      <section style={{ background: '#1A0F00', borderBottom: '4px solid #C9A84C' }}>
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.18)', color: '#C9A84C' }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: '#FFFFFF', fontFamily: 'var(--font-cairo)' }}>{f.title}</p>
                  <p className="text-[11px] leading-tight hidden md:block" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-cairo)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PRODUCT GRID ══════════════════════ */}
      <section id="collection" style={{ background: 'var(--bg-primary)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            {/* Summer theme label */}
            <span className="section-heading__label" style={{ background: 'linear-gradient(135deg,#C9A84C22,#F5E6CC44)', borderColor: '#C9A84C55', color: '#8B6914' }}>
              Wedding Guest Collection · Summer 2026
            </span>
            <h2 className="section-heading__title">أجمل إطلالات الموسم</h2>
            <div className="section-heading__line" style={{ background: 'linear-gradient(90deg, #C9A84C, #F5D06E)' }} />
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
                        style={{ color: '#C9A84C' }}
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
                        <span className="price-tag" style={{ color: '#C9A84C' }}>SAR {product.finalPrice.toLocaleString('ar-SA')}</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B6914', fontFamily: 'var(--font-montserrat)' }}>تفاصيل ←</span>
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
                جارٍ تحميل مجموعة الصيف... شغّل Scout لمزامنة المنتجات.
              </p>
              <a href="/api/agents/run" target="_blank">
                <button className="btn-primary mt-6 text-[14px] px-8 py-4">🤖 تشغيل Scout</button>
              </a>
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-14">
            <Link href="/collections">
              <button className="btn-secondary text-[15px] px-10 py-4">عرض جميع المنتجات</button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ WHY US ══════════════════════ */}
      <section style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">لماذا SaudiLux؟</span>
            <h2 className="section-heading__title">تجربة تسوق لا مثيل لها</h2>
            <div className="section-heading__line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🚚', title: 'توصيل 24-48 ساعة', desc: 'من مستودعنا في الرياض مباشرة إلى بابك. الأسرع في السعودية.', color: '#C9A84C' },
              { icon: '🔒', title: 'دفع آمن ومعتمد', desc: 'فيزا، ماستر، مدى، وآبل باي — مؤمّن بـ Moyasar وفق معايير ZATCA.', color: '#002366' },
              { icon: '↩️', title: 'إرجاع مجاني 30 يوم', desc: 'أعد أي منتج خلال 30 يومًا مجانًا. رضاك هو أولويتنا القصوى.', color: '#F5D06E' },
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

      {/* ══════════════════════ SUMMER GALA BANNER ══════════════════════ */}
      {/* Replaces Ramadan/Eid coupon banner — SUMMER GOLD theme ACTIVATED */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, #2A1F00 0%, #5C3D00 50%, #2A1F00 100%)', padding: '56px 0', borderTop: '2px solid #C9A84C', borderBottom: '2px solid #C9A84C' }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#C9A84C', fontFamily: 'var(--font-montserrat)' }}>
              Summer Gala Collection · Limited Release
            </span>
            <h2 className="text-[28px] md:text-[36px] font-black mt-2 mb-2" style={{ fontFamily: 'var(--font-cairo)', color: '#F5D06E', letterSpacing: '-0.02em' }}>
              خصم حصري لموسم الصيف!
            </h2>
            <p className="text-[15px] font-medium" style={{ color: 'rgba(245,208,110,0.75)', fontFamily: 'var(--font-cairo)' }}>
              استخدمي كود الخصم عند الدفع واستمتعي بتوفير يصل إلى 20%
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {['SAVE10', 'ROYAL20', 'VIP15'].map(code => (
              <div key={code} className="text-[16px] font-bold px-6 py-3 rounded" style={{ background: 'rgba(201,168,76,0.15)', border: '1.5px dashed rgba(245,208,110,0.6)', color: '#F5D06E', letterSpacing: '0.2em', fontFamily: 'var(--font-montserrat)' }}>
                {code}
              </div>
            ))}
          </div>
          <a href="#collection">
            <button
              className="px-8 py-4 rounded-md font-bold text-[16px]"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                color: '#2A1F00',
                fontFamily: 'var(--font-cairo)',
                boxShadow: '0 4px 24px rgba(201,168,76,0.4)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              تسوقي الآن ✨
            </button>
          </a>
        </div>
      </motion.section>

    </main>
  );
}
