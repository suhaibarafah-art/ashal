'use client';

import { useState } from 'react';

interface Product {
  id: string; titleAr: string; imageUrl: string | null;
  finalPrice: number; category: string; supplier: string;
  supplierSku: string; stockLevel: number;
}

interface ContentRecord {
  id: string; dayIndex: number; contentType: string; goal: string;
  status: string; teamNotes: string; hashtags: string; supplierRef: string;
  captions: string[];
  product: { id: string; titleAr: string; imageUrl: string | null; finalPrice: number; category: string; supplier: string; supplierSku: string } | null;
}

interface Props {
  todayIndex: number;
  weekOf: string;
  weekContent: ContentRecord[];
  products: Product[];
}

const DAY_NAMES  = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_TYPES  = ['Unboxing', 'The Look', 'Detail Shot', 'Problem/Solution', 'The Vibe', 'Behind the Scenes', 'FAQ / CTA'];
const DAY_GOALS  = ['إثارة الفضول', 'رفع قيمة السلة', 'إثبات الجودة', 'الاستعجال', 'براندينج', 'بناء الثقة', 'الإغلاق'];
const DAY_ICONS  = ['📦', '👗', '🔍', '⚡', '✨', '🤖', '🎯'];
const STATUS_COLOR: Record<string, string> = {
  DRAFT: '#F59E0B', APPROVED: '#8B5CF6', PUBLISHED: '#10B981',
};

export function MarketingHubClient({ todayIndex, weekOf, weekContent: initial, products }: Props) {
  const [records, setRecords]           = useState<ContentRecord[]>(initial);
  const [selectedDay, setSelectedDay]   = useState<number>(todayIndex);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [generating, setGenerating]     = useState(false);
  const [saving, setSaving]             = useState(false);
  const [notes, setNotes]               = useState('');
  const [copiedIdx, setCopiedIdx]       = useState<number | null>(null);
  const [toast, setToast]               = useState('');

  const current = records.find(r => r.dayIndex === selectedDay);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function generateContent() {
    setGenerating(true);
    try {
      const body: Record<string, unknown> = { dayIndex: selectedDay };
      if (selectedProduct) body.productId = selectedProduct;

      const res  = await fetch('/api/marketing/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في الخادم');

      const newRecord: ContentRecord = {
        id:          data.record.id,
        dayIndex:    data.record.dayIndex,
        contentType: data.record.contentType,
        goal:        data.record.goal,
        status:      data.record.status,
        teamNotes:   data.record.teamNotes,
        hashtags:    data.record.hashtags,
        supplierRef: data.record.supplierRef,
        captions:    data.captions,
        product:     data.product ?? null,
      };

      setRecords(prev => {
        const filtered = prev.filter(r => r.dayIndex !== selectedDay);
        return [...filtered, newRecord].sort((a, b) => a.dayIndex - b.dayIndex);
      });
      setNotes('');
      showToast('تم توليد المحتوى بنجاح! ✍️');
    } catch (e: any) {
      showToast('خطأ: ' + e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function changeStatus(status: string) {
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch('/api/marketing/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, status, teamNotes: notes || current.teamNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ');

      setRecords(prev => prev.map(r => r.dayIndex === selectedDay
        ? { ...r, status, teamNotes: notes || r.teamNotes }
        : r
      ));
      showToast(status === 'APPROVED' ? '✅ تمت الموافقة!' : status === 'PUBLISHED' ? '🚀 تم النشر!' : '↩️ تم الإرجاع للمسودة');
    } catch (e: any) {
      showToast('خطأ: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  function copyCaption(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  return (
    <div style={{ direction: 'rtl' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-[13px]"
          style={{ background: '#002366', border: '1px solid #FF8C00', color: 'white', fontFamily: 'var(--font-cairo)' }}>
          {toast}
        </div>
      )}

      {/* Day selector */}
      <div className="card-luxury mb-6">
        <h2 className="text-[16px] font-black mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
          <span>✍️</span> الكاتب الذكي — توليد المحتوى
        </h2>

        <div className="grid grid-cols-7 gap-1 mb-5">
          {Array.from({ length: 7 }, (_, i) => {
            const rec  = records.find(r => r.dayIndex === i);
            const sc   = rec ? STATUS_COLOR[rec.status] : '#333';
            const isSelected = i === selectedDay;
            const isToday    = i === todayIndex;
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className="p-2 rounded-lg text-center transition-all"
                style={{
                  background: isSelected ? 'rgba(232,118,26,0.2)' : 'var(--bg-tertiary)',
                  border: isSelected ? '2px solid #FF8C00' : `1px solid ${rec ? sc + '55' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                }}
              >
                <p className="text-[9px] font-bold" style={{ color: isToday ? '#FF8C00' : 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                  {DAY_NAMES[i]}
                </p>
                <p className="text-xl my-1">{DAY_ICONS[i]}</p>
                {rec && (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{ background: `${sc}20`, color: sc }}>
                    {rec.status.slice(0, 3)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day info */}
        <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: 'rgba(0,35,102,0.5)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <span className="text-2xl">{DAY_ICONS[selectedDay]}</span>
          <div>
            <p className="text-[14px] font-black" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-cairo)' }}>
              {DAY_NAMES[selectedDay]} — {DAY_TYPES[selectedDay]}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
              الهدف: {DAY_GOALS[selectedDay]}
            </p>
          </div>
          {current && (
            <span className="mr-auto text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: `${STATUS_COLOR[current.status]}20`, color: STATUS_COLOR[current.status], border: `1px solid ${STATUS_COLOR[current.status]}44`, fontFamily: 'var(--font-montserrat)' }}>
              {current.status}
            </span>
          )}
        </div>

        {/* Product selector */}
        <div className="mb-4">
          <label className="text-[12px] font-bold mb-2 block" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
            اختر منتج الموّرد للكابشن (اختياري — سيُختار تلقائياً إن تُرك فارغاً)
          </label>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="w-full p-3 rounded-lg text-[13px]"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}
          >
            <option value="">⚡ تلقائي (أفضل منتج في المخزون)</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.titleAr} — {p.finalPrice.toFixed(0)} SAR [{p.supplier.toUpperCase()}] stock:{p.stockLevel}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateContent}
          disabled={generating}
          className="w-full py-3 rounded-xl font-black text-[14px] transition-all"
          style={{
            background: generating ? 'rgba(232,118,26,0.2)' : 'linear-gradient(135deg, #FF8C00, #e8761a)',
            color: 'white', border: 'none', cursor: generating ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-cairo)',
          }}
        >
          {generating ? '⏳ الكاتب الذكي يعمل...' : `✍️ ولّد محتوى ${DAY_NAMES[selectedDay]}`}
        </button>
      </div>

      {/* Generated content display */}
      {current ? (
        <div className="card-luxury mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-[16px] font-black flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
              <span>📝</span> المحتوى المُولَّد
            </h2>
            {current.product && (
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                {current.product.imageUrl && (
                  <img src={current.product.imageUrl} alt={current.product.titleAr} className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div>
                  <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>{current.product.titleAr}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                    {current.product.supplier.toUpperCase()} · {current.product.finalPrice.toFixed(0)} SAR
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Supplier ref */}
          {current.supplierRef && (
            <p className="text-[11px] mb-3 px-3 py-1.5 rounded-lg" style={{ color: '#90CAF9', background: 'rgba(59,130,246,0.08)', fontFamily: 'var(--font-montserrat)' }}>
              🏭 {current.supplierRef}
            </p>
          )}

          {/* 3 Captions */}
          <div className="space-y-3 mb-4">
            {current.captions.map((cap, i) => (
              <div key={i} className="p-3 rounded-xl relative" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase tracking-wider mb-1 block" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>
                      كابشن #{i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>{cap}</p>
                  </div>
                  <button
                    onClick={() => copyCaption(cap, i)}
                    className="flex-shrink-0 px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                    style={{
                      background: copiedIdx === i ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                      color: copiedIdx === i ? '#10B981' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-montserrat)',
                    }}
                  >
                    {copiedIdx === i ? '✓ نُسخ' : '📋 نسخ'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {current.hashtags.split(' ').filter(Boolean).map((tag, i) => (
              <span key={i} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', color: '#90CAF9', border: '1px solid rgba(59,130,246,0.25)', fontFamily: 'var(--font-cairo)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Team notes */}
          <div className="mb-4">
            <label className="text-[12px] font-bold mb-2 block" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
              ملاحظات فريق التسويق
            </label>
            <textarea
              value={notes || current.teamNotes}
              onChange={e => setNotes(e.target.value)}
              placeholder="أي تعديل أو ملاحظة للكاتب..."
              rows={2}
              className="w-full p-3 rounded-lg text-[13px] resize-none"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {current.status !== 'APPROVED' && current.status !== 'PUBLISHED' && (
              <button
                onClick={() => changeStatus('APPROVED')}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl font-black text-[13px]"
                style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.5)', cursor: 'pointer', fontFamily: 'var(--font-cairo)' }}
              >
                {saving ? '...' : '✅ اعتماد'}
              </button>
            )}
            {current.status === 'APPROVED' && (
              <button
                onClick={() => changeStatus('PUBLISHED')}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl font-black text-[13px]"
                style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', border: '1px solid rgba(16,185,129,0.5)', cursor: 'pointer', fontFamily: 'var(--font-cairo)' }}
              >
                {saving ? '...' : '🚀 نشر على تيك توك'}
              </button>
            )}
            {current.status !== 'DRAFT' && (
              <button
                onClick={() => changeStatus('DRAFT')}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl font-bold text-[13px]"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'var(--font-cairo)' }}
              >
                ↩️ مسودة
              </button>
            )}
            <button
              onClick={generateContent}
              disabled={generating}
              className="px-4 py-2.5 rounded-xl font-bold text-[13px]"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)', cursor: 'pointer', fontFamily: 'var(--font-cairo)' }}
            >
              {generating ? '⏳' : '🔄 أعد التوليد'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card-luxury mb-6 text-center py-12">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-[16px] font-black mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}>
            لا يوجد محتوى لـ {DAY_NAMES[selectedDay]} بعد
          </p>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
            اضغط "ولّد محتوى" لتوليد الكابشنات تلقائياً من بيانات الموّرد
          </p>
        </div>
      )}

      {/* Published this week summary */}
      {records.filter(r => r.status === 'PUBLISHED').length > 0 && (
        <div className="card-luxury">
          <h2 className="text-[16px] font-black mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
            <span>🚀</span> منشور هذا الأسبوع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {records.filter(r => r.status === 'PUBLISHED').map(r => (
              <div key={r.id} className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{DAY_ICONS[r.dayIndex]}</span>
                  <span className="text-[12px] font-black" style={{ color: '#10B981', fontFamily: 'var(--font-cairo)' }}>{DAY_NAMES[r.dayIndex]} — {r.contentType}</span>
                </div>
                <p className="text-[11px] line-clamp-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>{r.captions[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
