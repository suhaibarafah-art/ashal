import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductGallery from '@/components/storefront/ProductGallery';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import QuantitySelectorWrapper from './QuantitySelectorWrapper';
import ProductCard from '@/components/storefront/ProductCard';
import TrustStrip from '@/components/storefront/TrustStrip';
import { Truck, RefreshCw, CheckCircle } from 'lucide-react';
import { formatPrice, discountPercent } from '@/lib/currency';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return {};
    return {
      title: locale === 'ar' ? (product.metaTitleAr ?? product.titleAr) : (product.metaTitleEn ?? product.titleEn),
      description: locale === 'ar' ? (product.metaDescAr ?? product.shortDescAr ?? '') : (product.metaDescEn ?? product.shortDescEn ?? ''),
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;

  let product = null;
  let relatedProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    });

    if (product?.categoryId) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          isActive: true,
          id: { not: product.id },
        },
        include: { images: true },
        take: 4,
      });
    }
  } catch {
    // DB not available
  }

  if (!product) {
    notFound();
  }

  const price = Number(product.sellingPrice);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice ? discountPercent(comparePrice, price) : 0;
  const primaryImage = product.images.find(i => i.isPrimary)?.url ?? product.images[0]?.url ?? '';
  const title = locale === 'ar' ? product.titleAr : product.titleEn;
  const desc = locale === 'ar' ? product.descAr : product.descEn;
  const bullets = locale === 'ar' ? product.bulletsAr : product.bulletsEn;

  return (
    <div>
      <div className="container py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} title={title} />

          {/* Details */}
          <div>
            {/* Breadcrumb */}
            {product.category && (
              <p className="text-sm text-ink-4 mb-2">
                {locale === 'ar' ? product.category.nameAr : product.category.nameEn}
              </p>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">{title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-brand-500">{formatPrice(price, locale)}</span>
              {comparePrice && (
                <span className="text-lg text-ink-5 line-through">{formatPrice(comparePrice, locale)}</span>
              )}
              {discount > 0 && (
                <span className="badge bg-red-100 text-red-600">-{discount}%</span>
              )}
            </div>

            <p className="text-xs text-ink-4 mb-4">
              {locale === 'ar' ? 'شامل ضريبة القيمة المضافة' : 'VAT included'}
            </p>

            {/* Short Desc */}
            {(locale === 'ar' ? product.shortDescAr : product.shortDescEn) && (
              <p className="text-sm text-ink-3 mb-5 leading-relaxed">
                {locale === 'ar' ? product.shortDescAr : product.shortDescEn}
              </p>
            )}

            {/* Bullets */}
            {bullets.length > 0 && (
              <ul className="space-y-2 mb-6">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                    <CheckCircle size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity + Add to Cart */}
            <QuantitySelectorWrapper
              product={{
                id: product.id,
                slug: product.slug,
                titleAr: product.titleAr,
                titleEn: product.titleEn,
                imageUrl: primaryImage,
                price,
                codEnabled: product.codEnabled,
                stock: product.stock,
              }}
              locale={locale}
            />

            {/* Delivery Info */}
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3 text-sm text-ink-3">
                <Truck size={16} className="text-brand-500" />
                <span>
                  {locale === 'ar'
                    ? `التوصيل خلال ${product.leadTimeDays ?? 3}-${(product.leadTimeDays ?? 3) + 2} أيام عمل`
                    : `Delivery in ${product.leadTimeDays ?? 3}-${(product.leadTimeDays ?? 3) + 2} business days`
                  }
                </span>
              </div>
              {product.codEnabled && (
                <div className="flex items-center gap-3 text-sm text-ink-3">
                  <CheckCircle size={16} className="text-brand-500" />
                  <span>{locale === 'ar' ? 'الدفع عند الاستلام متاح' : 'Cash on Delivery available'}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-ink-3">
                <RefreshCw size={16} className="text-brand-500" />
                <span>{locale === 'ar' ? 'إرجاع مجاني خلال 14 يوم' : 'Free returns within 14 days'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl font-bold text-ink mb-4">
              {locale === 'ar' ? 'التفاصيل' : 'Description'}
            </h2>
            <div className="prose max-w-none text-ink-3 text-sm leading-relaxed">
              {desc}
            </div>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-8">
          <TrustStrip />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl font-bold text-ink mb-6">
              {locale === 'ar' ? 'منتجات مشابهة' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p as Parameters<typeof ProductCard>[0]['product']} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
