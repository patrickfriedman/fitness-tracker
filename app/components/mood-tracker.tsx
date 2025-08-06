"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown, Heart, Zap } from 'lucide-react'

interface MoodEntry {
  date: string
  mood: string
  energy: number
}

export function MoodTracker() {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null)
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedEnergy, setSelectedEnergy] = useState(3)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`mood-${today}`)
    if (stored) {
      const mood = JSON.parse(stored)
      setTodayMood(mood)
      setSelectedMood(mood.mood)
      setSelectedEnergy(mood.energy)
    }
  }, [])

  const saveMood = () => {
    const today = new Date().toDateString()
    const moodEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      energy: selectedEnergy,
    }
    
    setTodayMood(moodEntry)
    localStorage.setItem(`mood-${today}`, JSON.stringify(moodEntry))
  }

  const moods = [
    { id: "great", label: "Great", icon: Smile, color: "text-green-500" },
    { id: "good", label: "Good", icon: Heart, color: "text-blue-500" },
    { id: "okay", label: "Okay", icon: Meh, color: "text-yellow-500" },
    { id: "bad", label: "Bad", icon: Frown, color: "text-red-500" },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Daily Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">How are you feeling?</p>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => {
                const Icon = mood.icon
                return (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.id)}
                    className="flex items-center space-x-1"
                  >
                    <Icon className={`h-4 w-4 ${mood.color}`} />
                    <span>{mood.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Energy Level: {selectedEnergy}/5
            </p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  variant={selectedEnergy >= level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEnergy(level)}
                  className="w-8 h-8 p-0"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={saveMood}
            disabled={!selectedMood}
            className="w-full"
            size="sm"
          >
            {todayMood ? "Update Mood" : "Save Mood"}
          </Button>
          
          {todayMood && (
            <div className="text-center text-sm text-gray-500">
              Mood logged for today ✓
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
