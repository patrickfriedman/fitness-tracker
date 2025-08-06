"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from 'lucide-react'

export function ActivityHeatmap() {
  // Generate mock data for the last 365 days
  const generateHeatmapData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random activity level (0-4)
      const intensity = Math.floor(Math.random() * 5)
      
      data.push({
        date: date.toISOString().split('T')[0],
        intensity,
      })
    }
    
    return data
  }

  const heatmapData = generateHeatmapData()

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100', // 0 - no activity
      'bg-green-100', // 1 - low
      'bg-green-200', // 2 - medium-low
      'bg-green-400', // 3 - medium-high
      'bg-green-600', // 4 - high
    ]
    return colors[intensity]
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
        <div className="grid grid-cols-53 gap-1">
          {heatmapData.map((day, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)}`}
              title={`${day.date}: ${day.intensity} activities`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
