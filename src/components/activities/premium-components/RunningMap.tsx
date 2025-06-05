
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain, Settings } from 'lucide-react';
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
  const routePointsRef = useRef<any[]>([]);

  // Usar a nova chave API fornecida
  const GOOGLE_MAPS_API_KEY = 'AIzaSyC4n6Y17OX0PIFYgeL64ibC4ISqQkOxUok';

  const initializeGoogleMaps = async () => {
    if (!mapContainer.current) return;

    try {
      await googleMapsService.loadGoogleMaps(GOOGLE_MAPS_API_KEY);
      
      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: gpsState.position ? 
          { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
          { lat: -23.550520, lng: -46.633308 }, // São Paulo default
        mapTypeId: (window as any).google.maps.MapTypeId.HYBRID,
        gestureHandling: 'greedy',
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false
      });

      setMapInstance(map);
      setMapLoaded(true);
      
      console.log('Google Maps inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar Google Maps:', error);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Mapa principal */}
      <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
        {mapLoaded ? (
          <div ref={mapContainer} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white">Carregando Google Maps...</p>
            </div>
          </div>
        )}
        
        {/* Overlay de informações */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="glass-card px-3 py-2 rounded-lg">
            <div className="text-xs text-navy-400">Distância</div>
            <div className="text-lg font-bold text-white">{data.distance.toFixed(2)} km</div>
          </div>
          
          <div className="glass-card px-3 py-2 rounded-lg">
            <div className="text-xs text-navy-400">Velocidade</div>
            <div className="text-lg font-bold text-white">{(data.currentSpeed * 3.6).toFixed(1)} km/h</div>
          </div>
        </div>

        {/* Controles do mapa */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
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
              <div className="text-xl font-bold text-white">{gpsState.accuracy.toFixed(0)}m</div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
