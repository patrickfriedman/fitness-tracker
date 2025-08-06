'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { WorkoutLog } from '@/types/fitness'

export default function WorkoutLogger() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [workoutName, setWorkoutName] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [todayWorkout, setTodayWorkout] = useState<WorkoutLog | null>(null)

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching workout log:', error)
        toast({
          title: 'Error',
          description: 'Failed to load today\'s workout.',
          variant: 'destructive',
        })
      } else if (data) {
        setTodayWorkout(data as WorkoutLog)
        setWorkoutName(data.name || '')
        setDuration(data.duration_minutes?.toString() || '')
        setNotes(data.notes || '')
        setExercises(
          data.exercises?.map((ex: any) => ({
            name: ex.name || '',
            sets: ex.sets?.toString() || '',
            reps: ex.reps?.toString() || '',
            weight: ex.weight?.toString() || '',
          })) || [{ name: '', sets: '', reps: '', weight: '' }]
        )
      }
      setIsLoading(false)
    }

    fetchTodayWorkout()
  }, [user, supabase, today, toast])

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }])
  }

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
  }

  const handleSaveWorkout = async () => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Workouts cannot be saved in demo mode.',
      })
      return
    }

    setIsSaving(true)
    const parsedExercises = exercises.map((ex) => ({
      name: ex.name,
      sets: parseInt(ex.sets) || 0,
      reps: parseInt(ex.reps) || 0,
      weight: parseFloat(ex.weight) || 0,
    }))

    const workoutData = {
      user_id: user.id,
      date: today,
      name: workoutName,
      duration_minutes: parseFloat(duration) || null,
      exercises: parsedExercises,
      notes: notes,
    }

    const { error } = await supabase
      .from('workout_logs')
      .upsert(workoutData, { onConflict: 'user_id,date' })

    if (error) {
      console.error('Error saving workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to save workout.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Workout saved!',
      })
      // Refresh the state to show the saved data
      setTodayWorkout({
        id: todayWorkout?.id || 'new', // Keep existing ID or use placeholder
        userId: user.id,
        date: today,
        name: workoutName,
        durationMinutes: parseFloat(duration) || 0,
        exercises: parsedExercises,
        notes: notes,
      })
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Workout Logger</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Workout Logger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              placeholder="e.g., Full Body Strength"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
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
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Exercises</h3>
          {exercises.map((exercise, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor={`exercise-name-${index}`}>Exercise</Label>
                <Input
                  id={`exercise-name-${index}`}
                  placeholder="e.g., Bench Press"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`sets-${index}`}>Sets</Label>
                <Input
                  id={`sets-${index}`}
                  type="number"
                  placeholder="3"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`reps-${index}`}>Reps</Label>
                <Input
                  id={`reps-${index}`}
                  type="number"
                  placeholder="8"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  placeholder="50"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                />
              </div>
              {exercises.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExercise(index)}
                  className="mt-auto"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addExercise} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes about your workout..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleSaveWorkout} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Workout
        </Button>
      </CardContent>
    </Card>
  )
}
