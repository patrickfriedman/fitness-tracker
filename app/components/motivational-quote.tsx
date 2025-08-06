'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

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
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Quote className="h-8 w-8 text-primary mb-4" />
        <p className="text-lg font-semibold italic mb-2">
          &quot;{quote?.text}&quot;
        </p>
        <p className="text-sm text-muted-foreground">- {quote?.author}</p>
      </CardContent>
    </Card>
  );
}
