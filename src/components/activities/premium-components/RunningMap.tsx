
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
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const routePointsRef = useRef<google.maps.LatLng[]>([]);

  const initializeGoogleMaps = async () => {
    if (!googleMapsKey || !mapContainer.current) return;

    try {
      await googleMapsService.loadGoogleMaps(googleMapsKey);
      
      const map = await googleMapsService.initializeMap(mapContainer.current, {
        zoom: 16,
        center: gpsState.position ? 
          { lat: gpsState.position.latitude, lng: gpsState.position.longitude } :
          { lat: -23.550520, lng: -46.633308 }, // São Paulo default
        mapTypeId: google.maps.MapTypeId.HYBRID,
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

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length) return;

    const googlePoints = route.map(pos => 
      new google.maps.LatLng(pos.latitude, pos.longitude)
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
      const currentPos = new google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );
      mapInstance.panTo(currentPos);
    }
  }, [gpsState.position, isActive, mapInstance]);

  if (showKeyInput && !googleMapsKey) {
    return (
      <PremiumCard className="p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Configurar Google Maps</h3>
        <p className="text-navy-400 mb-6">
          Para usar o mapa GPS premium, insira sua chave da API do Google Maps
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Chave da API do Google Maps (AIza...)"
            value={googleMapsKey}
            onChange={(e) => setGoogleMapsKey(e.target.value)}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:border-accent-orange outline-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                initializeGoogleMaps();
                setShowKeyInput(false);
              }}
              disabled={!googleMapsKey}
              className="flex-1 px-4 py-2 bg-accent-orange text-navy-900 rounded-lg font-medium hover:bg-accent-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inicializar Mapa
            </button>
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-4 py-2 text-navy-400 hover:text-white transition-colors"
            >
              Usar Visualização Simples
            </button>
          </div>
        </div>
        <div className="text-xs text-navy-500 mt-4 space-y-1">
          <p>
            Obtenha sua chave gratuita em{' '}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent-orange hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
          <p>• Ative as APIs: Maps JavaScript API, Elevation API</p>
          <p>• Configure restrições de domínio para segurança</p>
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
      {/* Mapa principal */}
      <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
        {mapLoaded && googleMapsKey ? (
          <div ref={mapContainer} className="w-full h-full" />
        ) : googleMapsKey ? (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white">Carregando Google Maps...</p>
            </div>
          </div>
        ) : (
          // Visualização simulada sem API
          <div className="w-full h-full bg-gradient-to-br from-green-900/30 via-blue-900/30 to-purple-900/30 relative overflow-hidden">
            {/* Grid de fundo */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }, (_, i) => (
                  <div key={i} className="border border-white/10"></div>
                ))}
              </div>
            </div>
            
            {/* Rota simulada */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              {route.length > 1 && (
                <motion.path
                  d={`M ${route.map((_, i) => {
                    const x = 50 + (i / route.length) * 300;
                    const y = 200 + Math.sin(i * 0.1) * 50;
                    return `${x},${y}`;
                  }).join(' L ')}`}
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
              )}
            </svg>
            
            {/* Posição atual simulada */}
            {isActive && (
              <motion.div
                className="absolute w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: `${50 + (route.length / 100) * 300}px`,
                  top: `${200 + Math.sin(route.length * 0.1) * 50}px`
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
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
          <button 
            onClick={() => setShowKeyInput(true)}
            className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
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
