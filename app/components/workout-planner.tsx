'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlannedWorkout, Exercise } from '@/types/fitness'
import { createPlannedWorkout, updatePlannedWorkout, deletePlannedWorkout } from '@/app/actions/workout-actions' // Assuming these actions exist
import { useToast } from '@/hooks/use-toast'

interface WorkoutPlannerProps {
  initialWorkouts?: PlannedWorkout[];
}

export default function WorkoutPlanner({ initialWorkouts = [] }: WorkoutPlannerProps) {
  const [workouts, setWorkouts] = useState<PlannedWorkout[]>(initialWorkouts);
  const [newWorkout, setNewWorkout] = useState<Partial<PlannedWorkout>>({
    workout_name: '',
    workout_date: new Date(),
    exercises: [],
    notes: '',
  });
  const { toast } = useToast();

  const handleAddExercise = () => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), { name: '', sets: 0, reps: 0, weight: 0, unit: 'kg' }],
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: (prev.exercises || []).filter((_, i) => i !== index),
    }));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    setNewWorkout((prev) => {
      const updatedExercises = [...(prev.exercises || [])];
      updatedExercises[index] = { ...updatedExercises[index], [field]: value };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSaveWorkout = async () => {
    if (!newWorkout.workout_name || !newWorkout.workout_date) {
      toast({
        title: 'Error',
        description: 'Workout name and date are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (newWorkout.id) {
        // Update existing workout
        const result = await updatePlannedWorkout(newWorkout.id, newWorkout as PlannedWorkout);
        if (result.success) {
          setWorkouts((prev) =>
            prev.map((w) => (w.id === newWorkout.id ? (newWorkout as PlannedWorkout) : w))
          );
          toast({ title: 'Success', description: 'Workout updated successfully.' });
        } else {
          toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
      } else {
        // Create new workout
        const result = await createPlannedWorkout(newWorkout as PlannedWorkout);
        if (result.success && result.workout) {
          setWorkouts((prev) => [...prev, result.workout!]);
          toast({ title: 'Success', description: 'Workout planned successfully.' });
        } else {
          toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
      }
      setNewWorkout({ workout_name: '', workout_date: new Date(), exercises: [], notes: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditWorkout = (workout: PlannedWorkout) => {
    setNewWorkout(workout);
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const result = await deletePlannedWorkout(id);
      if (result.success) {
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
        toast({ title: 'Success', description: 'Workout deleted successfully.' });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="grid gap-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{newWorkout.id ? 'Edit Planned Workout' : 'Plan New Workout'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              value={newWorkout.workout_name || ''}
              onChange={(e) => setNewWorkout((prev) => ({ ...prev, workout_name: e.target.value }))}
              placeholder="e.g., Full Body Strength"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workout-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !newWorkout.workout_date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newWorkout.workout_date ? (
                    format(newWorkout.workout_date, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newWorkout.workout_date}
                  onSelect={(date) => setNewWorkout((prev) => ({ ...prev, workout_date: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Exercises</Label>
            {newWorkout.exercises?.map((exercise, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets || ''}
                  onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps || ''}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Weight"
                  value={exercise.weight || ''}
                  onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Input
                  placeholder="Unit (kg/lbs)"
                  value={exercise.unit || ''}
                  onChange={(e) => handleExerciseChange(index, 'unit', e.target.value)}
                  className="w-24"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddExercise}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newWorkout.notes || ''}
              onChange={(e) => setNewWorkout((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific instructions or thoughts for this workout?"
            />
          </div>
          <Button onClick={handleSaveWorkout}>
            {newWorkout.id ? 'Update Workout' : 'Plan Workout'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Planned Workouts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {workouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts planned yet. Start by planning one above!</p>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{workout.workout_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(workout.workout_date), 'PPP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditWorkout(workout)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWorkout(workout.id!)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="font-medium">Exercises:</p>
                    <ul className="list-disc pl-5">
                      {workout.exercises.map((ex, idx) => (
                        <li key={idx}>
                          {ex.name} - {ex.sets} sets of {ex.reps} reps at {ex.weight} {ex.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {workout.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">Notes: {workout.notes}</p>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
