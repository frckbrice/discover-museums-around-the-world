'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  FCP: number;
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Only run in production and if web vitals is available
    if (process.env.NODE_ENV !== 'production') return;

    const reportWebVitals = (metric: any) => {
      // Send to analytics service
      console.log('Web Vital:', metric);

      // You can send to Google Analytics, your own analytics, etc.
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    // Import and initialize web-vitals
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });

    // Monitor resource loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation Performance:', {
            TTFB: navEntry.responseStart - navEntry.requestStart,
            DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            LoadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          });
        }
      }
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    return () => {
      observer.disconnect();
      longTaskObserver.disconnect();
    };
  }, []);

  return null;
};

// Hook for measuring component render performance
export const usePerformanceMeasure = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 16) { // Longer than one frame
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  });
};

// Hook for measuring API call performance
export const useApiPerformance = () => {
  const measureApiCall = async <T,>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now();

    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`API call to ${endpoint} took ${duration.toFixed(2)}ms`);

      // Report slow API calls
      if (duration > 1000) {
        console.warn(`Slow API call detected: ${endpoint} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.error(`API call to ${endpoint} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return { measureApiCall };
};

// Hook for measuring image loading performance
export const useImagePerformance = () => {
  const measureImageLoad = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const img = new Image();

      img.onload = () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Image ${src} loaded in ${duration.toFixed(2)}ms`);

        if (duration > 1000) {
          console.warn(`Slow image load detected: ${src} took ${duration.toFixed(2)}ms`);
        }

        resolve();
      };

      img.onerror = () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.error(`Image ${src} failed to load after ${duration.toFixed(2)}ms`);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  };

  return { measureImageLoad };
};

export default PerformanceMonitor; 