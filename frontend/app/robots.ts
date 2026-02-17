import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uskillity.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/checkout/', '/onboarding', '/users'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
