import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductActions } from './ProductActions';
import { ProductImage } from './ProductImage';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

// ── Dynamic metadata per product ──────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'منتج غير موجود' };
  const p = product as unknown as { imageUrl?: string };
  return {
    title: `${product.titleAr} | متجر الفخامة السعودي`,
    description: product.descAr.slice(0, 160),
    openGraph: {
      title: product.titleAr,
      description: product.descAr.slice(0, 160),
      images: p.imageUrl ? [{ url: p.imageUrl, width: 800, height: 800, alt: product.titleAr }] : [],
      locale: 'ar_SA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.titleAr,
      description: product.descAr.slice(0, 160),
      images: p.imageUrl ? [p.imageUrl] : [],
    },
  };
}

/**
 * Saudi Pro Product Page — Phase 4
 * - Coupon field → GET /checkout/[id]?coupon=CODE (functional pre-fill)
 * - Social proof (reviews + rating)
 * - Urgency: sold count + delivery promise
 * - ProductActions client component for interactivity
 * - JSON-LD structured data for Google Shopping
 */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const p = product as unknown as Record<string, unknown>;
  const isLocal   = String(p.supplier ?? 'cj') === 'mkhazen';
  const stockLevel = Number(p.stockLevel ?? 50);
  const imageUrl  = String(p.imageUrl ?? '') ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85';

  // Deterministic social proof from product id
  const seed       = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  const reviewCount = 47 + (seed % 89);         // 47–135 reviews
  const soldCount   = 120 + (seed % 340);        // 120–459 sold
  const ratingInt   = 4;                          // always 4 full stars
  const ratingHalf  = seed % 3 !== 0;            // sometimes 4.5

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

          {/* ── Image ── */}
          <div>
            <ProductImage src={imageUrl} alt={product.titleAr} soldCount={soldCount} />
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-5">

            {/* Shipping + stock tags */}
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
                <span className="tag-shipping-local">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h6l2 3v3h-8V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  توصيل خلال 48 ساعة 🚀
                </span>
              )}
              {stockLevel <= 15 && (
                <span className="badge-mustard">⚡ باقي {stockLevel} فقط!</span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-[36px] md:text-[44px] font-black leading-tight"
              style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {product.titleAr}
            </h1>

            {/* Rating + social proof */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {Array.from({ length: ratingInt }).map((_, i) => (
                  <span key={i} style={{ color: '#F59E0B', fontSize: '16px' }}>★</span>
                ))}
                {ratingHalf && <span style={{ color: '#F59E0B', fontSize: '16px' }}>★</span>}
              </div>
              <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-muted)' }}>
                ({reviewCount} تقييم)
              </span>
              <span style={{ width: '1px', height: '14px', background: 'var(--border-color)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                ✓ {soldCount} عميل راضٍ
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="price-tag-lg">SAR {product.finalPrice.toLocaleString('en-US')}</span>
              <span
                className="text-[12px] font-semibold px-2 py-1 rounded"
                style={{ background: 'var(--color-orange-ghost)', color: 'var(--color-orange)', fontFamily: 'var(--font-cairo)' }}
              >
                شامل الضريبة 15%
              </span>
            </div>

            {/* Urgency delivery promise */}
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ fontSize: '20px' }}>📦</span>
              <div>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 900, color: '#10B981', marginBottom: '1px' }}>
                  اطلبي الآن — يصلك قبل {isLocal ? 'الغد' : 'بعد غد'}
                </p>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  الطلبات المستلمة قبل 11 م تُشحن نفس اليوم
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}>
              {product.descAr}
            </p>

            {/* Trust icons */}
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

            {/* Coupon field — functional GET form → passes ?coupon= to checkout */}
            <ProductActions productId={product.id} titleAr={product.titleAr} imageUrl={imageUrl} finalPrice={product.finalPrice} />
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <h2 className="text-[22px] font-black mb-6" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>
            آراء العملاء ({reviewCount})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'سارة م.', city: 'الرياض', text: 'جودة خرافية وتوصيل سريع جداً! ما توقعت يكون بهالمستوى. راضية 100%', stars: 5 },
              { name: 'نورة ع.', city: 'جدة',    text: 'اشتريته لحفل زواج وكان مجنون. الكل سأل عنه! أنصح فيه بشدة', stars: 5 },
              { name: 'ريم ح.', city: 'الدمام',  text: 'اللون والخامة أحلى من الصورة. سأطلب مرة ثانية بالتأكيد', stars: 4 },
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[15px]" style={{ background: 'var(--color-orange-ghost)', color: 'var(--color-orange)', fontFamily: 'var(--font-cairo)' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</p>
                    <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)' }}>{r.city} · ✓ مشتري موثّق</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} style={{ color: '#F59E0B', fontSize: '13px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

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

      {/* JSON-LD structured data — Google Shopping & rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.titleAr,
            description: product.descAr,
            image: imageUrl,
            url: `${SITE_URL}/products/${product.id}`,
            brand: { '@type': 'Brand', name: 'متجر الفخامة السعودي' },
            offers: {
              '@type': 'Offer',
              price: product.finalPrice.toFixed(2),
              priceCurrency: 'SAR',
              availability: stockLevel > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              priceValidUntil: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10),
              seller: { '@type': 'Organization', name: 'متجر الفخامة السعودي' },
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'SAR' },
                deliveryTime: { '@type': 'ShippingDeliveryTime', businessDays: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2 } },
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: ratingHalf ? '4.5' : '4',
              reviewCount: String(reviewCount),
            },
          }),
        }}
      />
    </main>
  );
}
