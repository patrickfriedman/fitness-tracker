"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlannedWorkout } from '@/types/fitness'
import { addPlannedWorkout, updatePlannedWorkout, deletePlannedWorkout } from '@/app/actions/workout-actions'
import { useToast } from '@/hooks/use-toast'

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function WorkoutPlanner({ initialWorkouts }: { initialWorkouts: PlannedWorkout[] }) {
  const [workoutDate, setWorkoutDate] = useState<Date | undefined>(new Date())
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [notes, setNotes] = useState('')
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }])
  }

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises]
    // Ensure numeric fields are parsed as numbers
    if (field === 'sets' || field === 'reps' || field === 'weight') {
      newExercises[index][field] = Number(value)
    } else {
      newExercises[index][field] = value as string
    }
    setExercises(newExercises)
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
  }

  const handleSaveWorkout = async () => {
    if (!workoutDate || !workoutName) {
      toast({
        title: 'Error',
        description: 'Workout date and name are required.',
        variant: 'destructive',
      })
      return
    }

    const workoutData: Omit<PlannedWorkout, 'id' | 'created_at' | 'user_id'> = {
      workout_date: workoutDate.toISOString().split('T')[0],
      workout_name: workoutName,
      exercises: exercises.length > 0 ? exercises : null,
      notes: notes || null,
    }

    if (editingWorkoutId) {
      const { success, message } = await updatePlannedWorkout(editingWorkoutId, workoutData)
      if (success) {
        toast({
          title: 'Success',
          description: message,
        })
        setEditingWorkoutId(null)
      } else {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      }
    } else {
      const { success, message } = await addPlannedWorkout(workoutData)
      if (success) {
        toast({
          title: 'Success',
          description: message,
        })
      } else {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      }
    }
    resetForm()
  }

  const handleEditWorkout = (workout: PlannedWorkout) => {
    setEditingWorkoutId(workout.id)
    setWorkoutDate(new Date(workout.workout_date))
    setWorkoutName(workout.workout_name)
    setExercises(workout.exercises || [])
    setNotes(workout.notes || '')
  }

  const handleDeleteWorkout = async (id: string) => {
    const { success, message } = await deletePlannedWorkout(id)
    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setWorkoutDate(new Date())
    setWorkoutName('')
    setExercises([])
    setNotes('')
    setEditingWorkoutId(null)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editingWorkoutId ? 'Edit Planned Workout' : 'Plan Your Workout'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workoutDate">Workout Date</Label>
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
          <div className="space-y-2">
            <Label htmlFor="workoutName">Workout Name</Label>
            <Input
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Chest & Triceps, Leg Day"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Exercises</Label>
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Exercise Name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Sets"
                value={exercise.sets === 0 ? '' : exercise.sets}
                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Reps"
                value={exercise.reps === 0 ? '' : exercise.reps}
                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Weight (kg)"
                value={exercise.weight === 0 ? '' : exercise.weight}
                onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                className="w-24"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(index)}>
                <TrashIcon className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddExercise} className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes for this workout..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={handleSaveWorkout}>
            {editingWorkoutId ? 'Update Workout' : 'Save Workout'}
          </Button>
        </div>

        <Separator className="my-6" />

        <h3 className="text-lg font-semibold">Planned Workouts</h3>
        {initialWorkouts.length === 0 ? (
          <p className="text-muted-foreground">No planned workouts yet.</p>
        ) : (
          <div className="space-y-3">
            {initialWorkouts.map((workout) => (
              <Card key={workout.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(workout.workout_date), 'PPP')}
                    </p>
                    <h4 className="font-semibold text-lg">{workout.workout_name}</h4>
                    {workout.exercises && workout.exercises.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                        {workout.exercises.map((ex, idx) => (
                          <li key={idx}>
                            {ex.name} - {ex.sets}x{ex.reps} @ {ex.weight}kg
                          </li>
                        ))}
                      </ul>
                    )}
                    {workout.notes && (
                      <p className="text-sm text-muted-foreground mt-1">Notes: {workout.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditWorkout(workout)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkout(workout.id)}>
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="M15 5l4 4" />
    </svg>
  )
}
