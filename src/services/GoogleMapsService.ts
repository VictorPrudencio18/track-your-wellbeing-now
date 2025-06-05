
interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
}

interface CachedRoute {
  points: any[];
  timestamp: number;
  distance: number;
}

interface ThrottleState {
  lastRequest: number;
  requestCount: number;
  resetTime: number;
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private map: any = null;
  private directionsService: any = null;
  private directionsRenderer: any = null;
  private routeCache = new Map<string, CachedRoute>();
  private throttleState: ThrottleState = {
    lastRequest: 0,
    requestCount: 0,
    resetTime: 0
  };
  
  // Configurações para throttling
  private readonly MAX_REQUESTS_PER_MINUTE = 50;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requests
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(apiKey: string): Promise<void> {
    if ((window as any).google && (window as any).google.maps) {
      return; // Já carregado
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API carregado com sucesso');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Erro ao carregar Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  }

  async initializeMap(container: HTMLElement, options: any): Promise<any> {
    if (!(window as any).google || !(window as any).google.maps) {
      throw new Error('Google Maps API não está carregado');
    }

    const google = (window as any).google;

    this.map = new google.maps.Map(container, {
      zoom: 16,
      center: { lat: -23.550520, lng: -46.633308 }, // São Paulo default
      mapTypeId: google.maps.MapTypeId.HYBRID,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#000000' }, { lightness: 13 }]
        }
      ],
      ...options
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      polylineOptions: {
        strokeColor: '#4ade80',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      suppressMarkers: true
    });

    return this.map;
  }

  private canMakeRequest(): boolean {
    const now = Date.now();
    
    // Reset contador a cada minuto
    if (now > this.throttleState.resetTime) {
      this.throttleState.requestCount = 0;
      this.throttleState.resetTime = now + 60000; // Próximo reset em 1 minuto
    }

    // Verificar limite de requests por minuto
    if (this.throttleState.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      console.warn('Limite de requests por minuto atingido');
      return false;
    }

    // Verificar intervalo mínimo entre requests
    if (now - this.throttleState.lastRequest < this.MIN_REQUEST_INTERVAL) {
      console.warn('Request muito rápido, aguardando...');
      return false;
    }

    return true;
  }

  private updateThrottleState(): void {
    this.throttleState.lastRequest = Date.now();
    this.throttleState.requestCount++;
  }

  private getCacheKey(start: any, end: any): string {
    return `${start.lat()},${start.lng()}-${end.lat()},${end.lng()}`;
  }

  private getCachedRoute(cacheKey: string): CachedRoute | null {
    const cached = this.routeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }
    return null;
  }

  async addRoutePoint(position: any): Promise<void> {
    if (!this.map) return;

    const google = (window as any).google;

    // Criar marcador da posição atual
    new google.maps.Marker({
      position,
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4ade80',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    });

    // Centralizar mapa na nova posição
    this.map.panTo(position);
  }

  async drawRoute(points: any[]): Promise<void> {
    if (!this.map || points.length < 2) return;

    const google = (window as any).google;

    // Usar polyline para desenhar a rota em tempo real (mais eficiente)
    const routePath = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#4ade80',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });

    // Ajustar bounds para mostrar toda a rota
    const bounds = new google.maps.LatLngBounds();
    points.forEach(point => bounds.extend(point));
    this.map.fitBounds(bounds);
  }

  calculateDistance(point1: any, point2: any): number {
    if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.geometry) {
      // Fallback para cálculo manual se geometry não estiver disponível
      const R = 6371; // Raio da Terra em km
      const dLat = (point2.lat() - point1.lat()) * Math.PI / 180;
      const dLon = (point2.lng() - point1.lng()) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat() * Math.PI / 180) * Math.cos(point2.lat() * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
    
    const google = (window as any).google;
    // Usar Google Maps geometry library (mais preciso)
    return google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000; // em km
  }

  async getElevation(points: any[]): Promise<number[]> {
    if (!this.canMakeRequest() || !(window as any).google) {
      return points.map(() => 0); // Fallback
    }

    const google = (window as any).google;

    return new Promise((resolve, reject) => {
      const elevator = new google.maps.ElevationService();
      
      this.updateThrottleState();
      
      elevator.getElevationForLocations({
        locations: points,
      }, (results: any[], status: any) => {
        if (status === google.maps.ElevationStatus.OK && results) {
          resolve(results.map((result: any) => result.elevation));
        } else {
          console.warn('Erro ao obter elevação:', status);
          resolve(points.map(() => 0)); // Fallback
        }
      });
    });
  }

  async getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não disponível'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const google = (window as any).google;
          const latLng = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(latLng);
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
  }

  getMapInstance(): any {
    return this.map;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
