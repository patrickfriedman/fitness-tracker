'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { WorkoutLog, Exercise, ExerciseSet } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, PlusCircle, Trash2, Dumbbell, Clock } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function WorkoutLogger() {
  const { user } = useAuth()
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [newWorkoutDuration, setNewWorkoutDuration] = useState<string>('')
  const [newWorkoutNotes, setNewWorkoutNotes] = useState('')
  const [newExercises, setNewExercises] = useState<Exercise[]>([{ name: '', sets: [{ setNumber: 1, reps: 0, weight: 0, unit: 'lbs' }] }])
  const supabase = getBrowserClient()

  const fetchWorkoutLogs = async () => {
    if (!user?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(3) // Show last 3 workouts

    if (error) {
      console.error('Error fetching workout logs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load workout logs.',
        variant: 'destructive',
      })
    } else {
      // Map Supabase JSONB to TypeScript types
      const mappedLogs: WorkoutLog[] = data.map(log => ({
        id: log.id,
        userId: log.user_id,
        date: log.date,
        name: log.name,
        durationMinutes: log.duration_minutes || 0,
        exercises: (log.exercises || []) as Exercise[],
        notes: log.notes || undefined,
        caloriesBurned: log.calories_burned || undefined,
        createdAt: log.created_at,
      }));
      setWorkoutLogs(mappedLogs)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWorkoutLogs()
  }, [user])

  const handleAddExercise = () => {
    setNewExercises([...newExercises, { name: '', sets: [{ setNumber: 1, reps: 0, weight: 0, unit: 'lbs' }] }])
  }

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = newExercises.filter((_, i) => i !== index)
    setNewExercises(updatedExercises)
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...newExercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setNewExercises(updatedExercises)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...newExercises]
    const currentSets = updatedExercises[exerciseIndex].sets
    updatedExercises[exerciseIndex].sets.push({
      setNumber: currentSets.length + 1,
      reps: 0,
      weight: 0,
      unit: 'lbs',
    })
    setNewExercises(updatedExercises)
  }

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...newExercises]
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
    setNewExercises(updatedExercises)
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof ExerciseSet, value: any) => {
    const updatedExercises = [...newExercises]
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    }
    setNewExercises(updatedExercises)
  }

  const handleAddWorkout = async () => {
    if (!user?.id || !newWorkoutName) {
      toast({
        title: 'Input Error',
        description: 'Please enter a workout name.',
        variant: 'destructive',
      })
      return
    }
    setIsAdding(true)

    const { error } = await supabase.from('workout_logs').insert({
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      name: newWorkoutName,
      duration_minutes: parseFloat(newWorkoutDuration) || null,
      exercises: newExercises as any, // Cast to any for JSONB
      notes: newWorkoutNotes || null,
    })

    if (error) {
      console.error('Error adding workout log:', error)
      toast({
        title: 'Error',
        description: 'Failed to add workout log.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Workout logged successfully!',
      })
      setNewWorkoutName('')
      setNewWorkoutDuration('')
      setNewWorkoutNotes('')
      setNewExercises([{ name: '', sets: [{ setNumber: 1, reps: 0, weight: 0, unit: 'lbs' }] }])
      fetchWorkoutLogs() // Refresh data
    }
    setIsAdding(false)
  }

  return (
    <Card className="widget-card col-span-full md:col-span-2">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Workout Logger</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  id="workoutName"
                  value={newWorkoutName}
                  onChange={(e) => setNewWorkoutName(e.target.value)}
                  placeholder="e.g., Full Body Strength"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workoutDuration">Duration (minutes)</Label>
                <Input
                  id="workoutDuration"
                  type="number"
                  step="1"
                  value={newWorkoutDuration}
                  onChange={(e) => setNewWorkoutDuration(e.target.value)}
                  placeholder="e.g., 60"
                />
              </div>

              <h4 className="text-md font-semibold mt-4">Exercises</h4>
              {newExercises.map((exercise, exIndex) => (
                <Card key={exIndex} className="p-4 space-y-3 border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`exerciseName-${exIndex}`}>Exercise Name</Label>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(exIndex)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    id={`exerciseName-${exIndex}`}
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(exIndex, 'name', e.target.value)}
                    placeholder="e.g., Barbell Squat"
                  />
                  <div className="space-y-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-2">
                        <Label className="w-8">Set {set.setNumber}</Label>
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Weight"
                          value={set.weight}
                          onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                        <select
                          value={set.unit}
                          onChange={(e) => handleSetChange(exIndex, setIndex, 'unit', e.target.value as 'kg' | 'lbs')}
                          className="border rounded-md p-2"
                        >
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                        </select>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSet(exIndex, setIndex)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleAddSet(exIndex)} className="mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Set
                    </Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={handleAddExercise} className="w-full mt-4">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Exercise
              </Button>

              <div className="space-y-2 mt-4">
                <Label htmlFor="workoutNotes">Notes</Label>
                <Textarea
                  id="workoutNotes"
                  value={newWorkoutNotes}
                  onChange={(e) => setNewWorkoutNotes(e.target.value)}
                  placeholder="Any additional notes about this workout..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWorkout} disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log Workout'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="widget-content">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : workoutLogs.length > 0 ? (
          <div className="space-y-4">
            {workoutLogs.map((log) => (
              <Card key={log.id} className="p-3">
                <h3 className="font-semibold text-md flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" /> {log.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {new Date(log.date).toLocaleDateString()}
                  {log.durationMinutes && ` • ${log.durationMinutes} mins`}
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {log.exercises?.map((exercise, exIdx) => (
                    <li key={exIdx}>
                      <strong>{exercise.name}:</strong>{' '}
                      {exercise.sets?.map(set => `${set.reps}x${set.weight}${set.unit}`).join(', ')}
                    </li>
                  ))}
                </ul>
                {log.notes && <p className="text-xs italic mt-2">Notes: {log.notes}</p>}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No workouts logged yet. Start your first one!</p>
        )}
      </CardContent>
    </Card>
  )
}
