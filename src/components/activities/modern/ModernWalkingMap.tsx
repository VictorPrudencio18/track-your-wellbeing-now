
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { googleMapsService } from '@/services/GoogleMapsService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ModernWalkingMapProps {
  gpsState: GPSState;
  isActive: boolean;
  route: GPSPosition[];
  distance: number;
  currentSpeed: number;
}

export function ModernWalkingMap({ gpsState, isActive, route, distance, currentSpeed }: ModernWalkingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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
      
      console.log('Carregando Google Maps para caminhada...');
      await googleMapsService.loadGoogleMaps(googleMapsApiKey);
      
      console.log('Inicializando mapa de caminhada...');
      const initialCenter = gpsState.position ? 
        { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
        { lat: -23.550520, lng: -46.633308 };

      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: initialCenter,
        mapTypeId: (window as any).google?.maps?.MapTypeId?.ROADMAP,
        gestureHandling: 'greedy',
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false
      });

      setMapInstance(map);
      setMapLoaded(true);
      setLoading(false);
      setRetryCount(0);
      
      console.log('Google Maps inicializado com sucesso para caminhada');
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

  // Sincronizar posição GPS com o mapa em tempo real
  useEffect(() => {
    if (!mapLoaded || !mapInstance || !gpsState.position) return;

    try {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );

      // Centralizar mapa na posição atual se estiver ativo
      if (isActive) {
        mapInstance.panTo(currentPos);
      }

      // Adicionar marcador da posição atual
      googleMapsService.addRoutePoint(currentPos);
      
      console.log(`GPS sincronizado com mapa: lat=${gpsState.position.latitude.toFixed(6)}, lng=${gpsState.position.longitude.toFixed(6)}`);
    } catch (error) {
      console.error('Erro ao sincronizar GPS com mapa:', error);
    }
  }, [gpsState.position, mapLoaded, mapInstance, isActive]);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length || !(window as any).google || route.length < 2) return;

    try {
      const googlePoints = route.map(pos => 
        new (window as any).google.maps.LatLng(pos.latitude, pos.longitude)
      );

      console.log(`Atualizando rota de caminhada com ${googlePoints.length} pontos`);
      googleMapsService.drawRoute(googlePoints);
    } catch (error) {
      console.error('Erro ao atualizar rota de caminhada:', error);
    }
  }, [route, mapLoaded]);

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

  // Estado combinado de GPS + Mapa
  const isGPSReady = gpsState.position !== null;
  const isSystemReady = mapLoaded && isGPSReady;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-xl font-bold text-white">Mapa da Caminhada - Google Maps</h3>
        <div className={`text-sm flex items-center gap-2 mt-1 ${
          isSystemReady ? 'text-green-400' : 'text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isSystemReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
          }`}></div>
          {isSystemReady ? 'Sistema GPS + Mapa Pronto' : 
           loading ? 'Carregando Mapa...' : 
           !isGPSReady ? 'Aguardando GPS...' : 'Inicializando...'}
        </div>
      </div>

      {/* Mapa principal */}
      <div className="relative h-80 rounded-2xl overflow-hidden glass-card">
        {(loading || !isGPSReady) && (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white font-medium">
                {loading && !isGPSReady ? 'Carregando GPS + Google Maps...' :
                 loading ? 'Carregando Google Maps...' : 'Aguardando sinal GPS...'}
              </p>
              <p className="text-navy-400 text-sm mt-1">
                {retryCount > 0 ? `Tentativa ${retryCount + 1}/4` : 
                 gpsState.isTracking ? 'GPS em busca de sinal...' : 'Iniciando GPS...'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
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
          className={`w-full h-full ${(loading && !mapLoaded) || error ? 'absolute inset-0 opacity-0' : 'block'}`}
          style={{ minHeight: '320px' }}
        />
        
        {/* Overlay de informações */}
        {mapLoaded && !error && (
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Distância</div>
              <div className="text-lg font-bold text-white">{distance.toFixed(2)} km</div>
            </div>
            
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Velocidade</div>
              <div className="text-lg font-bold text-white">{(currentSpeed * 3.6).toFixed(1)} km/h</div>
            </div>

            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="text-xs text-navy-400">Status GPS</div>
              <div className={`text-xs font-medium ${isGPSReady ? 'text-green-400' : 'text-red-400'}`}>
                {isGPSReady ? 'GPS Ativo' : 'Sem Sinal'}
              </div>
            </div>
          </div>
        )}

        {/* Status do GPS */}
        <div className="absolute bottom-4 left-4">
          <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              gpsState.isReady && gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 
              gpsState.position ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-white">
              GPS: {gpsState.position ? `${gpsState.accuracy.toFixed(0)}m` : 'Sem sinal'}
            </span>
          </div>
        </div>

        {/* Controle de centralização */}
        {mapLoaded && !error && (
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={() => {
                if (mapInstance && gpsState.position) {
                  const currentPos = new (window as any).google.maps.LatLng(
                    gpsState.position.latitude,
                    gpsState.position.longitude
                  );
                  mapInstance.setCenter(currentPos);
                  mapInstance.setZoom(16);
                }
              }}
              disabled={!gpsState.position}
              className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Centralizar no GPS"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Informações da rota */}
      <div className="grid grid-cols-2 gap-4">
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
              <div className="text-sm text-navy-400">Precisão GPS</div>
              <div className="text-xl font-bold text-white">
                {gpsState.position ? `${gpsState.accuracy.toFixed(0)}m` : 'N/A'}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
