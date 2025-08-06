'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { WorkoutLog, NutritionLog } from '@/types/fitness'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface WeeklySummaryData {
  name: string; // Day of the week
  workouts: number;
  calories: number;
}

export default function WeeklySummary() {
  const { user, isDemo } = useAuth()
  const [summaryData, setSummaryData] = useState<WeeklySummaryData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWeeklyData = async () => {
      setLoading(true);
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

      const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

      if (isDemo) {
        // Simulate demo data
        const demoSummary: WeeklySummaryData[] = daysOfWeek.map(day => ({
          name: format(day, 'EEE'),
          workouts: Math.floor(Math.random() * 3), // 0-2 workouts
          calories: Math.floor(Math.random() * 1000) + 1000, // 1000-2000 calories
        }));
        setSummaryData(demoSummary);
        setLoading(false);
        return;
      }

      const { data: workouts, error: workoutError } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd'))
        .lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd'));

      const { data: nutrition, error: nutritionError } = await supabase
        .from('nutrition_logs')
        .select('date, total_calories')
        .eq('user_id', user.id)
        .gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd'))
        .lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd'));

      if (workoutError) console.error('Error fetching weekly workouts:', workoutError.message);
      if (nutritionError) console.error('Error fetching weekly nutrition:', nutritionError.message);

      const aggregatedWorkouts: { [key: string]: number } = {};
      workouts?.forEach(log => {
        const dayKey = format(new Date(log.date), 'yyyy-MM-dd');
        aggregatedWorkouts[dayKey] = (aggregatedWorkouts[dayKey] || 0) + 1;
      });

      const aggregatedCalories: { [key: string]: number } = {};
      nutrition?.forEach(log => {
        const dayKey = format(new Date(log.date), 'yyyy-MM-dd');
        aggregatedCalories[dayKey] = (aggregatedCalories[dayKey] || 0) + (log.total_calories || 0);
      });

      const weeklySummary: WeeklySummaryData[] = daysOfWeek.map(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        return {
          name: format(day, 'EEE'), // Mon, Tue, etc.
          workouts: aggregatedWorkouts[dayKey] || 0,
          calories: aggregatedCalories[dayKey] || 0,
        };
      });

      setSummaryData(weeklySummary);
      setLoading(false);
    };

    fetchWeeklyData();
  }, [user, isDemo, supabase]);

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summaryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="workouts" fill="#8884d8" name="Workouts" />
            <Bar yAxisId="right" dataKey="calories" fill="#82ca9d" name="Calories" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
