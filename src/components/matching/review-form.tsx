'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewFormProps {
  proposalId: string
  reviewedId: string
  onSubmit: () => void
}

export function ReviewForm({ proposalId, reviewedId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          reviewedId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (res.ok) {
        onSubmit()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 space-y-4">
      <h3 className="font-heading font-bold text-rapido-blue text-sm">Laisser un avis</h3>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-200'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-zinc-500">
            {rating === 1 ? 'Insuffisant' : rating === 2 ? 'Moyen' : rating === 3 ? 'Bien' : rating === 4 ? 'Très bien' : 'Excellent'}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre commentaire (optionnel)..."
        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rapido-blue/20"
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="bg-rapido-blue hover:bg-rapido-blue/90 text-white rounded-full text-xs gap-1.5"
      >
        <Send className="h-3.5 w-3.5" />
        Envoyer l&apos;avis
      </Button>
    </div>
  )
}
