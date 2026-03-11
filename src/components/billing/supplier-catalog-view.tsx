'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Loader2, BookOpen, Check } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface CatalogItem {
  id: string
  reference: string | null
  designation: string
  description: string | null
  unit: string
  price_ht: number
  tva_rate: number
  category: string | null
}

interface SupplierCatalogViewProps {
  supplierId: string
  supplierName: string
}

export function SupplierCatalogView({ supplierId, supplierName }: SupplierCatalogViewProps) {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        const res = await fetch(`/api/billing/suppliers/${supplierId}/catalog?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } catch { setItems([]) }
      finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(t)
  }, [supplierId, search])

  const addToLibrary = async (item: CatalogItem) => {
    const res = await fetch('/api/billing/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designation: item.designation,
        description: item.description,
        unit: item.unit,
        unitPriceHt: item.price_ht,
        tvaRate: item.tva_rate,
        costPrice: item.price_ht,
        supplierId,
        supplierReference: item.reference,
      }),
    })
    if (res.ok) {
      setAddedIds(prev => new Set([...prev, item.id]))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-zinc-700">Catalogue {supplierName}</h3>
        <span className="text-xs text-zinc-400">{items.length} article{items.length > 1 ? 's' : ''}</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher dans le catalogue..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-rapido-blue" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">
          {search ? 'Aucun résultat' : 'Catalogue vide'}
        </p>
      ) : (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {items.map(item => {
            const isAdded = addedIds.has(item.id)
            return (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-700 truncate">{item.designation}</p>
                    {item.reference && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{item.reference}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-semibold text-zinc-600">{formatCurrency(item.price_ht)} HT</span>
                    <span className="text-[10px] text-zinc-400">/{item.unit} · TVA {item.tva_rate}%</span>
                    {item.category && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">{item.category}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addToLibrary(item)}
                  disabled={isAdded}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isAdded
                      ? 'bg-green-50 text-green-600'
                      : 'bg-rapido-blue/10 text-rapido-blue hover:bg-rapido-blue/20'
                  }`}
                >
                  {isAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {isAdded ? 'Ajouté' : 'Ajouter'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-[10px] text-zinc-400 flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        Les articles ajoutés sont copiés dans votre bibliothèque avec le prix fournisseur comme prix d&apos;achat
      </p>
    </div>
  )
}
