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
      "bg-gray-100 dark:bg-gray-800", // 0 - no activity
      "bg-green-100 dark:bg-green-900", // 1 - low
      "bg-green-300 dark:bg-green-700", // 2 - medium
      "bg-green-500 dark:bg-green-500", // 3 - high
      "bg-green-700 dark:bg-green-300"  // 4 - very high
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
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity)}`}
                    title={`${day.date}: ${day.activity} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
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
