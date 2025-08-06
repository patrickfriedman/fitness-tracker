'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from 'lucide-react'
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Dummy data for chart, replace with actual data fetching and processing
const dummyChartData = [
  { name: "Mon", workouts: 2, calories: 1800 },
  { name: "Tue", workouts: 1, calories: 2200 },
  { name: "Wed", workouts: 3, calories: 2500 },
  { name: "Thu", workouts: 0, calories: 1500 },
  { name: "Fri", workouts: 2, calories: 2000 },
  { name: "Sat", workouts: 1, calories: 2300 },
  { name: "Sun", workouts: 0, calories: 1700 },
]

export default function WeeklySummary() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [summaryData, setSummaryData] = useState(dummyChartData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      if (!user) return
      setLoading(true)
      try {
        const today = new Date()
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())) // Sunday
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)) // Saturday

        const { data: workouts, error: workoutError } = await supabase
          .from('workout_logs')
          .select('date, duration_minutes')
          .eq('user_id', user.id)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0])

        if (workoutError) throw workoutError

        const { data: nutrition, error: nutritionError } = await supabase
          .from('nutrition_logs')
          .select('date, total_calories')
          .eq('user_id', user.id)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0])

        if (nutritionError) throw nutritionError

        const dailySummary: Record<string, { workouts: number, calories: number }> = {}
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek)
          date.setDate(startOfWeek.getDate() + i)
          const dateString = date.toISOString().split('T')[0]
          dailySummary[dateString] = { workouts: 0, calories: 0 }
        }

        workouts.forEach(w => {
          const dateString = w.date.split('T')[0]
          if (dailySummary[dateString]) {
            dailySummary[dateString].workouts += 1
          }
        })

        nutrition.forEach(n => {
          const dateString = n.date.split('T')[0]
          if (dailySummary[dateString]) {
            dailySummary[dateString].calories += n.total_calories
          }
        })

        const newSummaryData = Object.keys(dailySummary).map(dateString => {
          const date = new Date(dateString)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          return {
            name: dayName,
            workouts: dailySummary[dateString].workouts,
            calories: dailySummary[dateString].calories,
          }
        })
        setSummaryData(newSummaryData)

      } catch (error: any) {
        console.error("Error fetching weekly summary:", error)
        toast({
          title: "Error",
          description: `Failed to load weekly summary: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchWeeklySummary()
  }, [user, toast])

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading weekly summary...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {summaryData.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="font-medium">{day.name}</span>
                <span className="text-xs text-muted-foreground">{day.workouts} workouts</span>
                <span className="text-xs text-muted-foreground">{day.calories} kcal</span>
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-sm mt-1 flex flex-col-reverse">
                  <div
                    className="bg-blue-500 dark:bg-blue-600 rounded-sm"
                    style={{ height: `${(day.workouts / Math.max(...summaryData.map(d => d.workouts || 1))) * 100}%` }}
                    title={`${day.workouts} workouts`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
