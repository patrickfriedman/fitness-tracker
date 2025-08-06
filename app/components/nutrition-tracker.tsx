'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { NutritionLog } from '@/types/fitness'

export default function NutritionTracker() {
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([])
  const [newMeal, setNewMeal] = useState<Omit<NutritionLog, 'id'>>({
    date: new Date(),
    mealType: '',
    foodItems: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  const handleAddMeal = () => {
    if (newMeal.mealType && newMeal.foodItems && newMeal.calories > 0) {
      setNutritionLogs([...nutritionLogs, { ...newMeal, id: Date.now().toString() }])
      setNewMeal({ date: new Date(), mealType: '', foodItems: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
      toast({
        title: 'Meal Logged!',
        description: 'Your meal has been successfully recorded.',
      })
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please enter meal type, food items, and calories.',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveMeal = (id: string) => {
    setNutritionLogs(nutritionLogs.filter((log) => log.id !== id))
    toast({
      title: 'Meal Removed',
      description: 'The nutrition log has been deleted.',
    })
  }

  const totalCaloriesToday = nutritionLogs
    .filter(log => log.date.toDateString() === new Date().toDateString())
    .reduce((sum, log) => sum + log.calories, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nutrition Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Log a New Meal</h3>
          <Input
            placeholder="Meal Type (e.g., Breakfast, Lunch, Snack)"
            value={newMeal.mealType}
            onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
          />
          <Textarea
            placeholder="Food Items (e.g., 2 eggs, 1 toast, 1 apple)"
            value={newMeal.foodItems}
            onChange={(e) => setNewMeal({ ...newMeal, foodItems: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Calories (kcal)"
              value={newMeal.calories || ''}
              onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Protein (g)"
              value={newMeal.protein || ''}
              onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={newMeal.carbs || ''}
              onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Fat (g)"
              value={newMeal.fat || ''}
              onChange={(e) => setNewMeal({ ...newMeal, fat: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Button onClick={handleAddMeal} className="w-full">
            Log Meal
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Nutrition History</h3>
          <div className="text-lg font-bold">Total Calories Today: {totalCaloriesToday} kcal</div>
          {nutritionLogs.length === 0 ? (
            <p className="text-muted-foreground">No meals logged yet.</p>
          ) : (
            <div className="space-y-4">
              {nutritionLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{log.mealType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {log.date.toLocaleDateString()} - {log.calories} kcal
                      </p>
                      <p className="text-sm mt-1">{log.foodItems}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        P: {log.protein}g | C: {log.carbs}g | F: {log.fat}g
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMeal(log.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
