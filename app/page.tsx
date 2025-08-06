"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from 'lucide-react'
import { Home, Dumbbell, Apple, TrendingUp, Settings, User, LogOut, Trash2, GripVertical, Play, Pause, Square, CheckCircle } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import { LoginScreen } from "@/components/login-screen"
import { OnboardingFlow } from "./components/onboarding-flow"
import { BodyMetricsWidget } from "./components/body-metrics-widget"
import { MoodTracker } from "./components/mood-tracker"
import { MotivationalQuote } from "./components/motivational-quote"
import { WorkoutLogger } from "./components/workout-logger"
import { NutritionTracker } from "./components/nutrition-tracker"
import { ActivityHeatmap } from "./components/activity-heatmap"
import { WeeklySummary } from "./components/weekly-summary"
import { WorkoutPlanner } from "./components/workout-planner"
import type { Workout, WorkoutExercise } from "@/types/fitness"

interface ActiveWorkout {
  workout: Workout
  currentExerciseIndex: number
  startTime: Date
}

export default function FitnessApp() {
  const { user, logout, deleteAccount } = useAuth()
  const [activeTab, setActiveTab] = useState("today")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null)
  const [showWorkoutComplete, setShowWorkoutComplete] = useState(false)
  const [completedWorkout, setCompletedWorkout] = useState<Workout | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  console.log("FitnessApp render - user:", user)

  useEffect(() => {
    if (user && !user.primaryGoal) {
      setShowOnboarding(true)
    }
  }, [user])

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout({
      workout,
      currentExerciseIndex: 0,
      startTime: new Date(),
    })
  }

  const handleFinishWorkout = () => {
    if (activeWorkout) {
      const duration = Math.floor((new Date().getTime() - activeWorkout.startTime.getTime()) / 1000 / 60)
      const finishedWorkout = {
        ...activeWorkout.workout,
        duration,
        date: new Date().toISOString(),
      }
      setCompletedWorkout(finishedWorkout)
      setShowWorkoutComplete(true)
      setActiveWorkout(null)
    }
  }

  const handleSaveWorkout = () => {
    if (completedWorkout) {
      const existingWorkouts = JSON.parse(localStorage.getItem("fitness-workouts") || "[]")
      existingWorkouts.push(completedWorkout)
      localStorage.setItem("fitness-workouts", JSON.stringify(existingWorkouts))
      setShowWorkoutComplete(false)
      setCompletedWorkout(null)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete account:", error)
      alert("Failed to delete account. Please try again.")
    }
  }

  // Show login screen if no user
  if (!user) {
    console.log("No user found, showing LoginScreen")
    return <LoginScreen />
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
  }

  const renderWidgets = (widgetList: string[]) => {
    return widgetList.map((widget) => {
      switch (widget) {
        case "metrics":
          return (
            <div key={widget} className="relative group">
              <GripVertical className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
              <BodyMetricsWidget />
            </div>
          )
        case "mood":
          return (
            <div key={widget} className="relative group">
              <GripVertical className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
              <MoodTracker />
            </div>
          )
        case "quote":
          return (
            <div key={widget} className="relative group">
              <GripVertical className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
              <MotivationalQuote />
            </div>
          )
        case "quick-actions":
          return (
            <div key={widget} className="relative group">
              <GripVertical className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Start Quick Workout
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Apple className="mr-2 h-4 w-4" />
                    Log Meal
                  </Button>
                </CardContent>
              </Card>
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Active Workout Banner */}
      {activeWorkout && (
        <div className="bg-green-500 text-white px-4 py-2 text-center sticky top-0 z-50">
          <div className="flex items-center justify-center space-x-4">
            <Play className="h-4 w-4" />
            <span className="font-medium">
              Workout in Progress: {activeWorkout.workout.name} - Exercise{" "}
              {activeWorkout.currentExerciseIndex + 1} of {activeWorkout.workout.exercises.length}
            </span>
            <Button size="sm" variant="secondary" onClick={handleFinishWorkout}>
              <Square className="h-3 w-3 mr-1" />
              Finish
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitTracker Pro
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {user.primaryGoal?.replace("_", " ").toUpperCase()}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.username}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
              <TabsTrigger value="today" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Today</span>
              </TabsTrigger>
              <TabsTrigger value="workouts" className="flex items-center space-x-2">
                <Dumbbell className="h-4 w-4" />
                <span className="hidden sm:inline">Workouts</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center space-x-2">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderWidgets(user.preferences.todayWidgets)}
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutPlanner onStartWorkout={handleStartWorkout} />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionTracker />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityHeatmap />
              <WeeklySummary />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Workout Completion Modal */}
      <Dialog open={showWorkoutComplete} onOpenChange={setShowWorkoutComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Workout Complete!</span>
            </DialogTitle>
            <DialogDescription>Great job! Here's a summary of your workout:</DialogDescription>
          </DialogHeader>
          {completedWorkout && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{completedWorkout.name}</h3>
                <p className="text-sm text-gray-600">Duration: {completedWorkout.duration} minutes</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Exercises:</h4>
                {completedWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{exercise.exerciseName}</span>
                    <span className="text-gray-600 ml-2">
                      {exercise.sets.length} sets completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWorkoutComplete(false)}>
              Edit Workout
            </Button>
            <Button onClick={handleSaveWorkout}>Save & Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Delete Account</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including workouts, nutrition logs, and progress tracking.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
