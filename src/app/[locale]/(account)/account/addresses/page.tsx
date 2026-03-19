import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MapPin } from 'lucide-react';

export default async function AccountAddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  const isAr = locale === 'ar';

  let addresses: any[] = [];
  try {
    addresses = await prisma.address.findMany({
      where: { userId: (session?.user as any)?.id },
    });
  } catch {}

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-ink">{isAr ? 'عناواني' : 'My Addresses'}</h1>
      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin size={48} className="mx-auto text-ink-6 mb-4" />
          <p className="text-ink-3">{isAr ? 'لا يوجد عناوين محفوظة' : 'No saved addresses'}</p>
        </div>
      ) : addresses.map(a => (
        <div key={a.id} className="card p-5">
          <div className="font-medium text-ink">{a.label} {a.isDefault && <span className="badge bg-brand-100 text-brand-600 mr-2">{isAr ? 'افتراضي' : 'Default'}</span>}</div>
          <div className="text-sm text-ink-3 mt-1">{a.name} — {a.phone}</div>
          <div className="text-sm text-ink-3">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
          <div className="text-sm text-ink-3">{a.city}، {a.region}</div>
        </div>
      ))}
    </div>
  );
}
