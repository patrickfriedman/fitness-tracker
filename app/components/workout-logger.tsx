"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Dumbbell, Clock, Save } from 'lucide-react'

export function WorkoutLogger() {
  const [isOpen, setIsOpen] = useState(false)
  const [workoutData, setWorkoutData] = useState({
    name: "",
    duration: "",
    exercises: "",
    notes: ""
  })
  const [recentWorkouts, setRecentWorkouts] = useState([
    { id: 1, name: "Push Day", date: "2024-01-15", duration: 45 },
    { id: 2, name: "Pull Day", date: "2024-01-13", duration: 50 },
    { id: 3, name: "Leg Day", date: "2024-01-11", duration: 60 }
  ])

  const handleSave = () => {
    if (workoutData.name && workoutData.duration) {
      const newWorkout = {
        id: Date.now(),
        name: workoutData.name,
        date: new Date().toISOString().split('T')[0],
        duration: parseInt(workoutData.duration)
      }
      setRecentWorkouts(prev => [newWorkout, ...prev.slice(0, 4)])
      setWorkoutData({ name: "", duration: "", exercises: "", notes: "" })
      setIsOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Dumbbell className="mr-2 h-5 w-5" />
          Workout Logger
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  placeholder="e.g., Push Day, Cardio Session"
                  value={workoutData.name}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="45"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="exercises">Exercises</Label>
                <Textarea
                  id="exercises"
                  placeholder="List your exercises..."
                  value={workoutData.exercises}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, exercises: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did it go?"
                  value={workoutData.notes}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">Recent Workouts</h3>
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-sm">{workout.name}</p>
                <p className="text-xs text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-1 h-3 w-3" />
                {workout.duration}m
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
