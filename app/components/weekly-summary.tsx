"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Calendar, Target, Scale, Heart } from "lucide-react"
import { ActivityHeatmapWidget } from "./activity-heatmap"
import type { WeeklySummaryType } from "../../types/fitness"

interface WeeklySummaryProps {
  userId: string
}

const weightData = [
  { date: "Jan 20", weight: 184.2, bodyFat: 19.1 },
  { date: "Jan 21", weight: 183.8, bodyFat: 18.9 },
  { date: "Jan 22", weight: 183.5, bodyFat: 18.8 },
  { date: "Jan 23", weight: 183.1, bodyFat: 18.6 },
  { date: "Jan 24", weight: 182.9, bodyFat: 18.5 },
  { date: "Jan 25", weight: 182.6, bodyFat: 18.3 },
  { date: "Jan 26", weight: 182.4, bodyFat: 18.2 },
]

const moodData = [
  { date: "Jan 20", mood: 4, energy: 3, motivation: 4 },
  { date: "Jan 21", mood: 3, energy: 4, motivation: 3 },
  { date: "Jan 22", mood: 5, energy: 5, motivation: 5 },
  { date: "Jan 23", mood: 4, energy: 4, motivation: 4 },
  { date: "Jan 24", mood: 3, energy: 3, motivation: 3 },
  { date: "Jan 25", mood: 4, energy: 4, motivation: 4 },
  { date: "Jan 26", mood: 5, energy: 4, motivation: 5 },
]

export function WeeklySummaryComponent({ userId }: WeeklySummaryProps) {
  const [weeklyData] = useState<WeeklySummaryType>({
    userId,
    range: "Jan 20 - Jan 26, 2025",
    averageWeight: 183.1,
    averageBodyFat: 18.6,
    totalWorkouts: 5,
    caloriesTotal: 12450,
    prChanges: {
      "Bench Press": "+5 lbs",
      Squat: "+10 lbs",
      Deadlift: "+15 lbs",
    },
    goalProgress: {
      weightRemaining: 3.1,
      bodyFatRemaining: 3.6,
    },
    notes: "Great week! Increased all major lifts and stayed consistent with nutrition.",
  })

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
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Weekly Summary</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {weeklyData.range}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{weeklyData.totalWorkouts}</p>
                  <p className="text-sm text-gray-600">Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{weeklyData.caloriesTotal.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Calories Burned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{weeklyData.averageWeight}</p>
                  <p className="text-sm text-gray-600">Avg Weight</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{weeklyData.averageBodyFat}%</p>
                  <p className="text-sm text-gray-600">Avg Body Fat</p>
                </div>
              </div>

              {/* PR Changes */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Personal Records</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(weeklyData.prChanges).map(([exercise, change]) => (
                    <div
                      key={exercise}
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <span className="text-sm font-medium">{exercise}</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        {change}
                      </Badge>
                    </div>
                  ))}
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
                <span>Weight & Body Fat Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Weight Goal</span>
                      <Badge variant="outline" className="text-xs">
                        {weeklyData.goalProgress.weightRemaining.toFixed(1)} lbs to go
                      </Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Body Fat Goal</span>
                      <Badge variant="outline" className="text-xs">
                        {weeklyData.goalProgress.bodyFatRemaining.toFixed(1)}% to go
                      </Badge>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </div>

                {/* Weight Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} name="Weight (lbs)" />
                      <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} name="Body Fat (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
                <Heart className="h-5 w-5 text-pink-600" />
                <span>Mood & Energy Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="mood" fill="#ec4899" name="Mood" />
                    <Bar dataKey="energy" fill="#f59e0b" name="Energy" />
                    <Bar dataKey="motivation" fill="#3b82f6" name="Motivation" />
                  </BarChart>
                </ResponsiveContainer>
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
                <Target className="h-5 w-5 text-green-600" />
                <span>Goals & Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Weekly Workout Goal</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: 4 workouts</span>
                      <span>Completed: {weeklyData.totalWorkouts}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Calorie Burn Goal</h4>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      83% Complete
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: 15,000 calories</span>
                      <span>Burned: {weeklyData.caloriesTotal.toLocaleString()}</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Consistency Streak</h4>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">
                      6 Days
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Keep it up! You're on track for your longest streak yet.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
