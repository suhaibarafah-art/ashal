/**
 * Suppliers Management — /admin/suppliers
 * Shows all integrated suppliers and their live status
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SUPPLIER_INFO: Record<string, { nameAr: string; logo: string; color: string; integration: string; apiKey: string; docsUrl: string }> = {
  CJ_DROP:    { nameAr: 'CJ Dropshipping', logo: '📦', color: '#FF6B35', integration: 'TITAN-10 Auto (API)', apiKey: 'CJ_ACCESS_TOKEN', docsUrl: 'https://developers.cjdropshipping.com' },
  ALIEXPRESS: { nameAr: 'AliExpress', logo: '🛍️', color: '#FF4747', integration: 'محاكاة — يحتاج ALIEXPRESS_APP_KEY', apiKey: 'ALIEXPRESS_APP_KEY', docsUrl: 'https://portals.aliexpress.com' },
  ZENDROP:    { nameAr: 'Zendrop', logo: '⚡', color: '#7B61FF', integration: 'محاكاة — يحتاج ZENDROP_API_KEY', apiKey: 'ZENDROP_API_KEY', docsUrl: 'https://app.zendrop.com' },
  SPOCKET:    { nameAr: 'Spocket', logo: '🌐', color: '#6E45E2', integration: 'محاكاة — يحتاج SPOCKET_API_KEY', apiKey: 'SPOCKET_API_KEY', docsUrl: 'https://app.spocket.co' },
};

export default async function SuppliersPage() {
  const [suppliers, productsBySupplier] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.product.groupBy({ by: ['supplier'], _count: { id: true } }).catch(() => []),
  ]);

  const productCountMap: Record<string, number> = {};
  for (const row of productsBySupplier) {
    if (row.supplier) productCountMap[row.supplier] = row._count.id;
  }

  const cjTokenStored = await prisma.siteSetting
    .findUnique({ where: { key: 'cj_access_token' } })
    .then(r => !!r).catch(() => false);

  const supplierKeys = ['CJ_DROP', 'ALIEXPRESS', 'ZENDROP', 'SPOCKET'];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#0a0a1a', borderBottom: '2px solid #FF8C00', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/admin" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>ADMIN</Link>
        <span style={{ color: '#444' }}>/</span>
        <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '14px' }}>🏭 الموردون</span>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Info Banner */}
        <div style={{ background: '#3b82f611', border: '1px solid #3b82f633', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: '#93c5fd', margin: 0 }}>
            🤖 <strong>TITAN-10 Scout</strong> يبحث في جميع الموردين تلقائياً كل يوم — CJ متصل مباشرة، الباقي في وضع المحاكاة حتى تضيف API keys الحقيقية
          </p>
        </div>

        {/* Supplier Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {supplierKeys.map(key => {
            const info = SUPPLIER_INFO[key];
            const isCJ = key === 'CJ_DROP';
            const isLive = isCJ ? cjTokenStored : false;
            const productCount = productCountMap['CJ'] ?? productCountMap[key] ?? 0;

            return (
              <div key={key} style={{
                background: 'var(--bg-secondary)', border: `1px solid ${isLive ? `${info.color}44` : 'var(--border-color)'}`,
                borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: isLive ? info.color : '#374151' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{info.logo}</span>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px',
                    background: isLive ? '#16a34a22' : '#6b728022',
                    color: isLive ? '#4ade80' : '#9ca3af',
                    border: `1px solid ${isLive ? '#16a34a44' : '#6b728044'}`,
                  }}>
                    {isLive ? 'LIVE' : 'SIMULATION'}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 4px' }}>{info.nameAr}</h3>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{info.integration}</p>
                {isCJ && (
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#4ade80', margin: '0 0 8px' }}>
                    {productCount} منتج في المخزون
                  </p>
                )}
                {!isLive && (
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#f59e0b', margin: 0 }}>
                    أضف <code style={{ background: '#f59e0b11', padding: '1px 4px', borderRadius: '3px' }}>{info.apiKey}</code> في Vercel
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Suppliers from DB */}
        {suppliers.length > 0 && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>قائمة الموردين في قاعدة البيانات</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {['الاسم', 'النوع', 'الحالة', 'التكامل'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < suppliers.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-primary)' }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)' }}>{s.type}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: s.isActive ? '#16a34a22' : '#6b728022', color: s.isActive ? '#4ade80' : '#9ca3af' }}>
                          {s.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {SUPPLIER_INFO[s.type]?.integration ?? 'API'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
