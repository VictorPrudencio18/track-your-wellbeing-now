
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
    if (this.isLoaded && (window as any).google && (window as any).google.maps) {
      console.log('Google Maps já carregado');
      return;
    }

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

    if (!container) {
      throw new Error('Container do mapa não encontrado');
    }

    // Aguardar o container estar pronto no DOM
    await new Promise(resolve => {
      if (container.offsetParent !== null) {
        resolve(undefined);
      } else {
        const observer = new MutationObserver(() => {
          if (container.offsetParent !== null) {
            observer.disconnect();
            resolve(undefined);
          }
        });
        observer.observe(container.parentElement || document.body, { 
          childList: true, 
          subtree: true 
        });
        
        // Timeout de segurança
        setTimeout(() => {
          observer.disconnect();
          resolve(undefined);
        }, 2000);
      }
    });

    const google = (window as any).google;

    if (this.map) {
      this.clearRoute();
      this.clearMarkers();
    }

    const defaultOptions = {
      zoom: 16,
      center: { lat: -23.550520, lng: -46.633308 },
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

      // Aguardar o mapa estar completamente carregado
      await new Promise((resolve) => {
        google.maps.event.addListenerOnce(this.map, 'idle', resolve);
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
      this.clearMarkers();

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
      this.map.panTo(position);
    } catch (error) {
      console.error('Erro ao adicionar ponto de rota:', error);
    }
  }

  async drawRoute(points: any[]): Promise<void> {
    if (!this.map || points.length < 2 || !(window as any).google) return;

    const google = (window as any).google;

    try {
      if (this.polyline) {
        this.polyline.setMap(null);
      }

      this.polyline = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#4ade80',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: this.map
      });

      if (points.length > 5) {
        const bounds = new google.maps.LatLngBounds();
        points.forEach(point => bounds.extend(point));
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
        return google.maps.geometry.spherical.computeDistanceBetween(point1, point2) / 1000;
      }
    } catch (error) {
      console.warn('Google Maps geometry não disponível, usando cálculo manual');
    }
    
    const R = 6371;
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
