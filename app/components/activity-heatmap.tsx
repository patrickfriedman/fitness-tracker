"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface ActivityHeatmapProps {
  userId: string
}

interface ActivityData {
  date: string
  intensity: number
  workouts: number
}

export function ActivityHeatmapWidget({ userId }: ActivityHeatmapProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([])

  useEffect(() => {
    generateMockData()
  }, [])

  const generateMockData = () => {
    const data: ActivityData[] = []
    const today = new Date()

    // Generate data for 55 weeks * 10 days = 550 days
    for (let i = 549; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
      const workouts = intensity > 0 ? Math.floor(Math.random() * 3) + 1 : 0

      data.push({
        date: date.toISOString().split("T")[0],
        intensity,
        workouts,
      })
    }

    setActivityData(data)
  }

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-gray-100 dark:bg-gray-800"
      case 1:
        return "bg-green-200 dark:bg-green-900"
      case 2:
        return "bg-green-400 dark:bg-green-700"
      case 3:
        return "bg-green-600 dark:bg-green-500"
      case 4:
        return "bg-green-800 dark:bg-green-400"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <Calendar className="h-5 w-5" />
            <span>Activity Heatmap</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Last 550 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Heatmap Grid - 55 wide x 10 tall */}
          <div
            className="grid gap-1 overflow-x-auto min-w-[600px]"
            style={{
              gridTemplateColumns: "repeat(55, minmax(8px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(8px, 1fr))",
            }}
          >
            {activityData.map((day, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-sm cursor-pointer transition-all hover:scale-125 ${getIntensityColor(day.intensity)}`}
                title={`${formatDate(day.date)}: ${day.workouts} workout${day.workouts !== 1 ? "s" : ""}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-2 h-2 rounded-sm bg-green-200 dark:bg-green-900"></div>
              <div className="w-2 h-2 rounded-sm bg-green-400 dark:bg-green-700"></div>
              <div className="w-2 h-2 rounded-sm bg-green-600 dark:bg-green-500"></div>
              <div className="w-2 h-2 rounded-sm bg-green-800 dark:bg-green-400"></div>
            </div>
            <span>More</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-green-200 dark:border-green-800">
            <div className="text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {activityData.filter((d) => d.intensity > 0).length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active days</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {Math.round((activityData.filter((d) => d.intensity > 0).length / activityData.length) * 100)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Consistency</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {activityData.reduce((sum, d) => sum + d.workouts, 0)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total workouts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
