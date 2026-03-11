'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Users, Loader2, Trash2, Pencil, X, Check } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  siret: string | null
  client_type: string
  notes: string | null
  created_at: string
}

interface ClientDocument {
  id: string
  document_type: string
  document_number: string
  status: string
  total_ttc: number
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientDocs, setClientDocs] = useState<ClientDocument[]>([])
  const [saving, setSaving] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formSiret, setFormSiret] = useState('')
  const [formType, setFormType] = useState('particulier')
  const [formNotes, setFormNotes] = useState('')

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/clients')
      const data = await res.json()
      setClients(data.clients || [])
    } catch { setClients([]) }
    finally { setLoading(false) }
  }

  const resetForm = () => {
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormAddress('')
    setFormSiret('')
    setFormType('particulier')
    setFormNotes('')
  }

  const startEdit = (client: Client) => {
    setEditingId(client.id)
    setFormName(client.name)
    setFormEmail(client.email || '')
    setFormPhone(client.phone || '')
    setFormAddress(client.address || '')
    setFormSiret(client.siret || '')
    setFormType(client.client_type || 'particulier')
    setFormNotes(client.notes || '')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formName.trim()) return
    setSaving(true)
    try {
      const body = {
        name: formName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        siret: formSiret,
        clientType: formType,
        notes: formNotes,
      }

      if (editingId) {
        await fetch(`/api/billing/clients/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch('/api/billing/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      setShowForm(false)
      setEditingId(null)
      resetForm()
      fetchClients()
    } catch {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce client ?')) return
    await fetch(`/api/billing/clients/${id}`, { method: 'DELETE' })
    if (selectedClient?.id === id) setSelectedClient(null)
    fetchClients()
  }

  const selectClient = async (client: Client) => {
    setSelectedClient(client)
    try {
      const res = await fetch(`/api/billing/clients/${client.id}`)
      const data = await res.json()
      setClientDocs(data.documents || [])
    } catch {
      setClientDocs([])
    }
  }

  const filtered = clients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
  })

  const totalInvoiced = clientDocs
    .filter(d => ['facture', 'acompte', 'situation'].includes(d.document_type) && d.status === 'paid')
    .reduce((s, d) => s + Number(d.total_ttc), 0)
  const totalPending = clientDocs
    .filter(d => ['facture', 'acompte', 'situation'].includes(d.document_type) && ['sent', 'partially_paid', 'overdue'].includes(d.status))
    .reduce((s, d) => s + Number(d.total_ttc), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/artisan/facturation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
            <p className="text-sm text-zinc-500 mt-1">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-rapido-blue text-white rounded-xl text-sm font-semibold hover:bg-rapido-blue/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau client
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-rapido-blue/20 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700">
              {editingId ? 'Modifier le client' : 'Nouveau client'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Nom / Raison sociale *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Email</label>
              <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Téléphone</label>
              <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">SIRET</label>
              <input type="text" value={formSiret} onChange={(e) => setFormSiret(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-zinc-500 block mb-1">Adresse</label>
              <textarea value={formAddress} onChange={(e) => setFormAddress(e.target.value)} rows={2}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Type</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue">
                <option value="particulier">Particulier</option>
                <option value="professionnel">Professionnel</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Notes internes</label>
              <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving || !formName.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {editingId ? 'Modifier' : 'Créer'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue bg-white" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-rapido-blue" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
              <Users className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Aucun client trouvé</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((client) => (
                <div
                  key={client.id}
                  onClick={() => selectClient(client)}
                  className={`flex items-center justify-between p-4 bg-white rounded-xl border cursor-pointer transition-all ${
                    selectedClient?.id === client.id ? 'border-rapido-blue shadow-sm' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{client.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        client.client_type === 'professionnel' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {client.client_type === 'professionnel' ? 'Pro' : 'Part.'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {[client.email, client.phone].filter(Boolean).join(' · ') || 'Pas de contact'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); startEdit(client) }}
                      className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-50">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id) }}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client detail sidebar */}
        <div className="space-y-4">
          {selectedClient ? (
            <>
              <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-700">{selectedClient.name}</h3>
                {selectedClient.email && <p className="text-xs text-zinc-500">{selectedClient.email}</p>}
                {selectedClient.phone && <p className="text-xs text-zinc-500">{selectedClient.phone}</p>}
                {selectedClient.address && <p className="text-xs text-zinc-500">{selectedClient.address}</p>}
                {selectedClient.siret && <p className="text-xs text-zinc-500">SIRET : {selectedClient.siret}</p>}
                {selectedClient.notes && (
                  <p className="text-xs text-zinc-400 italic">{selectedClient.notes}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-zinc-200 p-3">
                  <p className="text-[10px] text-zinc-400 uppercase">Total facturé</p>
                  <p className="text-sm font-bold text-rapido-green">{formatCurrency(totalInvoiced)}</p>
                </div>
                <div className="bg-white rounded-xl border border-zinc-200 p-3">
                  <p className="text-[10px] text-zinc-400 uppercase">En attente</p>
                  <p className="text-sm font-bold text-amber-600">{formatCurrency(totalPending)}</p>
                </div>
              </div>
              {clientDocs.length > 0 && (
                <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase">Documents</h4>
                  {clientDocs.slice(0, 10).map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/artisan/facturation/${doc.id}`}
                      className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 -mx-1 px-1 rounded"
                    >
                      <div>
                        <span className="text-xs font-medium text-zinc-700">{doc.document_number}</span>
                        <span className="text-[10px] text-zinc-400 ml-2">
                          {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-600">{formatCurrency(Number(doc.total_ttc))}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
              <Users className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">Sélectionnez un client pour voir ses détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
