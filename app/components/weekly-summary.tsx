'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Helper to get dates for the last 7 days
const getLast7Days = () => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0]) // YYYY-MM-DD
  }
  return dates
}

export default function WeeklySummary() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [summaryData, setSummaryData] = useState({
    workouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgMood: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        // Simulate demo data
        setSummaryData({
          workouts: Math.floor(Math.random() * 5) + 2,
          totalDuration: Math.floor(Math.random() * 200) + 100,
          totalCalories: Math.floor(Math.random() * 1500) + 500,
          avgMood: parseFloat((Math.random() * 4 + 1).toFixed(1)),
        })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const last7Days = getLast7Days()
      const startDate = last7Days[0]
      const endDate = last7Days[last7Days.length - 1]

      try {
        // Fetch workout logs
        const { data: workouts, error: workoutError } = await supabase
          .from('workout_logs')
          .select('duration_minutes, calories_burned')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        // Fetch nutrition logs
        const { data: nutrition, error: nutritionError } = await supabase
          .from('nutrition_logs')
          .select('total_calories')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        // Fetch mood logs
        const { data: moods, error: moodError } = await supabase
          .from('mood_logs')
          .select('mood_score')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        if (workoutError || nutritionError || moodError) {
          console.error('Error fetching weekly summary:', workoutError || nutritionError || moodError)
          toast({
            title: 'Error',
            description: 'Failed to load weekly summary.',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }

        const totalWorkouts = workouts?.length || 0
        const totalDuration = workouts?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) || 0
        const totalCaloriesConsumed = nutrition?.reduce((sum, n) => sum + (n.total_calories || 0), 0) || 0
        const avgMood = moods?.length > 0 ? (moods.reduce((sum, m) => sum + (m.mood_score || 0), 0) / moods.length) : 0

        setSummaryData({
          workouts: totalWorkouts,
          totalDuration: totalDuration,
          totalCalories: totalCaloriesConsumed,
          avgMood: parseFloat(avgMood.toFixed(1)),
        })
      } catch (error) {
        console.error('Unexpected error in weekly summary:', error)
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading summary.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklySummary()
  }, [user, supabase, toast])

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart className="h-6 w-6 text-blue-500" />
          <p className="text-lg">
            <span className="font-bold">{summaryData.workouts}</span> Workouts Logged
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">⏱️</span>
          <p className="text-lg">
            <span className="font-bold">{summaryData.totalDuration.toFixed(0)}</span> Minutes Exercised
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">🍔</span>
          <p className="text-lg">
            <span className="font-bold">{summaryData.totalCalories.toFixed(0)}</span> Calories Consumed
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">😊</span>
          <p className="text-lg">
            Average Mood: <span className="font-bold">{summaryData.avgMood}</span>/5
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
