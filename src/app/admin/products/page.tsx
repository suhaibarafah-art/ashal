'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';

interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  sellingPrice: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string }[];
  category: { nameAr: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?q=${q}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    load(search);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    load(search);
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">المنتجات</h1>
          <p className="text-sm text-ink-4 mt-1">إجمالي: {total} منتج</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة منتج
        </Link>
      </div>

      <div className="card mb-4">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" />
            <input
              className="input pr-10"
              placeholder="بحث بالاسم أو الكود..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(search)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-3 text-right text-ink-4 font-medium">المنتج</th>
                <th className="px-4 py-3 text-right text-ink-4 font-medium">الفئة</th>
                <th className="px-4 py-3 text-right text-ink-4 font-medium">السعر</th>
                <th className="px-4 py-3 text-right text-ink-4 font-medium">المخزون</th>
                <th className="px-4 py-3 text-right text-ink-4 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-ink-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-4">جاري التحميل...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center">
                  <Package size={40} className="mx-auto text-ink-6 mb-2" />
                  <p className="text-ink-4">لا يوجد منتجات</p>
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package size={16} className="text-ink-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink">{p.titleAr}</div>
                        <div className="text-xs text-ink-4">{p.titleEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{p.category?.nameAr || '—'}</td>
                  <td className="px-4 py-3 font-medium">{Number(p.sellingPrice).toFixed(2)} ر.س</td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p.id, p.isActive)}
                      className={`badge cursor-pointer ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'نشط' : 'مخفي'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}`} className="btn-ghost p-2"><Pencil size={15} /></Link>
                      <button onClick={() => handleDelete(p.id)} className="btn-ghost p-2 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
