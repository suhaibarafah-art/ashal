import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch { }

  if (!product) notFound();

  const initialData = {
    titleAr: product.titleAr,
    titleEn: product.titleEn,
    shortDescAr: product.shortDescAr || '',
    shortDescEn: product.shortDescEn || '',
    sellingPrice: String(product.sellingPrice),
    comparePrice: product.comparePrice ? String(product.comparePrice) : '',
    costPrice: product.costPrice ? String(product.costPrice) : '',
    stock: String(product.stock),
    sku: product.sku || '',
    categoryId: product.categoryId || '',
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    codEnabled: product.codEnabled,
    bulletsAr: product.bulletsAr.length ? product.bulletsAr : [''],
    bulletsEn: product.bulletsEn.length ? product.bulletsEn : [''],
    images: product.images.map((i: any) => i.url),
    leadTimeDays: product.leadTimeDays ? String(product.leadTimeDays) : '',
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">تعديل المنتج</h1>
        <p className="text-sm text-ink-4 mt-1">{product.titleAr}</p>
      </div>
      <ProductForm productId={id} initialData={initialData} />
    </div>
  );
}
