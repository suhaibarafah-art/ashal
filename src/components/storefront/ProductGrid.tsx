'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  shortDescAr?: string | null;
  shortDescEn?: string | null;
  sellingPrice: number | { toNumber: () => number };
  comparePrice?: number | { toNumber: () => number } | null;
  images: { url: string; isPrimary: boolean }[];
}

interface ProductGridProps {
  products: Product[];
  locale: string;
  columns?: 2 | 3 | 4;
}

// ── Motion Variants ───────────────────────────────────────────────────────────
const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const imageReveal = {
  rest: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const overlayVariant = {
  rest: { opacity: 0, y: 8 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ── Price formatter ───────────────────────────────────────────────────────────
function toNum(val: number | { toNumber: () => number } | null | undefined): number {
  if (!val) return 0;
  return typeof val === 'object' ? val.toNumber() : val;
}

// ── Product Card ──────────────────────────────────────────────────────────────
function LuxuryProductCard({ product, locale }: { product: Product; locale: string }) {
  const isAr = locale === 'ar';
  const title = isAr ? product.titleAr : product.titleEn;
  const desc = isAr ? product.shortDescAr : product.shortDescEn;
  const price = toNum(product.sellingPrice);
  const comparePrice = toNum(product.comparePrice);
  const primaryImage = product.images.find(i => i.isPrimary)?.url || product.images[0]?.url;
  const discount = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const priceLabel = isAr ? `${price.toFixed(0)} ر.س` : `SAR ${price.toFixed(0)}`;
  const comparePriceLabel = comparePrice > 0 ? (isAr ? `${comparePrice.toFixed(0)} ر.س` : `SAR ${comparePrice.toFixed(0)}`) : null;

  return (
    <motion.div
      variants={cardVariant}
      initial="rest"
      whileHover="hover"
      className="product-card group"
    >
      <Link href={`/${locale}/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="product-card__image">
          {primaryImage ? (
            <motion.div variants={imageReveal} className="w-full h-full">
              <Image
                src={primaryImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--black-800)' }}>
              <span style={{ color: 'var(--black-600)', fontSize: '2.5rem' }}>◈</span>
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 start-3">
              <span className="price-badge">-{discount}%</span>
            </div>
          )}

          {/* Quick add overlay */}
          <motion.div
            variants={overlayVariant}
            className="absolute bottom-0 left-0 right-0 p-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
          >
            <button
              className="btn-primary w-full text-xs py-2"
              style={{ borderRadius: 0 }}
              onClick={e => {
                e.preventDefault();
                // Quick add to cart — handled by parent
                document.dispatchEvent(new CustomEvent('quick-add', { detail: { productId: product.id } }));
              }}
            >
              {isAr ? '+ أضف للسلة' : '+ Add to Cart'}
            </button>
          </motion.div>
        </div>

        {/* Body */}
        <div className="product-card__body">
          <h3 className="product-card__title">{title}</h3>
          {desc && <p className="product-card__desc">{desc}</p>}

          <div className="product-card__price">
            <span className="price-current">{priceLabel}</span>
            {comparePriceLabel && (
              <span className="price-compare">{comparePriceLabel}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full text-center py-20"
    >
      <div style={{ fontSize: '3rem', color: 'var(--black-700)', marginBottom: '1rem' }}>◈</div>
      <p style={{ color: 'var(--black-400)', fontSize: 'var(--text-base)' }}>
        {isAr ? 'المنتجات ستظهر هنا بعد إعداد قاعدة البيانات' : 'Products will appear here after database setup'}
      </p>
      <p style={{ color: 'var(--black-600)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
        npm run db:seed
      </p>
    </motion.div>
  );
}

// ── Main Grid ─────────────────────────────────────────────────────────────────
export default function ProductGrid({ products, locale, columns = 4 }: ProductGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`grid-${locale}`}
        variants={gridContainer}
        initial="hidden"
        animate="show"
        className="products-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {products.length === 0 ? (
          <EmptyState locale={locale} />
        ) : (
          products.map(product => (
            <LuxuryProductCard key={product.id} product={product} locale={locale} />
          ))
        )}
      </motion.div>
    </AnimatePresence>
  );
}
