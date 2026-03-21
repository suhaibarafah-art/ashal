/**
 * Phase 5: Real Moyasar Checkout Page
 * Server: fetch product → pass to CheckoutClient
 */

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const p = product as unknown as { imageUrl?: string; supplier?: string };

  return (
    <CheckoutClient
      product={{
        id: product.id,
        titleAr: product.titleAr,
        titleEn: product.titleEn,
        finalPrice: product.finalPrice,
        imageUrl: p.imageUrl ?? '',
        supplier: p.supplier ?? 'cj',
      }}
      moyasarKey={process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ?? ''}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store'}
    />
  );
}
