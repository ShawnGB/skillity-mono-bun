import type { MetadataRoute } from 'next';
import { getWorkshops } from '@/data/workshops';
import { WorkshopStatus } from '@skillity/shared';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uskillity.com';

  const staticPages = ['', '/workshops', '/about', '/teach'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const workshops = await getWorkshops();
  const workshopPages = workshops
    .filter(
      (w) =>
        w.status !== WorkshopStatus.DRAFT &&
        w.status !== WorkshopStatus.CANCELLED,
    )
    .map((w) => ({
      url: `${siteUrl}/workshops/${w.id}`,
      lastModified: new Date(w.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

  return [...staticPages, ...workshopPages];
}
