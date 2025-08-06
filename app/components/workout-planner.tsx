'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlannedWorkout } from '@/types/fitness'

export default function WorkoutPlanner() {
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [newWorkout, setNewWorkout] = useState<Omit<PlannedWorkout, 'id'>>({
    date: new Date(),
    title: '',
    description: '',
    exercises: [],
  })
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' })

  const handleAddWorkout = () => {
    if (newWorkout.title && newWorkout.date) {
      setPlannedWorkouts([...plannedWorkouts, { ...newWorkout, id: Date.now().toString() }])
      setNewWorkout({ date: new Date(), title: '', description: '', exercises: [] })
      setNewExercise({ name: '', sets: '', reps: '', weight: '' })
    }
  }

  const handleRemoveWorkout = (id: string) => {
    setPlannedWorkouts(plannedWorkouts.filter((workout) => workout.id !== id))
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Workout Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Plan a New Workout</h3>
          <Input
            placeholder="Workout Title"
            value={newWorkout.title}
            onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
          />
          <Textarea
            placeholder="Workout Description (optional)"
            value={newWorkout.description}
            onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !newWorkout.date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newWorkout.date ? format(newWorkout.date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newWorkout.date}
                onSelect={(date) => date && setNewWorkout({ ...newWorkout, date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="space-y-2">
            <h4 className="text-md font-medium">Exercises</h4>
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
            Add Planned Workout
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Planned Workouts</h3>
          {plannedWorkouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts planned yet.</p>
          ) : (
            <div className="space-y-4">
              {plannedWorkouts.map((workout) => (
                <Card key={workout.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{workout.title}</h4>
                      <p className="text-sm text-muted-foreground">{format(workout.date, 'PPP')}</p>
                      {workout.description && <p className="text-sm mt-1">{workout.description}</p>}
                      {workout.exercises.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Exercises:</p>
                          <ul className="list-disc list-inside">
                            {workout.exercises.map((exercise) => (
                              <li key={exercise.id}>{exercise.name} ({exercise.sets}x{exercise.reps} @ {exercise.weight})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveWorkout(workout.id)}>
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
