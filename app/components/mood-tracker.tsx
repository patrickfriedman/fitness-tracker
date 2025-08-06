"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'

const moods = [
  { emoji: "😴", label: "Tired", value: 1 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😊", label: "Good", value: 4 },
  { emoji: "🚀", label: "Energized", value: 5 },
]

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [todaysMood, setTodaysMood] = useState<number | null>(4)

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value)
    setTodaysMood(value)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 text-red-500 mr-2" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={todaysMood === mood.value ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-auto p-2"
              onClick={() => handleMoodSelect(mood.value)}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
        
        {todaysMood && (
          <div className="text-center text-sm text-gray-600">
            You're feeling {moods.find(m => m.value === todaysMood)?.label.toLowerCase()} today
          </div>
        )}
      </CardContent>
    </Card>
  )
}
