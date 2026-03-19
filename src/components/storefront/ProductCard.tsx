'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { discountPercent, formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    sellingPrice: number | { toNumber: () => number };
    comparePrice?: number | { toNumber: () => number } | null;
    images: { url: string; isPrimary: boolean }[];
    codEnabled: boolean;
    stock: number;
  };
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const [adding, setAdding] = useState(false);

  const price = typeof product.sellingPrice === 'object'
    ? product.sellingPrice.toNumber()
    : Number(product.sellingPrice);

  const comparePrice = product.comparePrice
    ? typeof product.comparePrice === 'object'
      ? product.comparePrice.toNumber()
      : Number(product.comparePrice)
    : null;

  const primaryImage = product.images.find(i => i.isPrimary)?.url ?? product.images[0]?.url;
  const discount = comparePrice ? discountPercent(comparePrice, price) : 0;
  const title = locale === 'ar' ? product.titleAr : product.titleEn;
  const inStock = product.stock > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || adding) return;
    setAdding(true);
    addItem({
      id: product.id,
      slug: product.slug,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      imageUrl: primaryImage ?? '',
      price,
      codEnabled: product.codEnabled,
    });
    openCart();
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-brand-50 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-100">
              <ShoppingCart size={32} className="text-brand-300" />
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2 start-2 badge bg-red-500 text-white">
              -{discount}%
            </span>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="badge bg-ink-3 text-white">
                {locale === 'ar' ? 'نفذ المخزون' : 'Out of Stock'}
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          {inStock && (
            <button
              onClick={handleAddToCart}
              className={cn(
                'absolute bottom-0 inset-x-0 py-2.5 bg-brand-500 text-white text-sm font-medium flex items-center justify-center gap-2',
                'translate-y-full group-hover:translate-y-0 transition-transform duration-200',
                adding && 'bg-brand-600'
              )}
            >
              <ShoppingCart size={16} />
              {adding
                ? (locale === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓')
                : (locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')
              }
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-ink leading-snug mb-1 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-500">{formatPrice(price, locale)}</span>
            {comparePrice && (
              <span className="text-xs text-ink-5 line-through">{formatPrice(comparePrice, locale)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
