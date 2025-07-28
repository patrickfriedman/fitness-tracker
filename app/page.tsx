"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Dumbbell, Apple, Users, Moon, Sun, Zap, Clock, GripVertical } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { AuthProvider, useAuth } from "../contexts/auth-context"
import { ThemeProvider, useTheme } from "../contexts/theme-context"
import { LoginScreen } from "./components/login-screen"
import { ActivityHeatmapWidget } from "./components/activity-heatmap"
import { MotivationalQuoteWidget } from "./components/motivational-quote"
import { MoodTrackerWidget } from "./components/mood-tracker"
import { WorkoutLogger } from "./components/workout-logger"
import { NutritionTracker } from "./components/nutrition-tracker"
import { WeeklySummary } from "./components/weekly-summary"
import { BodyMetricsWidget } from "./components/body-metrics-widget"
import { WaterTrackerWidget } from "./components/water-tracker"

import type { BodyMetrics, WorkoutLog, NutritionLog, MoodLog } from "../types/fitness"

interface Widget {
  id: string
  name: string
  component: string
  order: number
}

function FitnessApp() {
  const { user, logout, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [recentMetrics, setRecentMetrics] = useState<BodyMetrics | null>(null)
  const [todayWorkout, setTodayWorkout] = useState<WorkoutLog | null>(null)
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog | null>(null)
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [workoutInProgress, setWorkoutInProgress] = useState<WorkoutLog | null>(null)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)

  const [editingWidgets, setEditingWidgets] = useState(false)
  const [showMetricsModal, setShowMetricsModal] = useState(false)

  // Widget management for all pages
  const [todayWidgets, setTodayWidgets] = useState<Widget[]>([
    { id: "motivation", name: "Daily Motivation", component: "motivation", order: 0 },
    { id: "quick-stats", name: "Quick Stats", component: "quick-stats", order: 1 },
    { id: "water", name: "Water Tracker", component: "water", order: 2 },
    { id: "nutrition-summary", name: "Nutrition Summary", component: "nutrition-summary", order: 3 },
    { id: "body-metrics", name: "Body Metrics", component: "body-metrics", order: 4 },
    { id: "mood", name: "Mood Tracker", component: "mood", order: 5 },
    { id: "heatmap", name: "Activity Heatmap", component: "heatmap", order: 6 },
  ])

  const [workoutWidgets, setWorkoutWidgets] = useState<Widget[]>([
    { id: "quick-start", name: "Quick Start Templates", component: "quick-start", order: 0 },
    { id: "custom-workout", name: "Custom Workout", component: "custom-workout", order: 1 },
  ])

  const [nutritionWidgets, setNutritionWidgets] = useState<Widget[]>([
    { id: "daily-overview", name: "Daily Overview", component: "daily-overview", order: 0 },
    { id: "add-food", name: "Add Food", component: "add-food", order: 1 },
    { id: "meal-planning", name: "Meal Planning", component: "meal-planning", order: 2 },
  ])

  useEffect(() => {
    if (user) {
      loadUserData(user.id)
    }
  }, [user])

  const loadUserData = async (userId: string) => {
    // Mock data loading
    setRecentMetrics({
      userId,
      date: "2025-01-27",
      weight: 182.4,
      bodyFatPercentage: 18.2,
      goalWeight: 180,
      goalBodyFat: 15,
    })

    setTodayNutrition({
      userId,
      date: "2025-01-27",
      caloriesConsumed: 1850,
      calorieLimit: 2200,
      waterIntake: 32,
      waterGoal: 64,
    })
  }

  const handleWorkoutStart = (workout: WorkoutLog) => {
    setWorkoutInProgress(workout)
    setWorkoutStartTime(new Date())
  }

  const handleWorkoutFinish = (workout: WorkoutLog) => {
    setWorkoutInProgress(null)
    setWorkoutStartTime(null)
    // Save workout logic here
    console.log("Workout saved:", workout)
  }

  const moveWidget = (
    widgets: Widget[],
    setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>,
    fromIndex: number,
    toIndex: number,
  ) => {
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)

    // Update order values
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      order: index,
    }))

    setWidgets(updatedWidgets)
  }

  const renderWidget = (widget: Widget, pageType: string) => {
    const toggleWidget = (widgetId: string) => {
      const element = document.getElementById(`${widgetId}-widget`)
      if (element) {
        element.style.display = element.style.display === "none" ? "block" : "none"
      }
    }

    return (
      <div key={widget.id} className="relative group">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{widget.name}</h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
            >
              <GripVertical className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWidget(widget.id)}
              className="h-6 w-6 p-0 text-gray-500"
            >
              <span className="text-xs">−</span>
            </Button>
          </div>
        </div>
        <div id={`${widget.id}-widget`}>{renderWidgetContent(widget, pageType)}</div>
      </div>
    )
  }

  const renderWidgetContent = (widget: Widget, pageType: string) => {
    switch (widget.component) {
      case "motivation":
        return <MotivationalQuoteWidget />
      case "quick-stats":
        return (
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline" className="text-xs">
                    Goal
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{recentMetrics?.weight || "--"}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">lbs current</p>
                  {recentMetrics?.goalWeight && (
                    <Progress
                      value={Math.max(
                        0,
                        100 -
                          Math.abs(
                            (((recentMetrics.weight || 0) - recentMetrics.goalWeight) / recentMetrics.goalWeight) * 100,
                          ),
                      )}
                      className="h-1"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  <Badge variant="outline" className="text-xs">
                    {todayNutrition
                      ? Math.round((todayNutrition.caloriesConsumed / todayNutrition.calorieLimit) * 100)
                      : 0}
                    %
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {todayNutrition?.caloriesConsumed || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">calories today</p>
                  <Progress
                    value={Math.min(
                      100,
                      todayNutrition ? (todayNutrition.caloriesConsumed / todayNutrition.calorieLimit) * 100 : 0,
                    )}
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "nutrition-summary":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="h-5 w-5 text-green-600" />
                <span>Today's Nutrition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{todayNutrition?.caloriesConsumed || 0}</p>
                  <p className="text-sm text-gray-600">Calories Consumed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{todayNutrition?.calorieLimit || 0}</p>
                  <p className="text-sm text-gray-600">Daily Goal</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{todayNutrition?.waterIntake || 0}oz</p>
                  <p className="text-sm text-gray-600">Water Intake</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "body-metrics":
        return <BodyMetricsWidget userId={user?.id || ""} currentMetrics={recentMetrics} onUpdate={setRecentMetrics} />
      case "mood":
        return <MoodTrackerWidget userId={user?.id || ""} onMoodUpdate={setTodayMood} />
      case "heatmap":
      case "progress-heatmap":
        return <ActivityHeatmapWidget userId={user?.id || ""} />
      case "water":
        return (
          <WaterTrackerWidget
            userId={user?.id || ""}
            currentIntake={todayNutrition?.waterIntake}
            goal={todayNutrition?.waterGoal}
            onUpdate={(newIntake) => {
              setTodayNutrition((prev) => (prev ? { ...prev, waterIntake: newIntake } : null))
            }}
          />
        )
      default:
        return <div>Widget content for {widget.name}</div>
    }
  }

  if (!user) {
    return <LoginScreen />
  }

  const weightProgress = recentMetrics?.goalWeight
    ? ((recentMetrics.goalWeight - (recentMetrics.weight || 0)) / recentMetrics.goalWeight) * 100
    : 0

  const calorieProgress = todayNutrition ? (todayNutrition.caloriesConsumed / todayNutrition.calorieLimit) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Workout In Progress Banner - Shows on all pages */}
      {workoutInProgress && (
        <div className="sticky top-0 z-50 bg-green-600 text-white p-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">Workout in Progress</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Started: {workoutStartTime?.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitTracker
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Welcome back, {user.name.split(" ")[0]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-9 w-9 p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        document.getElementById("profile-upload")?.click()
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Change Profile Picture
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        logout()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const avatar = event.target?.result as string
                      updateUser({ ...user, avatar })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        <Tabs defaultValue="today" className="w-full">
          {/* Mobile Tab Navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
            <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
              <TabsTrigger value="today" className="flex-col space-y-1 h-full" data-tab="today">
                <Zap className="h-4 w-4" />
                <span className="text-xs">Today</span>
              </TabsTrigger>
              <TabsTrigger value="workouts" className="flex-col space-y-1 h-full" data-tab="workouts">
                <Dumbbell className="h-4 w-4" />
                <span className="text-xs">Workouts</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-col space-y-1 h-full" data-tab="nutrition">
                <Apple className="h-4 w-4" />
                <span className="text-xs">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-col space-y-1 h-full" data-tab="progress">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Progress</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="today" className="p-4 space-y-4">
            {todayWidgets.sort((a, b) => a.order - b.order).map((widget) => renderWidget(widget, "today"))}
          </TabsContent>

          <TabsContent value="workouts" className="p-4">
            <WorkoutLogger
              userId={user.id}
              workoutInProgress={workoutInProgress}
              onWorkoutStart={handleWorkoutStart}
              onWorkoutFinish={handleWorkoutFinish}
            />
          </TabsContent>

          <TabsContent value="nutrition" className="p-4">
            <NutritionTracker userId={user.id} />
          </TabsContent>

          <TabsContent value="progress" className="p-4">
            <WeeklySummary userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Metrics Update Modal */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Update Body Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (lb)</Label>
                <Input id="weight" type="number" step="0.1" defaultValue={recentMetrics?.weight} placeholder="182.4" />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  defaultValue={recentMetrics?.bodyFatPercentage}
                  placeholder="18.2"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowMetricsModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowMetricsModal(false)} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Widget Editing Mode */}
      {editingWidgets && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Customize Widgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{widget.name}</span>
                  <input type="checkbox" defaultChecked={true} className="h-4 w-4" />
                </div>
              ))}
              <Button onClick={() => setEditingWidgets(false)} className="w-full mt-4">
                Done
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FitnessApp />
      </AuthProvider>
    </ThemeProvider>
  )
}
