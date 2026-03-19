'use client';

import { useState } from 'react';
import QuantitySelector from '@/components/storefront/QuantitySelector';
import AddToCartButton from '@/components/storefront/AddToCartButton';

interface Props {
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
  locale: string;
}

export default function QuantitySelectorWrapper({ product, locale }: Props) {
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink-3">{locale === 'ar' ? 'الكمية' : 'Quantity'}</span>
        <QuantitySelector
          value={qty}
          onChange={setQty}
          max={product.stock}
        />
      </div>
      <AddToCartButton product={product} quantity={qty} locale={locale} />
    </div>
  );
}
