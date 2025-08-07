"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Believe you can and you're halfway there.",
  "Success is what comes after you stop making excuses.",
  "The body achieves what the mind believes.",
  "Strive for progress, not perfection.",
  "Your health is an investment, not an expense.",
  "Push yourself because no one else is going to do it for you.",
  "Today's actions are tomorrow's results.",
  "Discipline is choosing between what you want now and what you want most.",
  "The pain you feel today will be the strength you feel tomorrow.",
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Daily Motivation</CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg font-semibold italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  )
}
