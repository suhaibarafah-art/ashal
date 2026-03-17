'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Saudi Luxury Store - Heritage Category Navigation
 * التنقل الفئوي التراثي - عرض أقسام المتجر بأسلوب مجلات الموضة العالمية.
 */
export default function CategoryNav() {
  const categories = [
    { nameAr: 'المقتنيات الملكية', nameEn: 'Royal Collectibles', slug: 'royal' },
    { nameAr: 'هبات الرياض', nameEn: 'Riyadh Hype', slug: 'hype' },
    { nameAr: 'عطور السيادة', nameEn: 'Sovereign Scents', slug: 'scents' },
    { nameAr: 'الساعات النادرة', nameEn: 'Rare Timepieces', slug: 'watches' }
  ];

  return (
    <nav className="py-12 border-b border-white/5 bg-[#050505] sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="container flex justify-center gap-16 px-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.slug}`}
            className="group text-center min-w-max"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 group-hover:text-accent-gold transition-colors duration-500 mb-2">
              {cat.nameEn}
            </p>
            <h3 className="text-xl font-light luxury-serif group-hover:italic transition-all duration-700">
              {cat.nameAr}
            </h3>
            <div className="h-px w-0 bg-accent-gold mx-auto mt-4 group-hover:w-full transition-all duration-700" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
