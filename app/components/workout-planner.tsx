'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { Database } from '@/types/supabase'

type PlannedWorkout = Database['public']['Tables']['planned_workouts']['Row']
type PlannedExercise = { name: string; sets: number; reps: number; weight?: number | null }

export default function WorkoutPlanner() {
  const { user } = useAuth()
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDate, setWorkoutDate] = useState<Date | undefined>(new Date())
  const [exercises, setExercises] = useState<PlannedExercise[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]) // State to display saved workouts

  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  // Fetch planned workouts on component mount
  useState(() => {
    const fetchPlannedWorkouts = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('planned_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: true });

      if (error) {
        console.error('Error fetching planned workouts:', error);
      } else {
        setPlannedWorkouts(data || []);
      }
    };
    fetchPlannedWorkouts();
  }, [user, supabase]);


  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', sets: 0, reps: 0, weight: null },
    ])
  }

  const updateExercise = (index: number, field: keyof PlannedExercise, value: any) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setExercises(updatedExercises)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const saveWorkout = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to save workouts.',
        variant: 'destructive',
      })
      return
    }

    if (!workoutName || !workoutDate || exercises.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in workout name, date, and add at least one exercise.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.from('planned_workouts').insert({
      user_id: user.id,
      log_date: workoutDate.toISOString().split('T')[0],
      name: workoutName,
      exercises: exercises,
      notes: notes || null,
    })

    if (error) {
      console.error('Error saving workout plan:', error)
      toast({
        title: 'Error',
        description: 'Failed to save workout plan.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Workout Plan Saved!',
        description: 'Your workout plan has been successfully added.',
      })
      // Reset form
      setWorkoutName('')
      setWorkoutDate(new Date())
      setExercises([])
      setNotes('')
      // Re-fetch or update local state to show the new workout
      const { data, error: fetchError } = await supabase
        .from('planned_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: true });
      if (!fetchError) {
        setPlannedWorkouts(data || []);
      }
    }
    setLoading(false)
  }

  const handleDeletePlannedWorkout = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('planned_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id); // Ensure user can only delete their own workouts

    if (error) {
      console.error('Error deleting planned workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout plan.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Workout Plan Deleted',
        description: 'The workout plan has been removed.',
      });
      setPlannedWorkouts(prev => prev.filter(workout => workout.id !== id));
    }
    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Workout Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Name
          </label>
          <Input
            id="workoutName"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Full Body Strength"
          />
        </div>

        <div>
          <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !workoutDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {workoutDate ? format(workoutDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={workoutDate}
                onSelect={setWorkoutDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Exercises</h3>
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
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addExercise} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this workout..."
            rows={3}
          />
        </div>

        <Button onClick={saveWorkout} className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Workout Plan
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upcoming Workouts</h3>
          {plannedWorkouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts planned yet.</p>
          ) : (
            <div className="space-y-3">
              {plannedWorkouts.map((workout) => (
                <Card key={workout.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{workout.name} on {new Date(workout.log_date).toLocaleDateString()}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePlannedWorkout(workout.id)} disabled={loading}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  {workout.exercises && (workout.exercises as PlannedExercise[]).length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold">Exercises:</p>
                      <ul className="list-disc list-inside">
                        {(workout.exercises as PlannedExercise[]).map((ex, idx) => (
                          <li key={idx}>
                            {ex.name} ({ex.sets} sets of {ex.reps} reps{ex.weight ? ` @ ${ex.weight}kg` : ''})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {workout.notes && <p className="text-xs italic mt-1">{workout.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
