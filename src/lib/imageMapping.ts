// MuseumHubs Image Mapping
// This file contains mappings for high-quality, relevant images used throughout the application

export const IMAGE_MAPPING = {
    // Hero and main images
    hero: {
        primary: '/images/museum-hero-new.jpg',
        fallback: '/images/museum-interior.jpg',
        alt: 'MuseumHubs - Explore the World\'s Cultural Heritage'
    },

    // Country-specific images
    countries: {
        southAfrica: {
            primary: '/images/south-africa-heritage.jpg',
            fallback: '/images/south-africa.jpeg',
            alt: 'South African Cultural Heritage and Museums'
        },
        egypt: {
            primary: '/images/egypt-pyramids.jpg',
            fallback: '/images/egypt.jpeg',
            alt: 'Egyptian Pyramids and Ancient Heritage'
        },
        nigeria: {
            primary: '/images/nigeria-culture.jpg',
            fallback: '/images/badagry.jpg',
            alt: 'Nigerian Cultural Heritage and Traditions'
        },
        cameroon: {
            primary: '/images/cameroon-tradition.jpg',
            fallback: '/images/yaounde.jpg',
            alt: 'Cameroonian Cultural Traditions and Heritage'
        }
    },

    // Museum and cultural images
    museums: {
        interior: {
            primary: '/images/museum-interior.jpg',
            fallback: '/images/museum-gallery.jpg',
            alt: 'Museum Interior with Cultural Exhibits'
        },
        gallery: {
            primary: '/images/museum-gallery.jpg',
            fallback: '/images/museum-interior.jpg',
            alt: 'Museum Gallery with Art Collections'
        },
        artifacts: {
            primary: '/images/museum-artifacts.jpg',
            fallback: '/images/ancient-artifacts.jpg',
            alt: 'Ancient Artifacts and Cultural Objects'
        }
    },

    // Cultural heritage images
    heritage: {
        africanArt: {
            primary: '/images/african-art.jpg',
            fallback: '/images/cultural-exhibit.jpg',
            alt: 'Traditional African Art and Crafts'
        },
        culturalExhibit: {
            primary: '/images/cultural-exhibit.jpg',
            fallback: '/images/african-art.jpg',
            alt: 'Cultural Heritage Exhibition'
        },
        heritageSite: {
            primary: '/images/heritage-site.jpg',
            fallback: '/images/cultural-exhibit.jpg',
            alt: 'UNESCO World Heritage Site'
        }
    },

    // Collections and displays
    collections: {
        ancientArtifacts: {
            primary: '/images/ancient-artifacts.jpg',
            fallback: '/images/museum-artifacts.jpg',
            alt: 'Ancient Artifacts from Various Cultures'
        },
        traditionalCrafts: {
            primary: '/images/traditional-crafts.jpg',
            fallback: '/images/african-art.jpg',
            alt: 'Traditional Crafts and Artisanal Work'
        },
        historicalDisplay: {
            primary: '/images/historical-display.jpg',
            fallback: '/images/museum-gallery.jpg',
            alt: 'Historical Display and Museum Collections'
        }
    },

    // Social media and sharing images
    social: {
        ogImage: '/images/museum-hero-new.jpg',
        twitterImage: '/images/museum-hero-new.jpg',
        defaultThumbnail: '/images/museum-interior.jpg'
    },

    // Placeholder and loading images
    placeholders: {
        loading: '/images/museum-interior.jpg',
        error: '/images/museum-gallery.jpg',
        default: '/images/museum-hero-new.jpg'
    }
};

// Image quality settings for different use cases
export const IMAGE_QUALITY = {
    hero: {
        width: 1200,
        height: 630,
        quality: 85,
        format: 'webp'
    },
    thumbnail: {
        width: 400,
        height: 300,
        quality: 75,
        format: 'webp'
    },
    gallery: {
        width: 800,
        height: 600,
        quality: 80,
        format: 'webp'
    },
    card: {
        width: 600,
        height: 400,
        quality: 75,
        format: 'webp'
    }
};

// Helper function to get image with fallback
export const getImageWithFallback = (
    category: keyof typeof IMAGE_MAPPING,
    subcategory: string,
    type: 'primary' | 'fallback' = 'primary'
): { src: string; alt: string } => {
    const categoryConfig = IMAGE_MAPPING[category] as Record<string, { primary: string; fallback: string; alt: string }>;
    const imageConfig = categoryConfig?.[subcategory];

    if (!imageConfig) {
        return {
            src: IMAGE_MAPPING.placeholders.default,
            alt: 'MuseumHubs Cultural Heritage'
        };
    }

    return {
        src: imageConfig[type] || imageConfig.primary,
        alt: imageConfig.alt
    };
};

// Helper function to get country image
export const getCountryImage = (country: string): { src: string; alt: string } => {
    const countryKey = country.toLowerCase().replace(/\s+/g, '') as keyof typeof IMAGE_MAPPING.countries;
    return getImageWithFallback('countries', countryKey);
};

// Helper function to get museum image
export const getMuseumImage = (type: string): { src: string; alt: string } => {
    return getImageWithFallback('museums', type);
};

// Helper function to get heritage image
export const getHeritageImage = (type: string): { src: string; alt: string } => {
    return getImageWithFallback('heritage', type);
}; 