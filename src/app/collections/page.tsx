/**
 * Collections Page — Saudi Luxury Store
 */

import { prisma } from '@/lib/prisma';
import CollectionsClient from './CollectionsClient';

export const dynamic = 'force-dynamic';

export default async function Collections() {
  const raw = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  const products = raw.map(p => {
    const ext = p as unknown as { imageUrl?: string; supplier?: string; category?: string };
    return {
      id: p.id,
      titleAr: p.titleAr,
      descAr: p.descAr ?? '',
      finalPrice: p.finalPrice,
      imageUrl: ext.imageUrl,
      supplier: ext.supplier,
      category: ext.category ?? 'عام',
    };
  });

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
        <CollectionsClient products={products} />
      )}
    </main>
  );
}
