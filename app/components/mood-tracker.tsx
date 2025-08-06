'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile, Frown, Meh, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { MoodLog } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

const moodOptions = [
  { score: 1, icon: <Frown className="h-6 w-6 text-red-500" />, label: 'Bad' },
  { score: 2, icon: <Meh className="h-6 w-6 text-yellow-500" />, label: 'Okay' },
  { score: 3, icon: <Smile className="h-6 w-6 text-green-500" />, label: 'Good' },
]

export default function MoodTracker() {
  const { user, isDemo } = useAuth()
  const [currentMood, setCurrentMood] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = getBrowserClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchMoodLog = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isDemo) {
      setCurrentMood(3); // Simulate demo data
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('mood_logs')
      .select('mood_score')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching mood log:', error.message);
    } else if (data) {
      setCurrentMood(data.mood_score);
    } else {
      setCurrentMood(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMoodLog();
  }, [user, isDemo, today]);

  const handleMoodSelect = async (score: number) => {
    if (!user) return;

    setIsUpdating(true);
    if (isDemo) {
      setCurrentMood(score);
      setIsUpdating(false);
      return;
    }

    const { error } = await supabase
      .from('mood_logs')
      .upsert(
        { user_id: user.id, date: today, mood_score: score },
        { onConflict: 'user_id,date' }
      );

    if (error) {
      console.error('Error updating mood log:', error.message);
    } else {
      setCurrentMood(score);
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Mood</CardTitle>
          <Smile className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Mood</CardTitle>
        <Smile className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentMood ? moodOptions.find(m => m.score === currentMood)?.label : 'Not logged'}
        </div>
        <p className="text-xs text-muted-foreground">
          How are you feeling today?
        </p>
        <div className="flex justify-around gap-2 mt-4">
          {moodOptions.map((mood) => (
            <Button
              key={mood.score}
              variant={currentMood === mood.score ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleMoodSelect(mood.score)}
              disabled={isUpdating}
              className="flex flex-col h-auto w-auto p-2"
            >
              {isUpdating && currentMood === mood.score ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                mood.icon
              )}
              <span className="text-xs mt-1">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
