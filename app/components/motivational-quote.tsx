'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const quotes = [
  {
    quote: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState<{ quote: string; author: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching a quote
    const fetchQuote = () => {
      setIsLoading(true)
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
      setIsLoading(false)
    }

    fetchQuote()
    // Optionally, refresh quote every few hours
    const interval = setInterval(fetchQuote, 6 * 60 * 60 * 1000) // Every 6 hours
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="col-span-1 flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    )
  }

  return (
    <Card className="col-span-1 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <CardContent className="space-y-4">
        <p className="text-xl font-semibold italic">"{currentQuote?.quote}"</p>
        <p className="text-sm font-light">- {currentQuote?.author}</p>
      </CardContent>
    </Card>
  )
}
