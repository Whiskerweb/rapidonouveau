'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Search, Star, Trash2, Upload, Tag, Loader2,
  MoreHorizontal, Edit2, Package, Truck, Clock, Globe
} from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'
import { LibraryItemForm } from '@/components/billing/library-item-form'
import { CategoryManager } from '@/components/billing/category-manager'
import { CSVImportDialog } from '@/components/billing/csv-import-dialog'
import { ProductScraper } from '@/components/billing/product-scraper'

interface Category {
  id: string
  name: string
  color: string
  sort_order: number
}

interface LibraryItem {
  id: string
  designation: string
  description: string | null
  unit: string
  unit_price_ht: number
  tva_rate: number
  category: string | null
  cost_price: number | null
  supplier_id: string | null
  supplier_reference: string | null
  is_favorite: boolean
  last_used_at: string | null
  use_count: number
  category_id: string | null
  supplier: { id: string; name: string } | null
  cat: { id: string; name: string; color: string } | null
}

type TabFilter = 'all' | 'favorites' | 'recent' | string // string = category_id

export default function BibliotequePage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<'name' | 'price' | 'recent' | 'popular'>('name')

  // Dialogs
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<LibraryItem | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showScraper, setShowScraper] = useState(false)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (sort) params.set('sort', sort)
    if (activeTab === 'favorites') params.set('favorite', 'true')
    if (activeTab !== 'all' && activeTab !== 'favorites' && activeTab !== 'recent') {
      params.set('category_id', activeTab)
    }
    if (activeTab === 'recent') params.set('sort', 'recent')

    try {
      const res = await fetch(`/api/billing/library?${params}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [search, sort, activeTab])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/billing/library/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch { /* ignore */ }
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(fetchItems, 300)
    return () => clearTimeout(t)
  }, [fetchItems])

  const handleSave = async (data: { id?: string; designation: string; description: string; unit: string; unit_price_ht: number; tva_rate: number; category_id: string | null; cost_price: number | null; supplier_id: string | null; supplier_reference: string; is_favorite: boolean }) => {
    const isEdit = !!data.id
    const url = isEdit ? `/api/billing/library/${data.id}` : '/api/billing/library'
    const method = isEdit ? 'PATCH' : 'POST'

    const body = isEdit ? {
      designation: data.designation,
      description: data.description,
      unit: data.unit,
      unit_price_ht: data.unit_price_ht,
      tva_rate: data.tva_rate,
      category_id: data.category_id,
      cost_price: data.cost_price,
      supplier_id: data.supplier_id,
      supplier_reference: data.supplier_reference,
      is_favorite: data.is_favorite,
    } : {
      designation: data.designation,
      description: data.description,
      unit: data.unit,
      unitPriceHt: data.unit_price_ht,
      tvaRate: data.tva_rate,
      categoryId: data.category_id,
      costPrice: data.cost_price,
      supplierId: data.supplier_id,
      supplierReference: data.supplier_reference,
      isFavorite: data.is_favorite,
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowForm(false)
      setEditItem(null)
      fetchItems()
    } else {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch(`/api/billing/library/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selected.size} produit(s) ?`)) return
    await fetch('/api/billing/library/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', ids: [...selected] }),
    })
    setSelected(new Set())
    fetchItems()
  }

  const handleToggleFavorite = async (item: LibraryItem) => {
    await fetch(`/api/billing/library/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favorite: !item.is_favorite }),
    })
    fetchItems()
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map(i => i.id)))
  }

  const margin = (item: LibraryItem) => {
    if (!item.cost_price || !item.unit_price_ht) return null
    return Math.round(((item.unit_price_ht - item.cost_price) / item.unit_price_ht) * 100 * 10) / 10
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/artisan/facturation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Bibliothèque produits</h1>
            <p className="text-sm text-zinc-500">{items.length} produit{items.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowScraper(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rapido-blue border border-rapido-blue/30 bg-rapido-blue/5 rounded-xl hover:bg-rapido-blue/10 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Import web</span>
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => setShowCategories(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Catégories</span>
          </button>
          <Link
            href="/artisan/facturation/fournisseurs"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Fournisseurs</span>
          </Link>
          <button
            onClick={() => { setEditItem(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as typeof sort)}
          className="text-sm border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20"
        >
          <option value="name">Nom A-Z</option>
          <option value="price">Prix ↑</option>
          <option value="recent">Récents</option>
          <option value="popular">Populaires</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'all', label: 'Tous', icon: Package },
          { id: 'favorites', label: 'Favoris', icon: Star },
          { id: 'recent', label: 'Récents', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabFilter)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-rapido-blue text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === cat.id
                ? 'text-white'
                : 'text-zinc-600 hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === cat.id ? cat.color : `${cat.color}20`,
              color: activeTab === cat.id ? 'white' : cat.color,
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeTab === cat.id ? 'white' : cat.color }} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-rapido-blue/5 border border-rapido-blue/20 rounded-xl">
          <span className="text-sm font-medium text-rapido-blue">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-zinc-500 hover:text-zinc-700 ml-auto"
          >
            Désélectionner
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-rapido-blue" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Package className="h-12 w-12 text-zinc-300 mx-auto" />
          <p className="text-sm font-medium text-zinc-500">
            {search ? 'Aucun résultat' : 'Bibliothèque vide'}
          </p>
          <p className="text-xs text-zinc-400">
            {search ? 'Essayez un autre terme' : 'Ajoutez vos premiers produits ou importez un CSV'}
          </p>
          {!search && (
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => { setEditItem(null); setShowForm(true) }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> Créer un produit
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                <Upload className="h-4 w-4" /> Importer CSV
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected.size === items.length && items.length > 0}
                      onChange={selectAll}
                      className="rounded border-zinc-300"
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-zinc-500 text-xs">Désignation</th>
                  <th className="px-3 py-2.5 text-left font-medium text-zinc-500 text-xs">Catégorie</th>
                  <th className="px-3 py-2.5 text-right font-medium text-zinc-500 text-xs">Prix vente HT</th>
                  <th className="px-3 py-2.5 text-right font-medium text-zinc-500 text-xs">Prix achat HT</th>
                  <th className="px-3 py-2.5 text-right font-medium text-zinc-500 text-xs">Marge</th>
                  <th className="px-3 py-2.5 text-left font-medium text-zinc-500 text-xs">Fournisseur</th>
                  <th className="px-3 py-2.5 text-center font-medium text-zinc-500 text-xs w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const m = margin(item)
                  return (
                    <tr key={item.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-zinc-300"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleFavorite(item)} className="flex-shrink-0">
                            <Star className={`h-3.5 w-3.5 ${item.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
                          </button>
                          <div className="min-w-0">
                            <p className="font-medium text-zinc-800 truncate">{item.designation}</p>
                            <p className="text-[10px] text-zinc-400">{item.unit} · TVA {item.tva_rate}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        {item.cat && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${item.cat.color}15`, color: item.cat.color }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.cat.color }} />
                            {item.cat.name}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-zinc-700">
                        {formatCurrency(item.unit_price_ht)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-zinc-500">
                        {item.cost_price ? formatCurrency(item.cost_price) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {m !== null ? (
                          <span className={`text-xs font-medium ${m >= 20 ? 'text-green-600' : m >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                            {m}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-zinc-500">
                        {item.supplier?.name || '—'}
                        {item.supplier_reference && (
                          <span className="text-zinc-400 ml-1">({item.supplier_reference})</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="relative flex justify-center">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                            className="p-1 rounded hover:bg-zinc-100 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                          </button>
                          {actionMenuId === item.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg z-20 py-1 min-w-[120px]">
                              <button
                                onClick={() => { setEditItem(item); setShowForm(true); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
                              >
                                <Edit2 className="h-3 w-3" /> Modifier
                              </button>
                              <button
                                onClick={() => { handleDelete(item.id); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" /> Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {items.map(item => {
              const m = margin(item)
              return (
                <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-zinc-300 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleFavorite(item)}>
                          <Star className={`h-3.5 w-3.5 ${item.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
                        </button>
                        <p className="text-sm font-medium text-zinc-800 truncate">{item.designation}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-zinc-500">{item.unit} · TVA {item.tva_rate}%</span>
                        {item.cat && (
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: `${item.cat.color}15`, color: item.cat.color }}
                          >
                            {item.cat.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-bold text-zinc-700">{formatCurrency(item.unit_price_ht)}</span>
                        {item.cost_price && (
                          <span className="text-xs text-zinc-400">PA: {formatCurrency(item.cost_price)}</span>
                        )}
                        {m !== null && (
                          <span className={`text-xs font-medium ${m >= 20 ? 'text-green-600' : m >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                            {m}%
                          </span>
                        )}
                      </div>
                      {item.supplier && (
                        <p className="text-[10px] text-zinc-400 mt-1">
                          <Truck className="h-3 w-3 inline mr-1" />{item.supplier.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditItem(item); setShowForm(true) }}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Dialogs */}
      {showForm && (
        <LibraryItemForm
          item={editItem ? {
            id: editItem.id,
            designation: editItem.designation,
            description: editItem.description || '',
            unit: editItem.unit,
            unit_price_ht: editItem.unit_price_ht,
            tva_rate: editItem.tva_rate,
            category_id: editItem.category_id,
            cost_price: editItem.cost_price,
            supplier_id: editItem.supplier_id,
            supplier_reference: editItem.supplier_reference || '',
            is_favorite: editItem.is_favorite,
          } : null}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null) }}
        />
      )}

      {showCategories && (
        <CategoryManager
          categories={categories}
          onUpdate={fetchCategories}
          onClose={() => setShowCategories(false)}
        />
      )}

      {showImport && (
        <CSVImportDialog
          endpoint="/api/billing/library/import"
          title="Importer des produits"
          onComplete={fetchItems}
          onClose={() => setShowImport(false)}
        />
      )}

      {showScraper && (
        <ProductScraper
          onAddProduct={async (product) => {
            const res = await fetch('/api/billing/library', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(product),
            })
            if (res.ok) {
              setShowScraper(false)
              fetchItems()
            } else {
              alert('Erreur lors de l\'ajout')
            }
          }}
          onClose={() => setShowScraper(false)}
        />
      )}
    </div>
  )
}
