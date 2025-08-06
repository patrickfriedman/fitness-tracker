"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from 'lucide-react'

export function ActivityHeatmap() {
  // Generate mock data for the last 12 weeks
  const generateHeatmapData = () => {
    const data = []
    const today = new Date()
    
    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (week * 7 + day))
        
        // Mock activity level (0-4)
        const activity = Math.floor(Math.random() * 5)
        
        data.push({
          date: date.toISOString().split('T')[0],
          activity,
          workouts: activity > 0 ? Math.floor(Math.random() * 3) + 1 : 0
        })
      }
    }
    
    return data.reverse()
  }

  const heatmapData = generateHeatmapData()
  
  const getActivityColor = (level: number) => {
    const colors = [
      "bg-gray-100 dark:bg-gray-800", // No activity
      "bg-green-100 dark:bg-green-900", // Low
      "bg-green-200 dark:bg-green-800", // Medium-low
      "bg-green-400 dark:bg-green-600", // Medium-high
      "bg-green-600 dark:bg-green-400", // High
    ]
    return colors[level] || colors[0]
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            {Array.from({ length: 3 }, (_, i) => {
              const monthIndex = (new Date().getMonth() - 2 + i + 12) % 12
              return <span key={i}>{months[monthIndex]}</span>
            })}
          </div>
          
          {/* Heatmap grid */}
          <div className="grid grid-cols-12 gap-1">
            {heatmapData.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity)} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}
                title={`${day.date}: ${day.workouts} workout${day.workouts !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
          
          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mt-2">
            {weekdays.map(day => (
              <span key={day} className="text-center">{day[0]}</span>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
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
