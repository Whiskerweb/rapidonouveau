'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Truck, Loader2, Edit2, Trash2, Upload,
  Mail, Phone, Globe, ChevronRight, Package
} from 'lucide-react'
import { SupplierForm } from '@/components/billing/supplier-form'
import { SupplierCatalogView } from '@/components/billing/supplier-catalog-view'
import { CSVImportDialog } from '@/components/billing/csv-import-dialog'

interface Supplier {
  id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  notes: string | null
  catalog_count: number
  updated_at: string
}

export default function FournisseursPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showImportFor, setShowImportFor] = useState<string | null>(null)

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/billing/suppliers')
      const data = await res.json()
      setSuppliers(data.suppliers || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSuppliers() }, [])

  const handleSave = async (data: { id?: string; name: string; contact_name: string; email: string; phone: string; website: string; notes: string }) => {
    const isEdit = !!data.id
    const url = isEdit ? `/api/billing/suppliers/${data.id}` : '/api/billing/suppliers'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setShowForm(false)
      setEditSupplier(null)
      fetchSuppliers()
    } else {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce fournisseur et tout son catalogue ?')) return
    await fetch(`/api/billing/suppliers/${id}`, { method: 'DELETE' })
    if (selectedId === id) setSelectedId(null)
    fetchSuppliers()
  }

  const selected = suppliers.find(s => s.id === selectedId)

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/artisan/facturation/bibliotheque"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Fournisseurs</h1>
            <p className="text-sm text-zinc-500">{suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => { setEditSupplier(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-rapido-blue" />
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Truck className="h-12 w-12 text-zinc-300 mx-auto" />
          <p className="text-sm font-medium text-zinc-500">Aucun fournisseur</p>
          <p className="text-xs text-zinc-400">Ajoutez vos fournisseurs pour gérer leurs catalogues et prix</p>
          <button
            onClick={() => { setEditSupplier(null); setShowForm(true) }}
            className="mx-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Ajouter un fournisseur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Supplier list */}
          <div className="lg:col-span-1 space-y-2">
            {suppliers.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedId === s.id
                    ? 'border-rapido-blue bg-rapido-blue/5'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 flex-shrink-0">
                      <Truck className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-800 truncate">{s.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span className="flex items-center gap-0.5">
                          <Package className="h-3 w-3" /> {s.catalog_count} article{s.catalog_count > 1 ? 's' : ''}
                        </span>
                        {s.contact_name && <span>· {s.contact_name}</span>}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${selectedId === s.id ? 'text-rapido-blue rotate-90' : 'text-zinc-300'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
                {/* Supplier info */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">{selected.name}</h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowImportFor(selected.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <Upload className="h-3 w-3" /> Importer CSV
                    </button>
                    <button
                      onClick={() => { setEditSupplier(selected); setShowForm(true) }}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-zinc-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                  {selected.contact_name && <span>{selected.contact_name}</span>}
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-rapido-blue">
                      <Mail className="h-3 w-3" /> {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1 hover:text-rapido-blue">
                      <Phone className="h-3 w-3" /> {selected.phone}
                    </a>
                  )}
                  {selected.website && (
                    <a href={selected.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-rapido-blue">
                      <Globe className="h-3 w-3" /> Site web
                    </a>
                  )}
                </div>
                {selected.notes && (
                  <p className="text-xs text-zinc-400 italic">{selected.notes}</p>
                )}

                <hr className="border-zinc-100" />

                {/* Catalog */}
                <SupplierCatalogView supplierId={selected.id} supplierName={selected.name} />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
                <Truck className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Sélectionnez un fournisseur pour voir son catalogue</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialogs */}
      {showForm && (
        <SupplierForm
          supplier={editSupplier ? {
            id: editSupplier.id,
            name: editSupplier.name,
            contact_name: editSupplier.contact_name || '',
            email: editSupplier.email || '',
            phone: editSupplier.phone || '',
            website: editSupplier.website || '',
            notes: editSupplier.notes || '',
          } : null}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditSupplier(null) }}
        />
      )}

      {showImportFor && (
        <CSVImportDialog
          endpoint={`/api/billing/suppliers/${showImportFor}/import`}
          title="Importer catalogue fournisseur"
          onComplete={() => { setSelectedId(showImportFor); fetchSuppliers() }}
          onClose={() => setShowImportFor(null)}
        />
      )}
    </div>
  )
}
