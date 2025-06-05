
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
  private polyline: any = null;
  private markers: any[] = [];
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
    // Verificar se já está carregado
    if ((window as any).google && (window as any).google.maps) {
      console.log('Google Maps já carregado');
      return;
    }

    // Verificar se já existe um script carregando
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if ((window as any).google && (window as any).google.maps) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    return new Promise((resolve, reject) => {
      // Função de callback global
      (window as any).initGoogleMaps = () => {
        console.log('Google Maps carregado via callback');
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error('Erro ao carregar Google Maps API');
        reject(new Error('Erro ao carregar Google Maps API'));
      };
      
      document.head.appendChild(script);

      // Timeout de segurança
      setTimeout(() => {
        if (!(window as any).google || !(window as any).google.maps) {
          reject(new Error('Timeout ao carregar Google Maps'));
        }
      }, 10000);
    });
  }

  async initializeMap(container: HTMLElement, options: any): Promise<any> {
    if (!(window as any).google || !(window as any).google.maps) {
      throw new Error('Google Maps API não está carregado');
    }

    const google = (window as any).google;

    // Limpar mapa anterior se existir
    if (this.map) {
      this.clearRoute();
      this.clearMarkers();
    }

    const defaultOptions = {
      zoom: 16,
      center: { lat: -23.550520, lng: -46.633308 }, // São Paulo default
      mapTypeId: google.maps.MapTypeId.HYBRID,
      gestureHandling: 'greedy',
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: true,
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
      ]
    };

    this.map = new google.maps.Map(container, {
      ...defaultOptions,
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

    console.log('Mapa inicializado com sucesso');
    return this.map;
  }

  private canMakeRequest(): boolean {
    const now = Date.now();
    
    // Reset contador a cada minuto
    if (now > this.throttleState.resetTime) {
      this.throttleState.requestCount = 0;
      this.throttleState.resetTime = now + 60000;
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

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  async addRoutePoint(position: any): Promise<void> {
    if (!this.map) return;

    const google = (window as any).google;

    // Limpar marcador anterior
    this.clearMarkers();

    // Criar marcador da posição atual
    const marker = new google.maps.Marker({
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

    this.markers.push(marker);

    // Centralizar mapa na nova posição
    this.map.panTo(position);
  }

  async drawRoute(points: any[]): Promise<void> {
    if (!this.map || points.length < 2) return;

    const google = (window as any).google;

    // Limpar rota anterior
    if (this.polyline) {
      this.polyline.setMap(null);
    }

    // Criar nova polyline
    this.polyline = new google.maps.Polyline({
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

    console.log(`Rota desenhada com ${points.length} pontos`);
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
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
  }

  getMapInstance(): any {
    return this.map;
  }

  setMapType(mapType: string): void {
    if (this.map && (window as any).google) {
      const google = (window as any).google;
      this.map.setMapTypeId(google.maps.MapTypeId[mapType.toUpperCase()]);
    }
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
