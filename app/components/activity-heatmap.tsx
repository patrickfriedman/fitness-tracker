'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from 'lucide-react'
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Helper to get dates for the last year
const getDatesForLastYear = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.unshift(date.toISOString().split('T')[0]) // YYYY-MM-DD
  }
  return dates
}

const getIntensity = (count: number) => {
  if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
  if (count === 1) return 'bg-green-200 dark:bg-green-800';
  if (count === 2) return 'bg-green-400 dark:bg-green-700';
  if (count >= 3) return 'bg-green-600 dark:bg-green-600';
  return 'bg-gray-200 dark:bg-gray-700';
}

export default function ActivityHeatmap() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activityData, setActivityData] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return
      setLoading(true)
      try {
        // Fetch workout logs
        const { data: workoutData, error: workoutError } = await supabase
          .from('workout_logs')
          .select('date')
          .eq('user_id', user.id)

        if (workoutError) throw workoutError

        // Fetch nutrition logs
        const { data: nutritionData, error: nutritionError } = await supabase
          .from('nutrition_logs')
          .select('date')
          .eq('user_id', user.id)

        if (nutritionError) throw nutritionError

        // Combine and count activities per day
        const combinedData = [...workoutData, ...nutritionData]
        const counts: Record<string, number> = {}
        combinedData.forEach(item => {
          const date = item.date.split('T')[0] // Ensure YYYY-MM-DD format
          counts[date] = (counts[date] || 0) + 1
        })
        setActivityData(counts)
      } catch (error: any) {
        console.error("Error fetching activity data:", error)
        toast({
          title: "Error",
          description: `Failed to load activity data: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [user, toast])

  const dates = getDatesForLastYear()

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading activity data...</div>
        ) : (
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
            {/* Day labels (optional, can be added with more complex grid) */}
            {dates.map((dateString) => {
              const count = activityData[dateString] || 0
              return (
                <div
                  key={dateString}
                  className={`h-4 w-4 rounded-sm ${getIntensity(count)}`}
                  title={`${dateString}: ${count} activities`}
                />
              )
            })}
          </div>
        )}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-800" />
            <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-600" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
