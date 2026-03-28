export async function loader() {
  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Private routes',
    'Disallow: /profile',
    'Disallow: /onboarding',
    'Disallow: /checkout',
    'Disallow: /api/',
    '',
    'Sitemap: https://skillity.de/sitemap.xml',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
