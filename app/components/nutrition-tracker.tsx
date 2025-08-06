'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Utensils, Plus, Trash2 } from 'lucide-react'
import { NutritionLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface NutritionTrackerProps {
  initialNutritionLogs: NutritionLog[]
}

export default function NutritionTracker({ initialNutritionLogs }: NutritionTrackerProps) {
  const { session } = useAuth()
  const [mealType, setMealType] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [notes, setNotes] = useState('')
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>(initialNutritionLogs)
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const handleLogNutrition = async () => {
    if (!session?.user || !mealType || !calories) {
      toast({
        title: 'Error',
        description: 'Please fill in meal type and calories, and ensure you are logged in.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert({
          user_id: session.user.id,
          meal_type: mealType,
          calories: parseInt(calories),
          protein: protein ? parseInt(protein) : null,
          carbs: carbs ? parseInt(carbs) : null,
          fat: fat ? parseInt(fat) : null,
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setNutritionLogs((prevLogs) => [data, ...prevLogs])
        toast({
          title: 'Nutrition Logged',
          description: 'Your meal has been successfully recorded!',
        })
        // Reset form
        setMealType('')
        setCalories('')
        setProtein('')
        setCarbs('')
        setFat('')
        setNotes('')
      }
    } catch (error: any) {
      console.error('Error logging nutrition:', error)
      toast({
        title: 'Error',
        description: `Failed to log nutrition: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Nutrition Tracker</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="meal-type">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input id="calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="e.g., 500" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input id="protein" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="e.g., 30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input id="carbs" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="e.g., 60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input id="fat" type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="e.g., 20" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nutrition-notes">Notes (optional)</Label>
          <Textarea id="nutrition-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific details about your meal?" />
        </div>

        <Button onClick={handleLogNutrition} className="w-full mt-4">
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
                  <p className="text-sm font-medium">{log.meal_type} - {log.calories} kcal</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString()} | P:{log.protein}g C:{log.carbs}g F:{log.fat}g
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
