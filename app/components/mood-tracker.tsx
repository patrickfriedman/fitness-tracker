"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown } from 'lucide-react'

export function MoodTracker() {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)

  const moodOptions = [
    { value: 1, icon: Frown, label: "Poor", color: "text-red-500" },
    { value: 2, icon: Frown, label: "Fair", color: "text-orange-500" },
    { value: 3, icon: Meh, label: "Good", color: "text-yellow-500" },
    { value: 4, icon: Smile, label: "Great", color: "text-green-500" },
    { value: 5, icon: Smile, label: "Excellent", color: "text-blue-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Mood</p>
          <div className="flex space-x-2">
            {moodOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.value}
                  variant={mood === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood(option.value)}
                  className="flex-1"
                >
                  <Icon className={`h-4 w-4 ${mood === option.value ? "text-white" : option.color}`} />
                </Button>
              )
            })}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Energy Level</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={energy === level ? "default" : "outline"}
                size="sm"
                onClick={() => setEnergy(level)}
                className="flex-1"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {mood && energy && (
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              Mood: {moodOptions.find(o => o.value === mood)?.label} | Energy: {energy}/5
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
