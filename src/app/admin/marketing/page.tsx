/**
 * /admin/marketing — Marketing Hub
 * تكامل: الكاتب الذكي + بيانات الموّرد + موافقة فريق التسويق
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MarketingHubClient } from './MarketingHubClient';

export const dynamic = 'force-dynamic';

function getWeekOf(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_TYPES = ['Unboxing', 'The Look', 'Detail Shot', 'Problem/Solution', 'The Vibe', 'Behind the Scenes', 'FAQ / CTA'];
const DAY_ICONS = ['📦', '👗', '🔍', '⚡', '✨', '🤖', '🎯'];

export default async function MarketingPage() {
  const weekOf   = getWeekOf();
  const todayIdx = new Date().getDay();

  // Fetch this week's marketing content
  const weekContent = await prisma.marketingContent.findMany({
    where: { weekOf },
    include: {
      product: {
        select: {
          id: true, titleAr: true, titleEn: true, imageUrl: true,
          finalPrice: true, category: true, supplier: true,
          supplierSku: true, descAr: true, stockLevel: true,
        },
      },
    },
    orderBy: { dayIndex: 'asc' },
  });

  // Get available products for writer
  const products = await prisma.product.findMany({
    select: { id: true, titleAr: true, category: true, imageUrl: true, supplier: true, supplierSku: true, finalPrice: true, stockLevel: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  // Compute summary stats
  const stats = {
    total:     7,
    generated: weekContent.length,
    approved:  weekContent.filter(c => c.status === 'APPROVED').length,
    published: weekContent.filter(c => c.status === 'PUBLISHED').length,
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0A0F1E', direction: 'rtl' }}>
      {/* Top bar */}
      <div className="w-full px-8 py-4 flex items-center justify-between" style={{ background: '#002366', borderBottom: '3px solid #FF8C00' }}>
        <div>
          <h1 className="text-[22px] font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>
            🎵 محور التسويق
          </h1>
          <p className="text-[11px]" style={{ color: 'rgba(144,202,249,0.7)', fontFamily: 'var(--font-montserrat)' }}>
            MARKETING HUB — الكاتب الذكي + الموّرد + فريق التسويق
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none' }}>
              ⟨ لوحة القيادة
            </button>
          </Link>
        </div>
      </div>

      <div className="container py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'أيام الأسبوع',    value: `${stats.total}`,     color: '#3B82F6', icon: '📅' },
            { label: 'محتوى مُولَّد',   value: `${stats.generated}`, color: '#F59E0B', icon: '✍️' },
            { label: 'معتمد',           value: `${stats.approved}`,  color: '#8B5CF6', icon: '✅' },
            { label: 'منشور',           value: `${stats.published}`, color: '#10B981', icon: '🚀' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{s.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-montserrat)' }}>{s.label}</span>
              </div>
              <p className="text-[28px] font-black" style={{ color: s.color, fontFamily: 'var(--font-montserrat)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left: Weekly content list */}
          <div className="xl:col-span-1">
            <div className="card-luxury mb-6">
              <h2 className="text-[16px] font-black mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
                <span>📅</span> جدول الأسبوع
                <span className="text-[11px] font-normal mr-auto" style={{ color: 'var(--text-muted)' }}>{weekOf}</span>
              </h2>
              <div className="space-y-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const content = weekContent.find(c => c.dayIndex === i);
                  const isToday = i === todayIdx;
                  const statusColor: Record<string, string> = {
                    DRAFT: '#F59E0B', APPROVED: '#8B5CF6', PUBLISHED: '#10B981',
                  };
                  const sc = content ? statusColor[content.status] : '#444';
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: isToday ? 'rgba(232,118,26,0.10)' : 'var(--bg-tertiary)',
                        border: isToday ? '1px solid rgba(232,118,26,0.5)' : '1px solid var(--border-color)',
                      }}
                    >
                      <span className="text-lg">{DAY_ICONS[i]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-black" style={{ color: isToday ? 'var(--color-orange)' : 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>
                          {DAY_NAMES[i]} {isToday && <span className="text-[9px] mr-1" style={{ color: '#FF8C00' }}>TODAY</span>}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>{DAY_TYPES[i]}</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sc}20`, color: sc, border: `1px solid ${sc}44`, fontFamily: 'var(--font-montserrat)' }}>
                        {content ? content.status : 'EMPTY'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supplier Products Palette */}
            <div className="card-luxury">
              <h2 className="text-[16px] font-black mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
                <span>🏭</span> منتجات الموّرد
              </h2>
              <div className="space-y-2">
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.titleAr} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>📦</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>{p.titleAr}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                        {p.supplier.toUpperCase()} · {p.finalPrice.toFixed(0)} SAR · stock:{p.stockLevel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interactive content management (client component) */}
          <div className="xl:col-span-2">
            <MarketingHubClient
              todayIndex={todayIdx}
              weekOf={weekOf}
              weekContent={weekContent.map(c => ({
                id: c.id, dayIndex: c.dayIndex, contentType: c.contentType,
                goal: c.goal, status: c.status, teamNotes: c.teamNotes,
                hashtags: c.hashtags, supplierRef: c.supplierRef,
                captions: JSON.parse(c.captions || '[]') as string[],
                product: c.product ?? null,
              }))}
              products={products}
            />
          </div>
        </div>

        {/* Asset folder notice */}
        <div className="mt-8 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <span className="text-xl">📁</span>
          <div>
            <p className="text-[13px] font-black mb-1" style={{ color: '#86EFAC', fontFamily: 'var(--font-cairo)' }}>
              مستودع الأصول — /public/marketing/assets/week1/
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
              ارفع فيديوهاتك هنا ثم شاركها مع فريق التسويق للمراجعة. كل فيديو يُنشر بعد اعتماد الكابشن من هذه الصفحة.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
