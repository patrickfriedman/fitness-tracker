'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Dumbbell } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

type WorkoutLog = Database['public']['Tables']['workout_logs']['Row']
type ExerciseEntry = { name: string; sets: number; reps: number; weight?: number | null }

export default function WorkoutLogger() {
  const [workoutType, setWorkoutType] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]) // State to display saved logs

  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  // Fetch workout logs on component mount
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false });

      if (error) {
        console.error('Error fetching workout logs:', error);
      } else {
        setWorkoutLogs(data || []);
      }
    };
    fetchWorkoutLogs();
  }, [supabase]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: null }])
  }

  const updateExercise = (index: number, field: keyof ExerciseEntry, value: any) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setExercises(updatedExercises)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleLogWorkout = async () => {
    if (!workoutType || !duration || !caloriesBurned) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in workout type, duration, and calories burned.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not logged in.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('workout_logs').insert({
      user_id: user.id,
      workout_date: new Date().toISOString().split('T')[0],
      type: workoutType,
      duration_minutes: duration,
      calories_burned: caloriesBurned,
      notes: notes || null,
      exercises: exercises.length > 0 ? exercises : null,
    })

    if (error) {
      console.error('Error logging workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to log workout.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Workout Logged!',
        description: 'Your workout has been successfully recorded.',
      })
      // Reset form
      setWorkoutType('')
      setDuration('')
      setCaloriesBurned('')
      setNotes('')
      setExercises([])
      // Re-fetch or update local state to show the new workout
      const { data, error: fetchError } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false });
      if (!fetchError) {
        setWorkoutLogs(data || []);
      }
    }
    setLoading(false)
  }

  const handleDeleteWorkout = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('workout_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id); // Ensure user can only delete their own workouts

    if (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout log.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Workout Deleted',
        description: 'The workout log has been removed.',
      });
      setWorkoutLogs(prev => prev.filter(log => log.id !== id));
    }
    setLoading(false);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Log Workout</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Type
          </label>
          <Input
            id="workoutType"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="e.g., Strength, Cardio, HIIT"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || '')}
              placeholder="e.g., 60"
              required
            />
          </div>
          <div>
            <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calories Burned (kcal)
            </label>
            <Input
              id="caloriesBurned"
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(parseInt(e.target.value) || '')}
              placeholder="e.g., 400"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Exercises Performed</h3>
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  className="col-span-4 sm:col-span-1"
                />
                <Input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets === 0 ? '' : exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                  className="col-span-2 sm:col-span-1"
                />
                <Input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps === 0 ? '' : exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                  className="col-span-2 sm:col-span-1"
                />
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={exercise.weight === null || exercise.weight === 0 ? '' : exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || null)}
                  className="col-span-4 sm:col-span-1"
                />
              </div>
              <Button variant="destructive" size="icon" onClick={() => removeExercise(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addExercise} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this workout..."
            rows={3}
          />
        </div>

        <Button onClick={handleLogWorkout} className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {log.type} - {log.duration_minutes} mins - {log.calories_burned} kcal
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkout(log.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.workout_date).toLocaleDateString()}
                  </p>
                  {log.exercises && (log.exercises as ExerciseEntry[]).length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold">Exercises:</p>
                      <ul className="list-disc list-inside">
                        {(log.exercises as ExerciseEntry[]).map((ex, idx) => (
                          <li key={idx}>
                            {ex.name} ({ex.sets}x{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {log.notes && <p className="text-xs italic mt-1">{log.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
