"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Clock, Flame } from 'lucide-react'

export function WeeklySummary() {
  const weeklyStats = {
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    totalDuration: 180, // minutes
    caloriesBurned: 1200,
    avgMood: 4.2
  }

  const workoutProgress = (weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Weekly Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Workouts</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}</span>
                <span>{Math.round(workoutProgress)}%</span>
              </div>
              <Progress value={workoutProgress} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{weeklyStats.totalDuration}m</p>
              <p className="text-xs text-gray-500">Total time</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Calories</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{weeklyStats.caloriesBurned}</p>
              <p className="text-xs text-gray-500">Burned</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">😊</span>
              <span className="text-sm font-medium">Avg Mood</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{weeklyStats.avgMood}/5</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Great week! You're {Math.round(workoutProgress)}% towards your workout goal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
