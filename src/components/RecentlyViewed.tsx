'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Saudi Luxury Store - Recently Viewed Persistence
 * نظام تعقب المنتجات التي شاهدها العميل لضمان تجربة نخبوية متصلة.
 */
export default function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('empire_history') || '[]');
    setItems(history.slice(0, 4));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-20 pt-20 border-t border-white/5">
      <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold mb-8 text-center">شوهد مؤخراً</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item: any) => (
          <Link href={`/products/${item.id}`} key={item.id} className="group hover-lift">
            <div className="aspect-[4/5] bg-onyx border border-white/5 overflow-hidden mb-4">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#f8f6f2] truncate">{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
