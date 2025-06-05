
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain, Settings, Navigation, AlertCircle } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { EnhancedActivityData } from '@/hooks/useEnhancedActivityTracker';
import { googleMapsService } from '@/services/GoogleMapsService';

interface CyclingMapProps {
  gpsState: GPSState;
  data: EnhancedActivityData;
  isActive: boolean;
  route: GPSPosition[];
  fullscreen?: boolean;
}

export function CyclingMap({ gpsState, data, isActive, route, fullscreen = false }: CyclingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('hybrid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const routePointsRef = useRef<any[]>([]);

  // Usar a nova chave API fornecida
  const GOOGLE_MAPS_API_KEY = 'AIzaSyC4n6Y17OX0PIFYgeL64ibC4ISqQkOxUok';

  const initializeGoogleMaps = async () => {
    if (!mapContainer.current) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carregamento do Google Maps...');
      await googleMapsService.loadGoogleMaps(GOOGLE_MAPS_API_KEY);
      
      console.log('Inicializando mapa...');
      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: gpsState.position ? 
          { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
          { lat: -23.550520, lng: -46.633308 }, // São Paulo default
        mapTypeId: (window as any).google.maps.MapTypeId.HYBRID,
        gestureHandling: 'greedy',
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
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
      });

      setMapInstance(map);
      setMapLoaded(true);
      setLoading(false);
      
      console.log('Google Maps inicializado com sucesso para ciclismo');
    } catch (error: any) {
      console.error('Erro ao inicializar Google Maps:', error);
      setError(error.message || 'Erro ao carregar mapa');
      setLoading(false);
    }
  };

  // Inicializar mapa automaticamente
  useEffect(() => {
    initializeGoogleMaps();
  }, []);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length) return;

    const googlePoints = route.map(pos => 
      new (window as any).google.maps.LatLng(pos.latitude, pos.longitude)
    );

    routePointsRef.current = googlePoints;

    if (googlePoints.length > 0) {
      // Desenhar rota atualizada
      googleMapsService.drawRoute(googlePoints);
      
      // Adicionar ponto atual se ativo
      if (isActive && googlePoints.length > 0) {
        googleMapsService.addRoutePoint(googlePoints[googlePoints.length - 1]);
      }
    }
  }, [route, isActive, mapLoaded]);

  // Centralizar mapa na posição atual
  useEffect(() => {
    if (mapInstance && gpsState.position && isActive) {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );
      mapInstance.panTo(currentPos);
    }
  }, [gpsState.position, isActive, mapInstance]);

  const changeMapType = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    googleMapsService.setMapType(type);
    setMapType(type);
  };

  const centerOnCurrentLocation = () => {
    if (mapInstance && gpsState.position) {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );
      mapInstance.setCenter(currentPos);
      mapInstance.setZoom(16);
    }
  };

  const retryLoadMap = () => {
    setError(null);
    setMapLoaded(false);
    initializeGoogleMaps();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Mapa da Rota</h3>
        
        {mapLoaded && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapType('roadmap')}
              className={`glass-card border-navy-600 ${mapType === 'roadmap' ? 'bg-accent-orange text-navy-900' : ''}`}
            >
              Mapa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapType('satellite')}
              className={`glass-card border-navy-600 ${mapType === 'satellite' ? 'bg-accent-orange text-navy-900' : ''}`}
            >
              Satélite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapType('hybrid')}
              className={`glass-card border-navy-600 ${mapType === 'hybrid' ? 'bg-accent-orange text-navy-900' : ''}`}
            >
              Híbrido
            </Button>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <div className={`relative ${fullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'} rounded-2xl overflow-hidden glass-card`}>
        {loading && (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white">Carregando Google Maps...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <div>
                <p className="text-white font-medium">Erro ao carregar mapa</p>
                <p className="text-navy-400 text-sm">{error}</p>
              </div>
              <button 
                onClick={retryLoadMap}
                className="px-4 py-2 bg-accent-orange text-navy-900 rounded-lg font-medium hover:bg-accent-orange-light transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {mapLoaded && !loading && !error && (
          <div ref={mapContainer} className="w-full h-full" />
        )}
        
        {/* Overlay de informações no mapa */}
        {mapLoaded && (
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Velocidade</div>
              <div className="text-lg font-bold text-white">{(data.currentSpeed * 3.6).toFixed(1)} km/h</div>
            </div>
            
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Distância</div>
              <div className="text-lg font-bold text-white">{data.distance.toFixed(2)} km</div>
            </div>
            
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Elevação</div>
              <div className="text-lg font-bold text-white">{Math.round(data.elevationGain)}m</div>
            </div>
          </div>
        )}

        {/* Controles do mapa */}
        {mapLoaded && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={centerOnCurrentLocation}
              className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Navigation className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Mountain className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Status do GPS */}
        {mapLoaded && (
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-xs text-white">
                GPS: {gpsState.accuracy.toFixed(0)}m
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas da rota */}
      <div className="grid grid-cols-3 gap-4">
        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-navy-400">Pontos GPS</div>
              <div className="text-xl font-bold text-white">{route.length}</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-navy-400">Precisão</div>
              <div className="text-xl font-bold text-white">{gpsState.accuracy.toFixed(0)}m</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-navy-400">Qualidade</div>
              <div className="text-xl font-bold text-white">
                {gpsState.isHighAccuracy ? 'Alta' : 'Média'}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
