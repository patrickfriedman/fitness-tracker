'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { createBodyMetric, getLatestBodyMetric } from '@/app/actions/body-metrics-actions' // Assuming these actions exist
import { BodyMetric } from '@/types/fitness'
import { useAuth } from '@/contexts/auth-context'

export default function BodyMetricsWidget() {
  const { session, isLoading: authLoading } = useAuth();
  const [latestMetric, setLatestMetric] = useState<BodyMetric | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetric = async () => {
      if (!authLoading && session?.user?.id) {
        try {
          const result = await getLatestBodyMetric(session.user.id);
          if (result.success && result.metric) {
            setLatestMetric(result.metric);
            setWeight(result.metric.weight_kg?.toString() || '');
            setHeight(result.metric.height_cm?.toString() || '');
            setBodyFat(result.metric.body_fat_percent?.toString() || '');
          }
        } catch (error) {
          console.error('Failed to fetch body metric:', error);
          toast({
            title: 'Error',
            description: 'Failed to load body metrics.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !session?.user?.id) {
        setLoading(false);
      }
    };
    fetchMetric();
  }, [session, authLoading, toast]);

  const handleSaveMetric = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save metrics.',
        variant: 'destructive',
      });
      return;
    }

    const newMetric: Partial<BodyMetric> = {
      user_id: session.user.id,
      weight_kg: weight ? parseFloat(weight) : undefined,
      height_cm: height ? parseFloat(height) : undefined,
      body_fat_percent: bodyFat ? parseFloat(bodyFat) : undefined,
      log_date: new Date(),
    };

    try {
      const result = await createBodyMetric(newMetric as BodyMetric);
      if (result.success && result.metric) {
        setLatestMetric(result.metric);
        toast({
          title: 'Success',
          description: 'Body metrics saved successfully!',
        });
        setShowDialog(false);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to save body metrics.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving body metric:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving metrics.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Body Metrics</CardTitle>
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
        <CardTitle>Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {latestMetric ? (
          <>
            <p>Weight: {latestMetric.weight_kg ? `${latestMetric.weight_kg} kg` : 'N/A'}</p>
            <p>Height: {latestMetric.height_cm ? `${latestMetric.height_cm} cm` : 'N/A'}</p>
            <p>Body Fat: {latestMetric.body_fat_percent ? `${latestMetric.body_fat_percent}%` : 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Last updated: {new Date(latestMetric.log_date).toLocaleDateString()}</p>
          </>
        ) : (
          <p>No metrics logged yet.</p>
        )}
        <Button onClick={() => setShowDialog(true)} className="mt-4">
          {latestMetric ? 'Update Metrics' : 'Log Metrics'}
        </Button>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{latestMetric ? 'Update Body Metrics' : 'Log Body Metrics'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 70.5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 175"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bodyFat" className="text-right">
                Body Fat (%)
              </Label>
              <Input
                id="bodyFat"
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 15.2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetric}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
