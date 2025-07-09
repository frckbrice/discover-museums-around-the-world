'use client';
import React, { ReactNode } from 'react';
import { useAccessibility, useAriaLive, useSkipLink, useHighContrast, useReducedMotion } from '@/hooks/useAccessibility';

interface AccessibilityWrapperProps {
  children: ReactNode;
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  className = '',
  role,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
}) => {
  const { handleSkipLink } = useSkipLink();
  const { announce } = useAriaLive();

  return (
    <>
      {/* Skip Links */}
      <nav
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
        aria-label="Skip navigation"
      >
        <ul className="flex flex-col space-y-2">
          <li>
            <a
              href="#main-content"
              className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.preventDefault();
                handleSkipLink('main-content');
              }}
            >
              Skip to main content
            </a>
          </li>
          <li>
            <a
              href="#navigation"
              className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.preventDefault();
                handleSkipLink('navigation');
              }}
            >
              Skip to navigation
            </a>
          </li>
          <li>
            <a
              href="#footer"
              className="bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.preventDefault();
                handleSkipLink('footer');
              }}
            >
              Skip to footer
            </a>
          </li>
        </ul>
      </nav>

      {/* ARIA Live Region */}
      <div
        id="aria-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Main Content Wrapper */}
      <div
        className={className}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-labelledby={ariaLabelledby}
      >
        {children}
      </div>
    </>
  );
};

// Focus trap component for modals and dialogs
interface FocusTrapProps {
  children: ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  onEscape,
}) => {
  const { containerRef } = useAccessibility({
    trapFocus: isActive,
    onEscape,
  });

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} tabIndex={-1}>
      {children}
    </div>
  );
};

// Screen reader only text component
export const SrOnly: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Visually hidden component
export const VisuallyHidden: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span
    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
    style={{ clip: 'rect(0, 0, 0, 0)' }}
  >
    {children}
  </span>
);

// High contrast mode indicator
export const HighContrastIndicator: React.FC = () => {
  const { isHighContrast } = useHighContrast();

  if (!isHighContrast) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded text-sm z-50"
      role="status"
      aria-live="polite"
    >
      High contrast mode active
    </div>
  );
};

// Reduced motion indicator
export const ReducedMotionIndicator: React.FC = () => {
  const { prefersReducedMotion } = useReducedMotion();

  if (!prefersReducedMotion) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm z-50"
      role="status"
      aria-live="polite"
    >
      Reduced motion enabled
    </div>
  );
};

// Keyboard navigation indicator
export const KeyboardNavigationIndicator: React.FC = () => {
  const [isKeyboardUser, setIsKeyboardUser] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <style jsx global>{`
      ${isKeyboardUser ? `
        *:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
      ` : `
        *:focus {
          outline: none !important;
        }
      `}
    `}</style>
  );
};

export default AccessibilityWrapper; 