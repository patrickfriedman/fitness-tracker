'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper to get dates for the last N days
const getDates = (numDays: number) => {
  const dates = []
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d)
  }
  return dates
}

const getIntensityClass = (count: number) => {
  if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
  if (count < 3) return 'bg-blue-200 dark:bg-blue-800'
  if (count < 6) return 'bg-blue-400 dark:bg-blue-600'
  if (count < 10) return 'bg-blue-600 dark:bg-blue-400'
  return 'bg-blue-800 dark:bg-blue-200'
}

export default function ActivityHeatmap() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [activityData, setActivityData] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  const dates = getDates(90) // Last 90 days

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        // Simulate demo data
        const demoData: Record<string, number> = {}
        dates.forEach(d => {
          const dateStr = d.toISOString().split('T')[0]
          demoData[dateStr] = Math.floor(Math.random() * 10) // Random activity count
        })
        setActivityData(demoData)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const { data: workoutLogs, error: workoutError } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', dates[0].toISOString().split('T')[0]) // Start from the earliest date

      const { data: nutritionLogs, error: nutritionError } = await supabase
        .from('nutrition_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', dates[0].toISOString().split('T')[0])

      if (workoutError || nutritionError) {
        console.error('Error fetching activity data:', workoutError || nutritionError)
        // Handle error
      } else {
        const combinedData: Record<string, number> = {}
        dates.forEach(d => {
          combinedData[d.toISOString().split('T')[0]] = 0
        })

        workoutLogs?.forEach(log => {
          combinedData[log.date] = (combinedData[log.date] || 0) + 1
        })
        nutritionLogs?.forEach(log => {
          combinedData[log.date] = (combinedData[log.date] || 0) + 1
        })
        setActivityData(combinedData)
      }
      setIsLoading(false)
    }

    fetchActivityData()
  }, [user, supabase])

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Activity Heatmap (Last 90 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
          {/* Day labels (optional) */}
          <div className="flex flex-col justify-around text-xs text-muted-foreground pr-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          <TooltipProvider>
            {dates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0]
              const count = activityData[dateStr] || 0
              const dayOfWeek = date.getDay() // 0 for Sunday, 1 for Monday

              // Adjust for grid-rows-7 starting from Monday (or Sunday if preferred)
              // If your grid starts on Sunday, use dayOfWeek directly.
              // If your grid starts on Monday, map 0 (Sunday) to 6, and others to dayOfWeek - 1
              const gridRow = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday is last row

              return (
                <Tooltip key={dateStr}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'h-4 w-4 rounded-sm cursor-pointer',
                        getIntensityClass(count)
                      )}
                      style={{ gridRow: gridRow }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {count} activities
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
        <div className="flex justify-end items-center text-xs text-muted-foreground mt-2 space-x-1">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-800" />
          <div className="h-3 w-3 rounded-sm bg-blue-400 dark:bg-blue-600" />
          <div className="h-3 w-3 rounded-sm bg-blue-600 dark:bg-blue-400" />
          <div className="h-3 w-3 rounded-sm bg-blue-800 dark:bg-blue-200" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
