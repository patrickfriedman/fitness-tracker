'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createNutritionLog } from '@/app/actions/nutrition-actions'

export default function NutritionTracker() {
  const [foodItem, setFoodItem] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!foodItem || !calories) {
      toast({
        title: 'Error!',
        description: 'Food item and calories are required.',
        variant: 'destructive',
      })
      return
    }

    const result = await createNutritionLog({
      food_item: foodItem,
      calories: parseInt(calories),
      protein_g: protein ? parseFloat(protein) : undefined,
      carbs_g: carbs ? parseFloat(carbs) : undefined,
      fat_g: fat ? parseFloat(fat) : undefined,
    })

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Nutrition logged successfully.',
      })
      setFoodItem('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to log nutrition.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="foodItem" className="block text-sm font-medium text-gray-700">
            Food Item
          </label>
          <Input
            id="foodItem"
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="e.g., Chicken Breast"
          />
        </div>
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            Calories
          </label>
          <Input
            id="calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="e.g., 200"
          />
        </div>
        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
            Protein (g)
          </label>
          <Input
            id="protein"
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
            Carbs (g)
          </label>
          <Input
            id="carbs"
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
            Fat (g)
          </label>
          <Input
            id="fat"
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="e.g., 5"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Log Nutrition
        </Button>
      </CardContent>
    </Card>
  )
}
