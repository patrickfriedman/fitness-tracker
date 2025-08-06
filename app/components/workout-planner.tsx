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
import { format, isToday, isFuture } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkoutPlanner() {
  const { user, isDemo } = useAuth()
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [workoutName, setWorkoutName] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlannedWorkouts = async () => {
      setLoading(true);
      if (isDemo) {
        // Simulate demo data
        setPlannedWorkouts([
          {
            id: 'demo-plan-1',
            user_id: user.id,
            date: format(new Date(), 'yyyy-MM-dd'),
            name: 'Morning Cardio',
            notes: '30 min run',
            created_at: new Date().toISOString(),
          },
          {
            id: 'demo-plan-2',
            user_id: user.id,
            date: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 2 days from now
            name: 'Leg Day',
            notes: 'Heavy squats and deadlifts',
            created_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('planned_workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(new Date(), 'yyyy-MM-dd')) // Only future or today's workouts
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching planned workouts:', error.message);
      } else {
        setPlannedWorkouts(data);
      }
      setLoading(false);
    };

    fetchPlannedWorkouts();
  }, [user, isDemo, supabase]);

  const handleAddPlannedWorkout = () => {
    // Placeholder for opening a workout planning form/modal
    alert('Planning a new workout! (Feature coming soon)');
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!user || isDemo) {
      alert('Workouts cannot be deleted in demo mode.');
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from('planned_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting planned workout:', error.message);
    } else {
      setPlannedWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Workouts</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Workouts</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {plannedWorkouts && plannedWorkouts.length > 0 ? (
          <div className="space-y-3">
            {plannedWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{workout.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isToday(new Date(workout.date)) ? 'Today' : format(new Date(workout.date), 'MMM dd')}
                    {workout.notes && ` - ${workout.notes}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWorkout(workout.id)}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No upcoming workouts planned.
          </div>
        )}
        <Button className="w-full mt-4" onClick={handleAddPlannedWorkout}>
          <Plus className="mr-2 h-4 w-4" />
          Plan New Workout
        </Button>
      </CardContent>
    </Card>
  );
}
