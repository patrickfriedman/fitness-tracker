"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from 'lucide-react'

export function ActivityHeatmap() {
  // Generate sample data for the last 12 weeks
  const generateHeatmapData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random activity level (0-4)
      const activity = Math.floor(Math.random() * 5)
      
      data.push({
        date: date.toISOString().split('T')[0],
        activity,
        day: date.getDay()
      })
    }
    return data
  }

  const heatmapData = generateHeatmapData()
  
  const getActivityColor = (level: number) => {
    const colors = [
      "bg-gray-100 dark:bg-gray-800", // No activity
      "bg-green-100 dark:bg-green-900", // Low
      "bg-green-300 dark:bg-green-700", // Medium
      "bg-green-500 dark:bg-green-500", // High
      "bg-green-700 dark:bg-green-300"  // Very high
    ]
    return colors[level] || colors[0]
  }

  const weeks = []
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Activity Heatmap</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity)}`}
                    title={`${day.date}: ${day.activity} workouts`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
