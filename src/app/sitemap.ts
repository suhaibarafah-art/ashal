import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saudilux.store';

  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/collections`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/about`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/terms`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/privacy`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/returns`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/shipping`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/legal`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url: `${siteUrl}/products/${p.id}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
