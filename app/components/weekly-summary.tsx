'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Loader2, BarChart, Activity, Utensils, Scale } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface WeeklySummaryData {
  totalWorkouts: number;
  totalWorkoutDuration: number; // minutes
  totalCaloriesConsumed: number;
  averageWeight: number;
}

export default function WeeklySummary() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<WeeklySummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  const fetchWeeklySummary = async () => {
    if (!user?.id) return
    setLoading(true)

    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())) // Sunday
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)) // Saturday

    const startDate = startOfWeek.toISOString().split('T')[0]
    const endDate = endOfWeek.toISOString().split('T')[0]

    try {
      // Fetch workout logs
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_logs')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)

      if (workoutError) throw workoutError

      // Fetch nutrition logs
      const { data: nutritionData, error: nutritionError } = await supabase
        .from('nutrition_logs')
        .select('total_calories')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)

      if (nutritionError) throw nutritionError

      // Fetch body metrics
      const { data: bodyMetricData, error: bodyMetricError } = await supabase
        .from('body_metrics')
        .select('weight')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false }) // Get most recent for average

      if (bodyMetricError) throw bodyMetricError

      const totalWorkouts = workoutData.length
      const totalWorkoutDuration = workoutData.reduce((sum, log) => sum + (log.duration_minutes || 0), 0)
      const totalCaloriesConsumed = nutritionData.reduce((sum, log) => sum + (log.total_calories || 0), 0)
      const averageWeight = bodyMetricData.length > 0
        ? bodyMetricData.reduce((sum, metric) => sum + (metric.weight || 0), 0) / bodyMetricData.length
        : 0

      setSummary({
        totalWorkouts,
        totalWorkoutDuration,
        totalCaloriesConsumed,
        averageWeight,
      })

    } catch (error: any) {
      console.error('Error fetching weekly summary:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to load weekly summary.',
        variant: 'destructive',
      })
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeeklySummary()
  }, [user])

  return (
    <Card className="widget-card col-span-full md:col-span-1">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent className="widget-content space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : summary ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Workouts</p>
                <p className="text-lg font-bold">{summary.totalWorkouts}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-lg font-bold">{summary.totalWorkoutDuration} min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Calories</p>
                <p className="text-lg font-bold">{summary.totalCaloriesConsumed.toFixed(0)} kcal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg. Weight</p>
                <p className="text-lg font-bold">
                  {summary.averageWeight.toFixed(1)}{' '}
                  {user?.preferences?.units === 'metric' ? 'kg' : 'lbs'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No data for this week yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
