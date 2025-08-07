'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'

type WorkoutLog = Database['public']['Tables']['workout_logs']['Row']

export default function WeeklySummary() {
  const [workoutData, setWorkoutData] = useState<Array<{ day: string; duration: number }>>([])
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchWeeklyWorkouts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 6) // Last 7 days including today

      const { data, error } = await supabase
        .from('workout_logs')
        .select('workout_date, duration_minutes')
        .eq('user_id', user.id)
        .gte('workout_date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('workout_date', today.toISOString().split('T')[0])
        .order('workout_date', { ascending: true })

      if (error) {
        console.error('Error fetching weekly workouts:', error)
      } else if (data) {
        const dailyDurations: { [key: string]: number } = {}
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo)
          date.setDate(sevenDaysAgo.getDate() + i)
          dailyDurations[date.toISOString().split('T')[0]] = 0
        }

        data.forEach(log => {
          if (log.workout_date && log.duration_minutes) {
            dailyDurations[log.workout_date] += log.duration_minutes
          }
        })

        const formattedData = Object.keys(dailyDurations).map(date => ({
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          duration: dailyDurations[date],
        }))
        setWorkoutData(formattedData)
      }
    }

    fetchWeeklyWorkouts()
  }, [supabase])

  const chartData = workoutData.map(d => ({
    day: d.day,
    'Workout Duration': d.duration,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Workout Summary</CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        {workoutData.length > 0 ? (
          <ResponsiveBar
            data={chartData}
            keys={['Workout Duration']}
            indexBy="day"
            margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'greens' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Day',
              legendPosition: 'middle',
              legendOffset: 28,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Duration (minutes)',
              legendPosition: 'middle',
              legendOffset: -35,
            }}
            enableLabel={false}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e => e.id + ": " + e.formattedValue + " in day: " + e.indexValue}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No workout data for this week.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
