'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, FileText } from 'lucide-react';

interface Job {
  id: string;
  filename: string;
  status: string;
  totalRows: number;
  goodRows: number;
  badRows: number;
  createdAt: string;
  supplier: { name: string };
}

interface Supplier {
  id: string;
  name: string;
}

export default function AdminImportsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [result, setResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const [jobsRes, suppRes] = await Promise.all([
      fetch('/api/admin/imports'),
      fetch('/api/admin/suppliers'),
    ]);
    setJobs(await jobsRes.json());
    setSuppliers(await suppRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !supplierId) return alert('اختر المورد والملف');

    setUploading(true);
    setResult(null);
    const csvContent = await file.text();
    const res = await fetch('/api/admin/imports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplierId, csvContent, filename: file.name }),
    });
    const data = await res.json();
    setResult(data);
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = '';
  };

  const statusLabels: Record<string, string> = { PROCESSING: 'جاري المعالجة', DONE: 'مكتمل', FAILED: 'فشل' };
  const statusColors: Record<string, string> = { PROCESSING: 'bg-yellow-100 text-yellow-700', DONE: 'bg-green-100 text-green-700', FAILED: 'bg-red-100 text-red-700' };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-ink">استيراد المنتجات</h1>
        <p className="text-sm text-ink-4 mt-1">ارفع ملف CSV لاستيراد منتجات من الموردين كمسودات</p>
      </div>

      {/* Upload Form */}
      <div className="card p-5">
        <h2 className="font-semibold text-ink mb-4">رفع ملف CSV</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
          <strong>تنسيق الملف المطلوب:</strong>
          <code className="block mt-1 text-xs dir-ltr" dir="ltr">supplierSku,titleAr,titleEn,costPrice,sellingPrice,stock,leadTimeDays</code>
        </div>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">المورد *</label>
              <select className="input" value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
                <option value="">— اختر المورد —</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">ملف CSV *</label>
              <input ref={fileRef} type="file" accept=".csv" required className="input file:mr-0 file:border-0 file:bg-brand-50 file:text-brand-600 file:px-3 file:py-1 file:rounded file:text-sm cursor-pointer" />
            </div>
          </div>
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
            <Upload size={18} />
            {uploading ? 'جاري الرفع والمعالجة...' : 'رفع واستيراد'}
          </button>
        </form>

        {result && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {result.error ? (
              <span>خطأ: {result.error}</span>
            ) : (
              <span>تم الاستيراد: {result.totalRows} صف — {result.goodRows} صالح، {result.badRows} خاطئ.{' '}
                <Link href={`/admin/imports/${result.jobId}`} className="underline font-medium">مراجعة المسودات</Link>
              </span>
            )}
          </div>
        )}
      </div>

      {/* History */}
      <div className="card overflow-x-auto">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-ink">سجل الاستيرادات</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الملف</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">المورد</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الصفوف</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الحالة</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">التاريخ</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-4">جاري التحميل...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center">
                <FileText size={40} className="mx-auto text-ink-6 mb-2" />
                <p className="text-ink-4">لا يوجد استيرادات بعد</p>
              </td></tr>
            ) : jobs.map(j => (
              <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{j.filename}</td>
                <td className="px-4 py-3">{j.supplier.name}</td>
                <td className="px-4 py-3">
                  <span className="text-green-600">{j.goodRows}</span>
                  <span className="text-ink-4"> / {j.totalRows}</span>
                  {j.badRows > 0 && <span className="text-red-500 text-xs"> ({j.badRows} خطأ)</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusColors[j.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[j.status] || j.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-4">{new Date(j.createdAt).toLocaleDateString('ar-SA')}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/imports/${j.id}`} className="text-sm text-brand-500 hover:underline">مراجعة</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
