import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://museumcall.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/museums`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Admin pages (lower priority)
  const adminPages = [
    {
      url: `${baseUrl}/admin/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/admin/stories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/admin/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/admin/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
  ]

  // Super admin pages (lowest priority)
  const superAdminPages = [
    {
      url: `${baseUrl}/sadmin/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.1,
    },
    {
      url: `${baseUrl}/sadmin/museums`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.1,
    },
    {
      url: `${baseUrl}/sadmin/users`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.1,
    },
  ]

  return [...staticPages, ...adminPages, ...superAdminPages]
} 