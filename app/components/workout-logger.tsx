'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Dumbbell, PlusCircle, Trash2 } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import type { WorkoutLog, Exercise, Set } from "@/types/fitness"

export default function WorkoutLogger() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [workoutName, setWorkoutName] = useState("")
  const [duration, setDuration] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [notes, setNotes] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([])
  const [loadingWorkouts, setLoadingWorkouts] = useState(true)

  const units = user?.preferences.units || "imperial"
  const weightUnit = units === "imperial" ? "lbs" : "kg"

  useState(() => {
    const fetchWorkouts = async () => {
      if (!user) return
      setLoadingWorkouts(true)
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3)

      if (error) {
        console.error("Error fetching workouts:", error)
        toast({
          title: "Error",
          description: "Failed to load recent workouts.",
          variant: "destructive",
        })
      } else {
        setRecentWorkouts(data as WorkoutLog[])
      }
      setLoadingWorkouts(false)
    }
    fetchWorkouts()
  }, [user])

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: "", sets: [] }])
  }

  const updateExerciseName = (index: number, name: string) => {
    const newExercises = [...exercises]
    newExercises[index].name = name
    setExercises(newExercises)
  }

  const deleteExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
  }

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets.push({ id: Date.now().toString(), reps: 0, weight: 0, unit: weightUnit })
    setExercises(newExercises)
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const newExercises = [...exercises]
    // Ensure the unit is always correct based on user preferences
    if (field === 'weight') {
      newExercises[exerciseIndex].sets[setIndex] = {
        ...newExercises[exerciseIndex].sets[setIndex],
        [field]: parseFloat(value),
        unit: weightUnit
      }
    } else {
      newExercises[exerciseIndex].sets[setIndex] = {
        ...newExercises[exerciseIndex].sets[setIndex],
        [field]: value
      }
    }
    setExercises(newExercises)
  }

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
    setExercises(newExercises)
  }

  const handleLogWorkout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to log workouts.",
        variant: "destructive",
      })
      return
    }
    if (!workoutName || !duration || exercises.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in workout name, duration, and add at least one exercise.",
        variant: "destructive",
      })
      return
    }

    setIsLogging(true)
    try {
      const newWorkout: Partial<WorkoutLog> = {
        user_id: user.id,
        date: new Date().toISOString(),
        name: workoutName,
        duration_minutes: parseFloat(duration),
        exercises: exercises.map(ex => ({
          ...ex,
          sets: ex.sets.map(s => ({ ...s, weight: parseFloat(s.weight.toString()), reps: parseInt(s.reps.toString()) }))
        })),
        notes: notes || null,
      }

      const { data, error } = await supabase
        .from('workout_logs')
        .insert(newWorkout)
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Workout Logged!",
        description: "Your workout has been successfully recorded.",
      })
      setWorkoutName("")
      setDuration("")
      setExercises([])
      setNotes("")
      setIsLogging(false)
      setRecentWorkouts((prev) => [data[0] as WorkoutLog, ...prev].slice(0, 3))
    } catch (error: any) {
      console.error("Error logging workout:", error)
      toast({
        title: "Error",
        description: `Failed to log workout: ${error.message}`,
        variant: "destructive",
      })
      setIsLogging(false)
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Logger</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loadingWorkouts ? (
          <div className="text-center text-sm text-muted-foreground">Loading recent workouts...</div>
        ) : recentWorkouts.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Recent Workouts:</h3>
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0">
                <p className="font-medium">{workout.name} - {workout.duration_minutes} mins</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(workout.date).toLocaleDateString()}
                </p>
                <ul className="text-xs text-muted-foreground mt-1">
                  {workout.exercises.slice(0, 2).map((ex, idx) => (
                    <li key={idx}>{ex.name} ({ex.sets.length} sets)</li>
                  ))}
                  {workout.exercises.length > 2 && <li>...</li>}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mb-4">No workouts logged yet.</div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Log New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
              <DialogDescription>
                Record your workout details, exercises, sets, and reps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Full Body Strength"
                  disabled={isLogging}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 60"
                  disabled={isLogging}
                />
              </div>

              <h4 className="text-md font-semibold mt-4">Exercises</h4>
              {exercises.map((exercise, exIndex) => (
                <Card key={exercise.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      placeholder="Exercise Name (e.g., Bench Press)"
                      value={exercise.name}
                      onChange={(e) => updateExerciseName(exIndex, e.target.value)}
                      className="flex-grow mr-2"
                      disabled={isLogging}
                    />
                    <Button variant="destructive" size="icon" onClick={() => deleteExercise(exIndex)} disabled={isLogging}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <Label className="w-10">Set {setIndex + 1}</Label>
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={set.reps === 0 ? '' : set.reps}
                          onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                          className="w-20"
                          disabled={isLogging}
                        />
                        <Input
                          type="number"
                          placeholder={`Weight (${weightUnit})`}
                          value={set.weight === 0 ? '' : set.weight}
                          onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                          className="w-24"
                          disabled={isLogging}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteSet(exIndex, setIndex)} disabled={isLogging}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addSet(exIndex)} disabled={isLogging}>
                      Add Set
                    </Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addExercise} disabled={isLogging}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
              </Button>

              <div className="space-y-2 mt-4">
                <Label htmlFor="workout-notes">Notes (Optional)</Label>
                <Textarea
                  id="workout-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about your workout..."
                  className="min-h-[80px]"
                  disabled={isLogging}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleLogWorkout} disabled={isLogging}>
                {isLogging ? "Logging..." : "Save Workout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
