'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Row {
  id: string;
  rowNumber: number;
  supplierSku: string;
  titleAr: string | null;
  titleEn: string | null;
  costPrice: number | null;
  sellingPrice: number | null;
  stock: number | null;
  status: string;
  errorMsg: string | null;
  productId: string | null;
}

interface Job {
  id: string;
  filename: string;
  goodRows: number;
  badRows: number;
  totalRows: number;
  status: string;
  supplier: { name: string };
  rows: Row[];
}

export default function ImportReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/imports/${id}`);
    const data = await res.json();
    setJob(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const review = async (rowId: string, action: 'approve' | 'reject') => {
    setProcessing(p => ({ ...p, [rowId]: true }));
    await fetch(`/api/admin/imports/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowId, action }),
    });
    setProcessing(p => ({ ...p, [rowId]: false }));
    load();
  };

  const pendingRows = job?.rows.filter(r => r.status === 'PENDING') || [];
  const reviewedRows = job?.rows.filter(r => r.status !== 'PENDING') || [];

  const statusIcon: Record<string, React.ReactNode> = {
    PENDING: <Clock size={16} className="text-yellow-500" />,
    APPROVED: <CheckCircle size={16} className="text-green-500" />,
    REJECTED: <XCircle size={16} className="text-red-500" />,
  };

  if (loading) return <div className="p-6 text-center text-ink-4">جاري التحميل...</div>;
  if (!job) return <div className="p-6 text-center text-ink-4">لم يتم العثور على الاستيراد</div>;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-ink">مراجعة الاستيراد</h1>
        <p className="text-sm text-ink-4 mt-1">
          {job.supplier.name} — {job.filename} — {job.totalRows} صف
          ({job.goodRows} صالح، {job.badRows} خاطئ)
        </p>
      </div>

      {/* Pending rows */}
      {pendingRows.length > 0 && (
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink">في انتظار المراجعة ({pendingRows.length})</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-2 text-right text-ink-4 font-medium">#</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">كود المورد</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">العنوان (عربي)</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">العنوان (إنجليزي)</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">التكلفة</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">سعر البيع</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">المخزون</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {pendingRows.map(row => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2 text-ink-4">{row.rowNumber}</td>
                  <td className="px-4 py-2 font-mono text-xs">{row.supplierSku}</td>
                  <td className="px-4 py-2">{row.titleAr || '—'}</td>
                  <td className="px-4 py-2 text-ink-3" dir="ltr">{row.titleEn || '—'}</td>
                  <td className="px-4 py-2">{row.costPrice ? `${Number(row.costPrice).toFixed(2)} ر.س` : '—'}</td>
                  <td className="px-4 py-2">{row.sellingPrice ? `${Number(row.sellingPrice).toFixed(2)} ر.س` : '—'}</td>
                  <td className="px-4 py-2">{row.stock ?? '—'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => review(row.id, 'approve')}
                        disabled={!!processing[row.id]}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => review(row.id, 'reject')}
                        disabled={!!processing[row.id]}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 disabled:opacity-50"
                      >
                        رفض
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reviewed rows */}
      {reviewedRows.length > 0 && (
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-ink">تم المراجعة ({reviewedRows.length})</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-2 text-right text-ink-4 font-medium">#</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">كود المورد</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">العنوان</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">خطأ</th>
                <th className="px-4 py-2 text-right text-ink-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {reviewedRows.map(row => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-4 py-2 text-ink-4">{row.rowNumber}</td>
                  <td className="px-4 py-2 font-mono text-xs">{row.supplierSku}</td>
                  <td className="px-4 py-2">{row.titleAr || row.titleEn || '—'}</td>
                  <td className="px-4 py-2 text-red-500 text-xs">{row.errorMsg || ''}</td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1">
                      {statusIcon[row.status]}
                      <span className="text-xs">{row.status === 'APPROVED' ? 'مقبول' : 'مرفوض'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
