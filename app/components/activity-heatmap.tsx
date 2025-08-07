'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function ActivityHeatmap() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // This is a placeholder for actual activity data
  const activityData = {
    '2024-07-01': 5,
    '2024-07-05': 10,
    '2024-07-10': 8,
    '2024-07-15': 12,
    '2024-07-20': 7,
    '2024-07-25': 15,
  }

  const getDayClass = (day: Date) => {
    const dateString = day.toISOString().split('T')[0]
    const intensity = activityData[dateString as keyof typeof activityData]
    if (intensity) {
      if (intensity > 10) return 'bg-green-600 text-white'
      if (intensity > 5) return 'bg-green-400 text-white'
      return 'bg-green-200'
    }
    return ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            activity: (day) => {
              const dateString = day.toISOString().split('T')[0]
              return !!activityData[dateString as keyof typeof activityData]
            },
          }}
          modifiersStyles={{
            activity: {
              backgroundColor: 'var(--activity-color)', // Custom property for dynamic color
            },
          }}
          classNames={{
            day: ({ date: day }) => getDayClass(day),
          }}
        />
        <p className="mt-4 text-sm text-gray-500">
          Intensity of activity on selected days.
        </p>
      </CardContent>
    </Card>
  )
}
