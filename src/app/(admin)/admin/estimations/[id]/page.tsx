import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { EstimationActions } from '@/components/admin/estimation-actions'
import { questionnaireConfig } from '@/data/questionnaire-config'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-zinc-100 text-zinc-500' },
  submitted: { label: 'En attente', color: 'bg-amber-50 text-amber-600' },
  in_progress: { label: 'En cours', color: 'bg-blue-50 text-blue-600' },
  validated: { label: 'Validé', color: 'bg-indigo-50 text-indigo-600' },
  delivered: { label: 'Livré', color: 'bg-emerald-50 text-emerald-600' },
}

// Formater les réponses du questionnaire pour l'affichage
function formatQuestionnaireResponses(responses: Record<string, unknown>) {
  const formatted: { label: string; value: string }[] = []

  for (const [key, val] of Object.entries(responses)) {
    if (val === undefined || val === null || val === '') continue

    // Trouver le label de la question
    let questionLabel = key
    for (const section of questionnaireConfig.sections) {
      const q = section.questions.find((q) => q.id === key)
      if (q) {
        questionLabel = q.text

        // Trouver le label de la valeur si c'est un choix
        if (q.options && typeof val === 'string') {
          const option = q.options.find((o) => o.value === val)
          if (option) {
            formatted.push({ label: questionLabel, value: option.label })
            break
          }
        }
      }
    }

    // Formater la valeur
    if (Array.isArray(val)) {
      formatted.push({ label: questionLabel, value: val.join(', ') })
    } else if (typeof val === 'boolean') {
      formatted.push({ label: questionLabel, value: val ? 'Oui' : 'Non' })
    } else {
      formatted.push({ label: questionLabel, value: String(val) })
    }
  }

  return formatted
}

export default async function AdminEstimationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Charger l'estimation avec tous les détails
  const { data: estimation } = await supabase
    .from('estimations')
    .select('*')
    .eq('id', id)
    .single()

  if (!estimation) notFound()

  // Profil utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, artisan_profiles(*), immobilier_profiles(*), particulier_profiles(*)')
    .eq('id', estimation.user_id)
    .single()

  // Items et pièces jointes
  const { data: items } = await supabase
    .from('estimation_items')
    .select('*')
    .eq('estimation_id', id)

  const { data: attachments } = await supabase
    .from('attachments')
    .select('*')
    .eq('estimation_id', id)

  // Documents envoyés
  const { data: documents } = await supabase
    .from('estimation_documents')
    .select('*')
    .eq('estimation_id', id)
    .order('created_at', { ascending: false })

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.full_name || profile?.email || 'Utilisateur inconnu'

  const questionnaireResponses = estimation.questionnaire_responses as Record<string, unknown> | null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/estimations"
          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Demandes
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-sm font-medium text-zinc-900">
          {estimation.id.substring(0, 8)}...
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            STATUS_CONFIG[estimation.status]?.color || 'bg-zinc-100 text-zinc-500'
          }`}
        >
          {STATUS_CONFIG[estimation.status]?.label || estimation.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profil client */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading font-bold text-zinc-900 mb-4">Client</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-zinc-400">Nom</span>
                <p className="font-medium text-zinc-900">{displayName}</p>
              </div>
              <div>
                <span className="text-zinc-400">Email</span>
                <p className="font-medium text-zinc-900">{profile?.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <span className="text-zinc-400">Téléphone</span>
                  <p className="font-medium text-zinc-900">{profile.phone}</p>
                </div>
              )}
              {profile?.profile_type && (
                <div>
                  <span className="text-zinc-400">Type de profil</span>
                  <p className="font-medium text-zinc-900 capitalize">{profile.profile_type}</p>
                </div>
              )}
              {profile?.address_city && (
                <div>
                  <span className="text-zinc-400">Ville</span>
                  <p className="font-medium text-zinc-900">
                    {profile.address_department ? `${profile.address_department} - ` : ''}
                    {profile.address_city}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Réponses questionnaire */}
          {questionnaireResponses && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading font-bold text-zinc-900 mb-4">
                Réponses du questionnaire
              </h2>
              <div className="space-y-3">
                {formatQuestionnaireResponses(questionnaireResponses).map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 text-sm border-b border-zinc-50 pb-2">
                    <span className="text-zinc-500 min-w-0">{item.label}</span>
                    <span className="font-medium text-zinc-900 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt IA */}
          {estimation.ai_prompt && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading font-bold text-zinc-900 mb-4">Prompt structuré IA</h2>
              <pre className="bg-zinc-50 rounded-lg p-4 text-xs overflow-x-auto text-zinc-700 whitespace-pre-wrap">
                {estimation.ai_prompt}
              </pre>
            </div>
          )}

          {/* Description et infos basiques (fallback pour anciennes estimations) */}
          {!questionnaireResponses && estimation.notes && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading font-bold text-zinc-900 mb-4">Description</h2>
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">{estimation.notes}</p>
            </div>
          )}

          {/* Infos du bien */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading font-bold text-zinc-900 mb-4">Informations du bien</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              {estimation.project_type && (
                <div>
                  <span className="text-zinc-400">Type de projet</span>
                  <p className="font-medium text-zinc-900">{estimation.project_type}</p>
                </div>
              )}
              {estimation.property_type && (
                <div>
                  <span className="text-zinc-400">Type de bien</span>
                  <p className="font-medium text-zinc-900 capitalize">{estimation.property_type}</p>
                </div>
              )}
              {estimation.surface_m2 && (
                <div>
                  <span className="text-zinc-400">Surface</span>
                  <p className="font-medium text-zinc-900">{estimation.surface_m2} m²</p>
                </div>
              )}
              {(estimation.address || estimation.city) && (
                <div>
                  <span className="text-zinc-400">Adresse</span>
                  <p className="font-medium text-zinc-900">
                    {estimation.address}
                    {estimation.postal_code ? `, ${estimation.postal_code}` : ''}
                    {estimation.city ? ` ${estimation.city}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Catégories de travaux */}
          {items && items.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading font-bold text-zinc-900 mb-4">Catégories de travaux</h2>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700"
                  >
                    {item.category}
                    {item.level === 'partial' && ' (partiel)'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pièces jointes */}
          {attachments && attachments.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading font-bold text-zinc-900 mb-4">
                Pièces jointes ({attachments.length})
              </h2>
              <div className="space-y-2">
                {attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 transition-colors"
                  >
                    <span className="text-zinc-700 truncate">{att.filename}</span>
                    <span className="text-xs text-zinc-400 flex-shrink-0 ml-2">{att.type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale - Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading font-bold text-zinc-900 mb-4">Actions</h2>
            <EstimationActions estimationId={id} currentStatus={estimation.status} />
          </div>

          {/* Dates */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading font-bold text-zinc-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-400">Créée le</span>
                <p className="font-medium text-zinc-900">
                  {new Date(estimation.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {estimation.submitted_at && (
                <div>
                  <span className="text-zinc-400">Soumise le</span>
                  <p className="font-medium text-zinc-900">
                    {new Date(estimation.submitted_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {estimation.delivered_at && (
                <div>
                  <span className="text-zinc-400">Livrée le</span>
                  <p className="font-medium text-zinc-900">
                    {new Date(estimation.delivered_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents envoyés */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading font-bold text-zinc-900 mb-4">
              Documents envoyés ({documents?.length || 0})
            </h2>
            {documents && documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-zinc-700 truncate">{doc.filename}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      {doc.viewed_at ? ' | Consulté' : ' | Non consulté'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">Aucun document envoyé.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
