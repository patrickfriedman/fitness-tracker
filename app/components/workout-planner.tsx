'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CalendarDays, Trash2 } from 'lucide-react'
import { PlannedWorkout } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface WorkoutPlannerProps {
  initialPlannedWorkouts: PlannedWorkout[]
}

export default function WorkoutPlanner({ initialPlannedWorkouts }: WorkoutPlannerProps) {
  const { session } = useAuth()
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>(initialPlannedWorkouts)
  const [newWorkoutDate, setNewWorkoutDate] = useState('')
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [newWorkoutExercises, setNewWorkoutExercises] = useState<{ name: string; sets: number; reps: number }[]>([])
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const addExerciseToNewWorkout = () => {
    setNewWorkoutExercises([...newWorkoutExercises, { name: '', sets: 0, reps: 0 }])
  }

  const updateNewWorkoutExercise = (index: number, field: string, value: string | number) => {
    const updatedExercises = [...newWorkoutExercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setNewWorkoutExercises(updatedExercises)
  }

  const removeNewWorkoutExercise = (index: number) => {
    const updatedExercises = newWorkoutExercises.filter((_, i) => i !== index)
    setNewWorkoutExercises(updatedExercises)
  }

  const handleAddPlannedWorkout = async () => {
    if (!session?.user || !newWorkoutDate || !newWorkoutName || newWorkoutExercises.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and add at least one exercise, and ensure you are logged in.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('planned_workouts')
        .insert({
          user_id: session.user.id,
          date: newWorkoutDate,
          name: newWorkoutName,
          exercises: newWorkoutExercises,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setPlannedWorkouts((prevWorkouts) => [...prevWorkouts, data])
        toast({
          title: 'Workout Planned',
          description: 'Your workout has been successfully added to the planner!',
        })
        // Reset form
        setNewWorkoutDate('')
        setNewWorkoutName('')
        setNewWorkoutExercises([])
      }
    } catch (error: any) {
      console.error('Error adding planned workout:', error)
      toast({
        title: 'Error',
        description: `Failed to add planned workout: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Planner</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workout-date">Date</Label>
            <Input id="workout-date" type="date" value={newWorkoutDate} onChange={(e) => setNewWorkoutDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input id="workout-name" value={newWorkoutName} onChange={(e) => setNewWorkoutName(e.target.value)} placeholder="e.g., Leg Day" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-semibold">Exercises for this Workout</h3>
          {newWorkoutExercises.map((exercise, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-end">
              <div className="col-span-2">
                <Label htmlFor={`new-exercise-name-${index}`}>Name</Label>
                <Input
                  id={`new-exercise-name-${index}`}
                  value={exercise.name}
                  onChange={(e) => updateNewWorkoutExercise(index, 'name', e.target.value)}
                  placeholder="e.g., Deadlifts"
                />
              </div>
              <div>
                <Label htmlFor={`new-exercise-sets-${index}`}>Sets</Label>
                <Input
                  id={`new-exercise-sets-${index}`}
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => updateNewWorkoutExercise(index, 'sets', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 4"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <Label htmlFor={`new-exercise-reps-${index}`}>Reps</Label>
                  <Input
                    id={`new-exercise-reps-${index}`}
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateNewWorkoutExercise(index, 'reps', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 6"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeNewWorkoutExercise(index)} className="mt-6">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addExerciseToNewWorkout} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Exercise
          </Button>
        </div>

        <Button onClick={handleAddPlannedWorkout} className="w-full mt-4">
          Add Planned Workout
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upcoming Workouts</h3>
          {plannedWorkouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts planned yet.</p>
          ) : (
            <div className="space-y-3">
              {plannedWorkouts.map((workout) => (
                <Card key={workout.id} className="p-3">
                  <p className="text-sm font-medium">{workout.name} on {new Date(workout.date).toLocaleDateString()}</p>
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold">Exercises:</p>
                      <ul className="list-disc list-inside">
                        {workout.exercises.map((ex, idx) => (
                          <li key={idx}>
                            {ex.name} ({ex.sets} sets of {ex.reps} reps)
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
