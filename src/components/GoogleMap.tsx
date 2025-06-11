import React, { useEffect, useRef, useState } from 'react';
import { Location } from '../lib/database';
import { useGoogleMaps } from '../contexts/GoogleMapsContext';

interface GoogleMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  center = { lat: 40.7589, lng: -73.9851 }, // Default to NYC
  zoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { isLoaded, loadError } = useGoogleMaps();

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }, [isLoaded, center, zoom]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    locations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: Number(location.latitude), lng: Number(location.longitude) },
        map: mapInstanceRef.current,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getMarkerColor(location.overall_rating),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Add click listener
      marker.addListener('click', () => {
        onLocationSelect(location);
      });

      markersRef.current.push(marker);
    });
  }, [locations, onLocationSelect, isLoaded]);

  // Center map on selected location and highlight marker
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current || !window.google || !isLoaded) return;

    // Pan to the selected location
    const selectedPosition = {
      lat: Number(selectedLocation.latitude),
      lng: Number(selectedLocation.longitude)
    };
    
    mapInstanceRef.current.panTo(selectedPosition);
    
    // Optionally adjust zoom for better visibility
    const currentZoom = mapInstanceRef.current.getZoom();
    if (currentZoom < 15) {
      mapInstanceRef.current.setZoom(15);
    }

    // Update marker styles to highlight selected location
    markersRef.current.forEach((marker, index) => {
      const location = locations[index];
      const isSelected = location.id === selectedLocation.id;
      
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 16 : 12,
        fillColor: getMarkerColor(location.overall_rating),
        fillOpacity: 1,
        strokeColor: isSelected ? '#10b981' : '#ffffff',
        strokeWeight: isSelected ? 3 : 2,
      });
    });
  }, [selectedLocation, locations, isLoaded]);

  const getMarkerColor = (rating: number): string => {
    if (rating >= 4) return '#10b981'; // Green
    if (rating >= 3) return '#f59e0b'; // Yellow
    if (rating >= 2) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">Failed to load map</p>
          <p className="text-sm text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
};