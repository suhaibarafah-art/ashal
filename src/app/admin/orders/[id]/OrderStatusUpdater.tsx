'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: 'في الانتظار', PAID: 'مدفوع', PROCESSING: 'قيد التجهيز',
  SHIPPED: 'تم الشحن', DELIVERED: 'تم التوصيل', CANCELLED: 'ملغي',
};

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const update = async () => {
    if (status === currentStatus) return;
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select className="input text-sm py-2" value={status} onChange={e => setStatus(e.target.value)}>
        {STATUSES.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
      </select>
      <button onClick={update} disabled={saving || status === currentStatus} className="btn-primary text-sm py-2">
        {saving ? '...' : 'تحديث'}
      </button>
    </div>
  );
}
