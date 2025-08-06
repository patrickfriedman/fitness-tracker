"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Dumbbell, PlusCircle, Edit, XCircle } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { WorkoutLog, ExerciseLog, SetLog } from "@/types/fitness"
import { format } from "date-fns"

export function WorkoutLogger() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [workout, setWorkout] = useState<WorkoutLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [workoutName, setWorkoutName] = useState("")
  const [durationMinutes, setDurationMinutes] = useState<string>("")
  const [exercises, setExercises] = useState<ExerciseLog[]>([])
  const [notes, setNotes] = useState("")
  const [caloriesBurned, setCaloriesBurned] = useState<string>("")

  const units = user?.preferences.units || "imperial"

  useEffect(() => {
    if (user?.id) {
      fetchWorkoutLog()
    }
  }, [user?.id])

  const fetchWorkoutLog = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      if (data) {
        setWorkout(data as WorkoutLog)
        setWorkoutName(data.name)
        setDurationMinutes(data.duration_minutes?.toString() || "")
        setExercises(data.exercises || [])
        setNotes(data.notes || "")
        setCaloriesBurned(data.calories_burned?.toString() || "")
      } else {
        setWorkout(null)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error fetching workout log:", error.message)
      toast({
        title: "Error",
        description: "Failed to load workout log.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setWorkoutName("")
    setDurationMinutes("")
    setExercises([])
    setNotes("")
    setCaloriesBurned("")
  }

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: [{ reps: 0, weight: 0, unit: units }] }])
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
  }

  const handleExerciseNameChange = (index: number, name: string) => {
    const newExercises = [...exercises]
    newExercises[index].name = name
    setExercises(newExercises)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0, unit: units })
    setExercises(newExercises)
  }

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
    setExercises(newExercises)
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof SetLog, value: string) => {
    const newExercises = [...exercises]
    // @ts-ignore
    newExercises[exerciseIndex].sets[setIndex][field] = field === 'unit' ? value : parseFloat(value) || 0
    setExercises(newExercises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const workoutData = {
        user_id: user.id,
        date: today,
        name: workoutName,
        duration_minutes: durationMinutes ? parseFloat(durationMinutes) : null,
        exercises: exercises,
        notes: notes || null,
        calories_burned: caloriesBurned ? parseFloat(caloriesBurned) : null,
      }

      let error = null
      if (workout) {
        const { error: updateError } = await supabase
          .from('workout_logs')
          .update(workoutData)
          .eq('id', workout.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('workout_logs')
          .insert(workoutData)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Success",
        description: "Workout logged successfully!",
      })
      setIsDialogOpen(false)
      fetchWorkoutLog() // Re-fetch to update the display
    } catch (error: any) {
      console.error("Error saving workout log:", error.message)
      toast({
        title: "Error",
        description: "Failed to save workout log.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Workout</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : workout ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{workout.name}</h3>
            <p className="text-sm text-muted-foreground">
              {workout.durationMinutes ? `${workout.durationMinutes} minutes` : 'N/A'}
              {workout.caloriesBurned ? ` • ${workout.caloriesBurned} kcal` : ''}
            </p>
            <div className="space-y-2">
              {workout.exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="border rounded-md p-3">
                  <p className="font-semibold">{exercise.name}</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {exercise.sets.map((set, setIndex) => (
                      <li key={setIndex}>
                        {set.reps} reps @ {set.weight} {set.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Workout Log</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workout-name">Workout Name</Label>
                    <Input id="workout-name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input id="duration" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories">Calories Burned</Label>
                      <Input id="calories" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} />
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mt-4">Exercises</h4>
                  {exercises.map((exercise, exIndex) => (
                    <Card key={exIndex} className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`exercise-name-${exIndex}`}>Exercise Name</Label>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExercise(exIndex)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <Input
                        id={`exercise-name-${exIndex}`}
                        value={exercise.name}
                        onChange={(e) => handleExerciseNameChange(exIndex, e.target.value)}
                        placeholder="e.g., Bench Press"
                        required
                      />
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={set.reps === 0 ? '' : set.reps}
                              onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={set.weight === 0 ? '' : set.weight}
                              onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                              className="w-24"
                            />
                            <Select value={set.unit} onValueChange={(value) => handleSetChange(exIndex, setIndex, 'unit', value)}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="lbs">lbs</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSet(exIndex, setIndex)}>
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddSet(exIndex)}>
                          Add Set
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddExercise}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
                  </Button>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes about your workout?" />
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No workout logged for today.</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Log Today's Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Log New Workout</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workout-name">Workout Name</Label>
                    <Input id="workout-name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input id="duration" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories">Calories Burned</Label>
                      <Input id="calories" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} />
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mt-4">Exercises</h4>
                  {exercises.map((exercise, exIndex) => (
                    <Card key={exIndex} className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`exercise-name-${exIndex}`}>Exercise Name</Label>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExercise(exIndex)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <Input
                        id={`exercise-name-${exIndex}`}
                        value={exercise.name}
                        onChange={(e) => handleExerciseNameChange(exIndex, e.target.value)}
                        placeholder="e.g., Bench Press"
                        required
                      />
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={set.reps === 0 ? '' : set.reps}
                              onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={set.weight === 0 ? '' : set.weight}
                              onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                              className="w-24"
                            />
                            <Select value={set.unit} onValueChange={(value) => handleSetChange(exIndex, setIndex, 'unit', value)}>
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="lbs">lbs</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSet(exIndex, setIndex)}>
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddSet(exIndex)}>
                          Add Set
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddExercise}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
                  </Button>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes about your workout?" />
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Logging..." : "Log Workout"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
