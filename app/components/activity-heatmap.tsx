"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from 'lucide-react'

interface ActivityData {
  date: string
  workouts: number
  intensity: number // 0-4 scale
}

export function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<ActivityData[]>([])

  useEffect(() => {
    // Generate sample data for the last 12 weeks
    const data: ActivityData[] = []
    const today = new Date()
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random activity data for demo
      const workouts = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
      const intensity = workouts > 0 ? Math.floor(Math.random() * 4) + 1 : 0
      
      data.push({
        date: date.toISOString().split('T')[0],
        workouts,
        intensity
      })
    }
    
    setActivityData(data)
  }, [])

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-gray-100 dark:bg-gray-800"
      case 1: return "bg-green-100 dark:bg-green-900"
      case 2: return "bg-green-200 dark:bg-green-800"
      case 3: return "bg-green-400 dark:bg-green-600"
      case 4: return "bg-green-600 dark:bg-green-500"
      default: return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const weeks = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Activity Heatmap</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            {monthLabels.slice(-3).map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex space-x-1">
            {/* Day labels */}
            <div className="flex flex-col space-y-1 mr-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-3 text-xs text-gray-500 flex items-center">
                  {index % 2 === 1 ? day.slice(0, 3) : ''}
                </div>
              ))}
            </div>
            
            {/* Activity squares */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} border border-gray-200 dark:border-gray-700`}
                    title={`${day.date}: ${day.workouts} workout${day.workouts !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level)} border border-gray-200 dark:border-gray-700`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
