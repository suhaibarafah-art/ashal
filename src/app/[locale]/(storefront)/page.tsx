import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/storefront/ProductGrid';
import TrustStrip from '@/components/storefront/TrustStrip';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  let featuredProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let newProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  try {
    featuredProducts = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
    newProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
  } catch {
    // DB not available — show empty sections
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-luxury">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '640px' }}>
            <span className="hero-luxury__badge">
              {isAr ? 'أسهل — حلول يومية ذكية' : 'Ashal — Smart Daily Solutions'}
            </span>
            <h1 className="hero-luxury__title">
              {isAr ? (
                <>حلول يومية<br /><span className="gold-gradient">تبسّط حياتك</span></>
              ) : (
                <>Daily Solutions<br /><span className="gold-gradient">That Simplify Life</span></>
              )}
            </h1>
            <p className="hero-luxury__subtitle">
              {isAr
                ? 'منتجات مختارة بعناية تحل مشاكل حقيقية — مصممة للحياة العصرية في السعودية والخليج'
                : 'Carefully selected products that solve real problems — designed for modern life in Saudi Arabia and the Gulf'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link href={`/${locale}/collections/smart-home`} className="btn-primary">
                {isAr ? 'تسوق الآن' : 'Shop Now'}
              </Link>
              <Link href={`/${locale}/collections/productivity`} className="btn-secondary">
                {isAr ? 'اكتشف التشكيلات' : 'Explore Collections'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <TrustStrip />

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div className="section-heading" style={{ textAlign: 'start', marginBottom: 0 }}>
              <span className="section-heading__label">
                {isAr ? 'الأكثر طلباً' : 'Best Sellers'}
              </span>
              <h2 className="section-heading__title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                {isAr ? 'منتجات مميزة' : 'Featured Products'}
              </h2>
            </div>
            <Link
              href={`/${locale}/collections/smart-home`}
              className="btn-ghost"
              style={{ whiteSpace: 'nowrap' }}
            >
              {isAr ? 'عرض الكل ←' : '→ View All'}
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts as Parameters<typeof ProductGrid>[0]['products']}
            locale={locale}
          />
        </div>
      </section>

      {/* ── Gold Divider ──────────────────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <div style={{ padding: '0 var(--space-section)' }}>
          <div className="divider-gold" />
        </div>
      )}

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section style={{ padding: 'var(--space-section) 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div className="section-heading" style={{ textAlign: 'start', marginBottom: 0 }}>
                <span className="section-heading__label">
                  {isAr ? 'وصل حديثاً' : 'New Arrivals'}
                </span>
                <h2 className="section-heading__title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                  {isAr ? 'آخر الإضافات' : 'Latest Additions'}
                </h2>
              </div>
              <Link
                href={`/${locale}/collections/productivity`}
                className="btn-ghost"
                style={{ whiteSpace: 'nowrap' }}
              >
                {isAr ? 'عرض الكل ←' : '→ View All'}
              </Link>
            </div>

            <ProductGrid
              products={newProducts as Parameters<typeof ProductGrid>[0]['products']}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div
            className="card-luxury"
            style={{
              padding: 'clamp(3rem, 6vw, 5rem) 2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--black-900), var(--black-950))',
            }}
          >
            <span className="hero-luxury__badge" style={{ marginBottom: '1.25rem' }}>
              {isAr ? 'عرض محدود' : 'Limited Offer'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
                fontWeight: 700,
                color: 'var(--ivory)',
                marginBottom: '0.75rem',
              }}
            >
              {isAr ? 'شحن مجاني على الطلبات فوق 200 ريال' : 'Free Shipping on Orders Over SAR 200'}
            </h2>
            <p
              style={{
                color: 'var(--black-300)',
                fontSize: 'var(--text-base)',
                marginBottom: '2rem',
                maxWidth: '480px',
                marginInline: 'auto',
              }}
            >
              {isAr
                ? 'الدفع عند الاستلام متاح في جميع مناطق المملكة العربية السعودية'
                : 'Cash on delivery available across all regions of Saudi Arabia'}
            </p>
            <Link href={`/${locale}/collections/smart-home`} className="btn-primary">
              {isAr ? 'تسوق الآن' : 'Shop Now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
