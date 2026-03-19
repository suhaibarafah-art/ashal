import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/storefront/ProductCard';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) return {};
    return { title: locale === 'ar' ? cat.nameAr : cat.nameEn };
  } catch {
    return {};
  }
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;

  let category = null;
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  try {
    category = await prisma.category.findUnique({ where: { slug } });
    if (category) {
      products = await prisma.product.findMany({
        where: { categoryId: category.id, isActive: true },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch {
    // DB not available
  }

  if (!category) {
    notFound();
  }

  const name = locale === 'ar' ? category.nameAr : category.nameEn;
  const desc = locale === 'ar' ? category.descAr : category.descEn;

  return (
    <div>
      {/* Category Hero */}
      <div className="bg-brand-50 border-b border-brand-100 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-ink mb-2">{name}</h1>
          {desc && <p className="text-ink-3 max-w-xl">{desc}</p>}
          <p className="text-sm text-ink-4 mt-2">
            {products.length}{' '}
            {locale === 'ar' ? 'منتج' : 'products'}
          </p>
        </div>
      </div>

      <div className="container py-10">
        {products.length === 0 ? (
          <div className="text-center py-16 text-ink-4">
            <p className="text-lg font-medium">
              {locale === 'ar' ? 'لا توجد منتجات في هذه التشكيلة بعد' : 'No products in this collection yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p as Parameters<typeof ProductCard>[0]['product']} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
