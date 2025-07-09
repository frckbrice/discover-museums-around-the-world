import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useImagePerformance } from './PerformanceMonitor';
import { getImageWithFallback, IMAGE_QUALITY } from '@/lib/imageMapping';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  fill?: boolean;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
  fill = false,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imageRef = useRef<HTMLDivElement>(null);
  const { measureImageLoad } = useImagePerformance();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Performance monitoring
  useEffect(() => {
    if (isInView && src) {
      measureImageLoad(src).catch(() => {
        setHasError(true);
        onError?.();
      });
    }
  }, [isInView, src, measureImageLoad, onError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback for failed images
  if (hasError) {
    return (
      <div
        className={`${className} bg-muted flex items-center justify-center`}
        style={{
          width: width || '100%',
          height: height || '200px',
          ...style,
        }}
        role="img"
        aria-label={`${alt} - Image failed to load`}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  // Loading skeleton
  if (!isInView) {
    return (
      <div
        ref={imageRef}
        className={`${className} bg-muted animate-pulse`}
        style={{
          width: width || '100%',
          height: height || '200px',
          ...style,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={imageRef}
      className={`relative ${className} ${!isLoaded ? 'bg-muted animate-pulse' : ''}`}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        fill={fill}
        style={fill ? { objectFit: 'cover' } : undefined}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Responsive image sizes utility
export const getResponsiveSizes = () => {
  const responsiveSizes = {
    sm: '(max-width: 640px) 100vw',
    md: '(max-width: 768px) 50vw',
    lg: '(max-width: 1024px) 33vw',
    xl: '(max-width: 1280px) 25vw',
    '2xl': '20vw',
  };

  return Object.values(responsiveSizes).join(', ');
};

// Specialized image components
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'sizes'>> = (props) => (
  <OptimizedImage
    {...props}
    priority={true}
    sizes="100vw"
    quality={85}
  />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'quality'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 50vw, 25vw"
    quality={60}
  />
);

export const GalleryImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'quality'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={80}
  />
);

export default OptimizedImage; 