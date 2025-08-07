'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Utensils, Plus, Minus, Trash2 } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

type NutritionLog = Database['public']['Tables']['nutrition_logs']['Row']

export default function NutritionTracker() {
  const [calories, setCalories] = useState<number | ''>('')
  const [protein, setProtein] = useState<number | ''>('')
  const [carbs, setCarbs] = useState<number | ''>('')
  const [fat, setFat] = useState<number | ''>('')
  const [mealType, setMealType] = useState('') // e.g., Breakfast, Lunch, Dinner, Snack
  const [loading, setLoading] = useState(false)
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]) // State to display saved logs

  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  // Fetch nutrition logs on component mount
  useEffect(() => {
    const fetchNutritionLogs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false });

      if (error) {
        console.error('Error fetching nutrition logs:', error);
      } else {
        setNutritionLogs(data || []);
      }
    };
    fetchNutritionLogs();
  }, [supabase]);

  const handleLogNutrition = async () => {
    if (!calories || !protein || !carbs || !fat) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all nutrition fields.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not logged in.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      log_date: new Date().toISOString().split('T')[0],
      meal_type: mealType || 'General',
      calories: calories,
      protein_g: protein,
      carbs_g: carbs,
      fat_g: fat,
    })

    if (error) {
      console.error('Error logging nutrition:', error)
      toast({
        title: 'Error',
        description: 'Failed to log nutrition.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Nutrition Logged!',
        description: 'Your meal has been successfully recorded.',
      })
      // Reset form
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
      setMealType('')
      // Re-fetch or update local state to show the new log
      const { data, error: fetchError } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false });
      if (!fetchError) {
        setNutritionLogs(data || []);
      }
    }
    setLoading(false)
  }

  const handleDeleteNutrition = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('nutrition_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id); // Ensure user can only delete their own logs

    if (error) {
      console.error('Error deleting nutrition log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete nutrition log.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Nutrition Log Deleted',
        description: 'The nutrition log has been removed.',
      });
      setNutritionLogs(prev => prev.filter(log => log.id !== id));
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Log Nutrition</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Meal Type (optional)
          </label>
          <Input
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            placeholder="e.g., Breakfast, Lunch, Snack"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calories (kcal)
            </label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || '')}
              placeholder="e.g., 500"
              required
            />
          </div>
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Protein (g)
            </label>
            <Input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(parseInt(e.target.value) || '')}
              placeholder="e.g., 30"
              required
            />
          </div>
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Carbs (g)
            </label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(parseInt(e.target.value) || '')}
              placeholder="e.g., 50"
              required
            />
          </div>
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fat (g)
            </label>
            <Input
              id="fat"
              type="number"
              value={fat}
              onChange={(e) => setFat(parseInt(e.target.value) || '')}
              placeholder="e.g., 15"
              required
            />
          </div>
        </div>
        <Button onClick={handleLogNutrition} className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Log Meal
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Meals</h3>
          {nutritionLogs.length === 0 ? (
            <p className="text-muted-foreground">No meals logged yet.</p>
          ) : (
            <div className="space-y-3">
              {nutritionLogs.map((log) => (
                <Card key={log.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{log.meal_type} - {log.calories} kcal</p>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNutrition(log.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.log_date).toLocaleDateString()} | P:{log.protein_g}g C:{log.carbs_g}g F:{log.fat_g}g
                  </p>
                  {log.notes && <p className="text-xs italic mt-1">{log.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
