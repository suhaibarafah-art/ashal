import { prisma } from '@/lib/prisma';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function StorefrontLayout({ children, params }: Props) {
  const { locale } = await params;

  let categories: { id: string; slug: string; nameAr: string; nameEn: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, slug: true, nameAr: true, nameEn: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    // DB not available in preview
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar locale={locale} categories={categories} />
      <CartDrawer locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
