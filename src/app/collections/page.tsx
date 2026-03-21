/**
 * Collections Page — Saudi Luxury Store
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Collections() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Group by category
  const categories = [...new Set(products.map(p => (p as unknown as { category?: string }).category ?? 'عام'))].filter(Boolean);

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#002366', borderBottom: '3px solid #FF8C00', padding: '48px 0 40px' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'rgba(144,202,249,0.7)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
            ALL COLLECTIONS
          </p>
          <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            المجموعات <span style={{ color: '#FFDB58' }}>الفاخرة</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '12px' }}>
            {products.length} منتج حصري — توصيل سريع داخل المملكة
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Category filters */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <span style={{ padding: '6px 18px', borderRadius: '20px', background: '#002366', color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700 }}>
              الكل ({products.length})
            </span>
            {categories.map(cat => (
              <span key={cat} style={{ padding: '6px 18px', borderRadius: '20px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                {cat}
              </span>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</p>
            <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              لا توجد منتجات بعد
            </p>
            <a href="/api/agents/run" target="_blank">
              <button className="btn-primary text-[15px] px-8 py-4">🤖 شغّل Scout لإضافة المنتجات</button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map(product => {
              const ext = product as unknown as { imageUrl?: string; supplier?: string };
              const imageUrl = ext.imageUrl && ext.imageUrl.startsWith('http')
                ? ext.imageUrl
                : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';
              const isLocal = (ext.supplier ?? 'cj') === 'mkhazen';
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group block">
                  <div className="product-card">
                    <div className="product-card__img">
                      <img src={imageUrl} alt={product.titleAr} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} className="group-hover:scale-105" />
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        {isLocal
                          ? <span className="tag-shipping-local">24-48h 🇸🇦</span>
                          : <span className="tag-shipping-global">Global</span>
                        }
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-[15px] font-bold mb-1 truncate" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>{product.titleAr}</h4>
                      <p className="text-[12px] mb-3 truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>{product.descAr}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="price-tag">SAR {product.finalPrice.toLocaleString('ar-SA')}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-blue)', fontFamily: 'var(--font-montserrat)' }}>تفاصيل ←</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
