
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile } from "lucide-react";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Monitoramento de Saúde Vital 🏥
        </h1>
        <p className="text-gray-600 mt-1">Acompanhe suas métricas vitais e bem-estar completo</p>
      </div>

      <Tabs defaultValue="sleep" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Smile className="w-4 h-4" />
            Humor
          </TabsTrigger>
          <TabsTrigger value="pressure" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Pressão
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
          <WeightTracker />
        </TabsContent>

        <TabsContent value="mood">
          <MoodTracker />
        </TabsContent>

        <TabsContent value="pressure">
          <BloodPressureTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
