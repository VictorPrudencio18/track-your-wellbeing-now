
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';

interface RunningMapProps {
  gpsState: GPSState;
  data: ActivityData;
  isActive: boolean;
  route: GPSPosition[];
}

export function RunningMap({ gpsState, data, isActive, route }: RunningMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapRef = useRef<any>(null);
  const [routeSource, setRouteSource] = useState<any>(null);

  // Simular mapa 3D quando não há token Mapbox
  const [simulatedCenter, setSimulatedCenter] = useState({ lat: -23.550520, lng: -46.633308 });

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    const initializeMap = async () => {
      const mapboxgl = await import('mapbox-gl');
      
      (mapboxgl as any).accessToken = mapboxToken;
      
      const map = new (mapboxgl as any).Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: gpsState.position ? [gpsState.position.longitude, gpsState.position.latitude] : [-46.633308, -23.550520],
        zoom: 16,
        pitch: 60,
        bearing: 0,
        antialias: true
      });

      map.on('load', () => {
        // Adicionar fonte da rota
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Adicionar camada da rota com gradiente de velocidade
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff6b6b',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Adicionar marcador da posição atual
        if (gpsState.position) {
          const el = document.createElement('div');
          el.className = 'current-position-marker';
          el.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4ade80;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(74, 222, 128, 0.8);
            animation: pulse 2s infinite;
          `;

          new (mapboxgl as any).Marker(el)
            .setLngLat([gpsState.position.longitude, gpsState.position.latitude])
            .addTo(map);
        }
      });

      mapRef.current = map;
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [mapboxToken, gpsState.position]);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (mapRef.current && route.length > 1) {
      const coordinates = route.map(pos => [pos.longitude, pos.latitude]);
      
      mapRef.current.getSource('route')?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });

      // Centralizar mapa na posição atual
      if (route.length > 0 && isActive) {
        const lastPos = route[route.length - 1];
        mapRef.current.easeTo({
          center: [lastPos.longitude, lastPos.latitude],
          duration: 1000
        });
      }
    }
  }, [route, isActive]);

  if (showTokenInput && !mapboxToken) {
    return (
      <PremiumCard className="p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Configurar Mapa Premium</h3>
        <p className="text-navy-400 mb-6">
          Para usar o mapa 3D interativo, insira seu token público do Mapbox
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Token público do Mapbox (pk.ey...)"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:border-accent-orange outline-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowTokenInput(false)}
              className="flex-1 px-4 py-2 bg-accent-orange text-navy-900 rounded-lg font-medium hover:bg-accent-orange/90 transition-colors"
            >
              Usar Mapa
            </button>
            <button
              onClick={() => setShowTokenInput(false)}
              className="px-4 py-2 text-navy-400 hover:text-white transition-colors"
            >
              Usar Visualização Simples
            </button>
          </div>
        </div>
        <p className="text-xs text-navy-500 mt-4">
          Obtenha seu token gratuito em{' '}
          <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-accent-orange hover:underline">
            mapbox.com
          </a>
        </p>
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
        {mapboxToken ? (
          <div ref={mapContainer} className="w-full h-full" />
        ) : (
          // Visualização simulada sem Mapbox
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
            
            {/* Posição atual */}
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
