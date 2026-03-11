'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText, Search, Filter, ChevronRight, Loader2, Download, Users, Settings } from 'lucide-react'
import { BillingDashboard } from '@/components/billing/billing-dashboard'
import { formatCurrency, getStatusLabel, getDocTypeLabel } from '@/lib/billing-utils'

interface BillingDocument {
  id: string
  document_type: string
  document_number: string
  client_name: string
  status: string
  total_ttc: number
  created_at: string
  due_date: string | null
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  sent: 'bg-blue-50 text-blue-600',
  accepted: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
  paid: 'bg-green-50 text-green-700',
  partially_paid: 'bg-amber-50 text-amber-600',
  overdue: 'bg-red-50 text-red-600',
  signed: 'bg-indigo-50 text-indigo-600',
  cancelled: 'bg-zinc-100 text-zinc-500',
}

export default function FacturationPage() {
  const [documents, setDocuments] = useState<BillingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [typeFilter, statusFilter])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/billing/documents?${params}`)
      const data = await res.json()
      setDocuments(data.documents || [])
    } catch {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = documents.filter((doc) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      doc.client_name.toLowerCase().includes(q) ||
      doc.document_number.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Facturation</h1>
          <p className="text-sm text-zinc-500 mt-1">Gérez vos devis et factures</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/artisan/facturation/settings"
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            href="/artisan/facturation/clients"
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            Clients
          </Link>
          <a
            href="/api/billing/export/csv"
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </a>
          <Link
            href="/artisan/facturation/nouveau"
            className="flex items-center gap-2 px-4 py-2.5 bg-rapido-blue text-white rounded-xl text-sm font-semibold hover:bg-rapido-blue/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouveau document
          </Link>
        </div>
      </div>

      {/* Dashboard */}
      <BillingDashboard />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par client ou numéro..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue bg-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue bg-white appearance-none"
            >
              <option value="">Tous types</option>
              <option value="devis">Devis</option>
              <option value="facture">Factures</option>
              <option value="acompte">Acomptes</option>
              <option value="situation">Situations</option>
              <option value="avoir">Avoirs</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue bg-white"
          >
            <option value="">Tous statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyé</option>
            <option value="accepted">Accepté</option>
            <option value="paid">Payé</option>
            <option value="signed">Signé</option>
            <option value="overdue">En retard</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Document list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-rapido-blue" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <FileText className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Aucun document trouvé</p>
          <Link
            href="/artisan/facturation/nouveau"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-rapido-blue hover:text-rapido-blue/80"
          >
            <Plus className="h-4 w-4" />
            Créer votre premier document
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <Link
              key={doc.id}
              href={`/artisan/facturation/${doc.id}`}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-rapido-blue/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                  doc.document_type === 'devis' ? 'bg-rapido-blue/10 text-rapido-blue'
                    : doc.document_type === 'avoir' ? 'bg-red-50 text-red-500'
                    : 'bg-rapido-green/10 text-rapido-green'
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-900">{doc.document_number}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[doc.status] || 'bg-zinc-100 text-zinc-600'}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{doc.client_name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {getDocTypeLabel(doc.document_type)} · {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-bold text-zinc-700">{formatCurrency(Number(doc.total_ttc))}</span>
                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-rapido-blue transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
