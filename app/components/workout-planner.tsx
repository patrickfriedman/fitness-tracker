"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Wand2, Download, Play, Plus, Minus, Trash2 } from "lucide-react"
import type { WorkoutPlan } from "../../types/fitness"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface WorkoutPlannerProps {
  userId: string
}

interface ExerciseSet {
  reps?: number
  weight?: number
  distance?: number
  time?: number
  unit: string
}

interface Exercise {
  name: string
  sets: ExerciseSet[]
}

interface Workout {
  label: string
  exercises?: Exercise[]
}

interface CustomTemplate {
  id: string
  name: string
  category: string
  exercises: Exercise[]
}

interface CommonWorkout {
  name: string
  exercises: string[]
  frequency: number
  lastUsed: string
}

export function WorkoutPlanner({ userId }: WorkoutPlannerProps) {
  const [textInput, setTextInput] = useState(`Day 1 – Push:
Bench Press 3×5
Incline DB Press 4×10
Overhead Press 3×8
Tricep Dips 3×12

Day 2 – Pull:
Deadlift 1×5
Pull-ups 4×8
Barbell Rows 4×10
Face Pulls 3×15

Day 3 – Legs:
Squat 3×5
Romanian Deadlift 3×8
Leg Press 4×12
Calf Raises 4×15`)

  const [parsedPlan, setParsedPlan] = useState<WorkoutPlan | null>(null)
  const [savedPlans, setSavedPlans] = useState<WorkoutPlan[]>([
    {
      name: "Push/Pull/Legs Split",
      days: [
        {
          name: "Push Day",
          exercises: [
            {
              name: "Bench Press",
              sets: [
                { reps: 5, weight: 0, unit: "lb" },
                { reps: 5, weight: 0, unit: "lb" },
                { reps: 5, weight: 0, unit: "lb" },
              ],
            },
            {
              name: "Incline DB Press",
              sets: [
                { reps: 10, weight: 0, unit: "lb" },
                { reps: 10, weight: 0, unit: "lb" },
                { reps: 10, weight: 0, unit: "lb" },
                { reps: 10, weight: 0, unit: "lb" },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")

  const [currentWorkout, setCurrentWorkout] = useState<Workout>({
    label: "strength",
    exercises: [],
  })

  const [workoutInProgress, setWorkoutInProgress] = useState<boolean | null>(null)

  // Common workouts based on user history
  const [commonWorkouts] = useState<CommonWorkout[]>([
    {
      name: "Push Day",
      exercises: ["Bench Press", "Overhead Press", "Tricep Dips"],
      frequency: 15,
      lastUsed: "2025-01-25",
    },
    { name: "Pull Day", exercises: ["Deadlift", "Pull-ups", "Barbell Rows"], frequency: 12, lastUsed: "2025-01-24" },
    { name: "Leg Day", exercises: ["Squat", "Romanian Deadlift", "Leg Press"], frequency: 10, lastUsed: "2025-01-23" },
    {
      name: "Upper Body",
      exercises: ["Bench Press", "Barbell Rows", "Overhead Press"],
      frequency: 8,
      lastUsed: "2025-01-22",
    },
    { name: "Full Body", exercises: ["Squat", "Bench Press", "Barbell Rows"], frequency: 6, lastUsed: "2025-01-21" },
    {
      name: "Cardio HIIT",
      exercises: ["Treadmill Intervals", "Burpees", "Mountain Climbers"],
      frequency: 20,
      lastUsed: "2025-01-26",
    },
  ])

  const addExercise = () => {
    const newExercise: Exercise = {
      name: "Bench Press",
      sets: [{ reps: 0, weight: 0, unit: "lb" }],
    }

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise],
    }))
  }

  const addCommonWorkout = (commonWorkout: CommonWorkout) => {
    const exercises: Exercise[] = commonWorkout.exercises.map((exerciseName: string) => ({
      name: exerciseName,
      sets: [{ reps: 0, weight: 0, unit: "lb" }],
    }))

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises,
    }))
  }

  const updateExercise = (exerciseIndex: number, field: string, value: any) => {
    const updatedExercises = [...(currentWorkout.exercises || [])]
    if (field === "name") {
      updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], name: value }
    }
    setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    const updatedExercises = [...(currentWorkout.exercises || [])]
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]:
        field === "reps" || field === "weight" || field === "distance" || field === "time"
          ? Number.parseFloat(value) || 0
          : value,
    }
    setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
  }

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...(currentWorkout.exercises || [])]
    const newSet = { reps: 0, weight: 0, unit: "lb" }
    updatedExercises[exerciseIndex].sets.push(newSet)
    setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...(currentWorkout.exercises || [])]
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1)
      setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
    }
  }

  const removeExercise = (exerciseIndex: number) => {
    const updatedExercises = currentWorkout.exercises?.filter((_, i) => i !== exerciseIndex) || []
    setCurrentWorkout((prev) => ({ ...prev, exercises: updatedExercises }))
  }

  const saveAsTemplate = () => {
    if (newTemplateName && currentWorkout.exercises?.length) {
      const newTemplate: CustomTemplate = {
        id: `custom-${Date.now()}`,
        name: newTemplateName,
        category: currentWorkout.label,
        exercises: currentWorkout.exercises,
      }

      setCustomTemplates((prev) => [...prev, newTemplate])
      setIsCreatingTemplate(false)
      setNewTemplateName("")
    }
  }

  const deleteCustomTemplate = (templateId: string) => {
    setCustomTemplates((prev) => prev.filter((template) => template.id !== templateId))
  }

  const loadTemplate = (template: CustomTemplate) => {
    setCurrentWorkout({
      label: template.category,
      exercises: template.exercises,
    })
  }

  const startWorkout = () => {
    setWorkoutInProgress(true)
  }

  const parseWorkoutText = (text: string): WorkoutPlan => {
    const lines = text.split("\n").filter((line) => line.trim())
    const plan: WorkoutPlan = { name: "Custom Plan", days: [] }

    let currentDay: any = null

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (trimmed.toLowerCase().includes("day") && trimmed.includes(":")) {
        if (currentDay) {
          plan.days.push(currentDay)
        }
        currentDay = {
          name: trimmed,
          exercises: [],
        }
      } else if (currentDay && trimmed) {
        const exerciseMatch = trimmed.match(/^(.+?)\s+(\d+)×(\d+(?:-\d+)?|\d+\+?)(.*)$/)
        if (exerciseMatch) {
          const [, name, sets, reps, notes] = exerciseMatch
          currentDay.exercises.push({
            name: name.trim(),
            sets: Array.from({ length: Number.parseInt(sets) }, () => ({
              reps: Number.parseInt(reps),
              weight: 0,
              unit: "lb",
            })),
          })
        } else {
          currentDay.exercises.push({
            name: trimmed,
            sets: Array.from({ length: 3 }, () => ({ reps: 10, weight: 0, unit: "lb" })),
          })
        }
      }
    })

    if (currentDay) {
      plan.days.push(currentDay)
    }

    return plan
  }

  const handleParse = () => {
    const parsed = parseWorkoutText(textInput)
    setParsedPlan(parsed)
  }

  const savePlan = () => {
    if (parsedPlan) {
      setSavedPlans((prev) => [...prev, parsedPlan])
      setParsedPlan(null)
      setTextInput("")
    }
  }

  const generateTemplate = (type: string) => {
    const templates = {
      "push-pull-legs": `Day 1 – Push:
Bench Press 3×5
Incline DB Press 4×10
Overhead Press 3×8
Lateral Raises 3×12
Tricep Dips 3×12
Close Grip Bench 3×10

Day 2 – Pull:
Deadlift 1×5
Pull-ups 4×8
Barbell Rows 4×10
Cable Rows 3×12
Face Pulls 3×15
Barbell Curls 3×10

Day 3 – Legs:
Squat 3×5
Romanian Deadlift 3×8
Leg Press 4×12
Leg Curls 3×12
Calf Raises 4×15
Walking Lunges 3×20`,

      "upper-lower": `Day 1 – Upper:
Bench Press 4×6
Barbell Rows 4×6
Overhead Press 3×8
Pull-ups 3×8
Dips 3×10
Barbell Curls 3×10

Day 2 – Lower:
Squat 4×6
Romanian Deadlift 3×8
Leg Press 3×12
Leg Curls 3×10
Calf Raises 4×12
Abs Circuit 3×15`,

      "full-body": `Day 1 – Full Body:
Squat 3×8
Bench Press 3×8
Barbell Rows 3×8
Overhead Press 3×8
Romanian Deadlift 3×8
Pull-ups 3×8
Plank 3×30s`,
    }

    setTextInput(templates[type as keyof typeof templates] || "")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setTextInput(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="quick">Quick Add</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Common Workouts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {commonWorkouts
                  .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
                  .map((workout, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 justify-between bg-transparent"
                      onClick={() => addCommonWorkout(workout)}
                    >
                      <div className="text-left">
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{workout.exercises.join(", ")}</p>
                        <p className="text-xs text-gray-500">
                          Last used: {new Date(workout.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {workout.frequency}x
                      </Badge>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Create Your Own Workout Plan</span>
                </div>
                {currentWorkout.exercises?.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setIsCreatingTemplate(true)}>
                    Save as Template
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={addExercise} variant="outline" className="w-full bg-transparent">
                Add Exercise
              </Button>

              {currentWorkout.exercises && currentWorkout.exercises.length > 0 && (
                <div className="space-y-4">
                  {currentWorkout.exercises.map((exercise, exerciseIndex) => (
                    <Card key={exerciseIndex} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Exercise</Label>
                            <Select
                              value={exercise.name}
                              onValueChange={(value) => updateExercise(exerciseIndex, "name", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select exercise" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bench Press">Bench Press</SelectItem>
                                <SelectItem value="Squat">Squat</SelectItem>
                                <SelectItem value="Deadlift">Deadlift</SelectItem>
                                <SelectItem value="Pull-ups">Pull-ups</SelectItem>
                                <SelectItem value="Push-ups">Push-ups</SelectItem>
                                <SelectItem value="Overhead Press">Overhead Press</SelectItem>
                                <SelectItem value="Barbell Rows">Barbell Rows</SelectItem>
                                <SelectItem value="Incline Dumbbell Press">Incline Dumbbell Press</SelectItem>
                                <SelectItem value="Leg Press">Leg Press</SelectItem>
                                <SelectItem value="Leg Curls">Leg Curls</SelectItem>
                                <SelectItem value="Calf Raises">Calf Raises</SelectItem>
                                <SelectItem value="Tricep Dips">Tricep Dips</SelectItem>
                                <SelectItem value="Bicep Curls">Bicep Curls</SelectItem>
                                <SelectItem value="Lateral Raises">Lateral Raises</SelectItem>
                                <SelectItem value="Face Pulls">Face Pulls</SelectItem>
                                <SelectItem value="Treadmill">Treadmill</SelectItem>
                                <SelectItem value="Cycling">Cycling</SelectItem>
                                <SelectItem value="Running">Running</SelectItem>
                                <SelectItem value="Rowing">Rowing</SelectItem>
                                <SelectItem value="Custom">Custom Exercise</SelectItem>
                              </SelectContent>
                            </Select>
                            {exercise.name === "Custom" && (
                              <Input
                                placeholder="Enter custom exercise name"
                                className="mt-2"
                                onChange={(e) => updateExercise(exerciseIndex, "name", e.target.value)}
                              />
                            )}
                          </div>
                          <div>
                            <Label>Sets ({exercise.sets.length})</Label>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSet(exerciseIndex, exercise.sets.length - 1)}
                                disabled={exercise.sets.length <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{exercise.sets.length}</span>
                              <Button variant="outline" size="sm" onClick={() => addSet(exerciseIndex)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-xs font-medium text-gray-500">Set</div>
                          <div className="text-xs font-medium text-gray-500">Reps</div>
                          <div className="text-xs font-medium text-gray-500">Weight (lb)</div>
                          <div className="text-xs font-medium text-gray-500">Actions</div>
                        </div>

                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="grid grid-cols-4 gap-2">
                            <div className="flex items-center justify-center">
                              <span className="text-sm font-medium">{setIndex + 1}</span>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              value={set.reps || ""}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, "reps", e.target.value)}
                              placeholder="0"
                            />
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={set.weight || ""}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, "weight", e.target.value)}
                              placeholder="0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                              disabled={exercise.sets.length <= 1}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(exerciseIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove Exercise
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={startWorkout}
                  disabled={!currentWorkout.exercises?.length || workoutInProgress !== null}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Text Parser Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Text-to-Plan Parser</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-text">Workout Plan Text</Label>
                <Textarea
                  id="workout-text"
                  placeholder="Paste your workout plan here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: "Exercise Name Sets×Reps" (e.g., "Bench Press 3×5")
                </p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleParse} disabled={!textInput.trim()}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Parse Plan
                </Button>
                {parsedPlan && (
                  <Button onClick={savePlan} variant="outline">
                    Save Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => generateTemplate("push-pull-legs")}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">Push/Pull/Legs</h3>
                    <p className="text-sm text-gray-600 mb-3">3-day split focusing on movement patterns</p>
                    <Badge variant="outline">3 Days</Badge>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => generateTemplate("upper-lower")}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">Upper/Lower</h3>
                    <p className="text-sm text-gray-600 mb-3">4-day split alternating upper and lower body</p>
                    <Badge variant="outline">4 Days</Badge>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => generateTemplate("full-body")}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">Full Body</h3>
                    <p className="text-sm text-gray-600 mb-3">Complete workout hitting all muscle groups</p>
                    <Badge variant="outline">3 Days</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Custom Templates */}
              {customTemplates.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Custom Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500 relative group"
                        onClick={() => loadTemplate(template)}
                      >
                        <CardContent className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCustomTemplate(template.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <h3 className="font-semibold mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.exercises.length} exercises</p>
                          <Badge variant="outline" className="capitalize">
                            {template.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Workout Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedPlans.map((plan, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{plan.days.length} Days</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plan.days.map((day, dayIndex) => (
                          <div key={dayIndex} className="bg-gray-50 rounded p-3">
                            <h4 className="font-medium text-sm mb-2">{day.name}</h4>
                            <p className="text-xs text-gray-600">{day.exercises.length} exercises</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {savedPlans.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved plans yet</p>
                    <p className="text-sm">Create your first plan using the parser</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Template Modal */}
      {isCreatingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Save as Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="My Custom Workout"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsCreatingTemplate(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={saveAsTemplate} className="flex-1" disabled={!newTemplateName}>
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
