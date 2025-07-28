"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, RefreshCw } from "lucide-react"

const motivationalQuotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Your body can do it. It's your mind you need to convince.",
    author: "Unknown",
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian",
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "Success isn't given. It's earned in the gym, on the field, in every quiet moment when you choose discipline over comfort.",
    author: "Unknown",
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
  },
  {
    text: "Don't wish for it, work for it.",
    author: "Unknown",
  },
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown",
  },
  {
    text: "Progress, not perfection.",
    author: "Unknown",
  },
]

export function MotivationalQuoteWidget() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Set a random quote on component mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setCurrentQuote(motivationalQuotes[randomIndex])
  }, [])

  const getNewQuote = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
      setCurrentQuote(motivationalQuotes[randomIndex])
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-400">
            <Quote className="h-5 w-5" />
            <span>Daily Motivation</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getNewQuote}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <blockquote className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-xs text-right text-yellow-600 dark:text-yellow-500 font-medium">— {currentQuote.author}</p>
        </div>
      </CardContent>
    </Card>
  )
}
