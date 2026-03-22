import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isCrimsonPetalProduct } from '@/lib/ab-variants';
import ProductDescription from '@/components/ProductDescription';
import AddToCartButton from '@/components/AddToCartButton';
import CompleteTheLook from '@/components/CompleteTheLook';

/**
 * Saudi Pro Product Page — Summer Season 2026
 * Crimson Petal: A/B copy rotation (Royal/Modern/Emotional) + Agent Scout upsell
 */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const p = product as unknown as Record<string, unknown>;
  const isLocal      = (String(p.supplier ?? 'cj')) === 'mkhazen';
  const imageUrl     = (String(p.imageUrl ?? '')) ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85';
  const isTestProduct = isCrimsonPetalProduct(product.titleEn, product.titleAr);

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="container py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
          <Link href="/" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>الرئيسية</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{product.titleAr}</span>
        </nav>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Square Luxury Image ── */}
          <div>
            {/* Summer Wedding badge for Crimson Petal */}
            {isTestProduct && (
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                    color: '#2A1F00',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.08em',
                  }}
                >
                  ✨ WEDDING GUEST COLLECTION — SUMMER 2026
                </span>
              </div>
            )}
            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ aspectRatio: '1/1', background: 'var(--bg-tertiary)', boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={imageUrl}
                alt={product.titleAr}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.7s ease' }}
                loading="eager"
              />
            </div>
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-5">

            {/* Tags row */}
            <div className="flex items-center gap-3 flex-wrap">
              {isLocal ? (
                <span className="tag-shipping-local">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h6l2 3v3h-8V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  توصيل 24-48 ساعة — مستودع سعودي 🇸🇦
                </span>
              ) : (
                <span className="tag-shipping-global">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
                  </svg>
                  Global Collection — 7-14 يوم
                </span>
              )}
              {typeof (product as Record<string, unknown>).stockLevel === 'number' &&
                (product as Record<string, unknown>).stockLevel as number > 0 &&
                (product as Record<string, unknown>).stockLevel as number <= 10 && (
                <span className="badge-mustard">⚡ باقي {String((product as Record<string, unknown>).stockLevel)} فقط!</span>
              )}
              {isTestProduct && (
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded"
                  style={{ background: '#C9A84C22', color: '#8B6914', border: '1px solid #C9A84C55', fontFamily: 'var(--font-montserrat)' }}
                >
                  💍 Limited Edition
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-[36px] md:text-[44px] font-black leading-tight"
              style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {product.titleAr}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="price-tag-lg"
                style={isTestProduct ? { color: '#C9A84C' } : undefined}
              >
                SAR {product.finalPrice.toLocaleString('ar-SA')}
              </span>
              <span
                className="text-[12px] font-semibold px-2 py-1 rounded"
                style={{ background: 'var(--color-orange-ghost)', color: 'var(--color-orange)', fontFamily: 'var(--font-cairo)' }}
              >
                شامل الضريبة 15%
              </span>
            </div>

            {/* A/B Description — session-rotated for Crimson Petal */}
            <ProductDescription
              productId={product.id}
              defaultDesc={product.descAr}
              isTestProduct={isTestProduct}
            />

            {/* Feature Icons */}
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="trust-icon-strip">
                <div className="trust-icon-item">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-cairo)' }}>إرجاع مجاني 30 يوم</span>
                </div>
                <div className="trust-icon-item">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-cairo)' }}>دفع آمن (Moyasar)</span>
                </div>
                <div className="trust-icon-item">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-cairo)' }}>{isLocal ? 'مستودع سعودي' : 'شحن مؤمّن'}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-3">
              <input type="text" placeholder="كود الخصم (SAVE10 / ROYAL20)" className="input-luxury flex-1" />
              <button
                className="px-5 py-3 rounded-md font-bold text-[14px]"
                style={{ background: isTestProduct ? '#C9A84C' : 'var(--color-mustard)', color: '#1a1000', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none', flexShrink: 0 }}
              >
                تطبيق
              </button>
            </div>

            {/* CTAs — A/B tracked for Crimson Petal */}
            <div className="flex flex-col gap-3">
              <AddToCartButton
                productId={product.id}
                finalPrice={product.finalPrice}
                isTestProduct={isTestProduct}
              />
              <button className="btn-secondary w-full text-[15px] py-4" style={{ fontFamily: 'var(--font-cairo)' }}>
                أضف للمفضلة ♡
              </button>
            </div>
          </div>
        </div>

        {/* Agent Scout: Complete the Look — only shown on Crimson Petal */}
        {isTestProduct && <CompleteTheLook excludeProductId={product.id} />}

        {/* Back */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" className="flex items-center gap-2 font-bold text-[14px]" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-cairo)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            العودة للمجموعة
          </Link>
        </div>
      </div>
    </main>
  );
}
