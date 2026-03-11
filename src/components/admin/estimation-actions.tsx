'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EstimationActionsProps {
  estimationId: string
  currentStatus: string
}

const STATUSES = [
  { value: 'submitted', label: 'En attente' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'validated', label: 'Validé' },
  { value: 'delivered', label: 'Livré' },
]

export function EstimationActions({ estimationId, currentStatus }: EstimationActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/estimations/${estimationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Erreur')
      router.refresh()
    } catch {
      setStatus(currentStatus)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // 1. Upload le fichier
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'estimation-documents')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Erreur upload')
      const uploadData = await uploadRes.json()

      // 2. Créer le document et notifier
      const docRes = await fetch(`/api/admin/estimations/${estimationId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storagePath: uploadData.path || uploadData.url,
          filename: file.name,
          fileSize: file.size,
          documentType: 'estimation_pdf',
        }),
      })

      if (!docRes.ok) throw new Error('Erreur document')

      router.refresh()
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Changement de statut */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 block">Statut</label>
        <div className="flex gap-2">
          <Select value={status} onValueChange={handleStatusChange} disabled={saving}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload PDF */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 block">
          Envoyer un document au client
        </label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 cursor-pointer p-6 hover:border-rapido-blue hover:bg-rapido-blue/5 transition-colors text-center">
          <div className="text-2xl">+</div>
          <p className="text-sm font-medium text-rapido-blue">
            {uploading ? 'Envoi en cours...' : 'Uploader un PDF'}
          </p>
          <p className="text-xs text-zinc-400">Le client sera notifié automatiquement</p>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}
