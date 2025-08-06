'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Loader2, CalendarDays } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface ActivityData {
  date: string; // YYYY-MM-DD
  count: number;
}

export default function ActivityHeatmap() {
  const { user } = useAuth()
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  const fetchActivityData = async () => {
    if (!user?.id) return
    setLoading(true)

    // Fetch workout logs for the last year
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const startDate = oneYearAgo.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('workout_logs')
      .select('date')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching activity data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load activity heatmap data.',
        variant: 'destructive',
      })
    } else {
      // Aggregate data by date
      const aggregatedData: { [key: string]: number } = {}
      data.forEach(log => {
        const date = log.date
        aggregatedData[date] = (aggregatedData[date] || 0) + 1
      })

      const formattedData: ActivityData[] = Object.entries(aggregatedData).map(([date, count]) => ({
        date,
        count,
      }))
      setActivityData(formattedData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchActivityData()
  }, [user])

  const getLevel = (count: number) => {
    if (count === 0) return 'level-0'
    if (count === 1) return 'level-1'
    if (count === 2) return 'level-2'
    if (count >= 3) return 'level-3'
    return 'level-0'
  }

  // Generate dates for the last 365 days
  const generateDates = () => {
    const dates: string[] = []
    for (let i = 364; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const allDates = generateDates()
  const activityMap = new Map(activityData.map(item => [item.date, item.count]))

  return (
    <Card className="widget-card col-span-full">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="widget-content">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col items-start">
            <div className="flex justify-between w-full text-xs text-muted-foreground mb-2 px-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 auto-cols-max">
              {/* Day labels (Mon, Wed, Fri) - simplified for brevity */}
              <div className="flex flex-col text-xs text-muted-foreground mr-1">
                <span className="h-4 flex items-center justify-end">Mon</span>
                <span className="h-4"></span>
                <span className="h-4 flex items-center justify-end">Wed</span>
                <span className="h-4"></span>
                <span className="h-4 flex items-center justify-end">Fri</span>
                <span className="h-4"></span>
                <span className="h-4"></span>
              </div>
              {allDates.map((date, index) => {
                const count = activityMap.get(date) || 0
                const dayOfWeek = new Date(date).getDay() // 0 = Sunday, 6 = Saturday
                // Only render cells for Mon-Sun, starting from Monday (day 1)
                // Adjusting to fit a grid where row 1 is Monday, row 7 is Sunday
                const gridRow = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday is last row
                
                return (
                  <div
                    key={date}
                    className={`heatmap-cell ${getLevel(count)}`}
                    title={`${date}: ${count} workouts`}
                    style={{ gridRow: gridRow }}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-end w-full mt-4 text-xs text-muted-foreground">
              Less
              <div className="flex ml-2 space-x-1">
                <span className="heatmap-cell level-0"></span>
                <span className="heatmap-cell level-1"></span>
                <span className="heatmap-cell level-2"></span>
                <span className="heatmap-cell level-3"></span>
              </div>
              More
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
