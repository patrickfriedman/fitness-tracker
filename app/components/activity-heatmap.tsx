"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from 'lucide-react'

interface ActivityData {
  date: string
  workouts: number
  intensity: number
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
      
      // Random activity data
      const workouts = Math.floor(Math.random() * 3)
      data.push({
        date: date.toISOString().split('T')[0],
        workouts,
        intensity: workouts > 0 ? Math.floor(Math.random() * 4) + 1 : 0,
      })
    }
    
    setActivityData(data)
  }, [])

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-gray-100 dark:bg-gray-800"
      case 1: return "bg-green-200 dark:bg-green-900"
      case 2: return "bg-green-300 dark:bg-green-700"
      case 3: return "bg-green-400 dark:bg-green-600"
      case 4: return "bg-green-500 dark:bg-green-500"
      default: return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const weeks = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  const totalWorkouts = activityData.reduce((sum, day) => sum + day.workouts, 0)
  const activedays = activityData.filter(day => day.workouts > 0).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{totalWorkouts}</div>
              <div className="text-sm text-gray-500">Total Workouts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{activedays}</div>
              <div className="text-sm text-gray-500">Active Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((activedays / 84) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Consistency</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)}`}
                    title={`${day.date}: ${day.workouts} workout${day.workouts !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
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
        </div>
      </CardContent>
    </Card>
  )
}
