'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { SignaturePad } from '@/components/billing/signature-pad'
import { formatCurrency } from '@/lib/billing-utils'

interface SignDocument {
  id: string
  document_type: string
  document_number: string
  client_name: string
  project_description: string | null
  total_ht: number
  total_tva: number
  total_ttc: number
  status: string
  lines: {
    sort_order: number
    designation: string
    description: string | null
    unit: string
    quantity: number
    unit_price_ht: number
    tva_rate: number
    section_title: string | null
    is_section_header: boolean
  }[]
}

export default function SignerPage() {
  const params = useParams()
  const token = params.token as string

  const [doc, setDoc] = useState<SignDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [tvaAttested, setTvaAttested] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    fetchDocument()
  }, [token])

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/billing/sign/${token}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Document non trouvé')
        return
      }
      setDoc(data.document)
    } catch {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const hasReducedTva = doc?.lines.some((l) => !l.is_section_header && (l.tva_rate === 5.5 || l.tva_rate === 10))

  const handleSign = async (signatureData: string) => {
    if (!accepted) {
      alert('Veuillez accepter les conditions avant de signer')
      return
    }
    if (hasReducedTva && !tvaAttested) {
      alert('Veuillez attester que votre logement a plus de 2 ans pour bénéficier de la TVA réduite')
      return
    }
    setSigning(true)
    try {
      const res = await fetch(`/api/billing/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureData }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Erreur')
        return
      }
      setSigned(true)
    } catch {
      alert('Erreur lors de la signature')
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-zinc-800 mb-2">Document indisponible</h1>
          <p className="text-zinc-500">{error}</p>
        </div>
      </div>
    )
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">Devis signé avec succès !</h1>
          <p className="text-zinc-500">
            Votre signature a été enregistrée. L&apos;artisan sera notifié de votre acceptation.
          </p>
        </div>
      </div>
    )
  }

  if (!doc) return null

  // Group lines by section
  let currentSection = ''

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Signature de document</h1>
            <p className="text-xs text-zinc-500">Rapido&apos;Devis</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Document summary */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">Devis</p>
              <h2 className="text-xl font-bold text-zinc-900">{doc.document_number}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Montant TTC</p>
              <p className="text-xl font-bold text-zinc-900">{formatCurrency(Number(doc.total_ttc))}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
            <div>
              <p className="text-xs text-zinc-400">Client</p>
              <p className="text-sm font-medium text-zinc-700">{doc.client_name}</p>
            </div>
            {doc.project_description && (
              <div>
                <p className="text-xs text-zinc-400">Projet</p>
                <p className="text-sm text-zinc-700">{doc.project_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lines detail */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-700">Détail des prestations</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {doc.lines.map((line, idx) => {
              const showSection = line.section_title && line.section_title !== currentSection
              if (line.section_title) currentSection = line.section_title

              return (
                <div key={idx}>
                  {showSection && (
                    <div className="px-6 py-2 bg-zinc-50">
                      <span className="text-xs font-bold text-zinc-600 uppercase">{line.section_title}</span>
                    </div>
                  )}
                  {!line.is_section_header && (
                    <div className="px-6 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-700">{line.designation}</p>
                        {line.description && <p className="text-xs text-zinc-400 mt-0.5">{line.description}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-zinc-700">
                          {formatCurrency(line.quantity * line.unit_price_ht)}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {line.quantity} {line.unit} × {formatCurrency(line.unit_price_ht)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Total HT</span>
              <span className="font-medium text-zinc-700">{formatCurrency(Number(doc.total_ht))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">TVA</span>
              <span className="font-medium text-zinc-700">{formatCurrency(Number(doc.total_tva))}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-zinc-200">
              <span className="text-zinc-800">Total TTC</span>
              <span className="text-zinc-900">{formatCurrency(Number(doc.total_ttc))}</span>
            </div>
          </div>
        </div>

        {/* Signature section */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700">Votre signature</h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-zinc-600">
              Je déclare avoir reçu le devis avant l&apos;exécution des travaux, l&apos;avoir lu et
              en accepter les termes et conditions. Bon pour accord et exécution des travaux.
            </span>
          </label>

          {hasReducedTva && (
            <label className="flex items-start gap-3 cursor-pointer bg-blue-50 border border-blue-200 rounded-lg p-3">
              <input
                type="checkbox"
                checked={tvaAttested}
                onChange={(e) => setTvaAttested(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-800">
                J&apos;atteste que mon logement est achevé depuis plus de deux ans à la date de
                commencement des travaux et qu&apos;il est affecté à l&apos;habitation, conformément
                à l&apos;article 279-0 bis du CGI, pour bénéficier du taux réduit de TVA.
              </span>
            </label>
          )}

          {signing ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement de votre signature...
            </div>
          ) : (
            <SignaturePad onSignature={handleSign} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 bg-white px-4 py-4 text-center">
        <p className="text-xs text-zinc-400">
          Document sécurisé par Rapido&apos;Devis — Signature électronique conforme
        </p>
      </div>
    </div>
  )
}
