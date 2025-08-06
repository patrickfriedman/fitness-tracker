'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { WorkoutLog } from '@/types/fitness'

export default function WorkoutLogger() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [newWorkout, setNewWorkout] = useState<Omit<WorkoutLog, 'id'>>({
    date: new Date(),
    type: '',
    duration: 0,
    caloriesBurned: 0,
    notes: '',
    exercises: [],
  })
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' })

  const handleAddWorkout = () => {
    if (newWorkout.type && newWorkout.duration > 0) {
      setWorkoutLogs([...workoutLogs, { ...newWorkout, id: Date.now().toString() }])
      setNewWorkout({ date: new Date(), type: '', duration: 0, caloriesBurned: 0, notes: '', exercises: [] })
      setNewExercise({ name: '', sets: '', reps: '', weight: '' })
      toast({
        title: 'Workout Logged!',
        description: 'Your workout has been successfully recorded.',
      })
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please enter workout type and duration.',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveWorkout = (id: string) => {
    setWorkoutLogs(workoutLogs.filter((log) => log.id !== id))
    toast({
      title: 'Workout Removed',
      description: 'The workout log has been deleted.',
    })
  }

  const handleAddExercise = () => {
    if (newExercise.name) {
      setNewWorkout((prev) => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise, id: Date.now().toString() }],
      }))
      setNewExercise({ name: '', sets: '', reps: '', weight: '' })
    }
  }

  const handleRemoveExercise = (exerciseId: string) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((exercise) => exercise.id !== exerciseId),
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Workout Logger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Log a New Workout</h3>
          <Input
            placeholder="Workout Type (e.g., Cardio, Strength)"
            value={newWorkout.type}
            onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={newWorkout.duration || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Calories Burned (optional)"
              value={newWorkout.caloriesBurned || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Textarea
            placeholder="Notes (e.g., how you felt, specific exercises)"
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
          />

          <div className="space-y-2">
            <h4 className="text-md font-medium">Exercises Performed</h4>
            {newWorkout.exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center gap-2">
                <span className="flex-1">{exercise.name} ({exercise.sets}x{exercise.reps} @ {exercise.weight})</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(exercise.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Exercise Name"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="Sets"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                className="w-20"
              />
              <Input
                placeholder="Reps"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                className="w-20"
              />
              <Input
                placeholder="Weight"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                className="w-24"
              />
              <Button onClick={handleAddExercise} size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={handleAddWorkout} className="w-full">
            Log Workout
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Workout History</h3>
          {workoutLogs.length === 0 ? (
            <p className="text-muted-foreground">No workouts logged yet.</p>
          ) : (
            <div className="space-y-4">
              {workoutLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{log.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {log.date.toLocaleDateString()} - {log.duration} mins
                        {log.caloriesBurned > 0 && ` - ${log.caloriesBurned} kcal`}
                      </p>
                      {log.notes && <p className="text-sm mt-1">{log.notes}</p>}
                      {log.exercises.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Exercises:</p>
                          <ul className="list-disc list-inside">
                            {log.exercises.map((exercise) => (
                              <li key={exercise.id}>{exercise.name} ({exercise.sets}x{exercise.reps} @ {exercise.weight})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveWorkout(log.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
