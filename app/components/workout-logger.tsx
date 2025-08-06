'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Dumbbell, Trash2 } from 'lucide-react'
import { WorkoutLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface WorkoutLoggerProps {
  initialWorkoutLogs: WorkoutLog[]
}

export default function WorkoutLogger({ initialWorkoutLogs }: WorkoutLoggerProps) {
  const { session } = useAuth()
  const [workoutType, setWorkoutType] = useState('')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<{ name: string; sets: string; reps: string; weight: string }[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(initialWorkoutLogs)
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }])
  }

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
  }

  const handleLogWorkout = async () => {
    if (!session?.user || !workoutType || !duration) {
      toast({
        title: 'Error',
        description: 'Please fill in workout type and duration, and ensure you are logged in.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: session.user.id,
          type: workoutType,
          duration: parseInt(duration),
          calories_burned: caloriesBurned ? parseInt(caloriesBurned) : null,
          notes: notes || null,
          exercises: exercises.length > 0 ? exercises : null,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setWorkoutLogs((prevLogs) => [data, ...prevLogs])
        toast({
          title: 'Workout Logged',
          description: 'Your workout has been successfully recorded!',
        })
        // Reset form
        setWorkoutType('')
        setDuration('')
        setCaloriesBurned('')
        setNotes('')
        setExercises([])
      }
    } catch (error: any) {
      console.error('Error logging workout:', error)
      toast({
        title: 'Error',
        description: `Failed to log workout: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Logger</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workout-type">Workout Type</Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger id="workout-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories-burned">Calories Burned (optional)</Label>
            <Input id="calories-burned" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} placeholder="e.g., 300" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific details about your workout?" />
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-semibold">Exercises</h3>
          {exercises.map((exercise, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2">
                <Label htmlFor={`exercise-name-${index}`}>Name</Label>
                <Input
                  id={`exercise-name-${index}`}
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  placeholder="e.g., Squats"
                />
              </div>
              <div>
                <Label htmlFor={`exercise-sets-${index}`}>Sets</Label>
                <Input
                  id={`exercise-sets-${index}`}
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <Label htmlFor={`exercise-reps-${index}`}>Reps</Label>
                <Input
                  id={`exercise-reps-${index}`}
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  placeholder="e.g., 10"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <Label htmlFor={`exercise-weight-${index}`}>Weight</Label>
                  <Input
                    id={`exercise-weight-${index}`}
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                    placeholder="e.g., 50kg"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeExercise(index)} className="mt-6">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addExercise} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Exercise
          </Button>
        </div>

        <Button onClick={handleLogWorkout} className="w-full mt-4">
          Log Workout
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Workouts</h3>
          {workoutLogs.length === 0 ? (
            <p className="text-muted-foreground">No workouts logged yet.</p>
          ) : (
            <div className="space-y-3">
              {workoutLogs.map((log) => (
                <Card key={log.id} className="p-3">
                  <p className="text-sm font-medium">{log.type} - {log.duration} mins</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString()}
                    {log.calories_burned && ` | ${log.calories_burned} kcal`}
                  </p>
                  {log.notes && <p className="text-xs italic mt-1">{log.notes}</p>}
                  {log.exercises && log.exercises.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold">Exercises:</p>
                      <ul className="list-disc list-inside">
                        {log.exercises.map((ex, idx) => (
                          <li key={idx}>
                            {ex.name} ({ex.sets} sets of {ex.reps} reps, {ex.weight})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
