'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' })

  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  ]

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="col-span-full md:col-span-2 lg:col-span-1 xl:col-span-2">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Quote className="h-8 w-8 text-primary mb-4" />
        <p className="text-lg font-semibold italic mb-2">
          &quot;{quote.text}&quot;
        </p>
        <p className="text-sm text-muted-foreground">- {quote.author}</p>
      </CardContent>
    </Card>
  )
}
