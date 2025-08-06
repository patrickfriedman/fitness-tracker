"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { PlannedWorkout } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Plus, Loader2, Save, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function WorkoutPlanner() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [workoutName, setWorkoutName] = useState('')
  const [notes, setNotes] = useState('')
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [currentPlannedWorkout, setCurrentPlannedWorkout] = useState<PlannedWorkout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''

  useEffect(() => {
    const fetchPlannedWorkouts = async () => {
      if (!user?.id || !selectedDate) {
        setPlannedWorkouts([])
        setCurrentPlannedWorkout(null)
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
        console.error('Error fetching planned workouts:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to load planned workouts.',
          variant: 'destructive',
        })
        setPlannedWorkouts([])
        setCurrentPlannedWorkout(null)
      } else if (data) {
        setPlannedWorkouts(data as PlannedWorkout[])
        // If there's an existing workout for the day, load the first one for editing
        if (data.length > 0) {
          setCurrentPlannedWorkout(data[0] as PlannedWorkout)
          setWorkoutName(data[0].name || '')
          setNotes(data[0].notes || '')
          setIsEditing(false)
        } else {
          resetForm()
          setIsEditing(true)
        }
      }
      setIsLoading(false)
    }

    fetchPlannedWorkouts()
  }, [user?.id, supabase, formattedSelectedDate, selectedDate])

  const resetForm = () => {
    setWorkoutName('')
    setNotes('')
    setCurrentPlannedWorkout(null)
  }

  const handleSaveWorkout = async () => {
    if (!user?.id || !selectedDate) return

    setIsSaving(true)
    const newPlannedWorkout = {
      user_id: user.id,
      date: formattedSelectedDate,
      name: workoutName,
      notes: notes,
    }

    let error = null
    let data = null

    if (currentPlannedWorkout?.id) {
      // Update existing
      const { data: updateData, error: updateError } = await supabase
        .from('planned_workouts')
        .update(newPlannedWorkout)
        .eq('id', currentPlannedWorkout.id)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new
      const { data: insertData, error: insertError } = await supabase
        .from('planned_workouts')
        .insert(newPlannedWorkout)
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error('Error saving planned workout:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to save planned workout.',
        variant: 'destructive',
      })
    } else if (data) {
      setCurrentPlannedWorkout(data as PlannedWorkout)
      setPlannedWorkouts(prev => {
        const existingIndex = prev.findIndex(pw => pw.id === data.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = data as PlannedWorkout;
          return updated;
        }
        return [...prev, data as PlannedWorkout];
      });
      toast({
        title: 'Success',
        description: 'Planned workout saved!',
      })
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!user?.id) return

    setIsSaving(true) // Use saving state for deletion too
    const { error } = await supabase
      .from('planned_workouts')
      .delete()
      .eq('id', workoutId)
      .eq('user_id', user.id) // Ensure only owner can delete

    if (error) {
      console.error('Error deleting planned workout:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to delete planned workout.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Planned workout deleted!',
      })
      setPlannedWorkouts(prev => prev.filter(pw => pw.id !== workoutId));
      resetForm(); // Reset form if the deleted workout was the one being edited
      setIsEditing(true); // Allow adding a new one
    }
    setIsSaving(false)
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Planner</CardTitle>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Planned Workouts for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}</Label>
                {plannedWorkouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No workouts planned for this date.</p>
                ) : (
                  <div className="space-y-2">
                    {plannedWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          {workout.notes && <p className="text-xs text-muted-foreground">{workout.notes}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setCurrentPlannedWorkout(workout);
                            setWorkoutName(workout.name);
                            setNotes(workout.notes || '');
                            setIsEditing(true);
                          }}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit workout</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkout(workout.id)} disabled={isSaving}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete workout</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {currentPlannedWorkout?.id ? 'Edit Planned Workout' : 'Add New Planned Workout'}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="workoutName">Workout Name</Label>
              <Input
                id="workoutName"
                placeholder="e.g., Leg Day"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                disabled={!isEditing || isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Details about your workout plan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isEditing || isSaving}
              />
            </div>
            {isEditing && (
              <Button onClick={handleSaveWorkout} className="w-full" disabled={isSaving || !workoutName || !selectedDate}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Plan'}
              </Button>
            )}
            {!isEditing && (
              <Button onClick={() => { resetForm(); setIsEditing(true); }} className="w-full" disabled={isSaving}>
                <Plus className="h-4 w-4 mr-2" /> Add New Plan
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
