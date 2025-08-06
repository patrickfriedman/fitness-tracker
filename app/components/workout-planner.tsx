'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { PlannedWorkout } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, PlusCircle, CalendarIcon, Edit, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export default function WorkoutPlanner() {
  const { user } = useAuth()
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState<PlannedWorkout | null>(null)
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDate, setWorkoutDate] = useState<Date | undefined>(new Date())
  const [workoutNotes, setWorkoutNotes] = useState('')
  const supabase = getBrowserClient()

  const fetchPlannedWorkouts = async () => {
    if (!user?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('planned_workouts')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', format(new Date(), 'yyyy-MM-dd')) // Only future or today's workouts
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching planned workouts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load planned workouts.',
        variant: 'destructive',
      })
    } else {
      setPlannedWorkouts(data as PlannedWorkout[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPlannedWorkouts()
  }, [user])

  const resetForm = () => {
    setWorkoutName('')
    setWorkoutDate(new Date())
    setWorkoutNotes('')
    setCurrentWorkout(null)
    setIsEditing(false)
  }

  const handleAddOrUpdateWorkout = async () => {
    if (!user?.id || !workoutName || !workoutDate) {
      toast({
        title: 'Input Error',
        description: 'Please fill in all required fields (Name, Date).',
        variant: 'destructive',
      })
      return
    }
    setIsAdding(true)

    const workoutData = {
      user_id: user.id,
      name: workoutName,
      date: format(workoutDate, 'yyyy-MM-dd'),
      notes: workoutNotes || null,
    }

    let error = null;
    if (isEditing && currentWorkout) {
      const { error: updateError } = await supabase
        .from('planned_workouts')
        .update(workoutData)
        .eq('id', currentWorkout.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('planned_workouts')
        .insert(workoutData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving planned workout:', error)
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'add'} planned workout.`,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: `Workout ${isEditing ? 'updated' : 'planned'} successfully!`,
      })
      resetForm()
      fetchPlannedWorkouts() // Refresh data
    }
    setIsAdding(false)
  }

  const handleEditClick = (workout: PlannedWorkout) => {
    setCurrentWorkout(workout)
    setWorkoutName(workout.name)
    setWorkoutDate(new Date(workout.date))
    setWorkoutNotes(workout.notes || '')
    setIsEditing(true)
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!user?.id) return
    setIsAdding(true) // Use isAdding to disable buttons during delete

    const { error } = await supabase
      .from('planned_workouts')
      .delete()
      .eq('id', workoutId)
      .eq('user_id', user.id) // Ensure user owns the workout

    if (error) {
      console.error('Error deleting planned workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete planned workout.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Planned workout deleted.',
      })
      fetchPlannedWorkouts() // Refresh data
    }
    setIsAdding(false)
  }

  return (
    <Card className="widget-card col-span-full">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Workout Planner</CardTitle>
        <Dialog onOpenChange={(open) => { if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Plan Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Planned Workout' : 'Plan New Workout'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Workout Name</Label>
                <Input
                  id="planName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Leg Day"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planDate">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !workoutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {workoutDate ? format(workoutDate, "PPP") : <span>Pick a date</span>}
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
                <Label htmlFor="planNotes">Notes (optional)</Label>
                <Textarea
                  id="planNotes"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="e.g., Focus on heavy compounds."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrUpdateWorkout} disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Update Workout' : 'Plan Workout')}
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
        ) : plannedWorkouts.length > 0 ? (
          <div className="space-y-3">
            {plannedWorkouts.map((workout) => (
              <Card key={workout.id} className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-md">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                  {workout.notes && <p className="text-xs italic mt-1">{workout.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <Dialog onOpenChange={(open) => { if (!open) resetForm(); }} >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(workout)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {isEditing && currentWorkout?.id === workout.id && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Planned Workout</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="editPlanName">Workout Name</Label>
                            <Input
                              id="editPlanName"
                              value={workoutName}
                              onChange={(e) => setWorkoutName(e.target.value)}
                              placeholder="e.g., Leg Day"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editPlanDate">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !workoutDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {workoutDate ? format(workoutDate, "PPP") : <span>Pick a date</span>}
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
                            <Label htmlFor="editPlanNotes">Notes (optional)</Label>
                            <Textarea
                              id="editPlanNotes"
                              value={workoutNotes}
                              onChange={(e) => setWorkoutNotes(e.target.value)}
                              placeholder="e.g., Focus on heavy compounds."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddOrUpdateWorkout} disabled={isAdding}>
                            {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Workout'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkout(workout.id)} disabled={isAdding}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No workouts planned yet. Start planning your week!</p>
        )}
      </CardContent>
    </Card>
  )
}
