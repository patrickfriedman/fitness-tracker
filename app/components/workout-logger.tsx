'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { WorkoutLog } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkoutLogger() {
  const { user, isDemo } = useAuth()
  const [latestWorkout, setLatestWorkout] = useState<WorkoutLog | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLatestWorkout = async () => {
      setLoading(true);
      if (isDemo) {
        // Simulate demo data
        setLatestWorkout({
          id: 'demo-workout-1',
          user_id: user.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          name: 'Full Body Strength',
          duration_minutes: 60,
          exercises: [
            { name: 'Squats', sets: 3, reps: 10, weight: 60, unit: 'kg' },
            { name: 'Bench Press', sets: 3, reps: 8, weight: 50, unit: 'kg' },
          ],
          notes: 'Good session, felt strong.',
          calories_burned: 300,
          created_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest workout log:', error.message);
      } else if (data) {
        setLatestWorkout(data);
      } else {
        setLatestWorkout(null);
      }
      setLoading(false);
    };

    fetchLatestWorkout();
  }, [user, isDemo, supabase]);

  const handleLogWorkout = () => {
    // Placeholder for opening a workout logging form/modal
    alert('Logging a new workout! (Feature coming soon)');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Workout</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Latest Workout</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {latestWorkout ? (
          <>
            <div className="text-2xl font-bold">{latestWorkout.name}</div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(latestWorkout.date), 'MMM dd, yyyy')} - {latestWorkout.duration_minutes} mins
            </p>
            <div className="mt-4 text-sm">
              <p className="font-medium">Exercises:</p>
              <ul className="list-disc pl-5">
                {latestWorkout.exercises?.slice(0, 2).map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} ({exercise.sets}x{exercise.reps} @ {exercise.weight} {exercise.unit})
                  </li>
                ))}
                {latestWorkout.exercises && latestWorkout.exercises.length > 2 && (
                  <li>...and {latestWorkout.exercises.length - 2} more</li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No workouts logged yet.
          </div>
        )}
        <Button className="w-full mt-4" onClick={handleLogWorkout}>
          <Plus className="mr-2 h-4 w-4" />
          Log New Workout
        </Button>
      </CardContent>
    </Card>
  );
}
