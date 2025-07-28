"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap, Target, MessageCircle } from "lucide-react"
import type { MoodLog } from "../../types/fitness"

interface MoodTrackerWidgetProps {
  userId: string
  onMoodUpdate?: (mood: MoodLog) => void
}

const moodEmojis = ["😢", "😕", "😐", "😊", "😄"]
const moodLabels = ["Very Bad", "Bad", "Okay", "Good", "Excellent"]

export function MoodTrackerWidget({ userId, onMoodUpdate }: MoodTrackerWidgetProps) {
  const [currentMood, setCurrentMood] = useState<MoodLog>({
    userId,
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    energy: 3,
    motivation: 3,
    notes: "",
    timestamp: new Date().toISOString(),
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasLoggedToday, setHasLoggedToday] = useState(false)

  const handleMoodChange = (type: "mood" | "energy" | "motivation", value: number) => {
    setCurrentMood((prev) => ({
      ...prev,
      [type]: value as 1 | 2 | 3 | 4 | 5,
      timestamp: new Date().toISOString(),
    }))
  }

  const handleSaveMood = () => {
    onMoodUpdate?.(currentMood)
    setHasLoggedToday(true)
    setIsExpanded(false)
  }

  const getMoodColor = (value: number) => {
    const colors = [
      "text-red-600 bg-red-100",
      "text-orange-600 bg-orange-100",
      "text-yellow-600 bg-yellow-100",
      "text-green-600 bg-green-100",
      "text-emerald-600 bg-emerald-100",
    ]
    return colors[value - 1] || colors[2]
  }

  const renderMoodSelector = (
    type: "mood" | "energy" | "motivation",
    value: number,
    icon: React.ReactNode,
    label: string,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline" className={`text-xs ${getMoodColor(value)}`}>
          {moodLabels[value - 1]}
        </Badge>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant={value === rating ? "default" : "outline"}
            size="sm"
            className={`w-8 h-8 p-0 text-lg ${value === rating ? getMoodColor(rating) : ""}`}
            onClick={() => handleMoodChange(type, rating)}
          >
            {moodEmojis[rating - 1]}
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-pink-700 dark:text-pink-400">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Mood Tracker</span>
          </div>
          {hasLoggedToday && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
              Logged
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExpanded ? (
          <div className="text-center space-y-3">
            <div className="text-6xl">{moodEmojis[currentMood.mood - 1]}</div>
            <p className="text-lg font-medium text-pink-700 dark:text-pink-400">{moodLabels[currentMood.mood - 1]}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="font-medium">Energy</p>
                <p className={`px-2 py-1 rounded ${getMoodColor(currentMood.energy || 3)}`}>
                  {moodLabels[(currentMood.energy || 3) - 1]}
                </p>
              </div>
              <div className="text-center">
                <p className="font-medium">Motivation</p>
                <p className={`px-2 py-1 rounded ${getMoodColor(currentMood.motivation || 3)}`}>
                  {moodLabels[(currentMood.motivation || 3) - 1]}
                </p>
              </div>
              <div className="text-center">
                <p className="font-medium">Overall</p>
                <p className={`px-2 py-1 rounded ${getMoodColor(currentMood.mood)}`}>
                  {moodLabels[currentMood.mood - 1]}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsExpanded(true)}
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              disabled={hasLoggedToday}
            >
              {hasLoggedToday ? "Already Logged Today" : "Update Mood"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {renderMoodSelector("mood", currentMood.mood, <Heart className="h-4 w-4 text-pink-600" />, "Mood")}
            {renderMoodSelector(
              "energy",
              currentMood.energy || 3,
              <Zap className="h-4 w-4 text-yellow-600" />,
              "Energy",
            )}
            {renderMoodSelector(
              "motivation",
              currentMood.motivation || 3,
              <Target className="h-4 w-4 text-blue-600" />,
              "Motivation",
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Notes (Optional)</span>
              </div>
              <Textarea
                placeholder="How are you feeling today? Any thoughts or reflections..."
                value={currentMood.notes}
                onChange={(e) => setCurrentMood((prev) => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => setIsExpanded(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveMood} className="flex-1">
                Save Mood
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
