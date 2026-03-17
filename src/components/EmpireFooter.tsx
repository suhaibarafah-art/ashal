'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Saudi Luxury Store - Empire Footer
 * تذييل الموقع الإمبراطوري - يجمع بين الجمال والروابط الاستراتيجية.
 */
export default function EmpireFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#b38b4d]/10 py-20 px-12 font-serif">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <h3 className="text-2xl font-light text-[#f8f6f2] mb-6 tracking-tighter uppercase">Saudi <span className="text-[#b38b4d]">Luxury</span></h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            صناعة الفخامة الرقمية في قلب المملكة. نحن نمزج بين عراقة التراث السعودي وابتكار المستقبل السيادي لعام 2026.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#b38b4d] mb-6">الكيان</h4>
            <ul className="space-y-4 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-[#f8f6f2] transition-colors">الواجهة الرئيسية</Link></li>
              <li><Link href="/collections" className="hover:text-[#f8f6f2] transition-colors">المجموعات الملكية</Link></li>
              <li><Link href="/admin/empire" className="hover:text-[#f8f6f2] transition-colors">رادار الإمبراطورية</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#b38b4d] mb-6">السيادة</h4>
            <ul className="space-y-4 text-xs text-gray-400">
              <li><Link href="/legal" className="hover:text-[#f8f6f2] transition-colors">الشروط والخصوصية</Link></li>
              <li><Link href="/legal" className="hover:text-[#f8f6f2] transition-colors">سياسة الاسترجاع</Link></li>
              <li><Link href="/contact" className="hover:text-[#f8f6f2] transition-colors">تواصل النخبة</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-gray-600 tracking-widest uppercase">
          © 2026 Saudi Luxury Store | Antigravity Protocol Activated
        </p>
        <div className="flex gap-4">
            <span className="h-1 w-1 rounded-full bg-[#b38b4d]/40"></span>
            <span className="h-1 w-1 rounded-full bg-[#b38b4d]"></span>
            <span className="h-1 w-1 rounded-full bg-[#b38b4d]/40"></span>
        </div>
      </div>
    </footer>
  );
}
