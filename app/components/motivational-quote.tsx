'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Today's actions are tomorrow's results.",
    author: "Unknown",
  },
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown",
  },
]

export function MotivationalQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const quote = quotes[randomIndex]

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Motivation</CardTitle>
        <Quote className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg font-semibold leading-snug">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2 text-right">
          - {quote.author}
        </p>
      </CardContent>
    </Card>
  )
}
