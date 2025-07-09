'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useState } from 'react';

interface UseAccessibilityOptions {
  trapFocus?: boolean;
  autoFocus?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
  onTab?: (direction: 'forward' | 'backward') => void;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const focusableElements = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    return Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
      )
    ) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey } = event;

    switch (key) {
      case 'Escape':
        if (options.onEscape) {
          event.preventDefault();
          options.onEscape();
        }
        break;

      case 'Enter':
        if (options.onEnter) {
          event.preventDefault();
          options.onEnter();
        }
        break;

      case 'Tab':
        if (options.trapFocus) {
          event.preventDefault();
          const direction = shiftKey ? 'backward' : 'forward';

          if (options.onTab) {
            options.onTab(direction);
          } else {
            // Default focus trapping
            const elements = getFocusableElements();
            const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

            if (direction === 'forward') {
              const nextIndex = currentIndex === elements.length - 1 ? 0 : currentIndex + 1;
              elements[nextIndex]?.focus();
            } else {
              const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
              elements[prevIndex]?.focus();
            }
          }
        }
        break;
    }
  }, [options, getFocusableElements]);

  useEffect(() => {
    if (options.autoFocus && containerRef.current) {
      const elements = getFocusableElements();
      elements[0]?.focus();
    }
  }, [options.autoFocus, getFocusableElements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    containerRef,
    getFocusableElements,
  };
};

// Hook for managing ARIA live regions
export const useAriaLive = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;

      // Clear the message after a short delay
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }, []);

  return { announce };
};

// Hook for managing focus restoration
export const useFocusRestoration = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  return { saveFocus, restoreFocus };
};

// Hook for managing skip links
export const useSkipLink = () => {
  const handleSkipLink = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { handleSkipLink };
};

// Hook for managing high contrast mode
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { isHighContrast };
};

// Hook for managing reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { prefersReducedMotion };
}; 