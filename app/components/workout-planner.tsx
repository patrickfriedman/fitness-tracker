"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Play } from 'lucide-react'

interface PlannedWorkout {
  id: string
  name: string
  date: string
  time: string
  duration: number
  type: string
  exercises: string[]
}

export function WorkoutPlanner() {
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([
    {
      id: "1",
      name: "Upper Body Strength",
      date: "2024-01-16",
      time: "09:00",
      duration: 60,
      type: "Strength",
      exercises: ["Bench Press", "Pull-ups", "Shoulder Press", "Rows"]
    },
    {
      id: "2",
      name: "Cardio & Core",
      date: "2024-01-17",
      time: "18:00",
      duration: 45,
      type: "Cardio",
      exercises: ["Treadmill", "Planks", "Russian Twists", "Mountain Climbers"]
    },
    {
      id: "3",
      name: "Leg Day",
      date: "2024-01-18",
      time: "10:00",
      duration: 75,
      type: "Strength",
      exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"]
    }
  ])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strength':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'cardio':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'flexibility':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    return date === today
  }

  const isPast = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    return date < today
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Workout Planner
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Plan Workout
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {plannedWorkouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workouts planned</p>
            <p className="text-sm">Plan your first workout to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {plannedWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className={`border rounded-lg p-4 ${
                  isToday(workout.date) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
                  isPast(workout.date) ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{workout.name}</h4>
                    {isToday(workout.date) && (
                      <Badge variant="default" className="text-xs">Today</Badge>
                    )}
                  </div>
                  <Badge className={`text-xs ${getTypeColor(workout.type)}`}>
                    {workout.type}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{workout.time} ({workout.duration}min)</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {exercise}
                    </Badge>
                  ))}
                  {workout.exercises.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{workout.exercises.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {isToday(workout.date) && (
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Start Workout
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className={isToday(workout.date) ? '' : 'flex-1'}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
