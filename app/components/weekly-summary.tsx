"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { CalendarDays } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from "date-fns"

export function WeeklySummary() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [summaryData, setSummaryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchWeeklySummary()
    }
  }, [user?.id])

  const fetchWeeklySummary = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = new Date()
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }) // Monday
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 })

      const startOfLastWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 })
      const endOfLastWeek = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 })

      // Fetch workout logs for current week
      const { data: currentWeekWorkouts, error: currentWorkoutError } = await supabase
        .from('workout_logs')
        .select('date, duration_minutes, calories_burned')
        .eq('user_id', user.id)
        .gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd'))
        .lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd'))

      if (currentWorkoutError) throw currentWorkoutError

      // Fetch workout logs for last week
      const { data: lastWeekWorkouts, error: lastWorkoutError } = await supabase
        .from('workout_logs')
        .select('date, duration_minutes, calories_burned')
        .eq('user_id', user.id)
        .gte('date', format(startOfLastWeek, 'yyyy-MM-dd'))
        .lte('date', format(endOfLastWeek, 'yyyy-MM-dd'))

      if (lastWorkoutError) throw lastWorkoutError

      // Aggregate data
      const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek })
      const aggregatedData = daysOfWeek.map(day => {
        const dayKey = format(day, 'EEE') // Mon, Tue, etc.
        const dateString = format(day, 'yyyy-MM-dd')

        const dailyWorkouts = (currentWeekWorkouts || []).filter(w => w.date === dateString)
        const totalDuration = dailyWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0)
        const totalCaloriesBurned = dailyWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0)

        return {
          name: dayKey,
          duration: totalDuration,
          calories: totalCaloriesBurned,
        }
      })

      setSummaryData(aggregatedData)
    } catch (error: any) {
      console.error("Error fetching weekly summary:", error.message)
      toast({
        title: "Error",
        description: "Failed to load weekly summary.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" name="Workout Duration (min)" />
                {/* <Bar dataKey="calories" fill="#82ca9d" name="Calories Burned" /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Total workouts this week: {summaryData.filter(d => d.duration > 0).length}
        </p>
      </CardContent>
    </Card>
  )
}
