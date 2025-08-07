'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { getDailyNutritionLogs, addNutritionLog, updateNutritionLog, deleteNutritionLog } from '@/app/actions/nutrition-actions' // Assuming these actions exist
import { NutritionLog } from '@/types/fitness'
import { useAuth } from '@/contexts/auth-context'

export default function NutritionTracker() {
  const { session, isLoading: authLoading } = useAuth();
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLog, setCurrentLog] = useState<Partial<NutritionLog>>({
    food_item: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    log_date: new Date(),
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionLogs = async () => {
      if (!authLoading && session?.user?.id) {
        try {
          const result = await getDailyNutritionLogs(session.user.id);
          if (result.success && result.logs) {
            setNutritionLogs(result.logs);
          }
        } catch (error) {
          console.error('Failed to fetch nutrition logs:', error);
          toast({
            title: 'Error',
            description: 'Failed to load nutrition logs.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !session?.user?.id) {
        setLoading(false);
      }
    };
    fetchNutritionLogs();
  }, [session, authLoading, toast]);

  const handleSaveLog = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to log nutrition.',
        variant: 'destructive',
      });
      return;
    }

    if (!currentLog.food_item || !currentLog.calories) {
      toast({
        title: 'Error',
        description: 'Food item and calories are required.',
        variant: 'destructive',
      });
      return;
    }

    const logToSave: Partial<NutritionLog> = {
      user_id: session.user.id,
      food_item: currentLog.food_item,
      calories: parseInt(currentLog.calories as string),
      protein_g: currentLog.protein_g ? parseInt(currentLog.protein_g as string) : undefined,
      carbs_g: currentLog.carbs_g ? parseInt(currentLog.carbs_g as string) : undefined,
      fat_g: currentLog.fat_g ? parseInt(currentLog.fat_g as string) : undefined,
      log_date: currentLog.log_date || new Date(),
    };

    try {
      let result;
      if (currentLog.id) {
        result = await updateNutritionLog(currentLog.id, logToSave as NutritionLog);
      } else {
        result = await addNutritionLog(logToSave as NutritionLog);
      }

      if (result.success && result.log) {
        if (currentLog.id) {
          setNutritionLogs((prev) => prev.map((log) => (log.id === result.log!.id ? result.log! : log)));
        } else {
          setNutritionLogs((prev) => [...prev, result.log!]);
        }
        toast({
          title: 'Success',
          description: 'Nutrition logged successfully!',
        });
        setShowDialog(false);
        setCurrentLog({ food_item: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', log_date: new Date() });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to save nutrition log.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving nutrition log:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving your nutrition log.',
        variant: 'destructive',
      });
    }
  };

  const handleEditLog = (log: NutritionLog) => {
    setCurrentLog(log);
    setShowDialog(true);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const result = await deleteNutritionLog(id);
      if (result.success) {
        setNutritionLogs((prev) => prev.filter((log) => log.id !== id));
        toast({
          title: 'Success',
          description: 'Nutrition log deleted successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete nutrition log.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting nutrition log:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the nutrition log.',
        variant: 'destructive',
      });
    }
  };

  const totalCalories = nutritionLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = nutritionLogs.reduce((sum, log) => sum + (log.protein_g || 0), 0);
  const totalCarbs = nutritionLogs.reduce((sum, log) => sum + (log.carbs_g || 0), 0);
  const totalFat = nutritionLogs.reduce((sum, log) => sum + (log.fat_g || 0), 0);

  if (loading) {
    return (
      <div className="grid gap-4">
        <p>Loading nutrition logs...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Total Calories</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCalories}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Protein (g)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalProtein}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Carbs (g)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCarbs}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Fat (g)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalFat}</CardContent>
        </Card>
      </div>

      <Button onClick={() => {
        setCurrentLog({ food_item: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', log_date: new Date() });
        setShowDialog(true);
      }}>
        Log New Food
      </Button>

      {nutritionLogs.length === 0 ? (
        <p className="text-muted-foreground">No food logged yet. Start by logging one!</p>
      ) : (
        <div className="grid gap-4">
          {nutritionLogs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{log.food_item}</h3>
                  <p className="text-sm text-muted-foreground">
                    {log.calories} kcal | P:{log.protein_g || 0}g C:{log.carbs_g || 0}g F:{log.fat_g || 0}g
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditLog(log)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteLog(log.id!)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentLog.id ? 'Edit Nutrition Log' : 'Log New Food Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="food-item" className="text-right">
                Food Item
              </Label>
              <Input
                id="food-item"
                value={currentLog.food_item || ''}
                onChange={(e) => setCurrentLog((prev) => ({ ...prev, food_item: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., Chicken Breast"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                value={currentLog.calories || ''}
                onChange={(e) => setCurrentLog((prev) => ({ ...prev, calories: parseInt(e.target.value) || '' }))}
                className="col-span-3"
                placeholder="e.g., 250"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protein" className="text-right">
                Protein (g)
              </Label>
              <Input
                id="protein"
                type="number"
                value={currentLog.protein_g || ''}
                onChange={(e) => setCurrentLog((prev) => ({ ...prev, protein_g: parseInt(e.target.value) || '' }))}
                className="col-span-3"
                placeholder="e.g., 30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carbs" className="text-right">
                Carbs (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                value={currentLog.carbs_g || ''}
                onChange={(e) => setCurrentLog((prev) => ({ ...prev, carbs_g: parseInt(e.target.value) || '' }))}
                className="col-span-3"
                placeholder="e.g., 20"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fat" className="text-right">
                Fat (g)
              </Label>
              <Input
                id="fat"
                type="number"
                value={currentLog.fat_g || ''}
                onChange={(e) => setCurrentLog((prev) => ({ ...prev, fat_g: parseInt(e.target.value) || '' }))}
                className="col-span-3"
                placeholder="e.g., 10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLog}>Save Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
