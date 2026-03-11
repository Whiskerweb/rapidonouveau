'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

interface SupplierData {
  id?: string
  name: string
  contact_name: string
  email: string
  phone: string
  website: string
  notes: string
}

interface SupplierFormProps {
  supplier?: SupplierData | null
  onSave: (data: SupplierData) => void
  onClose: () => void
}

export function SupplierForm({ supplier, onSave, onClose }: SupplierFormProps) {
  const [name, setName] = useState(supplier?.name || '')
  const [contactName, setContactName] = useState(supplier?.contact_name || '')
  const [email, setEmail] = useState(supplier?.email || '')
  const [phone, setPhone] = useState(supplier?.phone || '')
  const [website, setWebsite] = useState(supplier?.website || '')
  const [notes, setNotes] = useState(supplier?.notes || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    onSave({
      id: supplier?.id,
      name: name.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      notes: notes.trim(),
    })
    setSaving(false)
  }

  const inputClass = "w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">
            {supplier?.id ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Nom *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Ex: Point.P, BigMat..." required autoFocus />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Contact</label>
            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className={inputClass} placeholder="Nom du contact" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">Téléphone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Site web</label>
            <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} resize-none`} rows={2} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving || !name.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {supplier?.id ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
