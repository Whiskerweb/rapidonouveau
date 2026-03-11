'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Users } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  siret: string | null
}

interface ClientPickerProps {
  onSelect: (client: Client) => void
}

export function ClientPicker({ onSelect }: ClientPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const fetchClients = async () => {
      setLoading(true)
      try {
        const q = search ? `?q=${encodeURIComponent(search)}` : ''
        const res = await fetch(`/api/billing/clients${q}`)
        const data = await res.json()
        setClients(data.clients || [])
      } catch {
        setClients([])
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(fetchClients, 200)
    return () => clearTimeout(timer)
  }, [open, search])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-rapido-blue hover:text-rapido-blue/80 transition-colors"
      >
        <Users className="h-4 w-4" />
        Client existant
      </button>

      {open && (
        <div className="absolute top-8 left-0 z-50 w-80 bg-white border border-zinc-200 rounded-xl shadow-lg p-2">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              autoFocus
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rapido-blue"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <p className="text-xs text-zinc-400 text-center py-4">Chargement...</p>
            ) : clients.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">Aucun client trouvé</p>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => { onSelect(client); setOpen(false) }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <p className="text-sm font-medium text-zinc-700">{client.name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {[client.email, client.phone].filter(Boolean).join(' · ')}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
