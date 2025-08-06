"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Dumbbell, Clock, Calendar } from 'lucide-react'

interface WorkoutLog {
  id: string
  name: string
  exercises: {
    name: string
    sets: { reps: number; weight: number }[]
  }[]
  duration: number
  date: string
}

export function WorkoutLogger() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [{ name: "", sets: [{ reps: 0, weight: 0 }] }]
  })

  useEffect(() => {
    const stored = localStorage.getItem("fitness-workouts")
    if (stored) {
      setWorkouts(JSON.parse(stored))
    }
  }, [])

  const handleSaveWorkout = () => {
    const workout: WorkoutLog = {
      id: Date.now().toString(),
      name: newWorkout.name,
      exercises: newWorkout.exercises.filter(ex => ex.name.trim() !== ""),
      duration: 45, // Default duration
      date: new Date().toISOString()
    }

    const updated = [workout, ...workouts]
    setWorkouts(updated)
    localStorage.setItem("fitness-workouts", JSON.stringify(updated))
    
    setNewWorkout({
      name: "",
      exercises: [{ name: "", sets: [{ reps: 0, weight: 0 }] }]
    })
    setIsOpen(false)
  }

  const addExercise = () => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: [{ reps: 0, weight: 0 }] }]
    }))
  }

  const updateExercise = (index: number, field: string, value: string) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }))
  }

  const recentWorkouts = workouts.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recent Workouts</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Push Day, Leg Day"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Exercises</Label>
                {newWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <Input
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, "name", e.target.value)}
                      placeholder="Exercise name"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addExercise}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                </Button>
              </div>
              
              <Button onClick={handleSaveWorkout} className="w-full">
                Save Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {recentWorkouts.length > 0 ? (
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{workout.name}</h4>
                  <Badge variant="secondary">
                    {new Date(workout.date).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Dumbbell className="h-4 w-4" />
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{workout.duration} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No workouts logged yet</p>
            <p className="text-gray-400 text-sm">Start by logging your first workout</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
