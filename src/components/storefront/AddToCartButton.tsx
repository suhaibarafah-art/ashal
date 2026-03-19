'use client';

import { useState } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    imageUrl: string;
    price: number;
    codEnabled: boolean;
    stock: number;
  };
  quantity: number;
  locale: string;
}

export default function AddToCartButton({ product, quantity, locale }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const [adding, setAdding] = useState(false);

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock || adding) return;
    setAdding(true);
    addItem({
      id: product.id,
      slug: product.slug,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity,
      codEnabled: product.codEnabled,
    });
    openCart();
    setTimeout(() => setAdding(false), 1500);
  };

  if (!inStock) {
    return (
      <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
        {locale === 'ar' ? 'نفذ المخزون' : 'Out of Stock'}
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="btn-primary flex-1"
      >
        <ShoppingCart size={18} />
        {adding
          ? (locale === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓')
          : (locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')
        }
      </button>
      <button
        onClick={() => {
          handleAddToCart();
        }}
        disabled={adding}
        className="btn-secondary px-4"
        title={locale === 'ar' ? 'اشتري الآن' : 'Buy Now'}
      >
        <Zap size={18} />
      </button>
    </div>
  );
}
