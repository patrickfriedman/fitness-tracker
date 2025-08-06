"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Play, Clock, Target, Calendar } from 'lucide-react'

interface Exercise {
  name: string
  sets: number
  reps: string
  weight?: number
  notes?: string
}

interface WorkoutPlan {
  id: string
  name: string
  type: string
  duration: number
  exercises: Exercise[]
  date?: string
}

interface WorkoutPlannerProps {
  onStartWorkout?: (workout: any) => void
}

export function WorkoutPlanner({ onStartWorkout }: WorkoutPlannerProps) {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "",
    type: "strength",
    duration: 60,
    exercises: [{ name: "", sets: 3, reps: "8-12", weight: 0, notes: "" }]
  })

  useEffect(() => {
    // Load sample workout plans
    const samplePlans: WorkoutPlan[] = [
      {
        id: "1",
        name: "Push Day",
        type: "strength",
        duration: 60,
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: 135 },
          { name: "Overhead Press", sets: 3, reps: "8-12", weight: 95 },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 60 },
          { name: "Tricep Dips", sets: 3, reps: "12-15" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", weight: 20 }
        ]
      },
      {
        id: "2",
        name: "Pull Day",
        type: "strength",
        duration: 55,
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "6-10" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", weight: 115 },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: 120 },
          { name: "Face Pulls", sets: 3, reps: "15-20", weight: 40 },
          { name: "Barbell Curls", sets: 3, reps: "10-12", weight: 65 }
        ]
      },
      {
        id: "3",
        name: "Leg Day",
        type: "strength",
        duration: 70,
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: 185 },
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", weight: 135 },
          { name: "Bulgarian Split Squats", sets: 3, reps: "12 each leg", weight: 40 },
          { name: "Leg Curls", sets: 3, reps: "12-15", weight: 80 },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: 45 }
        ]
      }
    ]
    
    const stored = localStorage.getItem("fitness-workout-plans")
    if (stored) {
      setWorkoutPlans(JSON.parse(stored))
    } else {
      setWorkoutPlans(samplePlans)
      localStorage.setItem("fitness-workout-plans", JSON.stringify(samplePlans))
    }
  }, [])

  const handleSavePlan = () => {
    const plan: WorkoutPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      type: newPlan.type,
      duration: newPlan.duration,
      exercises: newPlan.exercises.filter(ex => ex.name.trim() !== "")
    }

    const updated = [plan, ...workoutPlans]
    setWorkoutPlans(updated)
    localStorage.setItem("fitness-workout-plans", JSON.stringify(updated))
    
    setNewPlan({
      name: "",
      type: "strength",
      duration: 60,
      exercises: [{ name: "", sets: 3, reps: "8-12", weight: 0, notes: "" }]
    })
    setIsOpen(false)
  }

  const addExercise = () => {
    setNewPlan(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: 3, reps: "8-12", weight: 0, notes: "" }]
    }))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setNewPlan(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }))
  }

  const handleStartWorkout = (plan: WorkoutPlan) => {
    if (onStartWorkout) {
      onStartWorkout({
        id: plan.id,
        name: plan.name,
        exercises: plan.exercises.map(ex => ({
          exerciseName: ex.name,
          sets: Array(ex.sets).fill({ reps: 0, weight: ex.weight || 0 })
        }))
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Workout Plans</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Workout Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan-name">Plan Name</Label>
                    <Input
                      id="plan-name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Push Day"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Exercises</Label>
                  {newPlan.exercises.map((exercise, index) => (
                    <div key={index} className="border rounded p-3 space-y-3">
                      <Input
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, "name", e.target.value)}
                        placeholder="Exercise name"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Sets</Label>
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Reps</Label>
                          <Input
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, "reps", e.target.value)}
                            placeholder="8-12"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Weight (lbs)</Label>
                          <Input
                            type="number"
                            value={exercise.weight || ""}
                            onChange={(e) => updateExercise(index, "weight", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addExercise}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                
                <Button onClick={handleSavePlan} className="w-full">
                  Save Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <Badge variant="outline">{plan.type}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>{plan.exercises.length} exercises</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {plan.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {exercise.name}
                        </div>
                      ))}
                      {plan.exercises.length > 3 && (
                        <div className="text-sm text-gray-400">
                          +{plan.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartWorkout(plan)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
