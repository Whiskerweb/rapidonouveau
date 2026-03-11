'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProposalCard } from '@/components/matching/proposal-card'
import { Users, Search, Send, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface MatchingClientProps {
  estimationId: string
  matchingRequest: {
    id: string
    status: string
    required_trades: string[]
    notes: string | null
  } | null
  proposals: unknown[]
}

export function MatchingClient({ estimationId, matchingRequest, proposals: initialProposals }: MatchingClientProps) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [request, setRequest] = useState(matchingRequest)
  const [proposals] = useState(initialProposals as Array<{
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
  }>)

  const handleCreateRequest = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/matching/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimationId,
          notes: notes.trim() || null,
          maxDistanceKm: 50,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setRequest(data.matchingRequest)
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcceptProposal = async (proposalId: string) => {
    const res = await fetch(`/api/matching/${proposalId}/accept`, {
      method: 'PATCH',
    })

    if (res.ok) {
      router.refresh()
    }
  }

  // No request yet — show CTA
  if (!request) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rapido-blue/5 text-rapido-blue mx-auto">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-rapido-blue text-lg">
                Mise en relation avec un artisan
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                Nous trouvons les artisans les plus qualifiés près de chez vous, vérifiés et notés par nos utilisateurs.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-rapido-blue block mb-2">
                Notes pour les artisans (optionnel)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Précisions sur le projet, contraintes de planning, accès chantier..."
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rapido-blue/20"
              />
            </div>

            <Button
              onClick={handleCreateRequest}
              disabled={submitting}
              className="w-full bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full gap-2 py-6 text-sm shadow-sm hover:shadow-md transition-all"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Lancer la recherche d&apos;artisans
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '1', title: 'Recherche', desc: 'Nous trouvons les artisans qualifiés dans votre zone' },
            { step: '2', title: 'Propositions', desc: 'Les artisans intéressés vous envoient leur offre' },
            { step: '3', title: 'Mise en contact', desc: 'Vous choisissez et échangez directement' },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-zinc-100 bg-white p-4 text-center space-y-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rapido-blue/8 text-rapido-blue text-sm font-bold">
                {item.step}
              </span>
              <p className="font-medium text-rapido-blue text-sm">{item.title}</p>
              <p className="text-xs text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Request exists
  const isMatched = request.status === 'matched'

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
        isMatched
          ? 'border-rapido-green/20 bg-rapido-green/3'
          : 'border-rapido-blue/10 bg-rapido-blue/3'
      }`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          isMatched ? 'bg-rapido-green/15 text-rapido-green' : 'bg-rapido-blue/10 text-rapido-blue'
        }`}>
          {isMatched ? <CheckCircle2 className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </div>
        <div>
          <p className={`font-semibold text-sm ${isMatched ? 'text-rapido-green' : 'text-rapido-blue'}`}>
            {isMatched ? 'Artisan trouvé !' : 'Recherche en cours'}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isMatched
              ? 'Vous êtes en contact avec un artisan. Consultez vos notifications.'
              : `${proposals.length} proposition(s) reçue(s)`}
          </p>
        </div>
      </div>

      {/* Proposals */}
      {proposals.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-heading font-bold text-rapido-blue">
            Propositions ({proposals.length})
          </h2>
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onAccept={handleAcceptProposal}
              isOwner={!isMatched}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300 mx-auto">
            <Send className="h-6 w-6" />
          </div>
          <p className="font-heading font-bold text-rapido-blue">En attente de propositions</p>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Les artisans de votre zone sont en train d&apos;examiner votre demande. Vous serez notifié dès qu&apos;une proposition arrive.
          </p>
        </div>
      )}
    </div>
  )
}
