// src/components/activities/ActivityMap.tsx
import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Polyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default Leaflet icon fix
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ActivityMapProps {
  path: Coordinates[];
  currentPosition?: Coordinates | null; // Optional current position marker
  className?: string;
  height?: string; // e.g., '300px' or '50vh'
}

const ActivityMap: React.FC<ActivityMapProps> = ({
  path,
  currentPosition,
  className = '',
  height = '300px'
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const currentPositionMarkerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null); // Ref for the map container

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const initialCenter: LatLngExpression = path.length > 0
        ? [path[0].latitude, path[0].longitude]
        : [0, 0]; // Default center if path is empty

      mapRef.current = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: path.length > 0 ? 15 : 2, // Zoom in if path exists
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        ],
      });
    }

    // Cleanup map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array: runs only once on mount and cleanup on unmount

  // Update polyline when path changes
  useEffect(() => {
    if (mapRef.current && path.length > 0) {
      const latLngs: LatLngExpression[] = path.map(p => [p.latitude, p.longitude]);

      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latLngs);
      } else {
        polylineRef.current = L.polyline(latLngs, { color: 'blue' }).addTo(mapRef.current);
      }

      // Fit map to bounds of the polyline, but only if there's a path
      if (latLngs.length > 0) {
         // Add a small padding to ensure the entire line is visible
        mapRef.current.fitBounds(L.polyline(latLngs).getBounds(), { padding: [20, 20] });
      }
    } else if (mapRef.current && path.length === 0 && polylineRef.current) {
      // Clear polyline if path is emptied
      mapRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
  }, [path]);

  // Update current position marker
  useEffect(() => {
    if (mapRef.current && currentPosition) {
      const { latitude, longitude } = currentPosition;
      const latLng: LatLngExpression = [latitude, longitude];

      if (currentPositionMarkerRef.current) {
        currentPositionMarkerRef.current.setLatLng(latLng);
      } else {
        currentPositionMarkerRef.current = L.marker(latLng).addTo(mapRef.current);
      }

      // Optionally center map on current position if it's the only point
      if (path.length <= 1) {
        mapRef.current.setView(latLng, 15);
      }
    } else if (mapRef.current && !currentPosition && currentPositionMarkerRef.current) {
        mapRef.current.removeLayer(currentPositionMarkerRef.current);
        currentPositionMarkerRef.current = null;
    }
  }, [currentPosition, path]); // Re-run if currentPosition or path changes

  return (
    <div
      ref={mapContainerRef}
      className={`activity-map-container ${className}`}
      style={{ height: height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}
      aria-label="Mapa da atividade"
    >
      {/* Map will be initialized here by Leaflet */}
    </div>
  );
};

export default ActivityMap;
