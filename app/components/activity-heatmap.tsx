'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

// Helper to generate a range of dates
const getDatesInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const dates = []
  while (date.getMonth() === month) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return dates
}

// Simulate activity data
const generateActivityData = (year: number, month: number) => {
  const dates = getDatesInMonth(year, month)
  return dates.map((date) => ({
    date: date.toISOString().split('T')[0], // YYYY-MM-DD
    count: Math.floor(Math.random() * 5), // 0-4 activities
  }))
}

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<Array<{ date: string; count: number }>>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setActivityData(generateActivityData(currentYear, currentMonth))
  }, [currentYear, currentMonth])

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (count === 1) return 'bg-green-100 dark:bg-green-900/20'
    if (count === 2) return 'bg-green-200 dark:bg-green-900/40'
    if (count === 3) return 'bg-green-300 dark:bg-green-900/60'
    if (count === 4) return 'bg-green-400 dark:bg-green-900/80'
    return 'bg-green-500 dark:bg-green-900'
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleMonthChange = (direction: 'prev' | 'next') => {
    let newMonth = currentMonth
    let newYear = currentYear

    if (direction === 'prev') {
      newMonth--
      if (newMonth < 0) {
        newMonth = 11
        newYear--
      }
    } else {
      newMonth++
      if (newMonth > 11) {
        newMonth = 0
        newYear++
      }
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleMonthChange('prev')}>
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleMonthChange('next')}>
              Next
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
          {activityData.map((day, index) => (
            <TooltipProvider key={day.date}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'h-6 w-6 rounded-sm cursor-pointer',
                      getIntensityClass(day.count)
                    )}
                    style={{
                      gridColumnStart: index === 0 ? new Date(day.date).getDay() + 1 : 'auto',
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day.date}</p>
                  <p>{day.count} activities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="flex justify-end text-xs text-muted-foreground mt-4">
          Less <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-700 mx-1" />
          <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/20 mx-1" />
          <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-900/60 mx-1" />
          <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-900 mx-1" /> More
        </div>
      </CardContent>
    </Card>
  )
}
