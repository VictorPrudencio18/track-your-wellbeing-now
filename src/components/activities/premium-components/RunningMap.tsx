
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Mountain, Settings, Navigation, AlertCircle, RefreshCw, MapIcon } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState, GPSPosition } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';
import { tomTomMapsService } from '@/services/TomTomMapsService';

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
  const initAttempted = useRef(false);

  const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY as string;

  const initializeTomTomMaps = async () => {
    // Evitar múltiplas inicializações
    if (initAttempted.current) return;
    initAttempted.current = true;
    
    console.log('Inicializando TomTom Maps...');
    
    if (!mapContainer.current) {
      console.error('Container do mapa não encontrado');
      setError('Container do mapa não encontrado');
      setLoading(false);
      return;
    }

    if (!TOMTOM_API_KEY) {
      console.error('Chave da API do TomTom não configurada.');
      setError('Chave da API do TomTom não configurada. Verifique o arquivo .env.');
      setLoading(false);
      return;
    }
    
    console.log('Usando chave da API do TomTom:', TOMTOM_API_KEY.substring(0, 8) + '...');

    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando SDK do TomTom Maps...');
      await tomTomMapsService.loadTomTomMaps(TOMTOM_API_KEY);
      
      console.log('SDK carregado, criando instância do mapa...');
      
      // Usar posição atual do GPS se disponível, senão usar São Paulo
      const center = gpsState.position ? 
        [gpsState.position.longitude, gpsState.position.latitude] :
        [-46.633308, -23.550520]; // São Paulo

      const map = await tomTomMapsService.initializeMap(mapContainer.current, {
        apiKey: TOMTOM_API_KEY,
        center: center,
        zoom: 16
      });

      if (map) {
        setMapInstance(map);
        setMapLoaded(true);
        setLoading(false);
        setRetryCount(0);
        
        console.log('TomTom Maps inicializado com sucesso');
        
        // Se já temos posição GPS, adicionar marcador
        if (gpsState.position) {
          tomTomMapsService.addRoutePoint({
            lng: gpsState.position.longitude,
            lat: gpsState.position.latitude
          });
        }
      } else {
        throw new Error('Falha ao criar instância do mapa');
      }
    } catch (error: any) {
      console.error('Erro ao inicializar TomTom Maps:', error);
      setError(`Erro ao carregar mapa: ${error.message || 'Erro desconhecido'}`);
      setLoading(false);
      initAttempted.current = false; // Permitir nova tentativa
    }
  };

  // Inicializar mapa quando componente montar
  useEffect(() => {
    if (!initAttempted.current) {
      const timer = setTimeout(() => {
        initializeTomTomMaps();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Atualizar rota em tempo real
  useEffect(() => {
    if (!mapLoaded || !route.length) return;

    try {
      const tomTomPoints = route.map(pos => ({
        lng: pos.longitude,
        lat: pos.latitude
      }));

      if (tomTomPoints.length > 0) {
        console.log(`Atualizando rota com ${tomTomPoints.length} pontos`);
        tomTomMapsService.drawRoute(tomTomPoints);
        
        if (isActive && tomTomPoints.length > 0) {
          tomTomMapsService.addRoutePoint(tomTomPoints[tomTomPoints.length - 1]);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar rota TomTom:', error);
    }
  }, [route, isActive, mapLoaded]);

  // Centralizar mapa na posição atual
  useEffect(() => {
    if (mapInstance && gpsState.position && isActive) {
      try {
        const currentPos = {
          lng: gpsState.position.longitude,
          lat: gpsState.position.latitude
        };
        
        console.log('Centralizando mapa em:', currentPos);
        mapInstance.flyTo({
          center: [currentPos.lng, currentPos.lat],
          zoom: 16
        });
      } catch (error) {
        console.error('Erro ao centralizar mapa TomTom:', error);
      }
    }
  }, [gpsState.position, isActive, mapInstance]);

  const retryLoadMap = () => {
    if (retryCount < 3) {
      setError(null);
      setMapLoaded(false);
      setRetryCount(prev => prev + 1);
      initAttempted.current = false;
      initializeTomTomMaps();
    } else {
      setError('Muitas tentativas falharam. Verifique sua conexão com a internet.');
    }
  };

  const showGPSError = gpsState.error && !loading;
  const showMapError = error && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Status GPS */}
      {showGPSError && (
        <PremiumCard glass className="p-4 border-orange-500/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-orange-400 font-medium">Problema com GPS</p>
              <p className="text-sm text-navy-400">{gpsState.error}</p>
            </div>
          </div>
        </PremiumCard>
      )}

      {/* Status de inicialização */}
      {!gpsState.position && !showGPSError && (
        <PremiumCard glass className="p-4 border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <p className="text-blue-400 font-medium">Aguardando GPS</p>
              <p className="text-sm text-navy-400">O mapa será carregado após obter localização</p>
            </div>
          </div>
        </PremiumCard>
      )}

      {/* Mapa principal */}
      <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
        {loading && (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-white font-medium">Carregando TomTom Maps...</p>
              <p className="text-navy-400 text-sm mt-1">
                {retryCount > 0 ? `Tentativa ${retryCount + 1}/4` : 'Aguarde um momento...'}
              </p>
            </div>
          </div>
        )}

        {showMapError && (
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
                <div className="space-y-2">
                  <p className="text-red-400 text-sm">Limite de tentativas atingido</p>
                  <p className="text-navy-400 text-xs">Verifique sua conexão com a internet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Container do mapa - sempre presente */}
        <div 
          ref={mapContainer} 
          className={`w-full h-full ${loading || showMapError ? 'absolute inset-0 opacity-0' : 'block'}`}
          style={{ minHeight: '384px' }}
        />
        
        {/* Overlay de informações */}
        {mapLoaded && !showMapError && (
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
              <div className="text-xs text-navy-400">TomTom</div>
              <div className="text-xs font-medium text-accent-orange">Premium GPS</div>
            </div>
          </div>
        )}

        {/* Status do GPS */}
        <div className="absolute bottom-4 left-4">
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
        {mapLoaded && !showMapError && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button 
              onClick={() => tomTomMapsService.setMapType('roadmap')}
              className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title="Mapa Normal"
            >
              <MapIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => tomTomMapsService.setMapType('satellite')}
              className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              title="Satélite"
            >
              <Mountain className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
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

      {/* Informações sobre TomTom */}
      <PremiumCard glass className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-orange/20 rounded-lg border border-accent-orange/30">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">TomTom Maps Premium</div>
              <div className="text-xs text-navy-400">
                {mapLoaded ? 'Mapa carregado' : 'Carregando mapa...'}
                {gpsState.position && ` • GPS: ${gpsState.accuracy.toFixed(0)}m`}
              </div>
            </div>
          </div>
          <div className="text-xs text-accent-orange font-medium">
            {route.length > 0 ? 'Ativo' : 'Aguardando'}
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
