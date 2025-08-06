"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Clock, Flame } from 'lucide-react'

export function WeeklySummary() {
  const weeklyStats = {
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    totalDuration: 240, // minutes
    caloriesBurned: 1200,
    averageIntensity: 7.5,
    streak: 3
  }

  const workoutProgress = (weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Weekly Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workout Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Workouts This Week</span>
            <span className="text-sm text-gray-600">
              {weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}
            </span>
          </div>
          <Progress value={workoutProgress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{weeklyStats.totalDuration}</p>
            <p className="text-xs text-gray-600">Minutes</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Flame className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-600">{weeklyStats.caloriesBurned}</p>
            <p className="text-xs text-gray-600">Calories</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Average Intensity</span>
            <Badge variant="outline">{weeklyStats.averageIntensity}/10</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Current Streak</span>
            <Badge variant="default">{weeklyStats.streak} days</Badge>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Weekly Goal
            </span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Complete 5 workouts this week - you're 80% there! 💪
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
