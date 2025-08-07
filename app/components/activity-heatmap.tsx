'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveCalendar } from '@nivo/calendar' // Corrected import
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'

type WorkoutLog = Database['public']['Tables']['workout_logs']['Row']

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<Array<{ value: number; day: string }>>([])
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchActivityData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const year = now.getFullYear();
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error } = await supabase
        .from('workout_logs')
        .select('workout_date, duration_minutes')
        .eq('user_id', user.id)
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      if (error) {
        console.error('Error fetching activity data:', error);
      } else {
        const dailyActivity: { [key: string]: number } = {};
        data.forEach(log => {
          if (log.workout_date && log.duration_minutes) {
            dailyActivity[log.workout_date] = (dailyActivity[log.workout_date] || 0) + log.duration_minutes;
          }
        });

        // Generate data for all days in the year, filling in 0 for no activity
        const allDaysData = [];
        let currentDate = new Date(year, 0, 1);
        while (currentDate.getFullYear() === year) {
          const dayString = currentDate.toISOString().split('T')[0];
          allDaysData.push({
            day: dayString,
            value: dailyActivity[dayString] || 0,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setActivityData(allDaysData);
      }
    };
    fetchActivityData();
  }, [supabase]);

  const now = new Date()
  const year = now.getFullYear()
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        {activityData.length > 0 ? (
          <ResponsiveCalendar // Corrected component name
            data={activityData}
            from={startDate}
            to={endDate}
            emptyColor="#ebedf0"
            colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            yearSpacing={40}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 20,
                itemsSpacing: 14,
                itemDirection: 'right-to-left',
              },
            ]}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading activity data...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
