'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * EmpireFooter — Hidden on admin/checkout/orders routes
 */
export default function EmpireFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/orders')) return null;
  return (
    <footer style={{ background: '#002366', borderTop: '4px solid #FF8C00' }}>
      {/* Main footer grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-1 mb-6">
              <span
                className="text-3xl font-black tracking-tight uppercase"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#FFFFFF', letterSpacing: '-0.02em' }}
              >
                SAUDI<span style={{ color: '#FFDB58' }}>LUX</span>
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(144,202,249,0.6)', fontFamily: 'var(--font-montserrat)' }}>
                Luxury Empire 2026
              </span>
            </div>
            <p className="text-[14px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-cairo)', maxWidth: '320px' }}>
              منصة التجارة الإلكترونية الفاخرة في قلب المملكة العربية السعودية. جودة مضمونة، توصيل سريع، دفع آمن.
            </p>

            {/* Coupon chips */}
            <div className="flex flex-wrap gap-3">
              <span className="coupon-badge" style={{ background: 'rgba(245,200,66,0.15)', borderColor: '#FFDB58', color: '#FFDB58' }}>SAVE10</span>
              <span className="coupon-badge" style={{ background: 'rgba(245,200,66,0.15)', borderColor: '#FFDB58', color: '#FFDB58' }}>ROYAL20</span>
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h4
              className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 pb-3"
              style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', borderBottom: '1px solid rgba(245,200,66,0.2)' }}
            >
              المتجر
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/collections', label: 'المجموعات' },
                { href: '/admin', label: 'لوحة التحكم' },
                { href: '/admin/system-logs', label: 'سجلات النظام' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium transition-all hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-cairo)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4
              className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 pb-3"
              style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', borderBottom: '1px solid rgba(245,200,66,0.2)' }}
            >
              الدعم
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/legal', label: 'الشروط والخصوصية' },
                { href: '/legal', label: 'سياسة الاسترجاع' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium transition-all hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-cairo)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { icon: '🔒', text: 'دفع آمن 100%' },
              { icon: '🚚', text: 'توصيل سريع' },
              { icon: '↩️', text: 'إرجاع مجاني' },
              { icon: '🇸🇦', text: 'مستودع سعودي' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-cairo)' }}>
                <span>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-montserrat)' }}>
            © 2026 SAUDILUX — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
