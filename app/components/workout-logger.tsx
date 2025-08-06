"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Dumbbell, Clock, Calendar } from 'lucide-react'
import type { Workout } from "@/types/fitness"

export function WorkoutLogger() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    exercises: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("fitness-workouts")
    if (stored) {
      setWorkouts(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      date: new Date().toISOString(),
      duration: parseInt(newWorkout.duration),
      exercises: newWorkout.exercises.split(',').map((exercise, index) => ({
        id: `${Date.now()}-${index}`,
        exerciseName: exercise.trim(),
        sets: [],
        restTime: 60,
        notes: ""
      })),
      notes: ""
    }

    const updatedWorkouts = [workout, ...workouts]
    setWorkouts(updatedWorkouts)
    localStorage.setItem("fitness-workouts", JSON.stringify(updatedWorkouts))
    
    setNewWorkout({ name: "", duration: "", exercises: "" })
    setIsOpen(false)
  }

  const recentWorkouts = workouts.slice(0, 3)

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
          <DialogContent>
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
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="exercises">Exercises (comma separated)</Label>
                <Input
                  id="exercises"
                  value={newWorkout.exercises}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, exercises: e.target.value }))}
                  placeholder="Bench Press, Squats, Deadlifts"
                />
              </div>
              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={!newWorkout.name || !newWorkout.duration}
              >
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
              <div key={workout.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{workout.name}</h3>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {workout.duration}m
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(workout.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  {workout.exercises.length} exercises
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Dumbbell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No workouts logged yet</p>
            <Button size="sm" onClick={() => setIsOpen(true)}>
              Log First Workout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
