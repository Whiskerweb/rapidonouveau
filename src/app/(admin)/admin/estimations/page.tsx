import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-zinc-100 text-zinc-500' },
  submitted: { label: 'En attente', color: 'bg-amber-50 text-amber-600' },
  in_progress: { label: 'En cours', color: 'bg-blue-50 text-blue-600' },
  validated: { label: 'Validé', color: 'bg-indigo-50 text-indigo-600' },
  delivered: { label: 'Livré', color: 'bg-emerald-50 text-emerald-600' },
}

export default async function AdminEstimationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const statusFilter = params.status || 'all'
  const page = parseInt(params.page || '1')
  const perPage = 20

  let query = supabase
    .from('estimations')
    .select('id, user_id, property_type, project_type, surface_m2, address, city, postal_code, status, created_at, submitted_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: estimations, count } = await query

  // Récupérer les profils
  const userIds = [...new Set((estimations || []).map((e) => e.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, first_name, last_name, email, profile_type')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))
  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-zinc-900">
          Demandes d&apos;estimation
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {count || 0} demande{(count || 0) > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'submitted', label: 'En attente' },
          { value: 'in_progress', label: 'En cours' },
          { value: 'validated', label: 'Validées' },
          { value: 'delivered', label: 'Livrées' },
        ].map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/estimations${filter.value !== 'all' ? `?status=${filter.value}` : ''}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left px-4 py-3 font-medium text-zinc-500">Client</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-500 hidden sm:table-cell">
                Projet
              </th>
              <th className="text-left px-4 py-3 font-medium text-zinc-500 hidden md:table-cell">
                Localisation
              </th>
              <th className="text-left px-4 py-3 font-medium text-zinc-500 hidden lg:table-cell">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-zinc-500">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {estimations && estimations.length > 0 ? (
              estimations.map((estimation) => {
                const profile = profileMap.get(estimation.user_id)
                const displayName =
                  profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.full_name || profile?.email || '—'

                return (
                  <tr
                    key={estimation.id}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/admin/estimations/${estimation.id}`} className="block">
                        <p className="font-medium text-zinc-900">{displayName}</p>
                        {profile?.profile_type && (
                          <span className="text-xs text-zinc-400">{profile.profile_type}</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Link href={`/admin/estimations/${estimation.id}`} className="block">
                        <p className="text-zinc-700">
                          {estimation.project_type || estimation.property_type || '—'}
                        </p>
                        {estimation.surface_m2 && (
                          <span className="text-xs text-zinc-400">{estimation.surface_m2} m²</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-zinc-600">
                      <Link href={`/admin/estimations/${estimation.id}`}>
                        {estimation.city || estimation.postal_code || '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-500">
                      <Link href={`/admin/estimations/${estimation.id}`}>
                        {new Date(estimation.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_CONFIG[estimation.status]?.color || 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {STATUS_CONFIG[estimation.status]?.label || estimation.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Aucune demande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/estimations?${statusFilter !== 'all' ? `status=${statusFilter}&` : ''}page=${p}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
