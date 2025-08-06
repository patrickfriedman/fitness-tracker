"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    text: "Success isn't given. It's earned in the gym.",
    author: "Unknown"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown"
  },
  {
    text: "Don't wish for it, work for it.",
    author: "Unknown"
  },
  {
    text: "Progress, not perfection.",
    author: "Unknown"
  }
]

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  useEffect(() => {
    getNewQuote()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Quote className="h-5 w-5 text-purple-500" />
          <span>Daily Motivation</span>
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={getNewQuote}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <blockquote className="text-center space-y-2">
          <p className="text-sm italic text-gray-700 dark:text-gray-300">
            "{currentQuote.text}"
          </p>
          <footer className="text-xs text-gray-500">
            — {currentQuote.author}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}
