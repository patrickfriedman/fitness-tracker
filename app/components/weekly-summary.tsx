"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { WorkoutLog, NutritionLog } from '@/types/fitness'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeeklySummaryProps {
  initialWorkoutLogs: WorkoutLog[];
  initialNutritionLogs: NutritionLog[];
}

export default function WeeklySummary({ initialWorkoutLogs, initialNutritionLogs }: WeeklySummaryProps) {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  const summaryData = weekDays.map(date => {
    const dateString = format(date, 'yyyy-MM-dd');
    const workoutsToday = initialWorkoutLogs.filter(log => isSameDay(new Date(log.log_date), date));
    const nutritionToday = initialNutritionLogs.filter(log => isSameDay(new Date(log.log_date), date));

    const totalWorkoutDuration = workoutsToday.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    const totalCaloriesConsumed = nutritionToday.reduce((sum, log) => sum + log.calories, 0);

    return {
      name: format(date, 'EEE'), // Mon, Tue, etc.
      date: dateString,
      workouts: workoutsToday.length,
      duration: totalWorkoutDuration,
      calories: totalCaloriesConsumed,
    };
  });

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="duration" fill="#8884d8" name="Workout Duration (min)" />
              <Bar yAxisId="right" dataKey="calories" fill="#82ca9d" name="Calories Consumed (kcal)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold">Workouts:</h4>
            {summaryData.map((day, index) => (
              <p key={index}>{day.name}: {day.workouts} workouts ({day.duration} min)</p>
            ))}
          </div>
          <div>
            <h4 className="font-semibold">Nutrition:</h4>
            {summaryData.map((day, index) => (
              <p key={index}>{day.name}: {day.calories} kcal</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
