'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createWorkoutLog, getWorkoutLogs, updateWorkoutLog, deleteWorkoutLog } from '@/app/actions/workout-actions' // Assuming these actions exist
import { WorkoutLog, ExerciseLog } from '@/types/fitness'
import { useAuth } from '@/contexts/auth-context'

export default function WorkoutLogger() {
  const { session, isLoading: authLoading } = useAuth();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Partial<WorkoutLog>>({
    workout_name: '',
    duration_minutes: '',
    calories_burned: '',
    exercises: [],
    log_date: new Date(),
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (!authLoading && session?.user?.id) {
        try {
          const result = await getWorkoutLogs(session.user.id);
          if (result.success && result.logs) {
            setWorkoutLogs(result.logs);
          }
        } catch (error) {
          console.error('Failed to fetch workout logs:', error);
          toast({
                title: 'Error',
                description: 'Failed to load workout logs.',
                variant: 'destructive',
              });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !session?.user?.id) {
        setLoading(false);
      }
    };
    fetchWorkoutLogs();
  }, [session, authLoading, toast]);

  const handleAddExercise = () => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), { name: '', sets: 0, reps: 0, weight: 0, unit: 'kg' }],
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: (prev.exercises || []).filter((_, i) => i !== index),
    }));
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseLog, value: string | number) => {
    setCurrentWorkout((prev) => {
      const updatedExercises = [...(prev.exercises || [])];
      updatedExercises[index] = { ...updatedExercises[index], [field]: value };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSaveWorkout = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to log workouts.',
        variant: 'destructive',
      });
      return;
    }

    if (!currentWorkout.workout_name) {
      toast({
        title: 'Error',
        description: 'Workout name is required.',
        variant: 'destructive',
      });
      return;
    }

    const workoutToSave: Partial<WorkoutLog> = {
      user_id: session.user.id,
      workout_name: currentWorkout.workout_name,
      duration_minutes: currentWorkout.duration_minutes ? parseInt(currentWorkout.duration_minutes as string) : undefined,
      calories_burned: currentWorkout.calories_burned ? parseInt(currentWorkout.calories_burned as string) : undefined,
      exercises: currentWorkout.exercises,
      log_date: currentWorkout.log_date || new Date(),
    };

    try {
      let result;
      if (currentWorkout.id) {
        result = await updateWorkoutLog(currentWorkout.id, workoutToSave as WorkoutLog);
      } else {
        result = await createWorkoutLog(workoutToSave as WorkoutLog);
      }

      if (result.success && result.log) {
        if (currentWorkout.id) {
          setWorkoutLogs((prev) => prev.map((log) => (log.id === result.log!.id ? result.log! : log)));
        } else {
          setWorkoutLogs((prev) => [...prev, result.log!]);
        }
        toast({
          title: 'Success',
          description: 'Workout logged successfully!',
        });
        setShowDialog(false);
        setCurrentWorkout({ workout_name: '', duration_minutes: '', calories_burned: '', exercises: [], log_date: new Date() });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to save workout.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving your workout.',
        variant: 'destructive',
      });
    }
  };

  const handleEditWorkout = (workout: WorkoutLog) => {
    setCurrentWorkout(workout);
    setShowDialog(true);
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const result = await deleteWorkoutLog(id);
      if (result.success) {
        setWorkoutLogs((prev) => prev.filter((log) => log.id !== id));
        toast({
          title: 'Success',
          description: 'Workout deleted successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete workout.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the workout.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <p>Loading workout logs...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Button onClick={() => {
        setCurrentWorkout({ workout_name: '', duration_minutes: '', calories_burned: '', exercises: [], log_date: new Date() });
        setShowDialog(true);
      }}>
        Log New Workout
      </Button>

      {workoutLogs.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged yet. Start by logging one!</p>
      ) : (
        <div className="grid gap-4">
          {workoutLogs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{log.workout_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.log_date).toLocaleDateString()} - {log.duration_minutes} mins
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditWorkout(log)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteWorkout(log.id!)}>
                    Delete
                  </Button>
                </div>
              </div>
              {log.exercises && log.exercises.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p className="font-medium">Exercises:</p>
                  <ul className="list-disc pl-5">
                    {log.exercises.map((ex, idx) => (
                      <li key={idx}>
                        {ex.name} - {ex.sets} sets of {ex.reps} reps at {ex.weight} {ex.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {log.calories_burned && (
                <p className="mt-2 text-sm text-muted-foreground">Calories Burned: {log.calories_burned}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentWorkout.id ? 'Edit Workout Log' : 'Log New Workout'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={currentWorkout.workout_name || ''}
                onChange={(e) => setCurrentWorkout((prev) => ({ ...prev, workout_name: e.target.value }))}
                placeholder="e.g., Morning Run, Leg Day"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={currentWorkout.duration_minutes || ''}
                  onChange={(e) => setCurrentWorkout((prev) => ({ ...prev, duration_minutes: parseInt(e.target.value) || '' }))}
                  placeholder="e.g., 60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  value={currentWorkout.calories_burned || ''}
                  onChange={(e) => setCurrentWorkout((prev) => ({ ...prev, calories_burned: parseInt(e.target.value) || '' }))}
                  placeholder="e.g., 300"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Exercises</Label>
              {currentWorkout.exercises?.map((exercise, index) => (
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkout}>Save Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
