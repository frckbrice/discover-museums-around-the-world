// Google Maps API utility for managing script loading and initialization
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      isLoaded = true;
      resolve();
      return;
    }

    // Add callback to queue
    callbacks.push(resolve);

    // If already loading, don't create another script
    if (isLoading) {
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      isLoading = true;
      
      // Wait for existing script to load
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          isLoaded = true;
          isLoading = false;
          callbacks.forEach(cb => cb());
          callbacks.length = 0;
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      
      checkLoaded();
      return;
    }

    // Create and load the script
    isLoading = true;
    
    // Global callback function
    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      isLoading = false;
      callbacks.forEach(() => reject(new Error('Failed to load Google Maps API')));
      callbacks.length = 0;
    };

    document.head.appendChild(script);
  });
};

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && window.google && window.google.maps;
};