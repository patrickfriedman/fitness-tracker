'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { getDailyWaterLog, addWaterLog, updateWaterLog } from '@/app/actions/water-actions' // Assuming these actions exist
import { WaterLog } from '@/types/fitness'
import { useAuth } from '@/contexts/auth-context'

const WATER_GOAL_ML = 2000; // Example daily water goal in ml

export default function WaterTracker() {
  const { session, isLoading: authLoading } = useAuth();
  const [currentWater, setCurrentWater] = useState(0);
  const [waterLogId, setWaterLogId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterLog = async () => {
      if (!authLoading && session?.user?.id) {
        try {
          const result = await getDailyWaterLog(session.user.id);
          if (result.success && result.log) {
            setCurrentWater(result.log.amount_ml);
            setWaterLogId(result.log.id);
          } else {
            setCurrentWater(0);
            setWaterLogId(null);
          }
        } catch (error) {
          console.error('Failed to fetch water log:', error);
          toast({
            title: 'Error',
            description: 'Failed to load water intake.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !session?.user?.id) {
        setLoading(false);
      }
    };
    fetchWaterLog();
  }, [session, authLoading, toast]);

  const handleAddWater = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to log water.',
        variant: 'destructive',
      });
      return;
    }

    const amountToAdd = parseInt(addAmount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid positive number for water intake.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let result;
      if (waterLogId) {
        // Update existing log
        result = await updateWaterLog(waterLogId, currentWater + amountToAdd);
      } else {
        // Create new log
        const newLog: Partial<WaterLog> = {
          user_id: session.user.id,
          amount_ml: amountToAdd,
          log_date: new Date(),
        };
        result = await addWaterLog(newLog as WaterLog);
      }

      if (result.success && result.log) {
        setCurrentWater(result.log.amount_ml);
        setWaterLogId(result.log.id);
        toast({
          title: 'Success',
          description: `${amountToAdd}ml added to your water intake!`,
        });
        setAddAmount('');
        setShowDialog(false);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to log water.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error logging water:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while logging water.',
        variant: 'destructive',
      });
    }
  };

  const progress = (currentWater / WATER_GOAL_ML) * 100;

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Water Intake</CardTitle>
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
        <CardTitle>Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-center text-2xl font-bold">
          {currentWater} ml / {WATER_GOAL_ML} ml
        </div>
        <Progress value={progress} className="w-full" />
        <Button onClick={() => setShowDialog(true)} className="mt-4">
          Add Water
        </Button>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Water Intake</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (ml)
              </Label>
              <Input
                id="amount"
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWater}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
