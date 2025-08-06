"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown, Heart, Zap } from 'lucide-react'

const moods = [
  { id: "great", label: "Great", icon: Heart, color: "text-green-500" },
  { id: "good", label: "Good", icon: Smile, color: "text-blue-500" },
  { id: "okay", label: "Okay", icon: Meh, color: "text-yellow-500" },
  { id: "tired", label: "Tired", icon: Frown, color: "text-orange-500" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "text-purple-500" }
]

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [todaysMood, setTodaysMood] = useState<string | null>("good")

  const handleMoodSelect = (moodId: string) => {
    setTodaysMood(moodId)
    setSelectedMood(null)
  }

  const currentMood = moods.find(mood => mood.id === todaysMood)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysMood && currentMood && (
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <currentMood.icon className={`h-8 w-8 mx-auto mb-2 ${currentMood.color}`} />
            <p className="font-medium">Feeling {currentMood.label}</p>
            <p className="text-xs text-gray-500 mt-1">Today's mood</p>
          </div>
        )}
        
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => {
            const Icon = mood.icon
            return (
              <Button
                key={mood.id}
                variant={todaysMood === mood.id ? "default" : "outline"}
                size="sm"
                className="h-12 flex flex-col space-y-1"
                onClick={() => handleMoodSelect(mood.id)}
              >
                <Icon className={`h-4 w-4 ${mood.color}`} />
                <span className="text-xs">{mood.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
