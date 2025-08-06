"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { WorkoutLog } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { Dumbbell, Plus, Minus, Loader2, Save, Pencil, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export function WorkoutLogger() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [workoutName, setWorkoutName] = useState("")
  const [duration, setDuration] = useState("")
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number; weight?: number; unit?: 'kg' | 'lbs' }[]>([])
  const [notes, setNotes] = useState("")
  const [caloriesBurned, setCaloriesBurned] = useState("")
  const [currentWorkoutLog, setCurrentWorkoutLog] = useState<WorkoutLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const fetchWorkoutLog = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error fetching workout log:", error.message)
        toast({
          title: "Error",
          description: "Failed to load workout log.",
          variant: "destructive",
        })
      } else if (data) {
        setCurrentWorkoutLog(data as WorkoutLog)
        setWorkoutName(data.name || "")
        setDuration(data.duration_minutes?.toString() || "")
        setExercises(data.exercises || [])
        setNotes(data.notes || "")
        setCaloriesBurned(data.calories_burned?.toString() || "")
        setIsEditing(false) // If data exists, show as not editing initially
      } else {
        resetForm()
        setIsEditing(true) // If no data, prompt to edit
      }
      setIsLoading(false)
    }

    fetchWorkoutLog()
  }, [user?.id, supabase, today])

  const resetForm = () => {
    setWorkoutName("")
    setDuration("")
    setExercises([])
    setNotes("")
    setCaloriesBurned("")
    setCurrentWorkoutLog(null)
  }

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: 0, reps: 0, weight: undefined, unit: "kg" }])
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const handleSaveWorkout = async () => {
    if (!user?.id) return

    setIsSaving(true)
    const newWorkoutLog = {
      user_id: user.id,
      date: today,
      name: workoutName,
      duration_minutes: duration ? parseFloat(duration) : null,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || null,
        unit: ex.unit || null,
      })),
      notes: notes,
      calories_burned: caloriesBurned ? parseFloat(caloriesBurned) : null,
    }

    let error = null
    let data = null

    if (currentWorkoutLog?.id) {
      // Update existing
      const { data: updateData, error: updateError } = await supabase
        .from('workout_logs')
        .update(newWorkoutLog)
        .eq('id', currentWorkoutLog.id)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new
      const { data: insertData, error: insertError } = await supabase
        .from('workout_logs')
        .insert(newWorkoutLog)
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error("Error saving workout log:", error.message)
      toast({
        title: "Error",
        description: "Failed to save workout log.",
        variant: "destructive",
      })
    } else if (data) {
      setCurrentWorkoutLog(data as WorkoutLog)
      toast({
        title: "Success",
        description: "Workout log saved!",
      })
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Workout Logger</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Logger</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Today: {format(new Date(), 'PPP')}</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workoutName">Workout Name</Label>
            <Input
              id="workoutName"
              placeholder="e.g., Full Body Strength"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label>Exercises</Label>
            {exercises.map((exercise, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  disabled={!isEditing || isSaving}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets || ''}
                  onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps || ''}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Weight"
                  value={exercise.weight || ''}
                  onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value) || undefined)}
                  disabled={!isEditing || isSaving}
                  className="w-24"
                />
                <select
                  value={exercise.unit || "kg"}
                  onChange={(e) => handleExerciseChange(index, 'unit', e.target.value)}
                  disabled={!isEditing || isSaving}
                  className="w-16 border rounded-md p-2"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
                {isEditing && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(index)} disabled={isSaving}>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Remove exercise</span>
                  </Button>
                )}
              </div>
            ))}
            {isEditing && (
              <Button variant="outline" onClick={handleAddExercise} className="w-full" disabled={isSaving}>
                <Plus className="h-4 w-4 mr-2" /> Add Exercise
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="caloriesBurned">Calories Burned (estimated)</Label>
            <Input
              id="caloriesBurned"
              type="number"
              placeholder="e.g., 300"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your workout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!isEditing || isSaving}
            />
          </div>
        </div>
        {isEditing && (
          <Button onClick={handleSaveWorkout} className="w-full mt-4" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Workout'}
          </Button>
        )}
        {!isEditing && !currentWorkoutLog && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            No workout logged for today. Click edit to log your workout.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
