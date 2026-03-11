'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

interface CSVImportDialogProps {
  endpoint: string // e.g. '/api/billing/library/import' or '/api/billing/suppliers/[id]/import'
  title?: string
  extraFormData?: Record<string, string>
  onComplete: () => void
  onClose: () => void
}

export function CSVImportDialog({ endpoint, title = 'Importer un CSV', extraFormData, onComplete, onClose }: CSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors: { line: number; message: string }[]; updated?: number; priceChanges?: unknown[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File | null) => {
    if (!f) return
    setFile(f)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const delimiter = text.split('\n')[0]?.includes(';') ? ';' : ','
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length > 0) {
        setHeaders(lines[0].split(delimiter).map(h => h.trim().replace(/['"]/g, '')))
        setPreview(lines.slice(1, 6).map(l => l.split(delimiter).map(c => c.trim().replace(/['"]/g, ''))))
      }
    }
    reader.readAsText(f)
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (extraFormData) {
        for (const [k, v] of Object.entries(extraFormData)) {
          formData.append(k, v)
        }
      }

      const res = await fetch(endpoint, { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        onComplete()
      } else {
        setResult({ imported: 0, errors: [{ line: 0, message: data.error || 'Erreur inconnue' }] })
      }
    } catch {
      setResult({ imported: 0, errors: [{ line: 0, message: 'Erreur réseau' }] })
    } finally {
      setImporting(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.csv') || f.type === 'text/csv')) {
      handleFile(f)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Drop zone */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center cursor-pointer hover:border-rapido-blue/40 hover:bg-rapido-blue/5 transition-colors"
            >
              <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-zinc-600">Glissez un fichier CSV ici</p>
              <p className="text-xs text-zinc-400 mt-1">ou cliquez pour parcourir</p>
              <p className="text-[10px] text-zinc-400 mt-3">
                Colonnes attendues : designation, prix_ht, unite, tva, categorie, prix_achat, reference
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={e => handleFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          )}

          {/* File selected */}
          {file && !result && (
            <>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                <FileText className="h-5 w-5 text-rapido-blue flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-700 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(1)} Ko · {preview.length} lignes aperçu</p>
                </div>
                <button onClick={() => { setFile(null); setPreview([]); setHeaders([]) }} className="text-xs text-zinc-500 hover:text-red-500">
                  Changer
                </button>
              </div>

              {/* Preview table */}
              {headers.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-zinc-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-50">
                        {headers.map((h, i) => (
                          <th key={i} className="px-2 py-1.5 text-left font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-t border-zinc-100">
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1.5 text-zinc-600 whitespace-nowrap max-w-[150px] truncate">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rapido-blue rounded-xl hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {importing ? 'Import en cours...' : 'Importer'}
              </button>
            </>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {result.imported} produit{result.imported > 1 ? 's' : ''} importé{result.imported > 1 ? 's' : ''}
                  </p>
                  {result.updated !== undefined && result.updated > 0 && (
                    <p className="text-xs text-green-600">{result.updated} prix mis à jour</p>
                  )}
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">{result.errors.length} avertissement{result.errors.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <p key={i} className="text-[11px] text-amber-600">
                        {err.line > 0 ? `Ligne ${err.line}: ` : ''}{err.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
