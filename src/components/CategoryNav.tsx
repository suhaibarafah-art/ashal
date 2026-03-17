'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Saudi Luxury Store - Editorial Category Nav
 * شريط الأقسام التحريري الأبيض.
 */
export default function CategoryNav() {
  const categories = [
    { nameAr: 'وصل حديثاً', nameEn: 'New In', slug: 'new' },
    { nameAr: 'المصممون', nameEn: 'Designers', slug: 'designers' },
    { nameAr: 'أزياء', nameEn: 'Clothing', slug: 'clothing' },
    { nameAr: 'أحذية', nameEn: 'Shoes', slug: 'shoes' },
    { nameAr: 'حقائب', nameEn: 'Bags', slug: 'bags' },
    { nameAr: 'ركن الجمال', nameEn: 'Beauty', slug: 'beauty' }
  ];

  return (
    <nav className="py-6 bg-white border-b border-[#EAEAEA] relative z-40 mt-24">
      <div className="container flex justify-center gap-8 md:gap-16 px-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.slug}`}
            className="group text-center min-w-max flex flex-col items-center relative"
          >
            <h3 className="text-xs md:text-sm font-medium text-[#555] group-hover:text-black transition-colors duration-300 font-arabic-body">
              {cat.nameAr}
            </h3>
            {/* Ounass-style underline on hover */}
            <span className="absolute -bottom-6 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
