import { serverGet } from '@/lib/api-client.server';
import type { Workshop } from '@skillity/shared';
import { WorkshopStatus } from '@skillity/shared';

const BASE_URL = 'https://skillity.de';

const staticRoutes: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/workshops', priority: '0.9', changefreq: 'daily' },
  { path: '/teach', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/guidelines', priority: '0.4', changefreq: 'monthly' },
  { path: '/guides/plan-workshop', priority: '0.6', changefreq: 'monthly' },
  { path: '/guides/find-location', priority: '0.6', changefreq: 'monthly' },
  { path: '/guides/kleingewerbe', priority: '0.6', changefreq: 'monthly' },
];

function buildUrl(
  loc: string,
  lastmod?: string,
  changefreq?: string,
  priority?: string,
): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function loader() {
  let workshops: Workshop[] = [];
  try {
    workshops = await serverGet<Workshop[]>('/workshops');
  } catch {
    // If the backend is unavailable, serve static-only sitemap
  }

  const published = workshops.filter(
    (w) =>
      w.status === WorkshopStatus.PUBLISHED ||
      w.status === WorkshopStatus.COMPLETED,
  );

  // Collect unique host IDs from workshops
  const hostIds = [...new Set(published.map((w) => w.hostId).filter(Boolean))];

  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    ...staticRoutes.map((r) =>
      buildUrl(`${BASE_URL}${r.path}`, today, r.changefreq, r.priority),
    ),
    ...published.map((w) =>
      buildUrl(
        `${BASE_URL}/workshops/${w.id}`,
        w.updatedAt,
        'weekly',
        '0.7',
      ),
    ),
    ...hostIds.map((id) =>
      buildUrl(`${BASE_URL}/hosts/${id}`, today, 'monthly', '0.5'),
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
