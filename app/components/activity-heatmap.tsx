'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarHeatmap } from '@nivo/calendar'
import { Calendar } from 'lucide-react'

export default function ActivityHeatmap() {
  // Dummy data for the heatmap
  const now = new Date()
  const year = now.getFullYear()
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const generateRandomData = (numDays: number) => {
    const data = []
    for (let i = 0; i < numDays; i++) {
      const date = new Date(year, 0, 1)
      date.setDate(date.getDate() + i)
      // Simulate activity: higher values for more activity
      const value = Math.floor(Math.random() * 50) + (Math.random() > 0.7 ? 50 : 0) // More activity on some days
      data.push({
        value: value,
        day: date.toISOString().split('T')[0],
      })
    }
    return data
  }

  const data = generateRandomData(365) // Data for the whole year

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <CalendarHeatmap
          data={data}
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
      </CardContent>
    </Card>
  )
}
