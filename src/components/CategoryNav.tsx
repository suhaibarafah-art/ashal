'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Saudi Luxury Store - Heritage Category Navigation (Minimalist)
 * التنقل الفئوي التراثي - عرض أقسام المتجر بأسلوب مجلات الموضة العالمية (مخفف).
 */
export default function CategoryNav() {
  const categories = [
    { nameAr: 'المقتنيات الملكية', nameEn: 'Royal Collectibles', slug: 'royal' },
    { nameAr: 'هبات الرياض', nameEn: 'Riyadh Hype', slug: 'hype' },
    { nameAr: 'عطور السيادة', nameEn: 'Sovereign Scents', slug: 'scents' },
    { nameAr: 'الساعات النادرة', nameEn: 'Rare Timepieces', slug: 'watches' }
  ];

  return (
    <nav className="py-8 bg-transparent relative z-40">
      <div className="container flex justify-center gap-10 md:gap-24 px-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.slug}`}
            className="group text-center min-w-max flex flex-col items-center"
          >
            <h3 className="text-sm md:text-lg font-light text-[#faf8f5] opacity-60 group-hover:opacity-100 transition-all duration-700 font-arabic-heading">
              {cat.nameAr}
            </h3>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#c5a975] mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              {cat.nameEn}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
}
