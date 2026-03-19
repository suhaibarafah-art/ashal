import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';

export default async function AdminCustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {}

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">العملاء</h1>
        <p className="text-sm text-ink-4 mt-1">{customers.length} عميل مسجل</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الاسم</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">البريد</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الطلبات</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center">
                <Users size={40} className="mx-auto text-ink-6 mb-2" />
                <p className="text-ink-4">لا يوجد عملاء مسجلين بعد</p>
              </td></tr>
            ) : customers.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">{c.name || 'بدون اسم'}</td>
                <td className="px-4 py-3 text-ink-3" dir="ltr">{c.email}</td>
                <td className="px-4 py-3 text-center">{c._count.orders}</td>
                <td className="px-4 py-3 text-ink-4">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
