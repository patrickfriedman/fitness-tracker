"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, RefreshCw } from "lucide-react"
import type { MotivationalQuote } from "../../types/fitness"

const quotes: MotivationalQuote[] = [
  {
    id: 1,
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    id: 2,
    text: "Your body can do it. It's your mind you need to convince.",
    author: "Unknown",
  },
  {
    id: 3,
    text: "Success isn't given. It's earned in the gym, on the field, in every quiet moment when you choose discipline over comfort.",
    author: "Unknown",
  },
  {
    id: 4,
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
  {
    id: 5,
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    id: 6,
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian",
  },
  {
    id: 7,
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
  },
  {
    id: 8,
    text: "Don't wish for it, work for it.",
    author: "Unknown",
  },
  {
    id: 9,
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
  },
  {
    id: 10,
    text: "Push yourself because no one else is going to do it for you.",
    author: "Unknown",
  },
]

export function MotivationalQuoteWidget() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(quotes[0])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Set a random quote on component mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  const getNewQuote = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-purple-700 dark:text-purple-400">
          <div className="flex items-center space-x-2">
            <Quote className="h-5 w-5" />
            <span>Daily Motivation</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getNewQuote}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-sm text-purple-600 dark:text-purple-400 font-medium">— {currentQuote.author}</cite>
        </div>
      </CardContent>
    </Card>
  )
}
