"use client"

import { useAuth } from "@/contexts/auth-context"
import LoginScreen from "@/components/login-screen"
import OnboardingFlow from "@/app/components/onboarding-flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import BodyMetricsWidget from "@/app/components/body-metrics-widget"
import WaterTracker from "@/app/components/water-tracker"
import MoodTracker from "@/app/components/mood-tracker"
import MotivationalQuote from "@/app/components/motivational-quote"
import WorkoutLogger from "@/app/components/workout-logger"
import NutritionTracker from "@/app/components/nutrition-tracker"
import ActivityHeatmap from "@/app/components/activity-heatmap"
import WeeklySummary from "@/app/components/weekly-summary"
import WorkoutPlanner from "@/app/components/workout-planner"
import { Settings, LogOut, Trash2, UserIcon } from 'lucide-react'

export default function HomePage() {
  const { user, loading, logout, deleteAccount } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    if (user?.id === "demo-user") {
      toast({
        title: "Demo Account",
        description: "Cannot delete the demo account.",
        variant: "destructive",
      })
      setShowDeleteConfirm(false)
      return
    }
    const success = await deleteAccount()
    if (success) {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    }
    setShowDeleteConfirm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  // Simple check for onboarding completion (can be expanded)
  const isOnboarded = user.primaryGoal !== 'general_fitness' || user.name !== ''; // Example: if goal is set and name is not empty

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-2xl font-bold">FitTracker</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
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
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      <span className="text-destructive">Delete Account</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {!isOnboarded ? (
          <OnboardingFlow />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BodyMetricsWidget />
            <WaterTracker />
            <MoodTracker />
            <MotivationalQuote />
            <WorkoutLogger />
            <NutritionTracker />
            <ActivityHeatmap />
            <WeeklySummary />
            <WorkoutPlanner />
            {/* Add more widgets here */}
          </div>
        )}
      </main>
    </div>
  )
}
