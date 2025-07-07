
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain, Settings, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { EnhancedActivityData } from '@/hooks/useEnhancedActivityTracker';
import { googleMapsService } from '@/services/GoogleMapsService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const routePointsRef = useRef<any[]>([]);

  // Buscar a chave do Google Maps das secrets do Supabase
  const { data: googleMapsApiKey } = useQuery({
    queryKey: ['secret', 'GOOGLE_MAPS_API_KEY'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GOOGLE_MAPS_API_KEY' }
      });
      if (error) throw error;
      return data.value;
    },
    retry: false
  });

  const initializeGoogleMaps = async () => {
    if (!mapContainer.current || !googleMapsApiKey) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carregamento do Google Maps para ciclismo...');
      await googleMapsService.loadGoogleMaps(googleMapsApiKey);
      
      console.log('Inicializando mapa de ciclismo...');
      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: gpsState.position ? 
          { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
          { lat: -23.550520, lng: -46.633308 },
        mapTypeId: (window as any).google?.maps?.MapTypeId?.ROADMAP || 'roadmap',
        gestureHandling: 'greedy',
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false
      });

      setMapInstance(map);
      setMapLoaded(true);
      setLoading(false);
      setRetryCount(0);
      
      console.log('Google Maps inicializado com sucesso para ciclismo');
    } catch (error: any) {
      console.error('Erro ao inicializar Google Maps:', error);
      setError(`Erro ao carregar mapa: ${error.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  // Inicializar mapa quando a API key estiver disponível
  useEffect(() => {
    if (googleMapsApiKey) {
      initializeGoogleMaps();
    }
  }, [googleMapsApiKey]);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length || !(window as any).google) return;

    try {
      const googlePoints = route.map(pos => 
        new (window as any).google.maps.LatLng(pos.latitude, pos.longitude)
      );

      routePointsRef.current = googlePoints;

      if (googlePoints.length > 0) {
        googleMapsService.drawRoute(googlePoints);
        
        if (isActive && googlePoints.length > 0) {
          googleMapsService.addRoutePoint(googlePoints[googlePoints.length - 1]);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar rota de ciclismo:', error);
    }
  }, [route, isActive, mapLoaded]);

  // Centralizar mapa na posição atual
  useEffect(() => {
    if (mapInstance && gpsState.position && isActive) {
      try {
        const currentPos = new (window as any).google.maps.LatLng(
          gpsState.position.latitude,
          gpsState.position.longitude
        );
        mapInstance.panTo(currentPos);
      } catch (error) {
        console.error('Erro ao centralizar mapa de ciclismo:', error);
      }
    }
  }, [gpsState.position, isActive, mapInstance]);

  const changeMapType = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    try {
      googleMapsService.setMapType(type);
      setMapType(type);
    } catch (error) {
      console.error('Erro ao alterar tipo de mapa:', error);
    }
  };

  const centerOnCurrentLocation = () => {
    if (mapInstance && gpsState.position) {
      try {
        const currentPos = new (window as any).google.maps.LatLng(
          gpsState.position.latitude,
          gpsState.position.longitude
        );
        mapInstance.setCenter(currentPos);
        mapInstance.setZoom(16);
      } catch (error) {
        console.error('Erro ao centralizar no local atual:', error);
      }
    }
  };

  const retryLoadMap = () => {
    if (retryCount < 3) {
      setError(null);
      setMapLoaded(false);
      setRetryCount(prev => prev + 1);
      initializeGoogleMaps();
    } else {
      setError('Muitas tentativas falharam. Verifique sua conexão.');
    }
  };

  if (!googleMapsApiKey) {
    return (
      <PremiumCard glass className="p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-white">Carregando configuração do Google Maps...</p>
        </div>
      </PremiumCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Mapa</h3>
        
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
              {retryCount > 0 && (
                <p className="text-navy-400 text-sm">Tentativa {retryCount + 1}/4</p>
              )}
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
              {retryCount < 3 ? (
                <button 
                  onClick={retryLoadMap}
                  className="px-4 py-2 bg-accent-orange text-navy-900 rounded-lg font-medium hover:bg-accent-orange-light transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar novamente
                </button>
              ) : (
                <p className="text-red-400 text-sm">Limite de tentativas atingido</p>
              )}
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
          </div>
        )}

        {/* Status do GPS */}
        {mapLoaded && (
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 
                gpsState.position ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-white">
                GPS: {gpsState.position ? `${gpsState.accuracy.toFixed(0)}m` : 'Sem sinal'}
              </span>
            </div>
          </div>
        )}
      </div>

    </motion.div>
  );
}
