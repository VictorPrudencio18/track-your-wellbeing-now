interface TomTomMapsConfig {
  apiKey: string;
  libraries: string[];
}

export class TomTomMapsService {
  private static instance: TomTomMapsService;
  private map: any = null;
  private polyline: any = null;
  private markers: any[] = [];
  private isLoading: boolean = false;
  private isLoaded: boolean = false;
  private tt: any = null;

  private constructor() {}

  static getInstance(): TomTomMapsService {
    if (!TomTomMapsService.instance) {
      TomTomMapsService.instance = new TomTomMapsService();
    }
    return TomTomMapsService.instance;
  }

  async loadTomTomMaps(apiKey: string): Promise<void> {
    // Se já está carregado, retornar imediatamente
    if (this.isLoaded && (window as any).tt) {
      console.log('TomTom Maps já carregado');
      return;
    }

    // Se está carregando, aguardar
    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.isLoaded && (window as any).tt) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Verificar se já existe um script carregando
    const existingScript = document.querySelector('script[src*="maps.tomtom.com"]');
    if (existingScript) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if ((window as any).tt) {
            this.isLoaded = true;
            this.tt = (window as any).tt;
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
        // Carregar CSS do TomTom
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
        document.head.appendChild(link);

        // Carregar JavaScript do TomTom
        const script = document.createElement('script');
        script.src = `https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('TomTom Maps carregado com sucesso');
          this.isLoaded = true;
          this.isLoading = false;
          this.tt = (window as any).tt;
          resolve();
        };

        script.onerror = () => {
          console.error('Erro ao carregar TomTom Maps API');
          this.isLoading = false;
          reject(new Error('Erro ao carregar TomTom Maps API'));
        };
        
        document.head.appendChild(script);

        // Timeout de segurança
        setTimeout(() => {
          if (!this.isLoaded) {
            this.isLoading = false;
            reject(new Error('Timeout ao carregar TomTom Maps'));
          }
        }, 15000);
      } catch (error) {
        this.isLoading = false;
        reject(error);
      }
    });
  }

  async initializeMap(container: HTMLElement, options: any): Promise<any> {
    if (!this.isLoaded || !this.tt) {
      throw new Error('TomTom Maps API não está carregado');
    }

    // Limpar mapa anterior se existir
    if (this.map) {
      this.clearRoute();
      this.clearMarkers();
      this.map.remove();
    }

    // Usar estilo básico válido em vez do estilo personalizado que retorna 404
    const defaultOptions = {
      key: options.apiKey,
      container: container,
      center: options.center || [-46.633308, -23.550520],
      zoom: options.zoom || 16,
      style: 'basic_main' // Usar estilo básico válido
    };

    try {
      this.map = this.tt.map({
        ...defaultOptions,
        ...options
      });

      console.log('TomTom Map inicializado com sucesso');
      return this.map;
    } catch (error) {
      console.error('Erro ao inicializar mapa TomTom:', error);
      throw error;
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    this.markers = [];
  }

  async addRoutePoint(position: any): Promise<void> {
    if (!this.map || !this.tt) return;

    try {
      // Limpar marcador anterior
      this.clearMarkers();

      // Criar marcador da posição atual
      const marker = new this.tt.Marker({
        color: '#4ade80',
        scale: 0.8
      })
        .setLngLat([position.lng || position.longitude, position.lat || position.latitude])
        .addTo(this.map);

      this.markers.push(marker);

      // Centralizar mapa na nova posição
      this.map.flyTo({
        center: [position.lng || position.longitude, position.lat || position.latitude],
        zoom: 16
      });
    } catch (error) {
      console.error('Erro ao adicionar ponto de rota TomTom:', error);
    }
  }

  async drawRoute(points: any[]): Promise<void> {
    if (!this.map || points.length < 2 || !this.tt) return;

    try {
      // Limpar rota anterior
      if (this.polyline) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
        this.polyline = null;
      }

      // Converter pontos para formato TomTom [lng, lat]
      const coordinates = points.map(point => [
        point.lng || point.longitude,
        point.lat || point.latitude
      ]);

      // Criar GeoJSON para a rota
      const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      };

      // Adicionar source e layer para a rota
      this.map.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4ade80',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      this.polyline = true;

      // Ajustar bounds para mostrar toda a rota
      if (points.length > 5) {
        const bounds = new this.tt.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds, { padding: 50 });
      }

      console.log(`Rota TomTom desenhada com ${points.length} pontos`);
    } catch (error) {
      console.error('Erro ao desenhar rota TomTom:', error);
    }
  }

  calculateDistance(point1: any, point2: any): number {
    try {
      // Usar fórmula Haversine para cálculo de distância
      const R = 6371; // Raio da Terra em km
      const lat1 = point1.lat || point1.latitude;
      const lon1 = point1.lng || point1.longitude;
      const lat2 = point2.lat || point2.latitude;
      const lon2 = point2.lng || point2.longitude;

      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    } catch (error) {
      console.error('Erro ao calcular distância:', error);
      return 0;
    }
  }

  clearRoute(): void {
    if (this.map && this.polyline) {
      try {
        if (this.map.getLayer('route')) {
          this.map.removeLayer('route');
        }
        if (this.map.getSource('route')) {
          this.map.removeSource('route');
        }
        this.polyline = null;
      } catch (error) {
        console.warn('Erro ao limpar rota:', error);
      }
    }
  }

  getMapInstance(): any {
    return this.map;
  }

  setMapType(mapType: string): void {
    if (this.map) {
      let styleUrl = 'basic_main';
      
      switch (mapType.toLowerCase()) {
        case 'satellite':
          styleUrl = 'satellite_main';
          break;
        case 'hybrid':
          styleUrl = 'hybrid_main';
          break;
        case 'terrain':
          styleUrl = 'basic_main';
          break;
        default:
          styleUrl = 'basic_main';
      }
      
      this.map.setStyle(styleUrl);
    }
  }

  isMapLoaded(): boolean {
    return this.isLoaded && !!this.tt;
  }

  // Métodos específicos para atividades físicas
  async getElevationProfile(coordinates: any[]): Promise<any[]> {
    // Implementar chamada para API de elevação do TomTom
    try {
      const elevationData = [];
      for (let i = 0; i < coordinates.length; i++) {
        // Simular dados de elevação por enquanto
        elevationData.push({
          coordinate: coordinates[i],
          elevation: Math.random() * 100 + 500 // Elevação simulada
        });
      }
      return elevationData;
    } catch (error) {
      console.error('Erro ao obter perfil de elevação:', error);
      return [];
    }
  }

  async findNearbyPOIs(position: any, type: string = 'sport'): Promise<any[]> {
    // Implementar busca por POIs próximos relacionados a esportes
    try {
      // Por enquanto retornar array vazio, implementar chamada real depois
      return [];
    } catch (error) {
      console.error('Erro ao buscar POIs próximos:', error);
      return [];
    }
  }
}

export const tomTomMapsService = TomTomMapsService.getInstance();
