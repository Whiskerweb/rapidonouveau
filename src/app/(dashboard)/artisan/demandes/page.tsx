import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Hammer, MapPin, Ruler, Clock, MessageSquare } from 'lucide-react'
import { ArtisanDemandesClient } from './demandes-client'

export default async function ArtisanDemandesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // Verify user is artisan
  const { data: artisanProfile } = await supabase
    .from('artisan_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!artisanProfile) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300 mx-auto">
            <Hammer className="h-6 w-6" />
          </div>
          <p className="font-heading font-bold text-rapido-blue">Réservé aux artisans</p>
          <p className="text-sm text-zinc-400">
            Cette page est réservée aux profils artisans. Complétez votre profil pour y accéder.
          </p>
        </div>
      </div>
    )
  }

  // Get open matching requests matching artisan trades
  const artisanTrades = [
    artisanProfile.main_trade,
    ...(artisanProfile.specializations || [])
  ].filter(Boolean)

  const { data: openRequests } = await supabase
    .from('matching_requests')
    .select(`
      *,
      estimations (id, project_type, city, surface_m2, postal_code)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  // Get artisan's existing proposals
  const { data: myProposals } = await supabase
    .from('matching_proposals')
    .select('matching_request_id')
    .eq('artisan_id', user.id)

  const myProposalIds = new Set((myProposals || []).map(p => p.matching_request_id))

  // Filter requests that match artisan trades and haven't been proposed yet
  const relevantRequests = (openRequests || []).filter(req => {
    if (myProposalIds.has(req.id)) return false
    if (!req.required_trades || req.required_trades.length === 0) return true
    return req.required_trades.some((t: string) =>
      artisanTrades.some(at => at?.toLowerCase() === t.toLowerCase())
    )
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rapido-blue">
          Demandes de chantier
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Projets correspondant à vos compétences dans votre zone.
        </p>
      </div>

      <ArtisanDemandesClient
        requests={relevantRequests}
        artisanTrades={artisanTrades}
      />
    </div>
  )
}
