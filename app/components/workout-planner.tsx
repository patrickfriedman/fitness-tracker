"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Play, Plus } from 'lucide-react'
import type { Workout } from "@/types/fitness"

interface WorkoutPlannerProps {
  onStartWorkout?: (workout: Workout) => void
}

export function WorkoutPlanner({ onStartWorkout }: WorkoutPlannerProps) {
  const [plannedWorkouts, setPlannedWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    // Load sample workout templates
    const sampleWorkouts: Workout[] = [
      {
        id: "1",
        name: "Push Day",
        date: new Date().toISOString(),
        duration: 60,
        exercises: [
          {
            id: "1",
            exerciseName: "Bench Press",
            sets: [
              { reps: 8, weight: 135, completed: false },
              { reps: 8, weight: 145, completed: false },
              { reps: 6, weight: 155, completed: false },
            ],
            restTime: 120,
            notes: "Focus on controlled movement"
          },
          {
            id: "2",
            exerciseName: "Overhead Press",
            sets: [
              { reps: 10, weight: 95, completed: false },
              { reps: 8, weight: 105, completed: false },
              { reps: 6, weight: 115, completed: false },
            ],
            restTime: 90,
            notes: ""
          },
          {
            id: "3",
            exerciseName: "Dips",
            sets: [
              { reps: 12, weight: 0, completed: false },
              { reps: 10, weight: 0, completed: false },
              { reps: 8, weight: 0, completed: false },
            ],
            restTime: 60,
            notes: "Bodyweight"
          }
        ],
        notes: "Upper body push muscles"
      },
      {
        id: "2",
        name: "Pull Day",
        date: new Date().toISOString(),
        duration: 55,
        exercises: [
          {
            id: "4",
            exerciseName: "Pull-ups",
            sets: [
              { reps: 8, weight: 0, completed: false },
              { reps: 6, weight: 0, completed: false },
              { reps: 4, weight: 0, completed: false },
            ],
            restTime: 120,
            notes: "Full range of motion"
          },
          {
            id: "5",
            exerciseName: "Barbell Rows",
            sets: [
              { reps: 10, weight: 135, completed: false },
              { reps: 8, weight: 145, completed: false },
              { reps: 6, weight: 155, completed: false },
            ],
            restTime: 90,
            notes: "Keep back straight"
          },
          {
            id: "6",
            exerciseName: "Face Pulls",
            sets: [
              { reps: 15, weight: 40, completed: false },
              { reps: 12, weight: 50, completed: false },
              { reps: 10, weight: 60, completed: false },
            ],
            restTime: 60,
            notes: "High reps for rear delts"
          }
        ],
        notes: "Upper body pull muscles"
      },
      {
        id: "3",
        name: "Leg Day",
        date: new Date().toISOString(),
        duration: 70,
        exercises: [
          {
            id: "7",
            exerciseName: "Squats",
            sets: [
              { reps: 10, weight: 185, completed: false },
              { reps: 8, weight: 205, completed: false },
              { reps: 6, weight: 225, completed: false },
            ],
            restTime: 180,
            notes: "Go deep, control the weight"
          },
          {
            id: "8",
            exerciseName: "Romanian Deadlifts",
            sets: [
              { reps: 10, weight: 155, completed: false },
              { reps: 8, weight: 175, completed: false },
              { reps: 6, weight: 195, completed: false },
            ],
            restTime: 120,
            notes: "Feel the hamstring stretch"
          },
          {
            id: "9",
            exerciseName: "Walking Lunges",
            sets: [
              { reps: 20, weight: 0, completed: false },
              { reps: 16, weight: 0, completed: false },
              { reps: 12, weight: 0, completed: false },
            ],
            restTime: 90,
            notes: "Bodyweight, focus on balance"
          }
        ],
        notes: "Lower body strength and power"
      }
    ]
    
    setPlannedWorkouts(sampleWorkouts)
  }, [])

  const handleStartWorkout = (workout: Workout) => {
    if (onStartWorkout) {
      onStartWorkout(workout)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Workout Plans</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Create Plan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plannedWorkouts.map((workout) => (
            <div key={workout.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{workout.name}</h3>
                <Button
                  size="sm"
                  onClick={() => handleStartWorkout(workout)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {workout.duration} min
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {workout.exercises.length} exercises
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Exercises:</p>
                <div className="flex flex-wrap gap-2">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise.id} variant="outline" className="text-xs">
                      {exercise.exerciseName}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {workout.notes && (
                <p className="text-sm text-gray-600 italic">{workout.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
