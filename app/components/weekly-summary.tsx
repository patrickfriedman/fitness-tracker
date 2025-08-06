"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Award } from 'lucide-react'

interface WeeklyStats {
  workouts: number
  totalMinutes: number
  caloriesBurned: number
  avgMood: number
  waterGoalDays: number
}

export function WeeklySummary() {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    workouts: 0,
    totalMinutes: 0,
    caloriesBurned: 0,
    avgMood: 0,
    waterGoalDays: 0,
  })

  useEffect(() => {
    // Calculate stats from stored data
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    let workouts = 0
    let totalMinutes = 0
    let moodSum = 0
    let moodCount = 0
    let waterGoalDays = 0

    // Check each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      const dateString = date.toDateString()
      
      // Check workouts
      const workoutData = localStorage.getItem("fitness-workouts")
      if (workoutData) {
        const workoutList = JSON.parse(workoutData)
        const dayWorkouts = workoutList.filter((w: any) => 
          new Date(w.date).toDateString() === dateString
        )
        workouts += dayWorkouts.length
        totalMinutes += dayWorkouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0)
      }
      
      // Check mood
      const moodData = localStorage.getItem(`mood-${dateString}`)
      if (moodData) {
        const mood = JSON.parse(moodData)
        moodSum += mood.energy || 0
        moodCount++
      }
      
      // Check water goal
      const waterData = localStorage.getItem(`water-${dateString}`)
      if (waterData && parseInt(waterData) >= 64) {
        waterGoalDays++
      }
    }

    setWeeklyStats({
      workouts,
      totalMinutes,
      caloriesBurned: totalMinutes * 8, // Rough estimate
      avgMood: moodCount > 0 ? moodSum / moodCount : 0,
      waterGoalDays,
    })
  }, [])

  const goals = {
    workouts: 4,
    minutes: 240,
    waterDays: 7,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          This Week's Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.workouts}</div>
              <div className="text-sm text-gray-600">Workouts</div>
              <Progress 
                value={(weeklyStats.workouts / goals.workouts) * 100} 
                className="mt-2 h-1"
              />
            </div>
            
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.totalMinutes}</div>
              <div className="text-sm text-gray-600">Minutes</div>
              <Progress 
                value={(weeklyStats.totalMinutes / goals.minutes) * 100} 
                className="mt-2 h-1"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Calories Burned</span>
              </div>
              <Badge variant="outline">{weeklyStats.caloriesBurned} cal</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Avg Energy Level</span>
              </div>
              <Badge variant="outline">
                {weeklyStats.avgMood > 0 ? `${weeklyStats.avgMood.toFixed(1)}/5` : "No data"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Water Goal Days</span>
              </div>
              <Badge variant="outline">{weeklyStats.waterGoalDays}/7</Badge>
            </div>
          </div>
          
          {weeklyStats.workouts >= goals.workouts && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-green-700 dark:text-green-300 font-medium">
                🎉 Weekly workout goal achieved!
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
