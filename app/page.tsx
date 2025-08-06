"use client"

import { useAuth } from "@/contexts/auth-context"
import LoginScreen from "@/components/login-screen"
import { OnboardingFlow } from "@/app/components/onboarding-flow"
import { BodyMetricsWidget } from "@/app/components/body-metrics-widget"
import { WaterTracker } from "@/app/components/water-tracker"
import { MoodTracker } from "@/app/components/mood-tracker"
import { MotivationalQuote } from "@/app/components/motivational-quote"
import { WorkoutLogger } from "@/app/components/workout-logger"
import { NutritionTracker } from "@/app/components/nutrition-tracker"
import { ActivityHeatmap } from "@/app/components/activity-heatmap"
import { WeeklySummary } from "@/app/components/weekly-summary"
import { WorkoutPlanner } from "@/app/components/workout-planner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dumbbell, UserIcon, LogOut, Settings, Trash2 } from 'lucide-react'
import { useState } from "react"

export default function Home() {
  const { user, loading, logout, deleteAccount } = useAuth()
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  // If user exists but hasn't completed onboarding (e.g., primaryGoal is default)
  // This is a simplified check; a real app might have a dedicated onboarding status
  if (user.primaryGoal === 'general_fitness' && user.id !== "demo-user") {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Dumbbell className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">FitTracker Pro</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Workouts</Button>
            <Button variant="ghost">Nutrition</Button>
            <Button variant="ghost">Progress</Button>
          </nav>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                    <AvatarFallback>{user.name ? user.name.charAt(0) : user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Account</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          setIsDeletingAccount(true)
                          await deleteAccount()
                          setIsDeletingAccount(false)
                        }}
                        disabled={isDeletingAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BodyMetricsWidget />
        <WorkoutLogger />
        <NutritionTracker />
        <WaterTracker />
        <MoodTracker />
        <ActivityHeatmap />
        <WeeklySummary />
        <WorkoutPlanner />
        <MotivationalQuote />
      </main>
    </div>
  )
}
