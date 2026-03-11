'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, FileText, ArrowRightLeft, Trash2, Download, FileDown, Receipt, BarChart3, RotateCcw, Send, Link2, CheckCircle, Copy, Bell, BadgeCheck } from 'lucide-react'
import { DocumentForm } from '@/components/billing/document-form'
import { formatCurrency, getStatusLabel, getDocTypeLabel, calculateLatePenalties } from '@/lib/billing-utils'

interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: string | null
  reference: string | null
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [document, setDocument] = useState<Record<string, unknown> | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [addingPayment, setAddingPayment] = useState(false)
  const [showAcompteForm, setShowAcompteForm] = useState(false)
  const [acomptePercentage, setAcomptePercentage] = useState('30')
  const [creatingAcompte, setCreatingAcompte] = useState(false)
  const [showSituationForm, setShowSituationForm] = useState(false)
  const [lineAdvancements, setLineAdvancements] = useState<Record<string, number>>({})
  const [creatingSituation, setCreatingSituation] = useState(false)
  const [creatingAvoir, setCreatingAvoir] = useState(false)
  const [creatingSolde, setCreatingSolde] = useState(false)
  const [sending, setSending] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [reminding, setReminding] = useState(false)

  useEffect(() => {
    fetchDocument()
    fetchPayments()
  }, [id])

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/billing/documents/${id}`)
      const data = await res.json()
      setDocument(data.document)
    } catch {
      setDocument(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/billing/payments?documentId=${id}`)
      const data = await res.json()
      setPayments(data.payments || [])
    } catch {
      setPayments([])
    }
  }

  const handleConvert = async () => {
    if (!confirm('Convertir ce devis en facture ?')) return
    setConverting(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/convert`, { method: 'POST' })
      const data = await res.json()
      if (data.facture) {
        router.push(`/artisan/facturation/${data.facture.id}`)
      }
    } catch {
      alert('Erreur lors de la conversion')
    } finally {
      setConverting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce brouillon ?')) return
    setDeleting(true)
    try {
      await fetch(`/api/billing/documents/${id}`, { method: 'DELETE' })
      router.push('/artisan/facturation')
    } catch {
      alert('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const handleAddPayment = async () => {
    if (!paymentAmount) return
    setAddingPayment(true)
    try {
      await fetch('/api/billing/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: id,
          amount: Number(paymentAmount),
          paymentMethod: paymentMethod || null,
          reference: paymentRef || null,
        }),
      })
      setShowPaymentForm(false)
      setPaymentAmount('')
      setPaymentMethod('')
      setPaymentRef('')
      fetchPayments()
      fetchDocument()
    } catch {
      alert('Erreur lors de l\'ajout du paiement')
    } finally {
      setAddingPayment(false)
    }
  }

  const handleCreateAcompte = async () => {
    setCreatingAcompte(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/acompte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage: Number(acomptePercentage) }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      router.push(`/artisan/facturation/${data.acompte.id}`)
    } catch {
      alert('Erreur lors de la création de l\'acompte')
    } finally {
      setCreatingAcompte(false)
    }
  }

  const handleCreateSituation = async () => {
    if (Object.keys(lineAdvancements).length === 0) { alert('Renseignez au moins un avancement'); return }
    setCreatingSituation(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/situation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineAdvancements }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      router.push(`/artisan/facturation/${data.situation.id}`)
    } catch {
      alert('Erreur lors de la création de la situation')
    } finally {
      setCreatingSituation(false)
    }
  }

  const handleCreateSolde = async () => {
    if (!confirm('Créer la facture de solde pour clôturer ce devis ?')) return
    setCreatingSolde(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/solde`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      router.push(`/artisan/facturation/${data.solde.id}`)
    } catch {
      alert('Erreur lors de la création de la facture de solde')
    } finally {
      setCreatingSolde(false)
    }
  }

  const handleCreateAvoir = async () => {
    if (!confirm('Créer un avoir pour annuler ce document ?')) return
    setCreatingAvoir(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/avoir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Annulation' }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      router.push(`/artisan/facturation/${data.avoir.id}`)
    } catch {
      alert('Erreur lors de la création de l\'avoir')
    } finally {
      setCreatingAvoir(false)
    }
  }

  const handleSendEmail = async () => {
    if (!document?.client_email) { alert('Email client requis'); return }
    if (!confirm(`Envoyer le document par email à ${document.client_email} ?`)) return
    setSending(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/send`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      alert('Document envoyé avec succès !')
      fetchDocument()
    } catch {
      alert('Erreur lors de l\'envoi')
    } finally {
      setSending(false)
    }
  }

  const handleCopySignLink = () => {
    const signToken = document?.sign_token as string
    if (!signToken) return
    const url = `${window.location.origin}/signer/${signToken}`
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleRemind = async () => {
    if (!confirm('Envoyer une relance au client ?')) return
    setReminding(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/remind`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      alert(`Relance niveau ${data.level} envoyée !`)
      fetchDocument()
    } catch {
      alert('Erreur lors de l\'envoi de la relance')
    } finally {
      setReminding(false)
    }
  }

  const handleDuplicate = async () => {
    setDuplicating(true)
    try {
      const res = await fetch(`/api/billing/documents/${id}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); return }
      router.push(`/artisan/facturation/${data.duplicate.id}`)
    } catch {
      alert('Erreur lors de la duplication')
    } finally {
      setDuplicating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-rapido-blue" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="text-center py-20">
        <FileText className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-500">Document non trouvé</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-rapido-blue hover:underline">
          Retour
        </button>
      </div>
    )
  }

  const status = document.status as string
  const docType = document.document_type as string
  const isEditable = status === 'draft'
  const isFacture = docType === 'facture'
  const isDevis = docType === 'devis'
  const canConvert = isDevis && ['sent', 'draft'].includes(status)
  const canDelete = status === 'draft'
  const canAddPayment = ['facture', 'acompte', 'situation'].includes(docType) && !['paid', 'cancelled', 'draft'].includes(status)
  const canCreateAcompte = isDevis && ['signed', 'accepted', 'sent'].includes(status)
  const canCreateSituation = isDevis && ['signed', 'accepted', 'sent'].includes(status)
  const canCreateSolde = isDevis && ['signed', 'accepted', 'sent'].includes(status)
  const canCreateAvoir = ['facture', 'acompte', 'situation'].includes(docType) && ['paid', 'partially_paid', 'sent'].includes(status)
  const canRemind = ['facture', 'acompte', 'situation'].includes(docType) && ['sent', 'overdue', 'partially_paid'].includes(status)

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0)
  const remaining = Number(document.total_ttc) - totalPaid

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => router.push('/artisan/facturation')}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <div className="flex-1" />

        <a
          href={`/api/billing/documents/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </a>

        <button
          onClick={handleSendEmail}
          disabled={sending || !(document?.client_email as string)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-rapido-blue text-white rounded-xl hover:bg-rapido-blue/90 transition-colors disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Envoyer
        </button>

        {isDevis && !!(document?.sign_token) && (
          <button
            onClick={handleCopySignLink}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Link2 className="h-4 w-4" />
            {linkCopied ? 'Copié !' : 'Lien signature'}
          </button>
        )}

        {canCreateAcompte && (
          <button
            onClick={() => setShowAcompteForm(!showAcompteForm)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Receipt className="h-4 w-4" />
            Acompte
          </button>
        )}

        {canCreateSituation && (
          <button
            onClick={() => setShowSituationForm(!showSituationForm)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Situation
          </button>
        )}

        {canCreateSolde && (
          <button
            onClick={handleCreateSolde}
            disabled={creatingSolde}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-rapido-green text-white rounded-xl hover:bg-rapido-green/90 transition-colors disabled:opacity-50"
          >
            {creatingSolde ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
            Solde
          </button>
        )}

        {canCreateAvoir && (
          <button
            onClick={handleCreateAvoir}
            disabled={creatingAvoir}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {creatingAvoir ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Avoir
          </button>
        )}

        {canConvert && (
          <button
            onClick={handleConvert}
            disabled={converting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-rapido-green text-white rounded-xl hover:bg-rapido-green/90 transition-colors disabled:opacity-50"
          >
            {converting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
            Convertir en facture
          </button>
        )}

        {canAddPayment && (
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-rapido-blue text-white rounded-xl hover:bg-rapido-blue/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Paiement
          </button>
        )}

        {canRemind && (
          <button
            onClick={handleRemind}
            disabled={reminding}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            {reminding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            Relance
          </button>
        )}

        <button
          onClick={handleDuplicate}
          disabled={duplicating}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50"
        >
          {duplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          Dupliquer
        </button>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer
          </button>
        )}
      </div>

      {/* Signature badge */}
      {status === 'signed' && !!(document.signed_at) && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              Document signé le {new Date(document.signed_at as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {!!(document.signer_ip) && (
              <p className="text-xs text-green-600">IP : {document.signer_ip as string}</p>
            )}
          </div>
        </div>
      )}

      {/* Acompte form */}
      {showAcompteForm && (
        <div className="bg-white rounded-xl border border-rapido-blue/20 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Créer une facture d&apos;acompte</h3>
          <p className="text-xs text-zinc-400">
            Total TTC du devis : <span className="font-semibold text-zinc-700">{formatCurrency(Number(document.total_ttc))}</span>
          </p>
          <div className="flex items-end gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Pourcentage</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={acomptePercentage}
                  onChange={(e) => setAcomptePercentage(e.target.value)}
                  min={1}
                  max={100}
                  className="w-20 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                />
                <span className="text-sm text-zinc-500">%</span>
              </div>
            </div>
            <p className="text-sm text-zinc-600 pb-2">
              = {formatCurrency(Number(document.total_ttc) * Number(acomptePercentage) / 100)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateAcompte}
              disabled={creatingAcompte || !acomptePercentage}
              className="px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
            >
              {creatingAcompte ? 'Création...' : 'Créer l\'acompte'}
            </button>
            <button
              onClick={() => setShowAcompteForm(false)}
              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Situation form */}
      {showSituationForm && (
        <div className="bg-white rounded-xl border border-rapido-blue/20 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Créer une facture de situation</h3>
          <p className="text-xs text-zinc-400">Renseignez le pourcentage d&apos;avancement cumulé pour chaque ligne</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {((document.billing_document_lines as Record<string, unknown>[]) || [])
              .filter((l) => !l.is_section_header)
              .map((line) => (
                <div key={line.id as string} className="flex items-center gap-3 py-2 border-b border-zinc-100">
                  <span className="text-sm text-zinc-700 flex-1 truncate">{line.designation as string}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lineAdvancements[line.id as string] ?? ''}
                      onChange={(e) => setLineAdvancements((prev) => ({
                        ...prev,
                        [line.id as string]: Number(e.target.value),
                      }))}
                      placeholder="0"
                      className="w-16 text-sm text-right border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                    />
                    <span className="text-xs text-zinc-500">%</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateSituation}
              disabled={creatingSituation}
              className="px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
            >
              {creatingSituation ? 'Création...' : 'Créer la situation'}
            </button>
            <button
              onClick={() => setShowSituationForm(false)}
              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Payment form */}
      {showPaymentForm && (
        <div className="bg-white rounded-xl border border-rapido-blue/20 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Enregistrer un paiement</h3>
          <p className="text-xs text-zinc-400">
            Restant dû : <span className="font-semibold text-zinc-700">{formatCurrency(remaining)}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Montant *</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min={0}
                step="0.01"
                max={remaining}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Mode</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              >
                <option value="">--</option>
                <option value="virement">Virement</option>
                <option value="cheque">Chèque</option>
                <option value="especes">Espèces</option>
                <option value="carte">Carte</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Référence</label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="N° chèque, virement..."
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddPayment}
              disabled={addingPayment || !paymentAmount}
              className="px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
            >
              {addingPayment ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              onClick={() => setShowPaymentForm(false)}
              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Payments list */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Paiements reçus</h3>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    {formatCurrency(Number(p.amount))}
                    {p.payment_method && (
                      <span className="text-xs text-zinc-400 ml-2">({p.payment_method})</span>
                    )}
                  </p>
                  {p.reference && <p className="text-xs text-zinc-400">Réf : {p.reference}</p>}
                </div>
                <span className="text-xs text-zinc-400">
                  {new Date(p.payment_date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-200">
            <span className="text-sm font-medium text-zinc-500">Total payé</span>
            <span className="text-sm font-bold text-rapido-green">{formatCurrency(totalPaid)}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-zinc-500">Restant dû</span>
              <span className="text-sm font-bold text-amber-600">{formatCurrency(remaining)}</span>
            </div>
          )}
        </div>
      )}

      {/* Late penalties warning */}
      {status === 'overdue' && !!(document.due_date) && remaining > 0 && (() => {
        const penalties = calculateLatePenalties(remaining, document.due_date as string)
        if (!penalties) return null
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-bold text-red-800">Facture en retard — {penalties.daysLate} jours</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-red-700">Montant dû</span>
                <span className="font-medium text-red-800">{formatCurrency(remaining)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-700">Pénalités de retard ({penalties.annualRate}% annuel x {penalties.daysLate}j)</span>
                <span className="font-medium text-red-800">{formatCurrency(penalties.penalty)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-700">Indemnité forfaitaire de recouvrement</span>
                <span className="font-medium text-red-800">{formatCurrency(penalties.recoveryFee)}</span>
              </div>
              <div className="border-t border-red-200 pt-1 flex justify-between text-sm">
                <span className="font-bold text-red-800">Total exigible</span>
                <span className="font-bold text-red-800">{formatCurrency(penalties.totalDue)}</span>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Document form */}
      <DocumentForm
        mode="edit"
        initialData={{
          id: document.id as string,
          document_type: docType,
          document_number: document.document_number as string,
          client_name: (document.client_name as string) || '',
          client_email: (document.client_email as string) || '',
          client_phone: (document.client_phone as string) || '',
          client_address: (document.client_address as string) || '',
          client_siret: (document.client_siret as string) || '',
          project_address: (document.project_address as string) || '',
          project_description: (document.project_description as string) || '',
          notes: (document.notes as string) || '',
          payment_terms: (document.payment_terms as string) || '',
          payment_method: (document.payment_method as string) || '',
          validity_date: (document.validity_date as string) || '',
          due_date: (document.due_date as string) || '',
          deposit_percentage: (document.deposit_percentage as number) || 0,
          legal_mentions: (document.legal_mentions as string) || '',
          status,
          billing_document_lines: (document.billing_document_lines as Record<string, unknown>[])?.map((l) => ({
            id: l.id as string,
            sort_order: l.sort_order as number,
            designation: (l.designation as string) || '',
            description: (l.description as string) || null,
            unit: (l.unit as string) || 'u',
            quantity: l.quantity as number,
            unit_price_ht: l.unit_price_ht as number,
            tva_rate: l.tva_rate as number,
            library_item_id: (l.library_item_id as string) || null,
            cost_price: (l.cost_price as number) || null,
          })) || [],
        }}
      />
    </div>
  )
}
