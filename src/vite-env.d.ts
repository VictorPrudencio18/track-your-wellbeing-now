
/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      panTo(latLng: LatLng): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng): void;
    }

    class Marker {
      constructor(opts: MarkerOptions);
    }

    class Polyline {
      constructor(opts: PolylineOptions);
    }

    class DirectionsService {
      constructor();
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions);
      setDirections(result: any): void;
      setMap(map: Map | null): void;
    }

    class ElevationService {
      constructor();
      getElevationForLocations(
        request: ElevationRequest,
        callback: (results: ElevationResult[] | null, status: ElevationStatus) => void
      ): void;
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng | LatLngLiteral;
      mapTypeId?: MapTypeId;
      gestureHandling?: string;
      zoomControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: MapTypeStyle[];
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      icon?: any;
    }

    interface PolylineOptions {
      path: LatLng[];
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map?: Map;
    }

    interface DirectionsRendererOptions {
      map?: Map;
      polylineOptions?: PolylineOptions;
      suppressMarkers?: boolean;
    }

    interface ElevationRequest {
      locations: LatLng[];
    }

    interface ElevationResult {
      elevation: number;
      location: LatLng;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: any[];
    }

    enum MapTypeId {
      HYBRID = 'hybrid',
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      TERRAIN = 'terrain'
    }

    enum ElevationStatus {
      OK = 'OK',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
      }
    }

    namespace SymbolPath {
      const CIRCLE: any;
    }
  }
}

export {};
