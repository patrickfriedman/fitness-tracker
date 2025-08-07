'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { getDailyMoodLog, addMoodLog, updateMoodLog } from '@/app/actions/mood-actions' // Assuming these actions exist
import { MoodLog } from '@/types/fitness'
import { useAuth } from '@/contexts/auth-context'

export default function MoodTracker() {
  const { session, isLoading: authLoading } = useAuth();
  const [latestMood, setLatestMood] = useState<MoodLog | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [moodScore, setMoodScore] = useState<string>('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodLog = async () => {
      if (!authLoading && session?.user?.id) {
        try {
          const result = await getDailyMoodLog(session.user.id);
          if (result.success && result.log) {
            setLatestMood(result.log);
            setMoodScore(result.log.mood_score.toString());
            setNotes(result.log.notes || '');
          } else {
            setLatestMood(null);
            setMoodScore('');
            setNotes('');
          }
        } catch (error) {
          console.error('Failed to fetch mood log:', error);
          toast({
            title: 'Error',
            description: 'Failed to load mood data.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !session?.user?.id) {
        setLoading(false);
      }
    };
    fetchMoodLog();
  }, [session, authLoading, toast]);

  const handleSaveMood = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to log your mood.',
        variant: 'destructive',
      });
      return;
    }

    const score = parseInt(moodScore);
    if (isNaN(score) || score < 1 || score > 5) {
      toast({
        title: 'Invalid Mood Score',
        description: 'Please select a mood score between 1 and 5.',
        variant: 'destructive',
      });
      return;
    }

    const newMood: Partial<MoodLog> = {
      user_id: session.user.id,
      mood_score: score,
      notes: notes,
      log_date: new Date(),
    };

    try {
      let result;
      if (latestMood?.id) {
        result = await updateMoodLog(latestMood.id, newMood as MoodLog);
      } else {
        result = await addMoodLog(newMood as MoodLog);
      }

      if (result.success && result.log) {
        setLatestMood(result.log);
        toast({
          title: 'Success',
          description: 'Mood logged successfully!',
        });
        setShowDialog(false);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to log mood.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving your mood.',
        variant: 'destructive',
      });
    }
  };

  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 1: return '😞';
      case 2: return '😐';
      case 3: return '😊';
      case 4: return '😁';
      case 5: return '🤩';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Mood Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {latestMood ? (
          <>
            <div className="text-center text-4xl">
              {getMoodEmoji(latestMood.mood_score)}
            </div>
            <p className="text-center text-lg font-semibold">
              Mood Score: {latestMood.mood_score}/5
            </p>
            {latestMood.notes && (
              <p className="text-sm text-muted-foreground text-center">
                Notes: {latestMood.notes}
              </p>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Last logged: {new Date(latestMood.log_date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-center">No mood logged today.</p>
        )}
        <Button onClick={() => setShowDialog(true)} className="mt-4">
          {latestMood ? 'Update Mood' : 'Log Mood'}
        </Button>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{latestMood ? 'Update Your Mood' : 'Log Your Mood'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>How are you feeling today? (1-5)</Label>
              <RadioGroup
                value={moodScore}
                onValueChange={setMoodScore}
                className="flex justify-center gap-4"
              >
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex flex-col items-center space-y-1">
                    <RadioGroupItem value={score.toString()} id={`mood-${score}`} />
                    <Label htmlFor={`mood-${score}`}>{getMoodEmoji(score)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific thoughts or reasons for your mood?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMood}>Save Mood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
