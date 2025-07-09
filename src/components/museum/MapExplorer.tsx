import { useEffect, useRef, useState } from "react";
import { Museum } from "../../types";
import { toast } from "sonner";
import { loadGoogleMapsAPI, isGoogleMapsLoaded } from "../../lib/googleMaps";

interface MapExplorerProps {
  museums: Museum[];
  selectedMuseumId?: string | null;
  onMuseumSelect?: (museumId: string) => void;
}

export default function MapExplorer({ 
  museums, 
  selectedMuseumId, 
  onMuseumSelect 
}: MapExplorerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);


  // Handle Google Maps initialization
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (isGoogleMapsLoaded()) {
      initializeMap();
      return;
    }

    // Load Google Maps API using centralized utility
    loadGoogleMapsAPI()
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        console.error("Google Maps loading error:", error);
        setMapLoaded(false);
        toast.error("Could not load the interactive map. Please try again later.");
      });
  }, []);

  // Initialize map once Google Maps is loaded
  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      // In a development environment, we'll use a fallback map
      const defaultLocation = { lat: 6.4235, lng: 2.8839 }; // Badagry Heritage Museum
      
      const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 3,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      const infoWindowInstance = new (window as any).google.maps.InfoWindow();

      setMap(mapInstance);
      setInfoWindow(infoWindowInstance);
      setMapLoaded(true);

    } catch (error) {
      console.error("Map initialization error:", error);
      setMapLoaded(false);
      toast.error("Could not initialize the map. Please try again later.");
    }
  };

  // Add markers for museums when either museums or map changes
  useEffect(() => {
    if (!map || !mapLoaded || museums.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: any[] = [];
    const bounds = new (window as any).google.maps.LatLngBounds();
    
    museums.forEach(museum => {
      if (!museum.coordinates) return;
      
      try {
        const coordinates = museum.coordinates as { lat: number; lng: number };
        const position = new (window as any).google.maps.LatLng(coordinates.lat, coordinates.lng);
        
        const marker = new (window as any).google.maps.Marker({
          position,
          map,
          title: museum.name,
          animation: selectedMuseumId === museum.id ? 
            (window as any).google.maps.Animation.BOUNCE : undefined
        });
        
        marker.addListener('click', () => {
          if (infoWindow) {
            const content = `
              <div class="p-2">
                <h3 class="font-bold text-base">${museum.name}</h3>
                <p class="text-sm">${museum.city}, ${museum.country}</p>
                <p class="text-xs mt-1">${museum.museumType.charAt(0).toUpperCase() + museum.museumType.slice(1)} Museum</p>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          }
          
          if (onMuseumSelect) {
            onMuseumSelect(museum.id);
          }
        });
        
        newMarkers.push(marker);
        bounds.extend(position);
        
      } catch (error) {
        console.error(`Error adding marker for museum ${museum.id}:`, error);
      }
    });
    
    setMarkers(newMarkers);
    
    // Adjust map bounds if we have museums with coordinates
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too far for a single marker
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    }
  }, [museums, map, mapLoaded, selectedMuseumId]);

  // Handle selected museum change
  useEffect(() => {
    if (!map || !mapLoaded || !selectedMuseumId) return;
    
    // Find the selected museum
    const selectedMuseum = museums.find(m => m.id === selectedMuseumId);
    if (!selectedMuseum || !selectedMuseum.coordinates) return;
    
    const coordinates = selectedMuseum.coordinates as { lat: number; lng: number };
    map.panTo(new (window as any).google.maps.LatLng(coordinates.lat, coordinates.lng));
    
    // Animate the selected marker
    markers.forEach(marker => {
      if (marker.getTitle() === selectedMuseum.name) {
        if (infoWindow) {
          const content = `
            <div class="p-2">
              <h3 class="font-bold text-base">${selectedMuseum.name}</h3>
              <p class="text-sm">${selectedMuseum.city}, ${selectedMuseum.country}</p>
              <p class="text-xs mt-1">${selectedMuseum.museumType.charAt(0).toUpperCase() + selectedMuseum.museumType.slice(1)} Museum</p>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        }
        
        marker.setAnimation((window as any).google.maps.Animation.BOUNCE);
        
        // Stop the bounce after a short time
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);
      } else {
        marker.setAnimation(null);
      }
    });
  }, [selectedMuseumId, map, mapLoaded, museums]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapRef}
        className="w-full h-full rounded-md overflow-hidden"
      ></div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-muted-foreground mb-3 animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <p className="text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      )}
      
      {mapLoaded && museums.length === 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-muted-foreground mb-3"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p className="text-muted-foreground">No museums found matching your criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}
