'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react'

interface ArtisanProfile {
  company_name: string
  siret: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  insurance_decennale_name: string
  insurance_decennale_number: string
  bank_iban: string
  bank_bic: string
  bank_name: string
  default_payment_terms: string
  default_penalty_rate: number
  footer_text: string
}

export default function BillingSettingsPage() {
  const [profile, setProfile] = useState<ArtisanProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [companyName, setCompanyName] = useState('')
  const [siret, setSiret] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [insuranceName, setInsuranceName] = useState('')
  const [insuranceNumber, setInsuranceNumber] = useState('')
  const [bankIban, setBankIban] = useState('')
  const [bankBic, setBankBic] = useState('')
  const [bankName, setBankName] = useState('')
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('30 jours')
  const [defaultPenaltyRate, setDefaultPenaltyRate] = useState(10)
  const [footerText, setFooterText] = useState('')

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/artisan/profile')
      if (res.ok) {
        const data = await res.json()
        const p = data.profile
        if (p) {
          setCompanyName(p.company_name || '')
          setSiret(p.siret || '')
          setAddress(p.address || '')
          setCity(p.city || '')
          setPostalCode(p.postal_code || '')
          setPhone(p.phone || '')
          setEmail(p.email || '')
          setInsuranceName(p.insurance_decennale_name || '')
          setInsuranceNumber(p.insurance_decennale_number || '')
          setBankIban(p.bank_iban || '')
          setBankBic(p.bank_bic || '')
          setBankName(p.bank_name || '')
          setDefaultPaymentTerms(p.default_payment_terms || '30 jours')
          setDefaultPenaltyRate(p.default_penalty_rate || 10)
          setFooterText(p.footer_text || '')
          setProfile(p)
        }
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/artisan/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          siret,
          address,
          city,
          postal_code: postalCode,
          phone,
          email,
          insurance_decennale_name: insuranceName,
          insurance_decennale_number: insuranceNumber,
          bank_iban: bankIban,
          bank_bic: bankBic,
          bank_name: bankName,
          default_payment_terms: defaultPaymentTerms,
          default_penalty_rate: defaultPenaltyRate,
          footer_text: footerText,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-rapido-blue" />
      </div>
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-700">{title}</h2>
      {children}
    </div>
  )

  const Field = ({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string
  }) => (
    <div>
      <label className="text-xs font-medium text-zinc-500 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
      />
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/artisan/facturation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Paramètres facturation</h1>
            <p className="text-sm text-zinc-500">Personnalisez vos documents</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <Section title="Informations entreprise">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom de l'entreprise" value={companyName} onChange={setCompanyName} />
          <Field label="SIRET" value={siret} onChange={setSiret} placeholder="123 456 789 00012" />
          <div className="sm:col-span-2">
            <Field label="Adresse" value={address} onChange={setAddress} />
          </div>
          <Field label="Code postal" value={postalCode} onChange={setPostalCode} />
          <Field label="Ville" value={city} onChange={setCity} />
          <Field label="Téléphone" value={phone} onChange={setPhone} type="tel" />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
        </div>
      </Section>

      <Section title="Assurance décennale">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Compagnie d'assurance" value={insuranceName} onChange={setInsuranceName} placeholder="AXA, MAAF..." />
          <Field label="N° de police" value={insuranceNumber} onChange={setInsuranceNumber} />
        </div>
      </Section>

      <Section title="Coordonnées bancaires">
        <p className="text-xs text-zinc-400">Affichées sur vos factures (pas sur les devis)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="IBAN" value={bankIban} onChange={setBankIban} placeholder="FR76 1234 5678 9012 3456 7890 123" />
          </div>
          <Field label="BIC" value={bankBic} onChange={setBankBic} placeholder="BNPAFRPP" />
          <Field label="Banque" value={bankName} onChange={setBankName} placeholder="BNP Paribas" />
        </div>
      </Section>

      <Section title="Conditions par défaut">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Délai de paiement</label>
            <select
              value={defaultPaymentTerms}
              onChange={(e) => setDefaultPaymentTerms(e.target.value)}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            >
              <option value="à réception">À réception</option>
              <option value="30 jours">30 jours</option>
              <option value="45 jours">45 jours</option>
              <option value="60 jours">60 jours</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Taux de pénalité annuel (%)</label>
            <input
              type="number"
              value={defaultPenaltyRate}
              onChange={(e) => setDefaultPenaltyRate(Number(e.target.value))}
              min={0}
              max={100}
              step={0.5}
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
          </div>
        </div>
      </Section>

      <Section title="Pied de page">
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">Texte personnalisé (bas du document)</label>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            rows={2}
            placeholder="Merci pour votre confiance !"
            className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue resize-none"
          />
        </div>
      </Section>
    </div>
  )
}
