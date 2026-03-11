'use client'

import { useState } from 'react'
import { X, Plus, Trash2, GripVertical } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
  sort_order: number
}

interface CategoryManagerProps {
  categories: Category[]
  onUpdate: () => void
  onClose: () => void
}

const PALETTE = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#64748b', '#78716c',
]

export function CategoryManager({ categories, onUpdate, onClose }: CategoryManagerProps) {
  const [items, setItems] = useState(categories)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = async () => {
    if (!newName.trim()) return
    const res = await fetch('/api/billing/library/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), color: newColor }),
    })
    if (res.ok) {
      const { category } = await res.json()
      setItems([...items, category])
      setNewName('')
      onUpdate()
    } else {
      const data = await res.json()
      alert(data.error || 'Erreur')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    const res = await fetch(`/api/billing/library/categories?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems(items.filter(c => c.id !== id))
      onUpdate()
    }
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) { setEditingId(null); return }
    const res = await fetch('/api/billing/library/categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName.trim() }),
    })
    if (res.ok) {
      setItems(items.map(c => c.id === id ? { ...c, name: editName.trim() } : c))
      setEditingId(null)
      onUpdate()
    }
  }

  const handleColorChange = async (id: string, color: string) => {
    const res = await fetch('/api/billing/library/categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, color }),
    })
    if (res.ok) {
      setItems(items.map(c => c.id === id ? { ...c, color } : c))
      onUpdate()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Catégories</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Add new */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Nouvelle catégorie..."
              className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
            />
            <div className="relative group">
              <button
                type="button"
                className="h-9 w-9 rounded-lg border border-zinc-200"
                style={{ backgroundColor: newColor }}
              />
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg p-2 grid grid-cols-6 gap-1 hidden group-hover:grid z-10">
                {PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`h-6 w-6 rounded-full ${newColor === c ? 'ring-2 ring-offset-1 ring-rapido-blue' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-rapido-blue text-white hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Existing categories */}
          {items.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-4">Aucune catégorie</p>
          ) : (
            <div className="space-y-1">
              {items.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-50 group">
                  <GripVertical className="h-4 w-4 text-zinc-300 flex-shrink-0" />
                  <div className="relative group/color">
                    <div
                      className="h-5 w-5 rounded-full flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg p-2 grid grid-cols-6 gap-1 hidden group-hover/color:grid z-10">
                      {PALETTE.map(c => (
                        <button
                          key={c}
                          onClick={() => handleColorChange(cat.id, c)}
                          className={`h-6 w-6 rounded-full ${cat.color === c ? 'ring-2 ring-offset-1 ring-rapido-blue' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onBlur={() => handleRename(cat.id)}
                      onKeyDown={e => e.key === 'Enter' && handleRename(cat.id)}
                      className="flex-1 text-sm border border-rapido-blue rounded px-2 py-1 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1 text-sm text-zinc-700 cursor-pointer"
                      onDoubleClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                    >
                      {cat.name}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-zinc-400 text-center">Double-cliquez pour renommer · Survolez la pastille pour changer la couleur</p>
        </div>
      </div>
    </div>
  )
}
