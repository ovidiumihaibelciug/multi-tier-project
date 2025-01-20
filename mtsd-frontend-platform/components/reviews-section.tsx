'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

const reviews = [
  { id: 1, author: 'Alice Johnson', rating: 5, comment: 'Excellent course! Dr. Smith is an amazing instructor.' },
  { id: 2, author: 'Bob Williams', rating: 4, comment: 'Very informative, but the workload can be heavy at times.' },
  { id: 3, author: 'Charlie Brown', rating: 5, comment: 'This course gave me a solid foundation in CS. Highly recommended!' },
]

export default function ReviewsSection() {
  const [showAllReviews, setShowAllReviews] = useState(false)

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2)

  return (
    <div className="space-y-4">
      {displayedReviews.map((review) => (
        <div key={review.id} className="border-b pb-4 last:border-b-0">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-semibold">{review.author}</span>
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
        </div>
      ))}
      {!showAllReviews && reviews.length > 2 && (
        <Button variant="link" onClick={() => setShowAllReviews(true)}>
          Show all reviews
        </Button>
      )}
    </div>
  )
}

