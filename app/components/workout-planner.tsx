"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Dumbbell, Play, Trash2 } from 'lucide-react'
import type { Workout, WorkoutExercise } from "@/types/fitness"

interface WorkoutPlannerProps {
  onStartWorkout: (workout: Workout) => void
}

export function WorkoutPlanner({ onStartWorkout }: WorkoutPlannerProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Push Day",
      exercises: [
        {
          exerciseName: "Bench Press",
          sets: [
            { reps: 10, weight: 135 },
            { reps: 8, weight: 155 },
            { reps: 6, weight: 175 }
          ]
        },
        {
          exerciseName: "Shoulder Press",
          sets: [
            { reps: 12, weight: 65 },
            { reps: 10, weight: 75 },
            { reps: 8, weight: 85 }
          ]
        }
      ]
    },
    {
      id: "2",
      name: "Pull Day",
      exercises: [
        {
          exerciseName: "Pull-ups",
          sets: [
            { reps: 8 },
            { reps: 6 },
            { reps: 5 }
          ]
        },
        {
          exerciseName: "Barbell Rows",
          sets: [
            { reps: 10, weight: 135 },
            { reps: 8, weight: 155 }
          ]
        }
      ]
    }
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    name: "",
    exercises: []
  })

  const handleCreateWorkout = () => {
    if (newWorkout.name && newWorkout.exercises) {
      const workout: Workout = {
        id: Date.now().toString(),
        name: newWorkout.name,
        exercises: newWorkout.exercises
      }
      setWorkouts([...workouts, workout])
      setNewWorkout({ name: "", exercises: [] })
      setIsCreating(false)
    }
  }

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Planner</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
            </DialogHeader>
            <WorkoutForm
              workout={newWorkout}
              onChange={setNewWorkout}
              onSave={handleCreateWorkout}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{workout.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartWorkout(workout)}
                >
                  <Play className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteWorkout(workout.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {workout.exercises.length} exercises
                </p>
                <ul className="text-sm space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Dumbbell className="h-3 w-3" />
                      <span>{exercise.exerciseName}</span>
                      <span className="text-gray-500">
                        {exercise.sets.length} sets
                      </span>
                    </li>
                  ))}
                  {workout.exercises.length > 3 && (
                    <li className="text-gray-500">
                      +{workout.exercises.length - 3} more exercises
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WorkoutForm({ 
  workout, 
  onChange, 
  onSave, 
  onCancel 
}: {
  workout: Partial<Workout>
  onChange: (workout: Partial<Workout>) => void
  onSave: () => void
  onCancel: () => void
}) {
  const [newExercise, setNewExercise] = useState<Partial<WorkoutExercise>>({
    exerciseName: "",
    sets: [{ reps: 10, weight: 0 }]
  })

  const addExercise = () => {
    if (newExercise.exerciseName && newExercise.sets) {
      const exercises = [...(workout.exercises || []), newExercise as WorkoutExercise]
      onChange({ ...workout, exercises })
      setNewExercise({ exerciseName: "", sets: [{ reps: 10, weight: 0 }] })
    }
  }

  const removeExercise = (index: number) => {
    const exercises = workout.exercises?.filter((_, i) => i !== index) || []
    onChange({ ...workout, exercises })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="workoutName">Workout Name</Label>
        <Input
          id="workoutName"
          value={workout.name || ""}
          onChange={(e) => onChange({ ...workout, name: e.target.value })}
          placeholder="Enter workout name"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Exercises</h3>
        <div className="space-y-4">
          {workout.exercises?.map((exercise, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{exercise.exerciseName}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeExercise(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {exercise.sets.length} sets
              </div>
            </div>
          ))}
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium mb-4">Add Exercise</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exerciseName">Exercise Name</Label>
              <Input
                id="exerciseName"
                value={newExercise.exerciseName || ""}
                onChange={(e) => setNewExercise({ ...newExercise, exerciseName: e.target.value })}
                placeholder="e.g., Bench Press"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={newExercise.sets?.[0]?.reps || 10}
                  onChange={(e) => {
                    const sets = [{ ...newExercise.sets?.[0], reps: Number(e.target.value) }]
                    setNewExercise({ ...newExercise, sets })
                  }}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newExercise.sets?.[0]?.weight || 0}
                  onChange={(e) => {
                    const sets = [{ ...newExercise.sets?.[0], weight: Number(e.target.value) }]
                    setNewExercise({ ...newExercise, sets })
                  }}
                />
              </div>
            </div>
            <Button onClick={addExercise} className="w-full">
              Add Exercise
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!workout.name || !workout.exercises?.length}>
          Create Workout
        </Button>
      </div>
    </div>
  )
}
