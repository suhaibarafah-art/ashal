'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  titleAr: string;
  descAr: string;
  finalPrice: number;
  imageUrl?: string;
  supplier?: string;
  category?: string;
}

export default function CollectionsClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category ?? 'عام'))].filter(Boolean);
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'الكل') return products;
    return products.filter(p => (p.category ?? 'عام') === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="container py-12">
      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
        {/* الكل */}
        <button
          onClick={() => setActiveCategory('الكل')}
          style={{
            padding: '7px 20px', borderRadius: '20px', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            background: activeCategory === 'الكل' ? '#002366' : 'var(--bg-tertiary)',
            color: activeCategory === 'الكل' ? 'white' : 'var(--text-secondary)',
            boxShadow: activeCategory === 'الكل' ? '0 4px 12px rgba(0,35,102,0.3)' : 'none',
          }}
        >
          الكل ({products.length})
        </button>

        {categories.map(cat => {
          const count = products.filter(p => (p.category ?? 'عام') === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 20px', borderRadius: '20px', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', border: `1px solid ${isActive ? '#FF8C00' : 'var(--border-color)'}`,
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                background: isActive ? '#FF8C0011' : 'var(--bg-tertiary)',
                color: isActive ? '#FF8C00' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(255,140,0,0.2)' : 'none',
              }}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        {activeCategory === 'الكل' ? `عرض جميع المنتجات (${filtered.length})` : `${activeCategory} — ${filtered.length} منتج`}
      </p>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', color: 'var(--text-muted)' }}>
            لا توجد منتجات في هذا التصنيف
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map(product => {
            const imageUrl = product.imageUrl?.startsWith('http')
              ? product.imageUrl
              : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';
            const isLocal = (product.supplier ?? 'cj') === 'mkhazen';
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                <div className="product-card">
                  <div className="product-card__img">
                    <img
                      src={imageUrl}
                      alt={product.titleAr}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      className="group-hover:scale-105"
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      {isLocal
                        ? <span className="tag-shipping-local">24-48h 🇸🇦</span>
                        : <span className="tag-shipping-global">Global</span>
                      }
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-[15px] font-bold mb-1 truncate" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>
                      {product.titleAr}
                    </h4>
                    <p className="text-[12px] mb-3 truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                      {product.descAr}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="price-tag">SAR {product.finalPrice.toLocaleString('en-US')}</span>
                      <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-cairo)' }}>
                        تفاصيل
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
