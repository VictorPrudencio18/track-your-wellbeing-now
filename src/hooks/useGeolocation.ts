// src/hooks/useGeolocation.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

interface GeolocationState {
  currentPosition: Coordinates | null;
  path: Coordinates[];
  distance: number; // in kilometers
  error: string | null;
  isTracking: boolean;
  startTracking: () => void;
  pauseTracking: () => void;
  stopTracking: () => void;
}

// Haversine formula to calculate distance between two points
const haversineDistance = (coords1: Coordinates, coords2: Coordinates): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // Earth radius in kilometers

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

export const useGeolocation = (): GeolocationState => {
  const [currentPosition, setCurrentPosition] = useState<Coordinates | null>(null);
  const [path, setPath] = useState<Coordinates[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = (position: GeolocationPosition) => {
    const newPosition: Coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
    };

    setCurrentPosition(newPosition);
    setPath((prevPath) => {
      const updatedPath = [...prevPath, newPosition];
      if (updatedPath.length > 1) {
        const lastPoint = updatedPath[updatedPath.length - 2];
        const newSegmentDistance = haversineDistance(lastPoint, newPosition);
        setDistance((prevDistance) => prevDistance + newSegmentDistance);
      }
      return updatedPath;
    });
    setError(null); // Clear any previous error
  };

  const handleError = (err: GeolocationPositionError) => {
    console.error("Geolocation error:", err);
    if (err.code === 1) {
      setError("Permissão de localização negada. Por favor, habilite nas configurações do seu navegador.");
    } else {
      setError(`Erro ao obter localização: ${err.message}`);
    }
    // Optionally stop tracking on error or let user retry
    // pauseTracking();
  };

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }
    if (isTracking) return;

    setIsTracking(true);
    setError(null); // Clear previous errors
    // Clear previous path and distance for a new session, or allow resume
    // setPath([]);
    // setDistance(0);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0, // Don't use cached position
      }
    );
  }, [isTracking]);

  const pauseTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const stopTracking = useCallback(() => {
    pauseTracking();
    // Reset state for a new activity, or keep data for review
    // setCurrentPosition(null);
    // setPath([]);
    // setDistance(0);
    // setIsTracking(false); // already set by pauseTracking
  }, [pauseTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    currentPosition,
    path,
    distance,
    error,
    isTracking,
    startTracking,
    pauseTracking,
    stopTracking,
  };
};
