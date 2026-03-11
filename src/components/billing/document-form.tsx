'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send, ArrowLeft, Loader2 } from 'lucide-react'
import { LineItemEditor, type LineItem } from './line-item-editor'
import { ClientPicker } from './client-picker'
import { calculateDocumentTotals, calculateRetenueGarantie, formatCurrency, getDefaultLegalMentions } from '@/lib/billing-utils'

interface DocumentFormProps {
  mode: 'create' | 'edit'
  documentType?: 'devis' | 'facture'
  initialData?: {
    id?: string
    document_type: string
    document_number?: string
    client_name: string
    client_email: string
    client_phone: string
    client_address: string
    client_siret: string
    project_address: string
    project_description: string
    notes: string
    payment_terms: string
    payment_method: string
    validity_date: string
    due_date: string
    deposit_percentage: number
    legal_mentions: string
    status?: string
    billing_document_lines?: LineItem[]
  }
}

export function DocumentForm({ mode, documentType = 'devis', initialData }: DocumentFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [docType, setDocType] = useState(initialData?.document_type || documentType)
  const [clientName, setClientName] = useState(initialData?.client_name || '')
  const [clientEmail, setClientEmail] = useState(initialData?.client_email || '')
  const [clientPhone, setClientPhone] = useState(initialData?.client_phone || '')
  const [clientAddress, setClientAddress] = useState(initialData?.client_address || '')
  const [clientSiret, setClientSiret] = useState(initialData?.client_siret || '')
  const [projectAddress, setProjectAddress] = useState(initialData?.project_address || '')
  const [projectDescription, setProjectDescription] = useState(initialData?.project_description || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [paymentTerms, setPaymentTerms] = useState(initialData?.payment_terms || '30 jours')
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || '')
  const [validityDate, setValidityDate] = useState(initialData?.validity_date || '')
  const [dueDate, setDueDate] = useState(initialData?.due_date || '')
  const [depositPercentage, setDepositPercentage] = useState(initialData?.deposit_percentage || 0)
  const [legalMentions, setLegalMentions] = useState(initialData?.legal_mentions || getDefaultLegalMentions())
  const [retenueGarantieActive, setRetenueGarantieActive] = useState(false)
  const [retenueGarantiePct, setRetenueGarantiePct] = useState(5)
  const [autoliquidation, setAutoliquidation] = useState(false)

  const [lines, setLines] = useState<LineItem[]>(
    initialData?.billing_document_lines || []
  )

  const totals = useMemo(() => {
    const base = calculateDocumentTotals(lines.filter(l => !l.is_section_header))
    if (autoliquidation) {
      return { ...base, total_tva: 0, total_ttc: base.total_ht, tva_summary: [] }
    }
    return base
  }, [lines, autoliquidation])
  const retenue = useMemo(() => retenueGarantieActive ? calculateRetenueGarantie(totals.total_ttc, retenueGarantiePct) : null, [retenueGarantieActive, retenueGarantiePct, totals.total_ttc])

  const handleSave = async (asDraft = true) => {
    if (!clientName.trim()) {
      setError('Le nom du client est requis')
      return
    }

    setSaving(true)
    setError('')

    try {
      if (mode === 'create') {
        // Create document
        const res = await fetch('/api/billing/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: docType,
            clientName,
            clientEmail,
            clientPhone,
            clientAddress,
            clientSiret,
            projectAddress,
            projectDescription,
            notes,
            paymentTerms,
            paymentMethod,
            validityDate: validityDate || undefined,
            dueDate: dueDate || undefined,
            depositPercentage,
            legalMentions,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erreur lors de la création')
        }

        const { document } = await res.json()

        // Add lines
        for (const line of lines) {
          if (!line.designation && !line.is_section_header) continue
          await fetch(`/api/billing/documents/${document.id}/lines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              designation: line.designation,
              description: line.description,
              unit: line.unit,
              quantity: line.quantity,
              unitPriceHt: line.unit_price_ht,
              tvaRate: line.tva_rate,
              libraryItemId: line.library_item_id,
              sectionTitle: line.section_title,
              isSectionHeader: line.is_section_header,
            }),
          })
        }

        if (!asDraft) {
          await fetch(`/api/billing/documents/${document.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'sent' }),
          })
        }

        router.push(`/artisan/facturation/${document.id}`)
      } else {
        // Update document
        const res = await fetch(`/api/billing/documents/${initialData!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            client_address: clientAddress,
            client_siret: clientSiret,
            project_address: projectAddress,
            project_description: projectDescription,
            notes,
            payment_terms: paymentTerms,
            payment_method: paymentMethod,
            validity_date: validityDate || null,
            due_date: dueDate || null,
            deposit_percentage: depositPercentage,
            legal_mentions: legalMentions,
            ...(!asDraft ? { status: 'sent' } : {}),
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erreur lors de la mise à jour')
        }

        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  const isEditable = mode === 'create' || initialData?.status === 'draft'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {mode === 'create' ? 'Nouveau document' : `${initialData?.document_number || 'Document'}`}
            </h1>
            {initialData?.status && (
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${
                initialData.status === 'draft' ? 'bg-zinc-100 text-zinc-600' :
                initialData.status === 'sent' ? 'bg-blue-50 text-blue-600' :
                initialData.status === 'paid' ? 'bg-green-50 text-green-600' :
                initialData.status === 'overdue' ? 'bg-red-50 text-red-600' :
                'bg-zinc-100 text-zinc-600'
              }`}>
                {initialData.status}
              </span>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Brouillon
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Envoyer
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Document type */}
      {mode === 'create' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <label className="text-sm font-medium text-zinc-700 block mb-2">Type de document</label>
          <div className="flex gap-3">
            {(['devis', 'facture'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDocType(type)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                  docType === type
                    ? 'border-rapido-blue bg-rapido-blue/5 text-rapido-blue'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                {type === 'devis' ? 'Devis' : 'Facture'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Client info */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700">Informations client</h2>
          {isEditable && (
            <ClientPicker onSelect={(c) => {
              setClientName(c.name)
              setClientEmail(c.email || '')
              setClientPhone(c.phone || '')
              setClientAddress(c.address || '')
              setClientSiret(c.siret || '')
            }} />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Nom / Raison sociale *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              readOnly={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              readOnly={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Téléphone</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              readOnly={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">SIRET</label>
            <input
              type="text"
              value={clientSiret}
              onChange={(e) => setClientSiret(e.target.value)}
              readOnly={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Adresse</label>
            <textarea
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              readOnly={!isEditable}
              rows={2}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none"
            />
          </div>
        </div>
      </div>

      {/* Project info */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-700">Projet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Adresse du chantier</label>
            <input
              type="text"
              value={projectAddress}
              onChange={(e) => setProjectAddress(e.target.value)}
              readOnly={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              readOnly={!isEditable}
              rows={2}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none"
            />
          </div>
        </div>
      </div>

      {/* Lines */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <LineItemEditor
          lines={lines}
          onChange={setLines}
          readOnly={!isEditable}
        />
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <div className="max-w-xs ml-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Total HT</span>
            <span className="font-medium">{formatCurrency(totals.total_ht)}</span>
          </div>
          {!autoliquidation && totals.tva_summary.map((tva) => (
            <div key={tva.rate} className="flex justify-between text-sm">
              <span className="text-zinc-500">TVA {tva.rate}%</span>
              <span className="font-medium">{formatCurrency(tva.tva_amount)}</span>
            </div>
          ))}
          {autoliquidation && (
            <div className="flex justify-between text-sm text-amber-600">
              <span>TVA autoliquidée (0%)</span>
              <span className="font-medium">0,00 &euro;</span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-2 flex justify-between text-base">
            <span className="font-semibold text-zinc-700">{autoliquidation ? 'Total HT à payer' : 'Total TTC'}</span>
            <span className="font-bold text-rapido-blue">{formatCurrency(totals.total_ttc)}</span>
          </div>
          {depositPercentage > 0 && (
            <div className="flex justify-between text-sm text-rapido-green">
              <span>Acompte ({depositPercentage}%)</span>
              <span className="font-medium">{formatCurrency(totals.total_ttc * depositPercentage / 100)}</span>
            </div>
          )}
          {retenue && (
            <>
              <div className="flex justify-between text-sm text-amber-600">
                <span>Retenue de garantie ({retenueGarantiePct}%)</span>
                <span className="font-medium">-{formatCurrency(retenue.retenue)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-700">
                <span>Net à payer</span>
                <span>{formatCurrency(retenue.netAPayer)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-700">Conditions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Conditions de paiement</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              disabled={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            >
              <option value="à réception">À réception</option>
              <option value="30 jours">30 jours</option>
              <option value="45 jours">45 jours</option>
              <option value="60 jours">60 jours</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Mode de paiement</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!isEditable}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            >
              <option value="">Non spécifié</option>
              <option value="virement">Virement</option>
              <option value="cheque">Chèque</option>
              <option value="especes">Espèces</option>
              <option value="carte">Carte bancaire</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Acompte (%)</label>
            <input
              type="number"
              value={depositPercentage}
              onChange={(e) => setDepositPercentage(Number(e.target.value))}
              readOnly={!isEditable}
              min={0}
              max={100}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
          <div className="sm:col-span-3 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={retenueGarantieActive}
                onChange={(e) => setRetenueGarantieActive(e.target.checked)}
                disabled={!isEditable}
                className="h-4 w-4 rounded border-zinc-300 text-rapido-blue focus:ring-rapido-blue"
              />
              <span className="text-sm text-zinc-700">Retenue de garantie</span>
            </label>
            {retenueGarantieActive && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={retenueGarantiePct}
                  onChange={(e) => setRetenueGarantiePct(Number(e.target.value))}
                  readOnly={!isEditable}
                  min={0}
                  max={100}
                  step="0.5"
                  className="w-16 text-sm border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                />
                <span className="text-sm text-zinc-500">%</span>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoliquidation}
                onChange={(e) => setAutoliquidation(e.target.checked)}
                disabled={!isEditable}
                className="h-4 w-4 rounded border-zinc-300 text-rapido-blue focus:ring-rapido-blue"
              />
              <span className="text-sm text-zinc-700">Autoliquidation TVA (sous-traitance)</span>
            </label>
          </div>
          {autoliquidation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-medium">
                Autoliquidation de la TVA — Article 283-2 nonies du CGI. La TVA est due par le preneur (donneur d&apos;ordre). Ce document sera émis en HT uniquement.
              </p>
            </div>
          )}
          {docType === 'devis' && (
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Date de validité</label>
              <input
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
                readOnly={!isEditable}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              />
            </div>
          )}
          {docType === 'facture' && (
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Date d&apos;échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                readOnly={!isEditable}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes & Legal */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            readOnly={!isEditable}
            rows={2}
            placeholder="Notes visibles sur le document..."
            className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">Mentions légales</label>
          <textarea
            value={legalMentions}
            onChange={(e) => setLegalMentions(e.target.value)}
            readOnly={!isEditable}
            rows={4}
            className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none text-zinc-500"
          />
        </div>
      </div>

      {/* Bottom save buttons (mobile) */}
      {isEditable && (
        <div className="flex gap-2 sm:hidden pb-6">
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border border-zinc-200 rounded-xl"
          >
            <Save className="h-4 w-4" />
            Brouillon
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-rapido-blue rounded-xl"
          >
            <Send className="h-4 w-4" />
            Envoyer
          </button>
        </div>
      )}
    </div>
  )
}
