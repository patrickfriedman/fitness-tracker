"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Activity } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

// Helper to generate a random intensity for demonstration
const getRandomIntensity = () => Math.floor(Math.random() * 5) // 0-4

export function ActivityHeatmap() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activityData, setActivityData] = useState<Map<string, number>>(new Map()) // Map of 'YYYY-MM-DD' to intensity
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && date) {
      fetchActivityData(date)
    }
  }, [user?.id, date])

  const fetchActivityData = async (selectedDate: Date) => {
    if (!user?.id) return

    setLoading(true)
    try {
      const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
      const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd')

      // Fetch workout logs
      const { data: workoutLogs, error: workoutError } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)

      if (workoutError) throw workoutError

      // Fetch nutrition logs
      const { data: nutritionLogs, error: nutritionError } = await supabase
        .from('nutrition_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)

      if (nutritionError) throw nutritionError

      // Fetch body metrics
      const { data: bodyMetrics, error: metricsError } = await supabase
        .from('body_metrics')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)

      if (metricsError) throw metricsError

      // Combine and count activities
      const combinedDates = [
        ...(workoutLogs || []).map(log => log.date),
        ...(nutritionLogs || []).map(log => log.date),
        ...(bodyMetrics || []).map(log => log.date),
      ]

      const counts = new Map<string, number>()
      combinedDates.forEach(d => {
        const dateKey = format(new Date(d), 'yyyy-MM-dd')
        counts.set(dateKey, (counts.get(dateKey) || 0) + 1)
      })

      // Convert counts to intensity (simple mapping for now)
      const newActivityData = new Map<string, number>()
      const daysInMonth = eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) })

      daysInMonth.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd')
        const activityCount = counts.get(dateKey) || 0
        let intensity = 0
        if (activityCount > 0) intensity = 1 // At least one activity
        if (activityCount >= 2) intensity = 2 // Two or more activities
        if (activityCount >= 4) intensity = 3 // Four or more activities
        if (activityCount >= 6) intensity = 4 // Six or more activities (high activity)
        newActivityData.set(dateKey, intensity)
      })

      setActivityData(newActivityData)
    } catch (error: any) {
      console.error("Error fetching activity data:", error.message)
      toast({
        title: "Error",
        description: "Failed to load activity data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDayClass = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const intensity = activityData.get(dateKey) || 0

    switch (intensity) {
      case 1: return "bg-blue-100 dark:bg-blue-900/20" // Low activity
      case 2: return "bg-blue-200 dark:bg-blue-900/40" // Moderate activity
      case 3: return "bg-blue-300 dark:bg-blue-900/60" // High activity
      case 4: return "bg-blue-400 dark:bg-blue-900/80" // Very High activity
      default: return "" // No activity
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Calendar
            mode="single"
            month={date}
            onMonthChange={setDate}
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
            classNames={{
              day: ({ date: day }) => {
                const baseClass = "relative text-center text-sm p-0 focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-accent [&:has([data-selected])]:text-accent-foreground [&:has([data-selected])]:hover:bg-accent [&:has([data-selected])]:hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                const heatmapClass = getDayClass(day)
                return `${baseClass} ${heatmapClass}`
              },
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
          />
        )}
        <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground mt-4">
          <span className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/20"></span> Low
          <span className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-900/40"></span> Moderate
          <span className="w-3 h-3 rounded-full bg-blue-300 dark:bg-blue-900/60"></span> High
          <span className="w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-900/80"></span> Very High
        </div>
      </CardContent>
    </Card>
  )
}
