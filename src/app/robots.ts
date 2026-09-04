import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const baseUrl = configuredUrl && !configuredUrl.includes('seu-dominio.vercel.app')
    ? configuredUrl
    : 'https://passeiolegal.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
