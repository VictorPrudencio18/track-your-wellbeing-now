
import { Play, Pause, Square, Mountain, Gauge, MapPin, Wind, Zap, Loader2, X, AlertTriangle, PauseCircle, Repeat, Bolt } from "lucide-react"; // Added Repeat, Bolt, removed Droplets
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunningMap } from './premium-components/RunningMap';
import { useActivityTracker, ActivityData } from '@/hooks/useActivityTracker';
import { GPSState } from '@/hooks/useGPS';

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
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
  } = useActivityTracker('cycling');

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onComplete({
      type: 'cycle',
      name: 'Ciclismo GPS',
      duration: data.duration,
      distance: data.distance,
      calories: data.calories,
      avgSpeed: data.avgSpeed, // Use avgSpeed from hook
      elevationGain: data.elevationGain, // Use elevationGain from hook
      date: new Date(),
      gpsPoints: data.gpsPoints,
    });
    stopActivity();
  };

  const handlePrimaryAction = () => {
    if (!isActive) {
      startActivity();
    } else if (isPaused) {
      resumeActivity();
    } else {
      pauseActivity();
    }
  };

  const avgSpeedKmh = (data.duration > 0 ? (data.distance / (data.duration / 3600)) : 0).toFixed(1);
  const currentSpeedKmh = (data.currentSpeed * 3.6).toFixed(1);

  return (
    <div className="relative p-4 space-y-4 bg-gray-50 min-h-screen"> {/* Added relative positioning */}
      {/* Header */}
      <header className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Wind className="w-7 h-7 mr-2 text-blue-600" />
          Ciclismo
        </h1>
        {/* Placeholder for status indicators like GPS signal, battery, etc. */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isGPSReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} title={isGPSReady ? "GPS Pronto" : "Aguardando GPS..."}></div>
          {/* Could add more indicators here */}
        </div>
      </header>

      {/* Main Content: Two Panels */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Panel: Map */}
        <div className="md:w-3/5 w-full rounded-lg shadow-lg overflow-hidden">
          <RunningMap
            gpsState={gpsState}
            data={data}
            isActive={isActive && !isPaused}
            route={data.gpsPoints || []}
          />
        </div>

        {/* Right Panel: Metrics & Controls */}
        <div className="md:w-2/5 w-full space-y-4">
          {/* Primary Metrics */}
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-around text-center">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Tempo</span>
                  <div className="text-4xl font-bold text-gray-800">{formatTime(data.duration)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Distância</span>
                  <div className="text-4xl font-bold text-gray-800">{data.distance.toFixed(2)} <span className="text-xl">km</span></div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase">Velocidade Atual</span>
                <div className="text-6xl font-bold text-gray-800">{currentSpeedKmh} <span className="text-2xl">km/h</span></div> {/* Changed text-blue-600 to text-gray-800 */}
              </div>
            </CardContent>
          </Card>

          {/* Secondary Metrics */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Detalhes da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm"> {/* Changed gap-y-3 to gap-y-4 */}
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-xs text-gray-500">Elevação</span>
                  <div className="font-medium text-gray-700">{data.elevationGain.toFixed(0)} m</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-xs text-gray-500">Calorias</span>
                  <div className="font-medium text-gray-700">{data.calories} kcal</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-xs text-gray-500">Vel. Média</span>
                  <div className="font-medium text-gray-700">{avgSpeedKmh} km/h</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-xs text-gray-500">Precisão GPS</span>
                  <div className="font-medium text-gray-700">{gpsState.accuracy ? gpsState.accuracy.toFixed(0) + ' m' : 'N/A'}</div>
                </div>
              </div>
               {data.cadence !== undefined && (
                <div className="flex items-center space-x-2">
                  <Repeat className="w-5 h-5 text-gray-600" /> {/* Changed Droplets to Repeat for Cadence */}
                  <div>
                    <span className="text-xs text-gray-500">Cadência</span>
                    <div className="font-medium text-gray-700">{data.cadence} RPM</div>
                  </div>
                </div>
              )}
              {data.power !== undefined && (
                 <div className="flex items-center space-x-2">
                   <Bolt className="w-5 h-5 text-gray-600" /> {/* Changed Zap to Bolt for Power */}
                   <div>
                     <span className="text-xs text-gray-500">Potência</span>
                     <div className="font-medium text-gray-700">{data.power} W</div>
                   </div>
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-3 pt-2">
            {!isGPSReady && !isActive && (
              <div className="flex items-center justify-center text-sm text-yellow-600 p-2 bg-yellow-50 border border-yellow-300 rounded-md">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Aguardando sinal GPS estável para iniciar...
              </div>
            )}
            <Button
              onClick={handlePrimaryAction}
              className={`w-full text-lg py-6 flex items-center justify-center gap-2
                ${!isActive ? 'bg-green-600 hover:bg-green-700'
                  : isPaused ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-orange-500 hover:bg-orange-600'} text-white`}
              disabled={!isGPSReady && !isActive}
            >
              {!isActive ? <Play className="w-6 h-6" /> : isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              {!isActive ? "Iniciar Pedalada" : isPaused ? "Retomar" : "Pausar"}
            </Button>
            
            <Button 
              onClick={data.duration > 0 ? handleComplete : () => { stopActivity(); onCancel(); }}
              variant={data.duration > 0 ? "destructive" : "outline"}
              className="w-full text-lg py-6 border-gray-300"
              disabled={isActive && !isPaused} // Disable finish if active and not paused
            >
              {data.duration > 0 ? <Square className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
              {data.duration > 0 ? "Finalizar e Salvar" : "Cancelar Atividade"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pause State Overlay */}
      {isActive && isPaused && (
        <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
          <PauseCircle className="w-20 h-20 text-white mb-6 opacity-90" />
          <p className="text-white text-3xl font-bold tracking-wider">ATIVIDADE PAUSADA</p>
        </div>
      )}
    </div>
  );
}
