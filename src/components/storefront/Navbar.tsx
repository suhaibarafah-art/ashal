'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { cn } from '@/lib/utils';

interface NavbarProps {
  locale: string;
  categories: { id: string; slug: string; nameAr: string; nameEn: string }[];
}

export default function Navbar({ locale, categories }: NavbarProps) {
  const t = useTranslations('nav');
  const bt = useTranslations('brand');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const cartCount = totalItems();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const isRtl = locale === 'ar';

  return (
    <header
      className={cn(
        'luxury-nav sticky top-0 z-50 transition-all duration-300',
        scrolled && 'scrolled'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--gold-400)', fontFamily: 'var(--font-display)', textDecoration: 'none', letterSpacing: '-0.02em' }}
          >
            {bt('name')}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="text-sm transition-colors" style={{ color: 'var(--black-300)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-400)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--black-300)')}>
              {t('home')}
            </Link>

            {/* Collections Dropdown */}
            <div className="relative" onMouseEnter={() => setCollectionsOpen(true)} onMouseLeave={() => setCollectionsOpen(false)}>
              <button className="flex items-center gap-1 text-sm text-ink-3 hover:text-ink transition-colors">
                {t('collections')}
                <ChevronDown size={14} />
              </button>
              {collectionsOpen && categories.length > 0 && (
                <div className={cn(
                  'absolute top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[180px] z-50',
                  isRtl ? 'right-0' : 'left-0'
                )}>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/collections/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-ink-3 hover:text-ink hover:bg-brand-50 transition-colors"
                    >
                      {locale === 'ar' ? cat.nameAr : cat.nameEn}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/about`} className="text-sm text-ink-3 hover:text-ink transition-colors">
              {locale === 'ar' ? 'من نحن' : 'About'}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className={cn('flex items-center gap-2', isRtl ? 'flex-row-reverse' : '')}>
            {/* Language Switcher */}
            <Link
              href={`/${otherLocale}`}
              className="hidden md:flex items-center gap-1 text-xs font-medium text-ink-3 hover:text-ink px-2 py-1 rounded-lg hover:bg-gray-50 transition-all"
            >
              {otherLocale === 'ar' ? 'عربي' : 'EN'}
            </Link>

            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-gray-50 text-ink-3 hover:text-ink transition-all">
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-gray-50 text-ink-3 hover:text-ink transition-all"
              aria-label={t('cart')}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              href={`/${locale}/account/orders`}
              className="p-2 rounded-lg hover:bg-gray-50 text-ink-3 hover:text-ink transition-all"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-ink-3"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container py-4 flex flex-col gap-3">
            <Link href={`/${locale}`} className="text-sm text-ink py-2 border-b border-gray-50" onClick={() => setMobileOpen(false)}>
              {t('home')}
            </Link>
            <div className="py-2 border-b border-gray-50">
              <p className="text-sm font-medium text-ink mb-2">{t('collections')}</p>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${locale}/collections/${cat.slug}`}
                  className="block text-sm text-ink-3 py-1 ps-4"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === 'ar' ? cat.nameAr : cat.nameEn}
                </Link>
              ))}
            </div>
            <Link href={`/${locale}/about`} className="text-sm text-ink py-2 border-b border-gray-50" onClick={() => setMobileOpen(false)}>
              {locale === 'ar' ? 'من نحن' : 'About'}
            </Link>
            <Link href={`/${locale}/faq`} className="text-sm text-ink py-2 border-b border-gray-50" onClick={() => setMobileOpen(false)}>
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </Link>
            <Link
              href={`/${otherLocale}`}
              className="text-sm text-brand-500 py-2"
              onClick={() => setMobileOpen(false)}
            >
              {otherLocale === 'ar' ? 'عربي' : 'English'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
