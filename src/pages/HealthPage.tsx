
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp } from "lucide-react";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Monitoramento de Saúde 🏥
        </h1>
        <p className="text-gray-600 mt-1">Acompanhe suas métricas vitais e bem-estar</p>
      </div>

      <Tabs defaultValue="sleep" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Sono
          </TabsTrigger>
          <TabsTrigger value="heart" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Coração
          </TabsTrigger>
          <TabsTrigger value="hydration" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Hidratação
          </TabsTrigger>
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Peso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sleep">
          <SleepTracker />
        </TabsContent>

        <TabsContent value="heart">
          <HeartRateMonitor />
        </TabsContent>

        <TabsContent value="hydration">
          <HydrationTracker />
        </TabsContent>

        <TabsContent value="weight">
          <div className="text-center py-20 text-gray-500">
            <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Tracker de peso em desenvolvimento...</p>
            <p className="text-sm">Em breve você poderá monitorar seu peso e composição corporal</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
