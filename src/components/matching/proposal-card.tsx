'use client'

import { useState } from 'react'
import { Star, MapPin, Calendar, Euro, MessageSquare, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ProposalCardProps {
  proposal: {
    id: string
    artisan_message: string | null
    estimated_start_date: string | null
    estimated_price: number | null
    score: number
    status: string
    user_accepted: boolean
    artisan_profiles?: {
      company_name: string | null
      main_trade: string | null
      specializations: string[] | null
      rating: number | null
      total_reviews: number | null
      certifications: string[] | null
    }
  }
  onAccept?: (proposalId: string) => void
  isOwner?: boolean
}

export function ProposalCard({ proposal, onAccept, isOwner }: ProposalCardProps) {
  const [accepting, setAccepting] = useState(false)
  const artisan = proposal.artisan_profiles

  const handleAccept = async () => {
    if (!onAccept) return
    setAccepting(true)
    try {
      await onAccept(proposal.id)
    } finally {
      setAccepting(false)
    }
  }

  const rating = artisan?.rating || 0
  const reviews = artisan?.total_reviews || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        proposal.status === 'accepted'
          ? 'border-rapido-green/30 bg-rapido-green/3'
          : 'border-zinc-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Artisan info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rapido-blue/8 text-rapido-blue font-heading font-bold text-sm">
              {(artisan?.company_name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-rapido-blue text-sm">
                {artisan?.company_name || 'Artisan'}
              </h3>
              <p className="text-xs text-zinc-400">
                {artisan?.main_trade || 'Multi-corps'}
              </p>
            </div>
            {/* Score badge */}
            <span className="ml-auto sm:ml-2 rounded-full bg-rapido-green/10 px-2 py-0.5 text-[10px] font-bold text-rapido-green">
              {Math.round(proposal.score)}%
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-400">
              {rating.toFixed(1)} ({reviews} avis)
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3">
            {proposal.estimated_start_date && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Dispo: {new Date(proposal.estimated_start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {proposal.estimated_price && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Euro className="h-3.5 w-3.5" />
                ~{proposal.estimated_price.toLocaleString('fr-FR')} €
              </span>
            )}
          </div>

          {/* Message */}
          {proposal.artisan_message && (
            <div className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-zinc-600 leading-relaxed">{proposal.artisan_message}</p>
            </div>
          )}

          {/* Certifications */}
          {artisan?.certifications && artisan.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {artisan.certifications.map((cert) => (
                <span key={cert} className="rounded-full bg-rapido-green/10 px-2 py-0.5 text-[10px] font-medium text-rapido-green">
                  {cert}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="flex sm:flex-col gap-2 sm:items-end">
            {proposal.status === 'accepted' ? (
              <span className="flex items-center gap-1.5 rounded-full bg-rapido-green/10 px-3 py-1.5 text-xs font-medium text-rapido-green">
                <Check className="h-3.5 w-3.5" />
                Accepté
              </span>
            ) : proposal.status === 'pending' ? (
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={accepting}
                className="bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full text-xs gap-1.5"
              >
                {accepting ? (
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Accepter
              </Button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                {proposal.status === 'declined' ? 'Décliné' : proposal.status}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
