import { FC } from 'react';

interface StructuredDataProps {
  type: 'website' | 'organization' | 'article' | 'museum' | 'breadcrumb';
  data: any;
}

const StructuredData: FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'website' ? 'WebSite' :
        type === 'organization' ? 'Organization' :
          type === 'article' ? 'Article' :
            type === 'museum' ? 'Museum' :
              type === 'breadcrumb' ? 'BreadcrumbList' : 'WebSite',
    };

    return {
      ...baseData,
      ...data,
    };
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
};

// Predefined structured data for common use cases
export const WebsiteStructuredData: FC = () => (
  <StructuredData
    type="website"
    data={{
      name: 'MuseumHubs',
      url: 'https://museumcall.com',
      description: 'Immerse yourself in stories and artifacts from museums across the globe. Discover exceptional collections and immersive experiences from South Africa, Cameroon, Nigeria, Egypt, and beyond.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://museumcall.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }}
  />
);

export const OrganizationStructuredData: FC = () => (
  <StructuredData
    type="organization"
    data={{
      name: 'MuseumHubs',
      url: 'https://museumcall.com',
      logo: 'https://museumcall.com/logo-museum.jpg',
      sameAs: [
        'https://twitter.com/museumhubs',
        'https://facebook.com/museumhubs',
        'https://instagram.com/museumhubs',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@museumhubs.com',
      },
    }}
  />
);

export const MuseumStructuredData: FC<{ museum: any }> = ({ museum }) => (
  <StructuredData
    type="museum"
    data={{
      name: museum.name,
      description: museum.description,
      url: `https://museumcall.com/museums/${museum.id}`,
      image: museum.image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: museum.address?.street,
        addressLocality: museum.address?.city,
        addressRegion: museum.address?.state,
        postalCode: museum.address?.postalCode,
        addressCountry: museum.address?.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: museum.latitude,
        longitude: museum.longitude,
      },
      openingHours: museum.openingHours,
      telephone: museum.phone,
      email: museum.email,
      priceRange: museum.priceRange,
    }}
  />
);

export const ArticleStructuredData: FC<{ article: any }> = ({ article }) => (
  <StructuredData
    type="article"
    data={{
      headline: article.title,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Organization',
        name: 'MuseumHubs',
      },
      publisher: {
        '@type': 'Organization',
        name: 'MuseumHubs',
        logo: {
          '@type': 'ImageObject',
          url: 'https://museumcall.com/logo-museum.jpg',
        },
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://museumcall.com/stories/${article.id}`,
      },
    }}
  />
);

export const BreadcrumbStructuredData: FC<{ items: Array<{ name: string; url: string }> }> = ({ items }) => (
  <StructuredData
    type="breadcrumb"
    data={{
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }}
  />
);

export default StructuredData; 