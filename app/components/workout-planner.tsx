'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { PlannedWorkout } from '@/types/fitness'

export default function WorkoutPlanner() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [workoutName, setWorkoutName] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const formattedSelectedDate = selectedDate?.toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const fetchPlannedWorkouts = async () => {
      if (!user?.id || user.id === 'demo-user-123' || !formattedSelectedDate) {
        setPlannedWorkouts([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('planned_workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', formattedSelectedDate)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching planned workouts:', error)
        toast({
          title: 'Error',
          description: 'Failed to load planned workouts.',
          variant: 'destructive',
        })
        setPlannedWorkouts([])
      } else {
        setPlannedWorkouts(data as PlannedWorkout[])
      }
      setIsLoading(false)
    }

    fetchPlannedWorkouts()
  }, [user, supabase, formattedSelectedDate, toast])

  const handleAddWorkout = async () => {
    if (!user?.id || user.id === 'demo-user-123' || !formattedSelectedDate || !workoutName) {
      toast({
        title: 'Missing Info',
        description: 'Please select a date and enter a workout name.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    const newPlannedWorkout = {
      user_id: user.id,
      date: formattedSelectedDate,
      name: workoutName,
      notes: workoutNotes,
    }

    const { data, error } = await supabase
      .from('planned_workouts')
      .insert(newPlannedWorkout)
      .select()

    if (error) {
      console.error('Error adding planned workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to add planned workout.',
        variant: 'destructive',
      })
    } else if (data && data.length > 0) {
      setPlannedWorkouts((prev) => [...prev, data[0] as PlannedWorkout])
      setWorkoutName('')
      setWorkoutNotes('')
      toast({
        title: 'Success',
        description: 'Workout planned!',
      })
    }
    setIsSaving(false)
  }

  const handleDeleteWorkout = async (id: string) => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Workouts cannot be deleted in demo mode.',
      })
      return
    }

    setIsSaving(true)
    const { error } = await supabase
      .from('planned_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting planned workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete planned workout.',
        variant: 'destructive',
      })
    } else {
      setPlannedWorkouts((prev) => prev.filter((workout) => workout.id !== id))
      toast({
        title: 'Success',
        description: 'Workout deleted!',
      })
    }
    setIsSaving(false)
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Workout Planner</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="date-picker">Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Plan Workout for {selectedDate?.toLocaleDateString()}</h3>
          <div className="space-y-2">
            <Label htmlFor="new-workout-name">Workout Name</Label>
            <Input
              id="new-workout-name"
              placeholder="e.g., Leg Day"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-workout-notes">Notes</Label>
            <Textarea
              id="new-workout-notes"
              placeholder="e.g., 3 sets of 10 reps"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <Button onClick={handleAddWorkout} className="w-full" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Planned Workout
          </Button>

          <div className="space-y-2 mt-6">
            <h4 className="text-md font-semibold">Planned Workouts:</h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : plannedWorkouts.length === 0 ? (
              <p className="text-muted-foreground">No workouts planned for this date.</p>
            ) : (
              <ul className="space-y-2">
                {plannedWorkouts.map((workout) => (
                  <li key={workout.id} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      {workout.notes && <p className="text-sm text-muted-foreground">{workout.notes}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
