"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Quote } from 'lucide-react'

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "Your body can do it. It's your mind you need to convince.",
    author: "Unknown"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich"
  },
  {
    text: "Exercise is a celebration of what your body can do, not a punishment for what you ate.",
    author: "Unknown"
  }
]

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`quote-${today}`)
    if (stored) {
      setCurrentQuote(JSON.parse(stored))
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
      localStorage.setItem(`quote-${today}`, JSON.stringify(randomQuote))
    }
  }, [])

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setCurrentQuote(randomQuote)
    const today = new Date().toDateString()
    localStorage.setItem(`quote-${today}`, JSON.stringify(randomQuote))
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Quote className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium italic text-gray-700 dark:text-gray-300">
                "{currentQuote.text}"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                — {currentQuote.author}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={getNewQuote}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              New Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
