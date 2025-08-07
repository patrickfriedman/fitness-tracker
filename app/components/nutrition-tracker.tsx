"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NutritionLog } from '@/types/fitness'
import { addNutritionLog } from '@/app/actions/nutrition-actions'
import { useToast } from '@/hooks/use-toast'

export default function NutritionTracker({ initialNutritionLogs }: { initialNutritionLogs: NutritionLog[] }) {
  const [mealType, setMealType] = useState('')
  const [foodItem, setFoodItem] = useState('')
  const [calories, setCalories] = useState<number | ''>('')
  const [protein, setProtein] = useState<number | ''>('')
  const [carbs, setCarbs] = useState<number | ''>('')
  const [fat, setFat] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const today = new Date().toISOString().split('T')[0]
  const todayLogs = initialNutritionLogs.filter(log => log.log_date === today)
  const totalCaloriesToday = todayLogs.reduce((sum, log) => sum + log.calories, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!mealType || !foodItem || calories === '') {
      toast({
        title: 'Input Error',
        description: 'Meal type, food item, and calories are required.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const newLog: Omit<NutritionLog, 'id' | 'user_id' | 'log_date' | 'created_at'> = {
      meal_type: mealType,
      food_item: foodItem,
      calories: Number(calories),
      protein_g: protein === '' ? null : Number(protein),
      carbs_g: carbs === '' ? null : Number(carbs),
      fat_g: fat === '' ? null : Number(fat),
    }

    const { success, message } = await addNutritionLog(newLog)

    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
      setMealType('')
      setFoodItem('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Nutrition Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-semibold">
          Total Calories Today: {totalCaloriesToday} kcal
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType} disabled={loading}>
              <SelectTrigger id="mealType">
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
            <Label htmlFor="foodItem">Food Item</Label>
            <Input
              id="foodItem"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="e.g., Chicken Breast, Apple"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value === '' ? '' : parseInt(e.target.value))}
              placeholder="e.g., 300"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 25"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 30"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 10"
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging...' : 'Log Meal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
