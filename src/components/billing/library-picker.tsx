'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, BookOpen, Star, Clock, Package, X, Check, Truck, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface LibraryItem {
  id: string
  designation: string
  description: string | null
  unit: string
  unit_price_ht: number
  tva_rate: number
  category: string | null
  cost_price?: number | null
  is_favorite?: boolean
  supplier?: { id: string; name: string } | null
  cat?: { id: string; name: string; color: string } | null
}

interface Category {
  id: string
  name: string
  color: string
}

interface Supplier {
  id: string
  name: string
  catalog_count: number
}

interface CatalogItem {
  id: string
  reference: string | null
  designation: string
  description: string | null
  unit: string
  price_ht: number
  tva_rate: number
}

interface LibraryPickerProps {
  onSelect: (item: LibraryItem) => void
  onMultiSelect?: (items: LibraryItem[]) => void
}

type Tab = 'all' | 'favorites' | 'recent' | 'suppliers' | string

export function LibraryPicker({ onSelect, onMultiSelect }: LibraryPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<LibraryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [multiMode, setMultiMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (activeTab === 'favorites') params.set('favorite', 'true')
      if (activeTab === 'recent') params.set('sort', 'recent')
      if (activeTab !== 'all' && activeTab !== 'favorites' && activeTab !== 'recent' && activeTab !== 'suppliers') {
        params.set('category_id', activeTab)
      }
      const res = await fetch(`/api/billing/library?${params}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [search, activeTab])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(fetchItems, 200)
    return () => clearTimeout(t)
  }, [open, fetchItems])

  useEffect(() => {
    if (!open) return
    fetch('/api/billing/library/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {})
    fetch('/api/billing/suppliers').then(r => r.json()).then(d => setSuppliers(d.suppliers || [])).catch(() => {})
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    if (!selectedSupplier) return
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    fetch(`/api/billing/suppliers/${selectedSupplier}/catalog?${params}`)
      .then(r => r.json())
      .then(d => setCatalogItems(d.items || []))
      .catch(() => setCatalogItems([]))
      .finally(() => setLoading(false))
  }, [selectedSupplier, search])

  const handleSelect = (item: LibraryItem) => {
    if (multiMode) {
      const next = new Set(selected)
      if (next.has(item.id)) next.delete(item.id); else next.add(item.id)
      setSelected(next)
      return
    }

    // Track usage (fire-and-forget)
    fetch(`/api/billing/library/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ last_used_at: new Date().toISOString() }),
    }).catch(() => {})

    onSelect(item)
    setOpen(false)
    setSearch('')
  }

  const handleMultiAdd = () => {
    if (!onMultiSelect) return
    const selectedItems = items.filter(i => selected.has(i.id))
    // Track usage
    for (const item of selectedItems) {
      fetch(`/api/billing/library/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_used_at: new Date().toISOString() }),
      }).catch(() => {})
    }
    onMultiSelect(selectedItems)
    setOpen(false)
    setSearch('')
    setSelected(new Set())
    setMultiMode(false)
  }

  const handleCatalogSelect = (item: CatalogItem) => {
    const libItem: LibraryItem = {
      id: `catalog-${item.id}`,
      designation: item.designation,
      description: item.description,
      unit: item.unit,
      unit_price_ht: item.price_ht,
      tva_rate: item.tva_rate,
      category: null,
      cost_price: item.price_ht,
    }
    onSelect(libItem)
    setOpen(false)
    setSearch('')
  }

  const close = () => {
    setOpen(false)
    setSearch('')
    setSelected(new Set())
    setMultiMode(false)
    setSelectedSupplier(null)
    setActiveTab('all')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-rapido-blue hover:text-rapido-blue/80 font-medium transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        Bibliothèque
      </button>

      {/* Slide panel */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={close} />
          <div
            ref={panelRef}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">Bibliothèque</h2>
              <div className="flex items-center gap-2">
                {onMultiSelect && (
                  <button
                    onClick={() => { setMultiMode(!multiMode); setSelected(new Set()) }}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                      multiMode ? 'bg-rapido-blue text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Multi-sélection
                  </button>
                )}
                <button onClick={close} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-zinc-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 px-3 py-2 overflow-x-auto border-b border-zinc-100 scrollbar-hide">
              {[
                { id: 'all', label: 'Tous', icon: Package },
                { id: 'favorites', label: 'Favoris', icon: Star },
                { id: 'recent', label: 'Récents', icon: Clock },
                { id: 'suppliers', label: 'Catalogues', icon: Truck },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as Tab); setSelectedSupplier(null) }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? 'bg-rapido-blue text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </button>
              ))}
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveTab(cat.id); setSelectedSupplier(null) }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition-colors`}
                  style={{
                    backgroundColor: activeTab === cat.id ? cat.color : `${cat.color}15`,
                    color: activeTab === cat.id ? 'white' : cat.color,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeTab === cat.id ? 'white' : cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'suppliers' ? (
                /* Supplier catalog view */
                selectedSupplier ? (
                  <div className="p-3">
                    <button
                      onClick={() => setSelectedSupplier(null)}
                      className="flex items-center gap-1 text-xs text-rapido-blue mb-3 hover:underline"
                    >
                      ← Retour aux fournisseurs
                    </button>
                    {loading ? (
                      <p className="text-sm text-zinc-400 text-center py-8">Chargement...</p>
                    ) : catalogItems.length === 0 ? (
                      <p className="text-sm text-zinc-400 text-center py-8">Catalogue vide</p>
                    ) : (
                      catalogItems.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCatalogSelect(item)}
                          className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 border-b border-zinc-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-800 truncate">{item.designation}</p>
                              {item.reference && <span className="text-[10px] text-zinc-400">{item.reference}</span>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-zinc-700">{formatCurrency(item.price_ht)}</p>
                              <p className="text-[10px] text-zinc-400">/{item.unit} HT</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="p-3 space-y-1">
                    {suppliers.length === 0 ? (
                      <p className="text-sm text-zinc-400 text-center py-8">Aucun fournisseur configuré</p>
                    ) : (
                      suppliers.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSupplier(s.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors text-left"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 flex-shrink-0">
                            <Truck className="h-4 w-4 text-zinc-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-700">{s.name}</p>
                            <p className="text-[10px] text-zinc-400">{s.catalog_count} article{s.catalog_count > 1 ? 's' : ''}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-300" />
                        </button>
                      ))
                    )}
                  </div>
                )
              ) : (
                /* Library items */
                loading ? (
                  <p className="text-sm text-zinc-400 text-center py-8">Chargement...</p>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">{search ? 'Aucun résultat' : 'Bibliothèque vide'}</p>
                  </div>
                ) : (
                  items.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-4 py-3 border-b border-zinc-50 transition-colors ${
                        selected.has(item.id) ? 'bg-rapido-blue/5' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          {multiMode && (
                            <div className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border flex-shrink-0 ${
                              selected.has(item.id) ? 'bg-rapido-blue border-rapido-blue' : 'border-zinc-300'
                            }`}>
                              {selected.has(item.id) && <Check className="h-3 w-3 text-white" />}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {item.is_favorite && <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                              <p className="text-sm font-medium text-zinc-800 truncate">{item.designation}</p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {item.cat && (
                                <span
                                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                  style={{ backgroundColor: `${item.cat.color}15`, color: item.cat.color }}
                                >
                                  {item.cat.name}
                                </span>
                              )}
                              {item.supplier && (
                                <span className="text-[10px] text-zinc-400">
                                  <Truck className="h-2.5 w-2.5 inline mr-0.5" />{item.supplier.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-zinc-700">{formatCurrency(item.unit_price_ht)}</p>
                          <p className="text-[10px] text-zinc-400">/{item.unit} HT</p>
                          {item.cost_price && item.unit_price_ht > 0 && (
                            <p className="text-[10px] text-green-600 font-medium">
                              {Math.round(((item.unit_price_ht - item.cost_price) / item.unit_price_ht) * 1000) / 10}%
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>

            {/* Multi-select footer */}
            {multiMode && selected.size > 0 && (
              <div className="p-3 border-t border-zinc-100 bg-white">
                <button
                  onClick={handleMultiAdd}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Ajouter {selected.size} produit{selected.size > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
