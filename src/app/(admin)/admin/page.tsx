import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Stats par statut
  const { data: allEstimations } = await supabase
    .from('estimations')
    .select('id, status, created_at')

  const estimations = allEstimations || []

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const stats = {
    total: estimations.length,
    thisMonth: estimations.filter((e) => e.created_at >= startOfMonth).length,
    submitted: estimations.filter((e) => e.status === 'submitted').length,
    inProgress: estimations.filter((e) => e.status === 'in_progress').length,
    validated: estimations.filter((e) => e.status === 'validated').length,
    delivered: estimations.filter((e) => e.status === 'delivered').length,
  }

  // Demandes récentes en attente
  const { data: pendingEstimations } = await supabase
    .from('estimations')
    .select('id, user_id, property_type, address, city, surface_m2, status, created_at, project_type')
    .in('status', ['submitted', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10)

  // Récupérer les profils des utilisateurs correspondants
  const userIds = [...new Set((pendingEstimations || []).map((e) => e.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, first_name, last_name, email, profile_type')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

  const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-zinc-100 text-zinc-500' },
    submitted: { label: 'En attente', color: 'bg-amber-50 text-amber-600' },
    in_progress: { label: 'En cours', color: 'bg-blue-50 text-blue-600' },
    validated: { label: 'Validé', color: 'bg-indigo-50 text-indigo-600' },
    delivered: { label: 'Livré', color: 'bg-emerald-50 text-emerald-600' },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-zinc-900">
          Tableau de bord
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Vue d&apos;ensemble de l&apos;activité Rapido&apos;Devis.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Ce mois</p>
          <p className="font-heading text-3xl font-extrabold text-zinc-900 mt-1">
            {stats.thisMonth}
          </p>
          <p className="text-xs text-zinc-500 mt-1">nouvelles demandes</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">En attente</p>
          <p className="font-heading text-3xl font-extrabold text-amber-500 mt-1">
            {stats.submitted}
          </p>
          <p className="text-xs text-zinc-500 mt-1">demandes a traiter</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">En cours</p>
          <p className="font-heading text-3xl font-extrabold text-blue-500 mt-1">
            {stats.inProgress}
          </p>
          <p className="text-xs text-zinc-500 mt-1">en traitement</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Livrées</p>
          <p className="font-heading text-3xl font-extrabold text-emerald-500 mt-1">
            {stats.delivered}
          </p>
          <p className="text-xs text-zinc-500 mt-1">estimations terminées</p>
        </div>
      </div>

      {/* Pending estimations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-zinc-900">Demandes en attente</h2>
          <Link href="/admin/estimations" className="text-sm text-rapido-green hover:underline">
            Voir tout
          </Link>
        </div>

        {pendingEstimations && pendingEstimations.length > 0 ? (
          <div className="space-y-3">
            {pendingEstimations.map((estimation) => {
              const profile = profileMap.get(estimation.user_id)
              const displayName =
                profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.full_name || profile?.email || 'Utilisateur'

              return (
                <Link
                  key={estimation.id}
                  href={`/admin/estimations/${estimation.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-900 text-sm truncate">
                        {displayName}
                      </p>
                      {profile?.profile_type && (
                        <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
                          {profile.profile_type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {estimation.project_type || estimation.property_type || 'Estimation'}
                      {estimation.city ? ` - ${estimation.city}` : ''}
                      {estimation.surface_m2 ? ` - ${estimation.surface_m2}m²` : ''}
                      {' | '}
                      {new Date(estimation.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium flex-shrink-0 ${
                      statusConfig[estimation.status]?.color || 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {statusConfig[estimation.status]?.label || estimation.status}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-zinc-500">Aucune demande en attente.</p>
          </div>
        )}
      </div>
    </div>
  )
}
