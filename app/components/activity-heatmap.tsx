"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { ActivityHeatmap } from "../../types/fitness"

interface ActivityHeatmapWidgetProps {
  userId: string
}

export function ActivityHeatmapWidget({ userId }: ActivityHeatmapWidgetProps) {
  const [heatmapData, setHeatmapData] = useState<ActivityHeatmap[]>([])
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  useEffect(() => {
    generateHeatmapData()
  }, [userId])

  const generateHeatmapData = () => {
    const data: ActivityHeatmap[] = []
    const today = new Date()

    // Generate data for 55 weeks * 15 days = 825 days (55 wide x 15 tall)
    for (let i = 824; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dateStr = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()

      // Higher activity on weekdays, some randomness
      let count = 0
      const random = Math.random()

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Weekdays
        if (random > 0.3) count = Math.floor(random * 4) + 1
      } else {
        // Weekends
        if (random > 0.5) count = Math.floor(random * 3) + 1
      }

      data.push({
        date: dateStr,
        count,
        type: count > 2 ? "workout" : count > 0 ? "nutrition" : "workout",
      })
    }

    setHeatmapData(data)
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800"
    if (count === 1) return "bg-green-200 dark:bg-green-900"
    if (count === 2) return "bg-green-400 dark:bg-green-700"
    if (count === 3) return "bg-green-600 dark:bg-green-600"
    return "bg-green-800 dark:bg-green-500"
  }

  const getTooltipText = (item: ActivityHeatmap) => {
    const date = new Date(item.date).toLocaleDateString()
    if (item.count === 0) return `${date}: No activity`
    return `${date}: ${item.count} ${item.count === 1 ? "activity" : "activities"}`
  }

  // Organize data into weeks (55 weeks x 15 days)
  const weeks: ActivityHeatmap[][] = []
  for (let i = 0; i < heatmapData.length; i += 15) {
    weeks.push(heatmapData.slice(i, i + 15))
  }

  const totalActivities = heatmapData.reduce((sum, item) => sum + item.count, 0)
  const activedays = heatmapData.filter((item) => item.count > 0).length
  const currentStreak = calculateCurrentStreak()

  function calculateCurrentStreak(): number {
    let streak = 0
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Activity Heatmap</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {activedays} active days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">{totalActivities}</p>
            <p className="text-xs text-gray-600">Total Activities</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{activedays}</p>
            <p className="text-xs text-gray-600">Active Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
            <p className="text-xs text-gray-600">Current Streak</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="relative">
          <div className="grid grid-cols-55 gap-1 min-w-full overflow-x-auto">
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-2 h-2 rounded-sm cursor-pointer transition-all hover:scale-150 ${getIntensityClass(day.count)}`}
                  onMouseEnter={() => setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  title={getTooltipText(day)}
                />
              )),
            )}
          </div>

          {/* Tooltip */}
          {hoveredDate && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
              {getTooltipText(heatmapData.find((item) => item.date === hoveredDate)!)}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600"></div>
            <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-500"></div>
          </div>
          <span>More</span>
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Jan</span>
          <span>Mar</span>
          <span>May</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Nov</span>
        </div>
      </CardContent>
    </Card>
  )
}
