import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const baseUrl = configuredUrl && !configuredUrl.includes('seu-dominio.vercel.app')
    ? configuredUrl
    : 'https://passeiolegal.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/passeios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transfer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic pages from Firestore
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    if (adminDb) {
      // Add blog posts
      const blogSnapshot = await adminDb.collection('blog')
        .where('published', '==', true)
        .get();

      blogSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        dynamicPages.push({
          url: `${baseUrl}/blog/${data.slug}`,
          lastModified: data.updatedAt?.toDate() || new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });
      });

      // Add tours
      const toursSnapshot = await adminDb.collection('tours')
        .where('active', '==', true)
        .get();

      toursSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        dynamicPages.push({
          url: `${baseUrl}/passeios/${data.slug || doc.id}`,
          lastModified: data.updatedAt?.toDate() || new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      });

      // Add transfers
      const transfersSnapshot = await adminDb.collection('transfers')
        .where('active', '==', true)
        .get();

      transfersSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        dynamicPages.push({
          url: `${baseUrl}/transfer/${data.slug || doc.id}`,
          lastModified: data.updatedAt?.toDate() || new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
