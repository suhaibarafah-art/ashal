import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, MapPin, User, ArrowRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AccountLayout({ children, params }: Props) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const isAr = locale === 'ar';

  const links = [
    { href: `/${locale}/account/orders`, label: isAr ? 'طلباتي' : 'My Orders', icon: ShoppingBag },
    { href: `/${locale}/account/addresses`, label: isAr ? 'العناوين' : 'Addresses', icon: MapPin },
    { href: `/${locale}/account/profile`, label: isAr ? 'الملف الشخصي' : 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="flex items-center gap-2 mb-6 text-sm text-ink-4">
          <Link href={`/${locale}`} className="hover:text-ink">{isAr ? 'الرئيسية' : 'Home'}</Link>
          <ArrowRight size={14} />
          <span className="text-ink">{isAr ? 'حسابي' : 'My Account'}</span>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="card p-4">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="font-medium text-ink">{session.user.name}</p>
                <p className="text-sm text-ink-4">{session.user.email}</p>
              </div>
              <nav className="space-y-1">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-3 hover:text-ink hover:bg-gray-50 transition-colors">
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
