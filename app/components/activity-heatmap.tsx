"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { WorkoutLog } from '@/types/fitness'
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, addDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface ActivityHeatmapProps {
  initialWorkoutLogs: WorkoutLog[];
}

export default function ActivityHeatmap({ initialWorkoutLogs }: ActivityHeatmapProps) {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  const getWorkoutIntensity = (date: Date) => {
    const logsOnDate = initialWorkoutLogs.filter(log =>
      isSameDay(new Date(log.log_date), date)
    );
    if (logsOnDate.length === 0) return 'none';
    if (logsOnDate.length === 1) return 'light';
    if (logsOnDate.length <= 3) return 'medium';
    return 'heavy';
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Weekly Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {weekDays.map((date, index) => {
            const intensity = getWorkoutIntensity(date);
            return (
              <div
                key={index}
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold',
                  {
                    'bg-gray-200 dark:bg-gray-700': intensity === 'none',
                    'bg-green-200 dark:bg-green-700': intensity === 'light',
                    'bg-green-400 dark:bg-green-600': intensity === 'medium',
                    'bg-green-600 dark:bg-green-500': intensity === 'heavy',
                  }
                )}
                title={`${format(date, 'PPP')}: ${intensity === 'none' ? 'No workouts' : `${initialWorkoutLogs.filter(log => isSameDay(new Date(log.log_date), date)).length} workouts`}`}
              >
                {format(date, 'd')}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
