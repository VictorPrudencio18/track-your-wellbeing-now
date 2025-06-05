
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain, Settings, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';
import { googleMapsService } from '@/services/GoogleMapsService';

interface RunningMapProps {
  gpsState: GPSState;
  data: ActivityData;
  isActive: boolean;
  route: GPSPosition[];
}

export function RunningMap({ gpsState, data, isActive, route }: RunningMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const routePointsRef = useRef<any[]>([]);

  // Usar a nova chave API fornecida
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const initializeGoogleMaps = async () => {
    if (!mapContainer.current) return;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Chave da API do Google Maps não configurada.');
      setError('Chave da API do Google Maps não configurada. Verifique o arquivo .env.');
      setLoading(false);
      return;
    }
    // For debugging: Log that the key is being used (do not log the key itself in production)
    console.log('Usando chave da API do Google Maps do ambiente.');

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
      
      console.log('Google Maps inicializado com sucesso');
    } catch (error: any) {
      console.error('Erro ao inicializar Google Maps:', error);
      setError(`Erro ao carregar mapa: ${error.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  // Inicializar mapa automaticamente
  useEffect(() => {
    initializeGoogleMaps();
  }, []);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length || !(window as any).google) return;

    try {
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
    } catch (error) {
      console.error('Erro ao atualizar rota:', error);
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
        console.error('Erro ao centralizar mapa:', error);
      }
    }
  }, [gpsState.position, isActive, mapInstance]);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Mapa principal */}
      <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
        {/* Map container div is always present for the ref */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 w-full h-full bg-navy-800 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white">Carregando Google Maps...</p>
              {retryCount > 0 && (
                <p className="text-navy-400 text-sm">Tentativa {retryCount + 1}/4</p>
              )}
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && !loading && ( // Ensure error doesn't show if still in initial load
          <div className="absolute inset-0 w-full h-full bg-navy-800 flex items-center justify-center z-10">
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

        {/* Overlays for map information (distance, speed, GPS status, controls) */}
        {/* These should only be visible if the map IS loaded and there's no error/initial loading */}
        {mapLoaded && !loading && !error && (
          <>
            {/* Overlay de informações (Distância, Velocidade) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-0"> {/* Ensure z-index is lower than loading/error overlays */}
              <div className="glass-card px-3 py-2 rounded-lg">
                <div className="text-xs text-navy-400">Distância</div>
                <div className="text-lg font-bold text-white">{data.distance.toFixed(2)} km</div>
              </div>

              <div className="glass-card px-3 py-2 rounded-lg">
                <div className="text-xs text-navy-400">Velocidade</div>
                <div className="text-lg font-bold text-white">{(data.currentSpeed * 3.6).toFixed(1)} km/h</div>
              </div>
            </div>
            {/* Status do GPS */}
            <div className="absolute bottom-4 left-4 z-0">
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
            {/* Controles do mapa */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-0">
              <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Métricas da rota */}
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
