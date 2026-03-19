'use client';

import { useEffect, useState } from 'react';
import { Plus, Truck } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  code: string;
  contactEmail: string | null;
  isActive: boolean;
  _count: { productLinks: number; importJobs: number };
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', contactEmail: '', contactPhone: '', website: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/suppliers');
    const data = await res.json();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ name: '', code: '', contactEmail: '', contactPhone: '', website: '', notes: '' });
    load();
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">الموردون</h1>
          <p className="text-sm text-ink-4 mt-1">{suppliers.length} مورد</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة مورد
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 space-y-4">
          <h2 className="font-semibold text-ink">مورد جديد</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">اسم المورد *</label>
              <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">كود المورد *</label>
              <input className="input" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} dir="ltr" placeholder="SUPPLIER_CODE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">البريد الإلكتروني</label>
              <input className="input" type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">الجوال</label>
              <input className="input" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'جاري الحفظ...' : 'إضافة المورد'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-4 py-3 text-right text-ink-4 font-medium">المورد</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الكود</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">المنتجات</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الاستيرادات</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-4">جاري التحميل...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center">
                <Truck size={40} className="mx-auto text-ink-6 mb-2" />
                <p className="text-ink-4">لا يوجد موردين بعد</p>
              </td></tr>
            ) : suppliers.map(s => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{s.name}</div>
                  {s.contactEmail && <div className="text-xs text-ink-4">{s.contactEmail}</div>}
                </td>
                <td className="px-4 py-3 font-mono text-ink-3 text-xs">{s.code}</td>
                <td className="px-4 py-3 text-center">{s._count.productLinks}</td>
                <td className="px-4 py-3 text-center">{s._count.importJobs}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
