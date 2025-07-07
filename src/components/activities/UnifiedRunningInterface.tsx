import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Square, Timer, MapPin, Zap, Mountain, Activity, Target,
  Navigation, AlertCircle, RefreshCw, Satellite, Map as MapIcon, Eye, EyeOff
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { useRunningTracker } from "@/hooks/useRunningTracker";
import { googleMapsService } from "@/services/GoogleMapsService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedRunningInterfaceProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function UnifiedRunningInterface({ onComplete, onCancel }: UnifiedRunningInterfaceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const mapContainer = useRef<HTMLDivElement>(null);

  const {
    isActive,
    isPaused,
    data,
    gpsState,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    isGPSReady
  } = useRunningTracker();

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

  // Funções de formatação
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number) => {
    if (pace === 0) return '--:--';
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Métricas principais
  const mainMetrics = [
    {
      icon: Timer,
      label: 'Tempo',
      value: formatTime(data.duration),
      color: 'blue',
      animate: isActive && !isPaused
    },
    {
      icon: MapPin,
      label: 'Distância',
      value: `${data.distance.toFixed(2)} km`,
      color: 'green',
      animate: data.distance > 0
    },
    {
      icon: Zap,
      label: 'Velocidade',
      value: `${(data.currentSpeed * 3.6).toFixed(1)} km/h`,
      color: 'yellow',
      animate: data.currentSpeed > 0
    },
    {
      icon: Target,
      label: 'Pace',
      value: `${formatPace(data.pace)}/km`,
      color: 'purple',
      animate: data.pace > 0
    },
    {
      icon: Mountain,
      label: 'Elevação',
      value: `${data.elevationGain.toFixed(0)}m`,
      color: 'red',
      animate: data.elevationGain > 0
    },
    {
      icon: Activity,
      label: 'Calorias',
      value: `${data.calories} kcal`,
      color: 'orange',
      animate: data.calories > 0
    }
  ];

  const getCardClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/20 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      red: 'bg-red-500/20 border-red-500/30 text-red-400',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // Inicializar mapa
  const initializeMap = async () => {
    if (!mapContainer.current || !googleMapsApiKey || loadingApiKey) return;

    try {
      setLoading(true);
      setError(null);
      
      await googleMapsService.loadGoogleMaps(googleMapsApiKey);
      
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
        fullscreenControl: false,
        mapTypeControl: false
      });

      setMapInstance(map);
      setMapLoaded(true);
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Erro ao inicializar Google Maps:', error);
      setError(`Erro ao carregar mapa: ${error.message || 'Erro desconhecido'}`);
      setLoading(false);
    }
  };

  // Inicializar quando API key estiver disponível
  useEffect(() => {
    if (googleMapsApiKey && !loadingApiKey && showMap) {
      initializeMap();
    }
  }, [googleMapsApiKey, loadingApiKey, showMap]);

  // Sincronizar posição GPS com mapa
  useEffect(() => {
    if (!mapLoaded || !mapInstance || !gpsState.position) return;

    try {
      const currentPos = new (window as any).google.maps.LatLng(
        gpsState.position.latitude,
        gpsState.position.longitude
      );

      if (isActive) {
        mapInstance.panTo(currentPos);
      }

      googleMapsService.addRoutePoint(currentPos);
    } catch (error) {
      console.error('❌ Erro ao sincronizar GPS:', error);
    }
  }, [gpsState.position, mapLoaded, mapInstance, isActive]);

  // Desenhar rota
  useEffect(() => {
    if (!mapLoaded || !data.gpsPoints.length || data.gpsPoints.length < 2) return;

    try {
      const googlePoints = data.gpsPoints.map(pos => 
        new (window as any).google.maps.LatLng(pos.latitude, pos.longitude)
      );

      googleMapsService.drawRoute(googlePoints);
    } catch (error) {
      console.error('❌ Erro ao desenhar rota:', error);
    }
  }, [data.gpsPoints, mapLoaded]);

  const handleComplete = async () => {
    try {
      const finalData = await stopActivity();
      onComplete({
        type: 'running',
        duration: finalData.duration,
        distance: finalData.distance,
        calories: finalData.calories,
        pace: finalData.avgPace,
        avg_heart_rate: finalData.heartRate,
        max_heart_rate: finalData.maxHeartRate,
        elevation_gain: finalData.elevationGain,
      });
    } catch (error) {
      console.error('Erro ao finalizar corrida:', error);
      onCancel();
    }
  };

  const handleStart = async () => {
    try {
      if (isPaused) {
        resumeActivity();
      } else {
        await startActivity();
      }
    } catch (error) {
      console.error('Erro ao iniciar corrida:', error);
      alert('Não foi possível iniciar a corrida. Verifique se o GPS está ativado.');
    }
  };

  const handleStop = () => {
    if (data.duration > 0) {
      handleComplete();
    } else {
      onCancel();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const changeMapType = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    if (!mapLoaded) return;
    
    try {
      googleMapsService.setMapType(type);
      setMapType(type);
    } catch (error) {
      console.error('❌ Erro ao alterar tipo de mapa:', error);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-navy-900 p-4 overflow-y-auto' : ''}`}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 glass-card-subtle mb-6 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="text-4xl"
            animate={{ scale: isActive && !isPaused ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive && !isPaused ? Infinity : 0 }}
          >
            🏃‍♂️
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">GPS Runner Premium</h1>
            <div className={`flex items-center gap-2 text-sm ${
              !gpsState.position ? 'text-red-400' :
              !gpsState.isHighAccuracy ? 'text-yellow-400' : 'text-green-400'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                !gpsState.position ? 'bg-red-400' :
                !gpsState.isHighAccuracy ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
              {!gpsState.position ? 'Aguardando sinal GPS...' :
               !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'GPS Preciso'}
              {gpsState.accuracy > 0 && (
                <span className="text-xs text-navy-400">
                  ({gpsState.accuracy.toFixed(0)}m)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedButton
            onClick={() => setShowMap(!showMap)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-accent-orange/20"
          >
            <MapIcon className="w-5 h-5" />
          </AnimatedButton>
          <AnimatedButton
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-accent-orange/20"
          >
            {isFullscreen ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Status da corrida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-6"
      >
        <h2 className="text-2xl font-bold text-white">Dashboard da Corrida</h2>
        <div className={`text-lg font-medium ${
          isActive ? (isPaused ? 'text-yellow-400' : 'text-green-400') : 'text-navy-400'
        }`}>
          {isActive ? (isPaused ? 'PAUSADO' : 'CORRENDO') : 'PARADO'}
        </div>
      </motion.div>

      {/* Layout principal */}
      <div className={`grid gap-6 ${showMap ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        
        {/* Métricas principais */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {mainMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumCard glass className="p-4 h-full">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`p-3 rounded-lg border ${getCardClasses(metric.color)}`}
                      animate={metric.animate ? { 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 0 0 rgba(255,255,255,0)',
                          '0 0 20px rgba(255,255,255,0.2)',
                          '0 0 0 rgba(255,255,255,0)'
                        ]
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: metric.animate ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <metric.icon className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-navy-400">{metric.label}</div>
                      <motion.div 
                        className="text-xl font-bold text-white truncate"
                        key={metric.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        {metric.value}
                      </motion.div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          {/* Status GPS */}
          <PremiumCard glass className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  gpsState.isReady && gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 
                  gpsState.position ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="text-sm font-medium text-white">Status GPS</div>
                  <div className="text-xs text-navy-400">
                    {gpsState.position ? 
                      `Precisão: ${gpsState.accuracy.toFixed(0)}m • ${data.gpsPoints.length} pontos` : 
                      'Aguardando sinal GPS...'}
                  </div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                gpsState.isReady && gpsState.isHighAccuracy ? 'text-green-400' : 
                gpsState.position ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {gpsState.isReady && gpsState.isHighAccuracy ? 'Excelente' :
                 gpsState.position ? 'Boa' : 'Sem Sinal'}
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Mapa */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Header do mapa */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Mapa da Corrida</h3>
                  <div className={`text-sm flex items-center gap-2 ${
                    mapLoaded && gpsState.position ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      mapLoaded && gpsState.position ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    {mapLoaded && gpsState.position ? 'Sistema Pronto' : 'Carregando...'}
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
                {(loading || !gpsState.position) && (
                  <div className="absolute inset-0 bg-navy-800 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-white font-medium">
                        {loading && !gpsState.position ? 'Carregando GPS + Mapa...' :
                         loading ? 'Carregando Mapa...' : 'Aguardando GPS...'}
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
                      <button 
                        onClick={initializeMap}
                        className="px-4 py-2 bg-accent-orange text-navy-900 rounded-lg font-medium hover:bg-accent-orange-light transition-colors flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Tentar novamente
                      </button>
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
                      <div className={`text-xs font-medium ${gpsState.position ? 'text-green-400' : 'text-red-400'}`}>
                        {gpsState.position ? 'Ativo' : 'Sem Sinal'}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles de atividade */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${isFullscreen ? 'fixed bottom-6 left-1/2 transform -translate-x-1/2' : 'mt-6'} 
                   flex gap-4 ${isFullscreen ? 'glass-card p-4 rounded-2xl' : ''}`}
      >
        {!isActive ? (
          <AnimatedButton 
            onClick={handleStart}
            disabled={!isGPSReady}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 text-lg font-semibold min-w-[200px]"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            {!gpsState.position ? 'Aguardando sinal GPS...' :
             !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'Iniciar Corrida'}
          </AnimatedButton>
        ) : (
          <>
            <AnimatedButton 
              onClick={isPaused ? handleStart : pauseActivity}
              variant="outline"
              className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              {isPaused ? <Play className="w-6 h-6 mr-3" /> : <Pause className="w-6 h-6 mr-3" />}
              {isPaused ? 'Retomar' : 'Pausar'}
            </AnimatedButton>
            
            <AnimatedButton 
              onClick={handleStop}
              variant={data.duration > 0 ? "default" : "destructive"}
              className={`flex-1 py-4 text-lg font-semibold ${
                data.duration > 0 
                  ? "bg-gradient-to-r from-accent-orange to-accent-orange-light text-navy-900" 
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white"
              }`}
              size="lg"
            >
              <Square className="w-6 h-6 mr-3" />
              {data.duration > 0 ? 'Finalizar' : 'Cancelar'}
            </AnimatedButton>
          </>
        )}
      </motion.div>

      {/* Indicador de status ativo */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${isFullscreen ? 'fixed top-4 right-4' : 'absolute top-4 right-4'} 
                     flex items-center gap-2 glass-card px-3 py-2 rounded-full`}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">
            {isPaused ? 'PAUSADO' : 'GRAVANDO'}
          </span>
          <Activity className="w-4 h-4 text-green-400" />
        </motion.div>
      )}
    </motion.div>
  );
}