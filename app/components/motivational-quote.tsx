'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

const quotes = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
  },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, 10000) // Change quote every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <blockquote className="text-lg font-semibold italic">
          &ldquo;{currentQuote.text}&rdquo;
        </blockquote>
        <p className="mt-2 text-sm font-medium">- {currentQuote.author}</p>
      </CardContent>
    </Card>
  )
}
