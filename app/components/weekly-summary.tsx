'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, LineChart } from '@tremor/react'
import { Activity } from 'lucide-react'

export default function WeeklySummary() {
  // Dummy data for weekly summary
  const chartData = [
    { date: 'Mon', workouts: 2, calories: 800 },
    { date: 'Tue', workouts: 1, calories: 450 },
    { date: 'Wed', workouts: 0, calories: 0 },
    { date: 'Thu', workouts: 1, calories: 600 },
    { date: 'Fri', workouts: 2, calories: 900 },
    { date: 'Sat', workouts: 1, calories: 500 },
    { date: 'Sun', workouts: 0, calories: 0 },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <LineChart
          className="h-full"
          data={chartData}
          index="date"
          categories={['workouts', 'calories']}
          colors={['blue', 'emerald']}
          valueFormatter={(number: number) => `${number}`}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  )
}
