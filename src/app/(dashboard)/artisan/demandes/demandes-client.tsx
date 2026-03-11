'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Ruler, Clock, Send, Hammer, Calendar, Euro } from 'lucide-react'
import { motion } from 'framer-motion'

interface MatchingRequest {
  id: string
  required_trades: string[]
  notes: string | null
  created_at: string
  estimations: {
    id: string
    project_type: string | null
    city: string | null
    surface_m2: number | null
    postal_code: string | null
  } | null
}

interface ArtisanDemandesClientProps {
  requests: MatchingRequest[]
  artisanTrades: (string | null)[]
}

export function ArtisanDemandesClient({ requests, artisanTrades }: ArtisanDemandesClientProps) {
  const router = useRouter()
  const [proposingId, setProposingId] = useState<string | null>(null)
  const [proposalForm, setProposalForm] = useState({
    message: '',
    estimatedStartDate: '',
    estimatedPrice: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [proposedIds, setProposedIds] = useState<Set<string>>(new Set())

  const handlePropose = async (requestId: string) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/matching/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchingRequestId: requestId,
          message: proposalForm.message.trim() || null,
          estimatedStartDate: proposalForm.estimatedStartDate || null,
          estimatedPrice: proposalForm.estimatedPrice ? Number(proposalForm.estimatedPrice) : null,
        }),
      })

      if (res.ok) {
        setProposedIds(prev => new Set([...prev, requestId]))
        setProposingId(null)
        setProposalForm({ message: '', estimatedStartDate: '', estimatedPrice: '' })
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300 mx-auto">
          <Hammer className="h-6 w-6" />
        </div>
        <p className="font-heading font-bold text-rapido-blue">Aucune demande pour le moment</p>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          Les nouvelles demandes correspondant à vos compétences apparaîtront ici.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const estimation = req.estimations
        const isProposing = proposingId === req.id
        const isProposed = proposedIds.has(req.id)

        return (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Project info */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-rapido-blue">
                    {estimation?.project_type?.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase()) || 'Projet'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {estimation?.city && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {estimation.postal_code} {estimation.city}
                      </span>
                    )}
                    {estimation?.surface_m2 && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Ruler className="h-3.5 w-3.5" />
                        {estimation.surface_m2} m²
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                {!isProposed && !isProposing && (
                  <Button
                    size="sm"
                    onClick={() => setProposingId(req.id)}
                    className="bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full text-xs gap-1.5 flex-shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Proposer
                  </Button>
                )}

                {isProposed && (
                  <span className="rounded-full bg-rapido-green/10 px-3 py-1.5 text-xs font-medium text-rapido-green flex-shrink-0">
                    Proposé
                  </span>
                )}
              </div>

              {/* Trades */}
              {req.required_trades.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {req.required_trades.map((trade) => (
                    <span
                      key={trade}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        artisanTrades.some(at => at?.toLowerCase() === trade.toLowerCase())
                          ? 'bg-rapido-green/10 text-rapido-green'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {trade}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {req.notes && (
                <p className="text-xs text-zinc-500 italic bg-zinc-50 rounded-lg p-3">
                  {req.notes}
                </p>
              )}
            </div>

            {/* Proposal form */}
            {isProposing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-zinc-100 p-5 bg-zinc-50/50 space-y-4"
              >
                <textarea
                  rows={3}
                  value={proposalForm.message}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Votre message au client (présentez-vous, expérience, approche)..."
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 bg-white"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Disponibilité
                    </label>
                    <input
                      type="date"
                      value={proposalForm.estimatedStartDate}
                      onChange={(e) => setProposalForm(prev => ({ ...prev, estimatedStartDate: e.target.value }))}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                      <Euro className="h-3.5 w-3.5" />
                      Estimation prix (€)
                    </label>
                    <input
                      type="number"
                      value={proposalForm.estimatedPrice}
                      onChange={(e) => setProposalForm(prev => ({ ...prev, estimatedPrice: e.target.value }))}
                      placeholder="ex: 15000"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProposingId(null)}
                    className="rounded-full text-xs"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handlePropose(req.id)}
                    disabled={submitting}
                    className="bg-rapido-blue hover:bg-rapido-blue/90 text-white rounded-full text-xs gap-1.5"
                  >
                    {submitting ? (
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Envoyer la proposition
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
