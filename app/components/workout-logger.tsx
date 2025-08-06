"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { saveWorkout, updateWorkout } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Play, Square, Edit, Check, Trash2 } from 'lucide-react'
import type { WorkoutLog } from "../../types/fitness"

interface WorkoutLoggerProps {
  userId: string
  workoutInProgress?: WorkoutLog | null
  onWorkoutStart?: (workout: WorkoutLog) => void
  onWorkoutFinish?: (workout: WorkoutLog) => void
  onStartWorkout?: (workout: any) => void
}

interface Exercise {
  name: string
  sets: {
    reps?: number
    weight?: number
    unit: "lb" | "kg"
    time?: number
    distance?: number
    intensity?: "low" | "medium" | "high"
  }[]
}

const workoutTemplates = [
  {
    id: "push-day",
    name: "Push Day",
    category: "strength",
    exercises: [
      { name: "Bench Press", sets: 3, reps: "5", weight: 185, restTime: 180 },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", weight: 60, restTime: 120 },
      { name: "Overhead Press", sets: 3, reps: "6-8", weight: 135, restTime: 150 },
      { name: "Tricep Dips", sets: 3, reps: "10-12", weight: 40, restTime: 90 },
    ],
    estimatedDuration: 45,
  },
  {
    id: "pull-day",
    name: "Pull Day",
    category: "strength",
    exercises: [
      { name: "Deadlift", sets: 1, reps: "5", weight: 275, restTime: 300 },
      { name: "Pull-ups", sets: 4, reps: "6-8", weight: 40, restTime: 120 },
      { name: "Barbell Rows", sets: 4, reps: "8-10", weight: 155, restTime: 120 },
      { name: "Face Pulls", sets: 3, reps: "12-15", weight: 40, restTime: 60 },
    ],
    estimatedDuration: 50,
  },
  {
    id: "cardio-hiit",
    name: "HIIT Cardio",
    category: "cardio",
    exercises: [
      { name: "Treadmill Intervals", sets: 8, reps: "30s on/30s off", restTime: 30 },
      { name: "Burpees", sets: 3, reps: "10", restTime: 60 },
      { name: "Mountain Climbers", sets: 3, reps: "20", restTime: 45 },
    ],
    estimatedDuration: 25,
  },
]

const quickWorkouts = [
  { name: "Push Day", exercises: ["Push-ups", "Bench Press", "Shoulder Press"] },
  { name: "Pull Day", exercises: ["Pull-ups", "Rows", "Bicep Curls"] },
  { name: "Leg Day", exercises: ["Squats", "Deadlifts", "Lunges"] },
]

export function WorkoutLogger({ userId, workoutInProgress, onWorkoutStart, onWorkoutFinish, onStartWorkout }: WorkoutLoggerProps) {
  const [currentWorkout, setCurrentWorkout] = useState<Partial<WorkoutLog>>({
    userId,
    date: new Date().toISOString().split("T")[0],
    label: "strength",
    exercises: [],
    workingWeights: {},
    notes: "",
  })

  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutLog | null>(null)

  const addExercise = () => {
    const newExercise: Exercise = {
      name: "",
      sets: [{ reps: 0, weight: 0, unit: "lb" }],
    }

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise],
    }))
  }

  const removeExercise = (index: number) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || [],
    }))
  }

  const loadTemplate = (template: any) => {
    const exercises: Exercise[] = template.exercises.map((ex: any) => ({
      name: ex.name,
      sets: Array(ex.sets)
        .fill(null)
        .map(() => ({
          reps: template.category === "cardio" ? undefined : Number.parseInt(ex.reps.split("-")[0]) || 0,
          weight: ex.weight || 0,
          unit: "lb" as const,
          time: template.category === "cardio" ? 30 : undefined,
          distance: template.category === "cardio" ? 0.25 : undefined,
          intensity: template.category === "cardio" ? ("medium" as const) : undefined,
        })),
    }))

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises,
      label: template.category as any,
    }))
  }

  const startWorkout = async () => {
    const startTime = new Date()
    setWorkoutStartTime(startTime)
    
    const workout: WorkoutLog = {
      ...(currentWorkout as WorkoutLog),
      start_time: startTime.toISOString(),
      in_progress: true,
    }

    try {
      await saveWorkout(workout)
      onWorkoutStart?.(workout)
    } catch (error) {
      console.error('Error starting workout:', error)
    }
  }

  const finishWorkout = async () => {
    if (workoutStartTime && workoutInProgress) {
      const endTime = new Date()
      const duration = Math.round((endTime.getTime() - workoutStartTime.getTime()) / 60000)

      const workout = {
        ...workoutInProgress,
        end_time: endTime.toISOString(),
        duration,
        in_progress: false,
      }

      try {
        await updateWorkout(workout.id, workout)
        setCompletedWorkout(workout)
        setShowCompletionModal(true)
      } catch (error) {
        console.error('Error finishing workout:', error)
      }
    }
  }

  const confirmWorkout = () => {
    if (completedWorkout) {
      onWorkoutFinish?.(completedWorkout)
      setShowCompletionModal(false)
      setCompletedWorkout(null)
      setWorkoutStartTime(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickWorkouts.map((workout, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Dumbbell className="h-4 w-4" />
                    <h3 className="font-medium">{workout.name}</h3>
                  </div>
                  <ul className="text-sm text-gray-600 mb-3">
                    {workout.exercises.map((exercise, i) => (
                      <li key={i}>• {exercise}</li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onStartWorkout?.(workout)}
                  >
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Workout</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("custom-workout-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="custom-workout-widget">
          <Card>
            <CardHeader>
              <CardTitle>Custom Workout</CardTitle>
              <CardDescription>Create your own workout or modify a template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-type">Workout Type</Label>
                <Select
                  value={currentWorkout.label}
                  onValueChange={(value) => setCurrentWorkout((prev) => ({ ...prev, label: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addExercise} variant="outline" className="w-full bg-transparent">
                Add Exercise
              </Button>

              {currentWorkout.exercises && currentWorkout.exercises.length > 0 && (
                <div className="space-y-4">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Exercise name (e.g., Bench Press)"
                            value={exercise.name}
                            onChange={(e) => {
                              const updatedExercises = [...(currentWorkout.exercises || [])]
                              updatedExercises[index] = { ...exercise, name: e.target.value }
                              setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
                            }}
                            className="flex-1 mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">Sets: {exercise.sets.length}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={startWorkout}
                  disabled={!currentWorkout.exercises?.length || workoutInProgress !== null}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
                {workoutInProgress && (
                  <Button onClick={finishWorkout} variant="outline" className="flex-1 bg-transparent">
                    <Square className="h-4 w-4 mr-2" />
                    Finish Workout
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workout Completion Modal */}
      {showCompletionModal && completedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Workout Complete!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold capitalize">{completedWorkout.label} Workout</p>
                <p className="text-sm text-gray-600">Duration: {completedWorkout.duration} minutes</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Exercises Completed:</h4>
                {completedWorkout.exercises?.map((exercise, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">{exercise.sets.length} sets</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button onClick={confirmWorkout} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm & Save
                </Button>
                <Button onClick={() => setShowCompletionModal(false)} variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
