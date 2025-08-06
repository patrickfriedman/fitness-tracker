"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Dumbbell, Clock, Target } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
}

interface Workout {
  id: string
  name: string
  date: string
  duration: number
  exercises: Exercise[]
}

export function WorkoutLogger() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Push Day",
      date: "2024-01-15",
      duration: 75,
      exercises: [
        { id: "1", name: "Bench Press", sets: 4, reps: 8, weight: 185 },
        { id: "2", name: "Shoulder Press", sets: 3, reps: 10, weight: 135 },
        { id: "3", name: "Tricep Dips", sets: 3, reps: 12, weight: 0 },
      ]
    }
  ])

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [] as Exercise[],
  })

  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  })

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        sets: parseInt(newExercise.sets),
        reps: parseInt(newExercise.reps),
        weight: parseFloat(newExercise.weight) || 0,
      }
      
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }))
      
      setNewExercise({ name: "", sets: "", reps: "", weight: "" })
    }
  }

  const saveWorkout = () => {
    if (newWorkout.name && newWorkout.exercises.length > 0) {
      const workout: Workout = {
        id: Date.now().toString(),
        name: newWorkout.name,
        date: new Date().toISOString().split('T')[0],
        duration: 60, // Default duration
        exercises: newWorkout.exercises,
      }
      
      setWorkouts(prev => [workout, ...prev])
      setNewWorkout({ name: "", exercises: [] })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Dumbbell className="h-5 w-5 mr-2" />
          Workout Logger
        </CardTitle>
        <Dialog>
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
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  id="workoutName"
                  placeholder="e.g., Push Day, Leg Day"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Exercise</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseName">Exercise</Label>
                    <Select value={newExercise.name} onValueChange={(value) => setNewExercise(prev => ({ ...prev, name: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bench Press">Bench Press</SelectItem>
                        <SelectItem value="Squat">Squat</SelectItem>
                        <SelectItem value="Deadlift">Deadlift</SelectItem>
                        <SelectItem value="Shoulder Press">Shoulder Press</SelectItem>
                        <SelectItem value="Pull-ups">Pull-ups</SelectItem>
                        <SelectItem value="Rows">Rows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="185"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      placeholder="4"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      placeholder="8"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={addExercise} variant="outline" className="w-full">
                  Add Exercise
                </Button>
              </div>
              
              {newWorkout.exercises.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Exercises Added:</h4>
                  {newWorkout.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{exercise.name}</span>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{exercise.sets} sets</Badge>
                        <Badge variant="outline">{exercise.reps} reps</Badge>
                        {exercise.weight > 0 && <Badge variant="outline">{exercise.weight} lbs</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button onClick={saveWorkout} className="w-full" disabled={!newWorkout.name || newWorkout.exercises.length === 0}>
                Save Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workouts logged yet</p>
            <p className="text-sm">Start by logging your first workout!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{workout.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {workout.duration}min
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise.id} variant="secondary" className="text-xs">
                      {exercise.name}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(workout.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
