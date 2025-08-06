"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  
  const moods = [
    { emoji: "😄", label: "Great", value: "great" },
    { emoji: "😊", label: "Good", value: "good" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😔", label: "Bad", value: "bad" }
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Heart className="mr-2 h-4 w-4 text-red-500" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className="h-16 flex flex-col space-y-1"
              onClick={() => setSelectedMood(mood.value)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-center text-sm text-gray-600 mt-3">
            Mood logged for today!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
