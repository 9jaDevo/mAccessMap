import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: string | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkGoogleLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
      return;
    }

    // Load Google Maps API
    const loadGoogleMaps = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setLoadError('Google Maps API key is not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Create a global callback function
      (window as any).initGoogleMaps = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
          // Clean up the global callback
          delete (window as any).initGoogleMaps;
        } else {
          setLoadError('Google Maps API failed to load properly');
        }
      };

      script.onerror = () => {
        setLoadError('Failed to load Google Maps API script');
        // Clean up the global callback
        delete (window as any).initGoogleMaps;
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const value = {
    isLoaded,
    loadError,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

// Declare global types for TypeScript
declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}