
import { Activity, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityData {
  id: string;
  type: string;
  duration: string;
  distance?: string;
  date: string;
  calories?: number;
}

interface RecentActivityProps {
  activities: ActivityData[];
}

const activityIcons = {
  run: "🏃‍♂️",
  cycle: "🚴‍♂️",
  yoga: "🧘‍♀️",
  walk: "🚶‍♂️",
};

const activityColors = {
  run: "bg-red-100 text-red-700",
  cycle: "bg-blue-100 text-blue-700",
  yoga: "bg-purple-100 text-purple-700",
  walk: "bg-green-100 text-green-700",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activityColors[activity.type as keyof typeof activityColors]}`}>
                  <span className="text-lg">
                    {activityIcons[activity.type as keyof typeof activityIcons]}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium capitalize">{activity.type}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.duration}
                    </span>
                    {activity.distance && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.distance}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {activity.date}
                    </span>
                  </div>
                </div>
              </div>
              {activity.calories && (
                <div className="text-right">
                  <p className="font-medium">{activity.calories}</p>
                  <p className="text-sm text-gray-600">calorias</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
