"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock, Dumbbell } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  sets: Array<{ reps: number; weight: number }>
}

export function WorkoutLogger() {
  const [workout, setWorkout] = useState({
    name: "",
    exercises: [] as Exercise[]
  })
  const [newExercise, setNewExercise] = useState("")

  const addExercise = () => {
    if (newExercise.trim()) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise,
        sets: [{ reps: 0, weight: 0 }]
      }
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }))
      setNewExercise("")
    }
  }

  const addSet = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { reps: 0, weight: 0 }] }
          : ex
      )
    }))
  }

  const updateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    }))
  }

  const removeExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }))
  }

  const saveWorkout = () => {
    if (workout.exercises.length > 0) {
      // In a real app, this would save to the database
      console.log("Saving workout:", workout)
      alert("Workout saved!")
      setWorkout({ name: "", exercises: [] })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dumbbell className="h-5 w-5" />
          <span>Log Workout</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            placeholder="e.g., Push Day, Leg Day"
            value={workout.name}
            onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Add Exercise</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Exercise name"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExercise()}
            />
            <Button onClick={addExercise}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{exercise.name}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center space-x-2">
                    <Badge variant="outline">Set {setIndex + 1}</Badge>
                    <Input
                      type="number"
                      placeholder="Reps"
                      className="w-20"
                      value={set.reps || ""}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                    />
                    <span className="text-sm text-gray-500">reps @</span>
                    <Input
                      type="number"
                      placeholder="Weight"
                      className="w-24"
                      value={set.weight || ""}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                    />
                    <span className="text-sm text-gray-500">lbs</span>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addSet(exercise.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Set
                </Button>
              </div>
            </div>
          ))}
        </div>

        {workout.exercises.length > 0 && (
          <Button onClick={saveWorkout} className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            Save Workout
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
