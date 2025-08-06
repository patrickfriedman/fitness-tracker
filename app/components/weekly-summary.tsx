"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Calendar, Scale, Heart, Dumbbell, Apple, Target, Zap, Award } from 'lucide-react'
import { ActivityHeatmapWidget } from "./activity-heatmap"

interface WeeklySummaryProps {
  userId: string
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

  const totalWorkouts = weeklyData.reduce((sum, day) => sum + day.workouts, 0)
  const avgCalories = Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length)
  const weightChange = weeklyData[weeklyData.length - 1].weight - weeklyData[0].weight
  const avgMood = (weeklyData.reduce((sum, day) => sum + day.mood, 0) / weeklyData.length).toFixed(1)
  const totalMinutes = weeklyData.reduce((sum, day) => sum + day.workouts * 60, 0) // Assuming each workout is 60 minutes

  const weeklyStats = {
    workoutsCompleted: totalWorkouts,
    workoutsPlanned: 5,
    totalMinutes: totalMinutes,
    caloriesBurned: avgCalories,
    avgMood: parseFloat(avgMood),
    streak: 7, // Placeholder for streak calculation
  }

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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Workouts</span>
                    <span className="text-sm text-gray-500">
                      {weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}
                    </span>
                  </div>
                  <Progress value={(weeklyStats.workoutsCompleted / weeklyStats.workoutsPlanned) * 100} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalMinutes}</div>
                    <div className="text-xs text-gray-600">Minutes Active</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{weeklyStats.caloriesBurned}</div>
                    <div className="text-xs text-gray-600">Calories Burned</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Avg Mood</span>
                    <Badge variant="outline">{weeklyStats.avgMood}/5</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{weeklyStats.streak} day streak</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Daily Workouts</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="workouts" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
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
                  Average mood this week: <span className="font-bold text-purple-600">{weeklyStats.avgMood}/5</span>
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
