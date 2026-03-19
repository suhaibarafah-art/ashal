'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save } from 'lucide-react';

interface ProductFormData {
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  descAr: string;
  descEn: string;
  bulletsAr: string[];
  bulletsEn: string[];
  sellingPrice: string;
  comparePrice: string;
  costPrice: string;
  stock: string;
  sku: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  codEnabled: boolean;
  leadTimeDays: string;
  images: string[];
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface Props {
  productId?: string;
  initialData?: Partial<ProductFormData>;
}

const emptyForm: ProductFormData = {
  titleAr: '', titleEn: '', shortDescAr: '', shortDescEn: '',
  descAr: '', descEn: '', bulletsAr: [''], bulletsEn: [''],
  sellingPrice: '', comparePrice: '', costPrice: '',
  stock: '0', sku: '', categoryId: '', isActive: true,
  isFeatured: false, codEnabled: true, leadTimeDays: '', images: [''],
};

export default function ProductForm({ productId, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({ ...emptyForm, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/products?limit=0').then(r => r.json()).catch(() => ({}));
    // load categories from a simple approach
    fetch('/api/admin/categories').then(r => r.json()).then(d => setCategories(d || [])).catch(() => {});
  }, []);

  const setField = (k: keyof ProductFormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  const setBullet = (lang: 'bulletsAr' | 'bulletsEn', i: number, v: string) => {
    const arr = [...form[lang]];
    arr[i] = v;
    setField(lang, arr);
  };

  const addBullet = (lang: 'bulletsAr' | 'bulletsEn') => setField(lang, [...form[lang], '']);
  const removeBullet = (lang: 'bulletsAr' | 'bulletsEn', i: number) =>
    setField(lang, form[lang].filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
      stock: parseInt(form.stock) || 0,
      leadTimeDays: form.leadTimeDays ? parseInt(form.leadTimeDays) : undefined,
      bulletsAr: form.bulletsAr.filter(Boolean),
      bulletsEn: form.bulletsEn.filter(Boolean),
      images: form.images.filter(Boolean),
      slug: form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    };

    try {
      const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = productId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'حدث خطأ');
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Basic Info */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-ink border-b border-gray-100 pb-3">المعلومات الأساسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">العنوان بالعربية *</label>
            <input className="input" value={form.titleAr} onChange={e => setField('titleAr', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">العنوان بالإنجليزية *</label>
            <input className="input" value={form.titleEn} onChange={e => setField('titleEn', e.target.value)} required dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">وصف قصير (عربي)</label>
            <textarea className="input h-20 resize-none" value={form.shortDescAr} onChange={e => setField('shortDescAr', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">وصف قصير (إنجليزي)</label>
            <textarea className="input h-20 resize-none" value={form.shortDescEn} onChange={e => setField('shortDescEn', e.target.value)} dir="ltr" />
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-ink border-b border-gray-100 pb-3">السعر والمخزون</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">سعر البيع (ر.س) *</label>
            <input className="input" type="number" step="0.01" min="0" value={form.sellingPrice} onChange={e => setField('sellingPrice', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">سعر المقارنة</label>
            <input className="input" type="number" step="0.01" min="0" value={form.comparePrice} onChange={e => setField('comparePrice', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">التكلفة</label>
            <input className="input" type="number" step="0.01" min="0" value={form.costPrice} onChange={e => setField('costPrice', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">المخزون</label>
            <input className="input" type="number" min="0" value={form.stock} onChange={e => setField('stock', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">كود المنتج (SKU)</label>
            <input className="input" value={form.sku} onChange={e => setField('sku', e.target.value)} dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">الفئة</label>
            <select className="input" value={form.categoryId} onChange={e => setField('categoryId', e.target.value)}>
              <option value="">— بدون فئة —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">مدة التوصيل (أيام)</label>
            <input className="input" type="number" min="0" value={form.leadTimeDays} onChange={e => setField('leadTimeDays', e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { key: 'isActive', label: 'منتج نشط' },
            { key: 'isFeatured', label: 'منتج مميز' },
            { key: 'codEnabled', label: 'الدفع عند الاستلام' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form[key as keyof ProductFormData]} onChange={e => setField(key as keyof ProductFormData, e.target.checked)} className="w-4 h-4 accent-brand-500" />
              <span className="text-sm text-ink">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-ink border-b border-gray-100 pb-3">صور المنتج</h2>
        {form.images.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input className="input flex-1" placeholder="رابط الصورة" value={url} onChange={e => {
              const imgs = [...form.images];
              imgs[i] = e.target.value;
              setField('images', imgs);
            }} dir="ltr" />
            <button type="button" onClick={() => setField('images', form.images.filter((_, idx) => idx !== i))} className="btn-ghost p-2 text-red-400"><X size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={() => setField('images', [...form.images, ''])} className="btn-secondary text-sm flex items-center gap-1">
          <Plus size={14} /> إضافة صورة
        </button>
      </div>

      {/* Bullets */}
      <div className="card p-5">
        <h2 className="font-semibold text-ink border-b border-gray-100 pb-3 mb-4">نقاط المميزات</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {(['bulletsAr', 'bulletsEn'] as const).map(lang => (
            <div key={lang} className="space-y-2">
              <label className="block text-sm font-medium text-ink-3">{lang === 'bulletsAr' ? 'بالعربية' : 'بالإنجليزية'}</label>
              {form[lang].map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input className="input flex-1" value={b} onChange={e => setBullet(lang, i, e.target.value)} dir={lang === 'bulletsAr' ? 'rtl' : 'ltr'} />
                  <button type="button" onClick={() => removeBullet(lang, i)} className="btn-ghost p-2 text-red-400"><X size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addBullet(lang)} className="btn-ghost text-sm flex items-center gap-1">
                <Plus size={12} /> إضافة نقطة
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} />
          {saving ? 'جاري الحفظ...' : (productId ? 'حفظ التعديلات' : 'إضافة المنتج')}
        </button>
        <a href="/admin/products" className="btn-secondary">إلغاء</a>
      </div>
    </form>
  );
}
