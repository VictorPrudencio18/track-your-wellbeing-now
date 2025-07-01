import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Navigation, AlertCircle, RefreshCw, Satellite, Map as MapIcon,
  Zap, TrendingUp
} from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { RunningData } from '@/hooks/useRunningTracker';
import { googleMapsService } from '@/services/GoogleMapsService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedRunningMapProps {
  gpsState: GPSState;
  data: RunningData;
  isActive: boolean;
}

export function EnhancedRunningMap({ gpsState, data, isActive }: EnhancedRunningMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Buscar chave do Google Maps
  const { data: googleMapsApiKey, isLoading: loadingApiKey } = useQuery({
    queryKey: ['secret', 'GOOGLE_MAPS_API_KEY'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GOOGLE_MAPS_API_KEY' }
      });
      if (error) throw error;
      return data.value;
    },
    retry: 2
  });

  // Inicializar mapa
  const initializeMap = async () => {
    if (!mapContainer.current || !googleMapsApiKey || loadingApiKey) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🗺️ Inicializando Google Maps para corrida...');
      await googleMapsService.loadGoogleMaps(googleMapsApiKey);
      
      const initialCenter = gpsState.position ? 
        { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
        { lat: -23.550520, lng: -46.633308 }; // São Paulo como fallback

      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: initialCenter,
        mapTypeId: (window as any).google?.maps?.MapTypeId?.ROADMAP,
        gestureHandling: 'greedy',
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
      });

      setMapInstance(map);
      setMapLoaded(true);
      setLoading(false);
      setRetryCount(0);
      
      console.log('✅ Google Maps inicializado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao inicializar Google Maps:', error);
      setError(`Erro ao carregar mapa: ${error.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  // Inicializar quando API key estiver disponível
  useEffect(() => {
    if (googleMapsApiKey && !loadingApiKey) {
      initializeMap();
    }
  }, [googleMapsApiKey, loadingApiKey]);

  // Sincronizar posição GPS com mapa em tempo real
  useEffect(() => {
    if (!mapLoaded || !mapInstance || !gpsState.position) return;

    try {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );

      // Centralizar mapa na posição atual durante atividade
      if (isActive) {
        mapInstance.panTo(currentPos);
      }

      // Adicionar marcador da posição atual
      googleMapsService.addRoutePoint(currentPos);
      
      console.log(`📍 GPS sincronizado: ${gpsState.position.latitude.toFixed(6)}, ${gpsState.position.longitude.toFixed(6)}`);
    } catch (error) {
      console.error('❌ Erro ao sincronizar GPS:', error);
    }
  }, [gpsState.position, mapLoaded, mapInstance, isActive]);

  // Desenhar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !data.gpsPoints.length || data.gpsPoints.length < 2) return;

    try {
      const googlePoints = data.gpsPoints.map(pos => 
        new (window as any).google.maps.LatLng(pos.latitude, pos.longitude)
      );

      console.log(`🛤️ Atualizando rota com ${googlePoints.length} pontos`);
      googleMapsService.drawRoute(googlePoints);
    } catch (error) {
      console.error('❌ Erro ao desenhar rota:', error);
    }
  }, [data.gpsPoints, mapLoaded]);

  const changeMapType = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    if (!mapLoaded) return;
    
    try {
      googleMapsService.setMapType(type);
      setMapType(type);
    } catch (error) {
      console.error('❌ Erro ao alterar tipo de mapa:', error);
    }
  };

  const retryLoadMap = () => {
    if (retryCount < 3) {
      setError(null);
      setMapLoaded(false);
      setRetryCount(prev => prev + 1);
      initializeMap();
    } else {
      setError('Muitas tentativas falharam. Verifique sua conexão.');
    }
  };

  const centerMapOnGPS = () => {
    if (mapInstance && gpsState.position) {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );
      mapInstance.setCenter(currentPos);
      mapInstance.setZoom(18);
    }
  };

  // Loading state para API key
  if (loadingApiKey) {
    return (
      <PremiumCard glass className="p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-white">Carregando configuração do mapa...</p>
        </div>
      </PremiumCard>
    );
  }

  const isGPSReady = gpsState.position !== null && gpsState.isReady;
  const isSystemReady = mapLoaded && isGPSReady;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Header do mapa */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Mapa da Corrida</h3>
          <div className={`text-sm flex items-center gap-2 ${
            isSystemReady ? 'text-green-400' : 'text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isSystemReady ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            {isSystemReady ? 'Sistema Pronto' : 
             loading ? 'Carregando...' : 
             !isGPSReady ? 'Aguardando GPS...' : 'Inicializando...'}
          </div>
        </div>
        
        {mapLoaded && (
          <div className="flex gap-2">
            <button
              onClick={() => changeMapType('roadmap')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                mapType === 'roadmap' 
                  ? 'bg-accent-orange text-navy-900' 
                  : 'bg-navy-800 text-white hover:bg-navy-700'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => changeMapType('satellite')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                mapType === 'satellite' 
                  ? 'bg-accent-orange text-navy-900' 
                  : 'bg-navy-800 text-white hover:bg-navy-700'
              }`}
            >
              <Satellite className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Container do mapa */}
      <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
        {(loading || !isGPSReady) && (
          <div className="absolute inset-0 bg-navy-800 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white font-medium">
                {loading && !isGPSReady ? 'Carregando GPS + Mapa...' :
                 loading ? 'Carregando Mapa...' : 'Aguardando GPS...'}
              </p>
              <p className="text-navy-400 text-sm mt-1">
                {retryCount > 0 ? `Tentativa ${retryCount + 1}/4` : 
                 gpsState.isTracking ? 'GPS em busca de sinal...' : 'Iniciando GPS...'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-navy-800 flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <div>
                <p className="text-white font-medium">Erro ao carregar mapa</p>
                <p className="text-navy-400 text-sm mt-1">{error}</p>
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

        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ minHeight: '384px' }}
        />
        
        {/* Overlay de métricas */}
        {mapLoaded && !error && (
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Distância</div>
              <div className="text-lg font-bold text-white">{data.distance.toFixed(2)} km</div>
            </div>
            
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Velocidade</div>
              <div className="text-lg font-bold text-white">{(data.currentSpeed * 3.6).toFixed(1)} km/h</div>
            </div>

            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">GPS</div>
              <div className={`text-xs font-medium ${isGPSReady ? 'text-green-400' : 'text-red-400'}`}>
                {isGPSReady ? 'Ativo' : 'Sem Sinal'}
              </div>
            </div>
          </div>
        )}

        {/* Controles do mapa */}
        {mapLoaded && !error && (
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={centerMapOnGPS}
              disabled={!gpsState.position}
              className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Centralizar no GPS"
            >
              <Navigation className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Status GPS */}
        <div className="absolute bottom-4 left-4">
          <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              gpsState.isReady && gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 
              gpsState.position ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-white">
              {gpsState.position ? `${gpsState.accuracy.toFixed(0)}m` : 'Sem GPS'}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas da rota */}
      <div className="grid grid-cols-3 gap-4">
        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-navy-400">Pontos GPS</div>
              <div className="text-xl font-bold text-white">{data.gpsPoints.length}</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-navy-400">Precisão</div>
              <div className="text-xl font-bold text-white">
                {gpsState.position ? `${gpsState.accuracy.toFixed(0)}m` : 'N/A'}
              </div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard glass className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isSystemReady ? 'bg-green-500/20' : 'bg-yellow-500/20'
            }`}>
              <TrendingUp className={`w-5 h-5 ${isSystemReady ? 'text-green-400' : 'text-yellow-400'}`} />
            </div>
            <div>
              <div className="text-sm text-navy-400">Sistema</div>
              <div className={`text-sm font-medium ${
                isSystemReady ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {isSystemReady ? 'Pronto' : 'Carregando'}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}