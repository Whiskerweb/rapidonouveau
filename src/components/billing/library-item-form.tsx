'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
}

interface Supplier {
  id: string
  name: string
}

interface LibraryItemData {
  id?: string
  designation: string
  description: string
  unit: string
  unit_price_ht: number
  tva_rate: number
  category_id: string | null
  cost_price: number | null
  supplier_id: string | null
  supplier_reference: string
  is_favorite: boolean
}

interface LibraryItemFormProps {
  item?: LibraryItemData | null
  onSave: (item: LibraryItemData) => void
  onClose: () => void
}

const UNITS = ['u', 'm', 'm²', 'm³', 'ml', 'kg', 'h', 'j', 'forfait', 'lot', 'ens']
const TVA_RATES = [0, 5.5, 10, 20]

export function LibraryItemForm({ item, onSave, onClose }: LibraryItemFormProps) {
  const [designation, setDesignation] = useState(item?.designation || '')
  const [description, setDescription] = useState(item?.description || '')
  const [unit, setUnit] = useState(item?.unit || 'u')
  const [unitPriceHt, setUnitPriceHt] = useState(item?.unit_price_ht ?? 0)
  const [tvaRate, setTvaRate] = useState(item?.tva_rate ?? 20)
  const [categoryId, setCategoryId] = useState(item?.category_id || '')
  const [costPrice, setCostPrice] = useState(item?.cost_price ?? '')
  const [supplierId, setSupplierId] = useState(item?.supplier_id || '')
  const [supplierRef, setSupplierRef] = useState(item?.supplier_reference || '')
  const [isFavorite, setIsFavorite] = useState(item?.is_favorite || false)

  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/billing/library/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {})
    fetch('/api/billing/suppliers').then(r => r.json()).then(d => setSuppliers(d.suppliers || [])).catch(() => {})
  }, [])

  const margin = costPrice && unitPriceHt
    ? Math.round(((unitPriceHt - Number(costPrice)) / unitPriceHt) * 100 * 10) / 10
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!designation.trim() || unitPriceHt < 0) return

    setSaving(true)
    onSave({
      id: item?.id,
      designation: designation.trim(),
      description: description.trim(),
      unit,
      unit_price_ht: Number(unitPriceHt),
      tva_rate: Number(tvaRate),
      category_id: categoryId || null,
      cost_price: costPrice !== '' ? Number(costPrice) : null,
      supplier_id: supplierId || null,
      supplier_reference: supplierRef,
      is_favorite: isFavorite,
    })
    setSaving(false)
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-medium text-zinc-500 block mb-1">{label}</label>
      {children}
    </div>
  )

  const inputClass = "w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">
            {item?.id ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Field label="Désignation *">
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className={inputClass}
              placeholder="Ex: Carrelage grès 30x30"
              required
              autoFocus
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              rows={2}
              placeholder="Détails supplémentaires..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Unité">
              <select value={unit} onChange={e => setUnit(e.target.value)} className={inputClass}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="TVA (%)">
              <select value={tvaRate} onChange={e => setTvaRate(Number(e.target.value))} className={inputClass}>
                {TVA_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix de vente HT *">
              <input
                type="number"
                value={unitPriceHt}
                onChange={e => setUnitPriceHt(Number(e.target.value))}
                className={inputClass}
                min={0}
                step={0.01}
                required
              />
            </Field>
            <Field label="Prix d'achat HT">
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className={inputClass}
                min={0}
                step={0.01}
                placeholder="Optionnel"
              />
            </Field>
          </div>

          {margin !== null && (
            <div className={`text-xs font-medium px-3 py-1.5 rounded-lg ${margin >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              Marge : {margin}%
            </div>
          )}

          <Field label="Catégorie">
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
              <option value="">Sans catégorie</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fournisseur">
              <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className={inputClass}>
                <option value="">Aucun</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Réf. fournisseur">
              <input
                type="text"
                value={supplierRef}
                onChange={e => setSupplierRef(e.target.value)}
                className={inputClass}
                placeholder="SKU / Ref"
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={e => setIsFavorite(e.target.checked)}
              className="rounded border-zinc-300 text-rapido-blue focus:ring-rapido-blue/20"
            />
            <span className="text-sm text-zinc-600">Marquer comme favori</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !designation.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {item?.id ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
