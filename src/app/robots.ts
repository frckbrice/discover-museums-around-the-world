import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/sadmin/',
          '/api/',
          '/_next/',
          '/private/',
          '*.json',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/sadmin/',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://museumcall.com/sitemap.xml',
    host: 'https://museumcall.com',
  }
} 