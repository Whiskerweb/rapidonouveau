'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Plus, BookOpen } from 'lucide-react'

interface LibraryItem {
  id: string
  designation: string
  description: string | null
  unit: string
  unit_price_ht: number
  tva_rate: number
  category: string | null
}

interface LibraryPickerProps {
  onSelect: (item: LibraryItem) => void
}

export function LibraryPicker({ onSelect }: LibraryPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        const res = await fetch(`/api/billing/library?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-rapido-blue hover:text-rapido-blue/80 font-medium transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        Bibliothèque
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-zinc-200 shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un ouvrage..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-zinc-400">Chargement...</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-400">
                {search ? 'Aucun résultat' : 'Bibliothèque vide'}
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-b border-zinc-50 last:border-0 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{item.designation}</p>
                      {item.category && (
                        <span className="inline-block text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full mt-1">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-zinc-700">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unit_price_ht)}
                      </p>
                      <p className="text-[10px] text-zinc-400">/{item.unit} HT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Plus className="h-3 w-3 text-rapido-green" />
                    <span className="text-[11px] text-rapido-green font-medium">Ajouter</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
