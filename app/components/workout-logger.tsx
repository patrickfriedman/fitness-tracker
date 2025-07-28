"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Edit } from "lucide-react"
import { WorkoutPlanner } from "./workout-planner"
import type { WorkoutLog } from "../../types/fitness"

interface WorkoutLoggerProps {
  userId: string
  workoutInProgress?: WorkoutLog | null
  onWorkoutStart?: (workout: WorkoutLog) => void
  onWorkoutFinish?: (workout: WorkoutLog) => void
}

export function WorkoutLogger({ userId, workoutInProgress, onWorkoutStart, onWorkoutFinish }: WorkoutLoggerProps) {
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null)

  const handleFinishWorkout = () => {
    if (workoutInProgress) {
      const finishedWorkout: WorkoutLog = {
        ...workoutInProgress,
        endTime: new Date().toISOString(),
        duration: 45, // Mock duration
        inProgress: false,
      }
      setCompletedWorkout(finishedWorkout)
      setShowCompletionModal(true)
    }
  }

  const handleConfirmWorkout = () => {
    if (completedWorkout) {
      onWorkoutFinish?.(completedWorkout)
      setShowCompletionModal(false)
      setCompletedWorkout(null)
    }
  }

  const handleEditWorkout = () => {
    // Allow editing of the completed workout
    setShowCompletionModal(false)
    // Could open an edit modal here
  }

  return (
    <div className="space-y-6">
      {/* Workout In Progress Card */}
      {workoutInProgress && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-green-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <span>Workout in Progress</span>
              </div>
              <Button onClick={handleFinishWorkout} size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Finish
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {workoutInProgress.label}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Exercises:</span>
                <span className="text-sm">{workoutInProgress.exercises?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Started:</span>
                <span className="text-sm">{new Date(workoutInProgress.startTime || "").toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Planner */}
      <WorkoutPlanner userId={userId} />

      {/* Workout Completion Modal */}
      {showCompletionModal && completedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Workout Complete!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Great job!</p>
                <p className="text-sm text-gray-600">
                  You completed a {completedWorkout.duration} minute {completedWorkout.label} workout
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Workout Summary:</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{completedWorkout.duration} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Exercises:</span>
                    <span>{completedWorkout.exercises?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="capitalize">{completedWorkout.label}</span>
                  </div>
                </div>
              </div>

              {completedWorkout.exercises && completedWorkout.exercises.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Exercises Completed:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {completedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm bg-gray-50 dark:bg-gray-800 rounded p-2">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-gray-600 ml-2">{exercise.sets.length} sets</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleEditWorkout} variant="outline" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Workout
                </Button>
                <Button onClick={handleConfirmWorkout} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm & Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
