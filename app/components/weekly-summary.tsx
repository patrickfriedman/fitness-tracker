"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Calendar, Scale, Heart, Dumbbell, Apple, Target, Zap, Award } from 'lucide-react'
import { ActivityHeatmapWidget } from "./activity-heatmap"

interface WeeklySummaryProps {
  userId: string
}

interface WeeklyStats {
  workoutsCompleted: number
  workoutsPlanned: number
  totalMinutes: number
  caloriesBurned: number
  streak: number
}

const weeklyData = [
  { day: "Mon", workouts: 1, calories: 2100, weight: 182.5, mood: 4 },
  { day: "Tue", workouts: 0, calories: 2300, weight: 182.3, mood: 3 },
  { day: "Wed", workouts: 1, calories: 1950, weight: 182.1, mood: 5 },
  { day: "Thu", workouts: 1, calories: 2200, weight: 181.9, mood: 4 },
  { day: "Fri", workouts: 0, calories: 2400, weight: 182.0, mood: 3 },
  { day: "Sat", workouts: 1, calories: 2000, weight: 181.8, mood: 5 },
  { day: "Sun", workouts: 1, calories: 2150, weight: 181.6, mood: 4 },
]

const monthlyWeightData = [
  { week: "Week 1", weight: 184.2, bodyFat: 19.1 },
  { week: "Week 2", weight: 183.5, bodyFat: 18.8 },
  { week: "Week 3", weight: 182.8, bodyFat: 18.5 },
  { week: "Week 4", weight: 182.1, bodyFat: 18.2 },
]

const moodData = [
  { day: "Mon", mood: 4 },
  { day: "Tue", mood: 3 },
  { day: "Wed", mood: 5 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 3 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 4 },
]

const achievements = [
  { name: "Consistency King", description: "7 day streak!", icon: "🔥" },
  { name: "Heavy Lifter", description: "New PR this week", icon: "💪" },
  { name: "Cardio Champion", description: "150+ minutes cardio", icon: "🏃" },
]

export function WeeklySummary({ userId }: WeeklySummaryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [stats, setStats] = useState<WeeklyStats>({
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    totalMinutes: 240,
    caloriesBurned: 1200,
    streak: 3
  })

  useEffect(() => {
    const totalWorkouts = weeklyData.reduce((sum, day) => sum + day.workouts, 0)
    const avgCalories = Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length)
    const weightChange = weeklyData[weeklyData.length - 1].weight - weeklyData[0].weight
    const avgMood = (weeklyData.reduce((sum, day) => sum + day.mood, 0) / weeklyData.length).toFixed(1)
    const totalMinutes = weeklyData.reduce((sum, day) => sum + day.workouts * 60, 0) // Assuming each workout is 60 minutes

    setStats({
      workoutsCompleted: totalWorkouts,
      workoutsPlanned: 5,
      totalMinutes: totalMinutes,
      caloriesBurned: avgCalories,
      streak: 7, // Placeholder for streak calculation
    })
  }, [])

  const workoutProgress = (stats.workoutsCompleted / stats.workoutsPlanned) * 100

  return (
    <div className="space-y-6">
      {/* Activity Heatmap */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Heatmap</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("progress-heatmap-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="progress-heatmap-widget">
          <ActivityHeatmapWidget userId={userId} />
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Overview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("weekly-overview-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="weekly-overview-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>This Week's Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Workout Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Workout Goal</span>
                    <span className="text-sm text-gray-600">
                      {stats.workoutsCompleted} / {stats.workoutsPlanned}
                    </span>
                  </div>
                  <Progress value={workoutProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {workoutProgress >= 100 ? "Goal achieved! 🎉" : `${stats.workoutsPlanned - stats.workoutsCompleted} workouts remaining`}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Zap className="h-4 w-4 text-blue-500 mr-1" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalMinutes}</div>
                    <div className="text-xs text-gray-600">Minutes Active</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="h-4 w-4 text-green-500 mr-1" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.caloriesBurned}</div>
                    <div className="text-xs text-gray-600">Calories Burned</div>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Current Streak</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {stats.streak} days
                  </Badge>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-medium mb-2">This Week's Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Completed 4 strength training sessions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Maintained 3-day workout streak</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Burned over 1000 calories</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weight & Body Fat Progress */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight & Body Fat Progress</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("weight-progress-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="weight-progress-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-blue-600" />
                <span>Body Composition Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyWeightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="weight" orientation="left" domain={["dataMin - 1", "dataMax + 1"]} />
                  <YAxis yAxisId="bodyFat" orientation="right" domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Line
                    yAxisId="weight"
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Weight (lbs)"
                  />
                  <Line
                    yAxisId="bodyFat"
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Body Fat (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mood Tracking */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mood Tracking</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("mood-progress-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="mood-progress-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <span>Weekly Mood Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} name="Mood (1-5)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Average mood this week: <span className="font-bold text-purple-600">{stats.streak}/5</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals Progress</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("goals-progress-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="goals-progress-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Monthly Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Workout Frequency</span>
                    <span>15/20 sessions</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weight Loss Goal</span>
                    <span>2.6/5 lbs</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Body Fat Reduction</span>
                    <span>0.9/3 %</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consistency Streak</span>
                    <span>12/30 days</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">3</p>
                  <p className="text-xs text-gray-600">Goals on track</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">1</p>
                  <p className="text-xs text-gray-600">Needs attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week's Achievements</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("achievements-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="achievements-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-lg">{achievement.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
