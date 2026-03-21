/**
 * Homepage — Server Component
 * Fetches products from DB → passes to HomeClient (animations)
 */

import { prisma } from '@/lib/prisma';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const rawProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 16,
  });

  const products = rawProducts.map(p => {
    const ext = p as unknown as { imageUrl?: string; supplier?: string };
    return {
      id: p.id,
      titleAr: p.titleAr,
      descAr: p.descAr,
      finalPrice: p.finalPrice,
      imageUrl: ext.imageUrl ?? '',
      supplier: ext.supplier ?? 'cj',
    };
  });

  return <HomeClient products={products} />;
}
