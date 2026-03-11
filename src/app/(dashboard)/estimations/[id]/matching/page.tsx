import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Users, Search } from 'lucide-react'
import { MatchingClient } from './matching-client'

export default async function MatchingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: estimationId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // Get estimation
  const { data: estimation } = await supabase
    .from('estimations')
    .select('id, project_type, city, status, surface_m2')
    .eq('id', estimationId)
    .eq('user_id', user.id)
    .single()

  if (!estimation) redirect('/estimations')

  // Get existing matching request
  const { data: matchingRequest } = await supabase
    .from('matching_requests')
    .select('*')
    .eq('estimation_id', estimationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get proposals if request exists
  let proposals: unknown[] = []
  if (matchingRequest) {
    const { data } = await supabase
      .from('matching_proposals')
      .select(`
        *,
        artisan_profiles (user_id, company_name, main_trade, specializations, rating, total_reviews, certifications)
      `)
      .eq('matching_request_id', matchingRequest.id)
      .order('score', { ascending: false })

    proposals = data || []
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/estimations/${estimationId}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
            Trouver un artisan
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {estimation.project_type?.replace(/_/g, ' ')} — {estimation.city || 'Non localisé'}
          </p>
        </div>
      </div>

      {/* Status info */}
      {estimation.status !== 'delivered' && estimation.status !== 'validated' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mx-auto">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-amber-700">Estimation en cours de traitement</p>
            <p className="text-sm text-amber-600 mt-1">
              La mise en relation sera disponible une fois votre estimation livrée.
            </p>
          </div>
        </div>
      ) : (
        <MatchingClient
          estimationId={estimationId}
          matchingRequest={matchingRequest}
          proposals={proposals}
        />
      )}
    </div>
  )
}
