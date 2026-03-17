'use client';

import { useEffect } from 'react';

/**
 * Saudi Luxury Store - History Tracer
 * يسجل زيارات المنتجات لضمان استمرارية تجربة النخبة.
 */
export default function HistoryTracer({ product }: { product: any }) {
  useEffect(() => {
    if (!product) return;
    
    const history = JSON.parse(localStorage.getItem('empire_history') || '[]');
    const newItem = {
      id: product.id,
      title: product.titleAr,
      image: `/api/sys/proxy-image?url=${encodeURIComponent(product.id)}`, // Simple mockup proxy
      timestamp: Date.now()
    };
    
    // Filter duplicates and keep top 10
    const filtered = [newItem, ...history.filter((h: any) => h.id !== product.id)].slice(0, 10);
    localStorage.setItem('empire_history', JSON.stringify(filtered));
  }, [product]);

  return null;
}
