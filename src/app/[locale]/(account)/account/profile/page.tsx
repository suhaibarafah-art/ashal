import { auth } from '@/lib/auth';

export default async function AccountProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-ink">{isAr ? 'الملف الشخصي' : 'Profile'}</h1>
      <div className="card p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-4 mb-1">{isAr ? 'الاسم' : 'Name'}</label>
          <p className="text-ink">{session?.user?.name || '—'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-4 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
          <p className="text-ink" dir="ltr">{session?.user?.email}</p>
        </div>
        <p className="text-sm text-ink-4">
          {isAr ? 'لتعديل بياناتك تواصل معنا على البريد الإلكتروني.' : 'To update your details, contact us by email.'}
        </p>
      </div>
    </div>
  );
}
