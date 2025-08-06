"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, Target } from 'lucide-react'

interface PlannedWorkout {
  id: string
  name: string
  date: string
  duration: number
  type: string
  completed: boolean
}

export function WorkoutPlanner() {
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([
    {
      id: "1",
      name: "Push Day",
      date: "2024-01-16",
      duration: 60,
      type: "Strength",
      completed: false
    },
    {
      id: "2",
      name: "Cardio Session",
      date: "2024-01-17",
      duration: 30,
      type: "Cardio",
      completed: false
    },
    {
      id: "3",
      name: "Pull Day",
      date: "2024-01-18",
      duration: 60,
      type: "Strength",
      completed: true
    }
  ])

  const toggleWorkoutComplete = (id: string) => {
    setPlannedWorkouts(prev =>
      prev.map(workout =>
        workout.id === id
          ? { ...workout, completed: !workout.completed }
          : workout
      )
    )
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Workout Planner</span>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {plannedWorkouts.map((workout) => (
          <div
            key={workout.id}
            className={`p-4 border rounded-lg transition-all ${
              workout.completed
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${workout.completed ? "line-through text-gray-500" : ""}`}>
                {workout.name}
              </h4>
              <Badge className={getTypeColor(workout.type)}>
                {workout.type}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(workout.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{workout.duration} min</span>
              </div>
            </div>
            
            <Button
              size="sm"
              variant={workout.completed ? "outline" : "default"}
              onClick={() => toggleWorkoutComplete(workout.id)}
              className="w-full"
            >
              {workout.completed ? (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark Complete"
              )}
            </Button>
          </div>
        ))}
        
        {plannedWorkouts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workouts planned yet</p>
            <Button className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Plan Your First Workout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
