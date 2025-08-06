'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarHeatmap } from 'recharts-calendar-heatmap'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Loader2, Activity } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { format, subYears, addDays } from 'date-fns'

interface ActivityData {
  date: string;
  count: number;
}

export function ActivityHeatmap() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const oneYearAgo = format(subYears(new Date(), 1), 'yyyy-MM-dd')
      const today = format(new Date(), 'yyyy-MM-dd')

      // Fetch workout logs
      const { data: workoutLogs, error: workoutError } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', oneYearAgo)
        .lte('date', today)

      if (workoutError) {
        console.error('Error fetching workout logs for heatmap:', workoutError.message)
        toast({
          title: 'Error',
          description: 'Failed to load workout activity.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Aggregate counts by date
      const counts: { [key: string]: number } = {}
      workoutLogs.forEach(log => {
        counts[log.date] = (counts[log.date] || 0) + 1
      })

      // Convert to format for CalendarHeatmap
      const formattedData: ActivityData[] = Object.keys(counts).map(date => ({
        date,
        count: counts[date],
      }))

      setActivityData(formattedData)
      setIsLoading(false)
    }

    fetchActivityData()
  }, [user?.id, supabase])

  const startDate = subYears(new Date(), 1)
  const endDate = new Date()

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Workout activity over the last year</p>
        <div className="w-full overflow-x-auto">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            data={activityData}
            colorScale={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']} // GitHub-like green scale
            panelColors={{
              0: '#ebedf0',
              1: '#9be9a8',
              2: '#40c463',
              3: '#30a14e',
              4: '#216e39',
            }}
            tooltipDataAttrs={(value: any) => {
              if (!value || !value.date) {
                return { 'data-tip': 'No activity' };
              }
              return {
                'data-tip': `${value.count || 0} workouts on ${format(new Date(value.date), 'PPP')}`,
              };
            }}
            // Adjusting cell size and spacing for better fit
            rectProps={{
              rx: 2,
              ry: 2,
            }}
            rectSize={12}
            gutter={3}
            showMonthLabels={true}
            showWeekdayLabels={false}
            showOutOfRangeDays={false}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Darker shades indicate more workouts.
        </p>
      </CardContent>
    </Card>
  )
}
