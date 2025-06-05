
interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private map: any = null;
  private polyline: any = null;
  private markers: any[] = [];
  private isLoading: boolean = false;
  private isLoaded: boolean = false;

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(apiKey: string): Promise<void> {
    // Se já está carregado, retornar imediatamente
    if (this.isLoaded && (window as any).google && (window as any).google.maps) {
      console.log('Google Maps já carregado');
      return;
    }

    // Se está carregando, aguardar
    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.isLoaded && (window as any).google && (window as any).google.maps) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Verificar se já existe um script carregando
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if ((window as any).google && (window as any).google.maps) {
            this.isLoaded = true;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.isLoading = true;

    return new Promise((resolve, reject) => {
      try {
        // Criar callback único
        const callbackName = `initGoogleMaps_${Date.now()}`;
        
        (window as any)[callbackName] = () => {
          console.log('Google Maps carregado com sucesso');
          this.isLoaded = true;
          this.isLoading = false;
          delete (window as any)[callbackName];
          resolve();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
          console.error('Erro ao carregar Google Maps API');
          this.isLoading = false;
          delete (window as any)[callbackName];
          reject(new Error('Erro ao carregar Google Maps API'));
        };
        
        document.head.appendChild(script);

        // Timeout de segurança
        setTimeout(() => {
          if (!this.isLoaded) {
            this.isLoading = false;
            delete (window as any)[callbackName];
            reject(new Error('Timeout ao carregar Google Maps'));
          }
        }, 15000);
      } catch (error) {
        this.isLoading = false;
        reject(error);
      }
    });
  }

  async initializeMap(container: HTMLElement, options: any): Promise<any> {
    if (!this.isLoaded || !(window as any).google || !(window as any).google.maps) {
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
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'greedy',
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    try {
      this.map = new google.maps.Map(container, {
        ...defaultOptions,
        ...options
      });

      console.log('Mapa inicializado com sucesso');
      return this.map;
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      throw error;
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    this.markers = [];
  }

  async addRoutePoint(position: any): Promise<void> {
    if (!this.map || !(window as any).google) return;

    const google = (window as any).google;

    try {
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
    } catch (error) {
      console.error('Erro ao adicionar ponto de rota:', error);
    }
  }

  async drawRoute(points: any[]): Promise<void> {
    if (!this.map || points.length < 2 || !(window as any).google) return;

    const google = (window as any).google;

    try {
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
      
      // Só ajustar bounds se tivermos pontos suficientes
      if (points.length > 5) {
        this.map.fitBounds(bounds);
      }

      console.log(`Rota desenhada com ${points.length} pontos`);
    } catch (error) {
      console.error('Erro ao desenhar rota:', error);
    }
  }

  calculateDistance(point1: any, point2: any): number {
    try {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.geometry) {
        const google = (window as any).google;
        return google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000; // em km
      }
    } catch (error) {
      console.warn('Google Maps geometry não disponível, usando cálculo manual');
    }
    
    // Fallback para cálculo manual
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

  clearRoute(): void {
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }

  getMapInstance(): any {
    return this.map;
  }

  setMapType(mapType: string): void {
    if (this.map && (window as any).google) {
      const google = (window as any).google;
      const mapTypeId = mapType.toUpperCase();
      if (google.maps.MapTypeId[mapTypeId]) {
        this.map.setMapTypeId(google.maps.MapTypeId[mapTypeId]);
      }
    }
  }

  isMapLoaded(): boolean {
    return this.isLoaded && !!(window as any).google && !!(window as any).google.maps;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
