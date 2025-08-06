'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CalendarHeatmap } from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { WorkoutLog } from '@/types/fitness'
import { format, subYears, addDays } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface HeatmapValue {
  date: string;
  count: number;
}

export default function ActivityHeatmap() {
  const { user, isDemo } = useAuth()
  const [heatmapData, setHeatmapData] = useState<HeatmapValue[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchActivityData = async () => {
      setLoading(true);
      if (isDemo) {
        // Simulate demo data for the last year
        const today = new Date();
        const oneYearAgo = subYears(today, 1);
        const demoData: HeatmapValue[] = [];
        for (let d = oneYearAgo; d <= today; d = addDays(d, 1)) {
          const count = Math.floor(Math.random() * 4); // 0-3 workouts
          if (count > 0) {
            demoData.push({ date: format(d, 'yyyy-MM-dd'), count });
          }
        }
        setHeatmapData(demoData);
        setLoading(false);
        return;
      }

      // Fetch workout logs for the last year
      const oneYearAgo = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', oneYearAgo);

      if (error) {
        console.error('Error fetching activity data:', error.message);
      } else {
        // Aggregate data by date
        const aggregatedData: { [key: string]: number } = {};
        data.forEach(log => {
          const dateKey = format(new Date(log.date), 'yyyy-MM-dd');
          aggregatedData[dateKey] = (aggregatedData[dateKey] || 0) + 1;
        });

        const formattedData = Object.entries(aggregatedData).map(([date, count]) => ({
          date,
          count,
        }));
        setHeatmapData(formattedData);
      }
      setLoading(false);
    };

    fetchActivityData();
  }, [user, isDemo, supabase]);

  const endDate = new Date();
  const startDate = subYears(endDate, 1);

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${Math.min(value.count, 4)}`;
          }}
          tooltipDataAttrs={(value: HeatmapValue) => {
            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': value.date
                ? `${value.count} workouts on ${format(new Date(value.date), 'MMM dd, yyyy')}`
                : 'No workouts',
            };
          }}
          showWeekdayLabels
          gutterSize={2}
          horizontal={false} // Display vertically
        />
        <style jsx global>{`
          .react-calendar-heatmap .color-empty { fill: #ebedf0; }
          .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
          .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
          .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
          .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
          .react-calendar-heatmap text { font-size: 8px; } /* Adjust font size for labels */
        `}</style>
        {/* Tooltip component from shadcn/ui, assuming it's available */}
        {/* <Tooltip id="heatmap-tooltip" /> */}
      </CardContent>
    </Card>
  );
}
