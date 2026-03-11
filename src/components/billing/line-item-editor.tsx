'use client'

import { useState } from 'react'
import { Trash2, GripVertical, Plus, Layers, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'
import { LibraryPicker } from './library-picker'

export interface LineItem {
  id?: string
  sort_order: number
  designation: string
  description: string | null
  unit: string
  quantity: number
  unit_price_ht: number
  tva_rate: number
  library_item_id?: string | null
  section_title?: string | null
  is_section_header?: boolean
  cost_price?: number | null
}

interface LineItemEditorProps {
  lines: LineItem[]
  onChange: (lines: LineItem[]) => void
  readOnly?: boolean
}

const UNITS = ['u', 'm', 'm²', 'm³', 'ml', 'kg', 'h', 'j', 'forfait', 'lot', 'ens']
const TVA_RATES = [0, 5.5, 10, 20]

export function LineItemEditor({ lines, onChange, readOnly }: LineItemEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [expandedMargins, setExpandedMargins] = useState<Record<number, boolean>>({})

  const addLine = (preset?: Partial<LineItem>) => {
    const newLine: LineItem = {
      sort_order: lines.length + 1,
      designation: preset?.designation || '',
      description: preset?.description || null,
      unit: preset?.unit || 'u',
      quantity: preset?.quantity || 1,
      unit_price_ht: preset?.unit_price_ht || 0,
      tva_rate: preset?.tva_rate || 20,
      library_item_id: preset?.library_item_id || null,
      cost_price: preset?.cost_price ?? null,
    }
    onChange([...lines, newLine])
  }

  const addSection = () => {
    const newLine: LineItem = {
      sort_order: lines.length + 1,
      designation: '',
      description: null,
      unit: 'u',
      quantity: 0,
      unit_price_ht: 0,
      tva_rate: 20,
      section_title: 'Nouvelle section',
      is_section_header: true,
    }
    onChange([...lines, newLine])
  }

  const updateLine = (index: number, field: keyof LineItem, value: string | number | null) => {
    const updated = [...lines]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeLine = (index: number) => {
    const updated = lines.filter((_, i) => i !== index)
    onChange(updated.map((l, i) => ({ ...l, sort_order: i + 1 })))
  }

  const duplicateLine = (index: number) => {
    const source = lines[index]
    const copy = { ...source, id: undefined, sort_order: index + 2 }
    const updated = [...lines]
    updated.splice(index + 1, 0, copy)
    onChange(updated.map((l, i) => ({ ...l, sort_order: i + 1 })))
  }

  const toggleMargin = (index: number) => {
    setExpandedMargins(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...lines]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    onChange(updated.map((l, i) => ({ ...l, sort_order: i + 1 })))
    setDragIndex(index)
  }
  const handleDragEnd = () => setDragIndex(null)

  const lineTotal = (line: LineItem) => {
    return line.quantity * line.unit_price_ht
  }

  const lineMargin = (line: LineItem) => {
    if (!line.cost_price || line.cost_price <= 0) return null
    const totalCost = line.cost_price * line.quantity
    const totalSale = line.unit_price_ht * line.quantity
    const margin = totalSale - totalCost
    const marginPct = totalSale > 0 ? (margin / totalSale) * 100 : 0
    const coeff = line.cost_price > 0 ? line.unit_price_ht / line.cost_price : 0
    return { margin, marginPct, coeff, totalCost }
  }

  // Global margin summary
  const globalMargin = (() => {
    let totalSale = 0
    let totalCost = 0
    let hasAnyMargin = false
    for (const line of lines) {
      if (line.is_section_header) continue
      totalSale += line.quantity * line.unit_price_ht
      if (line.cost_price && line.cost_price > 0) {
        totalCost += line.cost_price * line.quantity
        hasAnyMargin = true
      }
    }
    if (!hasAnyMargin) return null
    const margin = totalSale - totalCost
    const marginPct = totalSale > 0 ? (margin / totalSale) * 100 : 0
    return { totalSale, totalCost, margin, marginPct }
  })()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700">Lignes du document</h3>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <LibraryPicker
              onSelect={(item) => addLine({
                designation: item.designation,
                description: item.description,
                unit: item.unit,
                unit_price_ht: item.unit_price_ht,
                tva_rate: item.tva_rate,
                library_item_id: item.id.startsWith('catalog-') ? null : item.id,
                cost_price: item.cost_price ?? null,
              })}
              onMultiSelect={(items) => {
                const newLines = items.map((item, i) => ({
                  sort_order: lines.length + i + 1,
                  designation: item.designation,
                  description: item.description,
                  unit: item.unit,
                  quantity: 1,
                  unit_price_ht: item.unit_price_ht,
                  tva_rate: item.tva_rate,
                  library_item_id: item.id.startsWith('catalog-') ? null : item.id,
                  cost_price: item.cost_price ?? null,
                }))
                onChange([...lines, ...newLines])
              }}
            />
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <Layers className="h-4 w-4" />
              Section
            </button>
            <button
              type="button"
              onClick={() => addLine()}
              className="flex items-center gap-1.5 text-sm font-medium text-rapido-green hover:text-rapido-green/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>
        )}
      </div>

      {/* Desktop table header */}
      <div className="hidden md:grid md:grid-cols-[1fr_80px_80px_100px_80px_90px_40px] gap-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider px-2">
        <span>Désignation</span>
        <span className="text-right">Qté</span>
        <span>Unité</span>
        <span className="text-right">PU HT</span>
        <span>TVA</span>
        <span className="text-right">Total HT</span>
        <span />
      </div>

      {lines.length === 0 && (
        <div className="text-center py-8 text-zinc-400 text-sm border-2 border-dashed border-zinc-200 rounded-xl">
          Aucune ligne. Cliquez sur &quot;Ajouter&quot; ou utilisez la bibliothèque.
        </div>
      )}

      {lines.map((line, index) => {
        // Section header rendering
        if (line.is_section_header) {
          return (
            <div
              key={index}
              draggable={!readOnly}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`rounded-xl border bg-zinc-50 p-3 transition-all ${
                dragIndex === index ? 'border-rapido-blue shadow-md opacity-70' : 'border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <GripVertical className="h-4 w-4 text-zinc-400 cursor-grab flex-shrink-0" />
                )}
                <Layers className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                <input
                  type="text"
                  value={line.section_title || ''}
                  onChange={(e) => updateLine(index, 'section_title', e.target.value)}
                  placeholder="Titre de section"
                  readOnly={readOnly}
                  className="flex-1 text-sm font-bold text-zinc-700 bg-transparent border-0 focus:outline-none uppercase tracking-wide"
                />
                {!readOnly && (
                  <button type="button" onClick={() => removeLine(index)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )
        }

        return (
        <div
          key={index}
          draggable={!readOnly}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`rounded-xl border bg-white p-3 transition-all ${
            dragIndex === index ? 'border-rapido-blue shadow-md opacity-70' : 'border-zinc-200'
          }`}
        >
          {/* Mobile layout */}
          <div className="md:hidden space-y-3">
            <div className="flex items-start gap-2">
              {!readOnly && (
                <GripVertical className="h-5 w-5 text-zinc-300 cursor-grab flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={line.designation}
                  onChange={(e) => updateLine(index, 'designation', e.target.value)}
                  placeholder="Désignation *"
                  readOnly={readOnly}
                  className="w-full text-sm font-medium border-0 border-b border-zinc-200 pb-1 focus:outline-none focus:border-rapido-blue bg-transparent"
                />
                <textarea
                  value={line.description || ''}
                  onChange={(e) => updateLine(index, 'description', e.target.value || null)}
                  placeholder="Description (optionnel)"
                  readOnly={readOnly}
                  rows={1}
                  className="w-full text-xs text-zinc-500 border-0 focus:outline-none bg-transparent resize-none"
                />
              </div>
              {!readOnly && (
                <div className="flex gap-1 flex-shrink-0">
                  <button type="button" onClick={() => duplicateLine(index)} className="text-zinc-400 hover:text-zinc-600 p-1" title="Dupliquer">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeLine(index)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block">Qté</label>
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, 'quantity', Number(e.target.value))}
                  readOnly={readOnly}
                  min={0}
                  step="0.01"
                  className="w-full text-sm border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block">Unité</label>
                <select
                  value={line.unit}
                  onChange={(e) => updateLine(index, 'unit', e.target.value)}
                  disabled={readOnly}
                  className="w-full text-sm border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block">PU HT</label>
                <input
                  type="number"
                  value={line.unit_price_ht}
                  onChange={(e) => updateLine(index, 'unit_price_ht', Number(e.target.value))}
                  readOnly={readOnly}
                  min={0}
                  step="0.01"
                  className="w-full text-sm border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block">TVA</label>
                <select
                  value={line.tva_rate}
                  onChange={(e) => updateLine(index, 'tva_rate', Number(e.target.value))}
                  disabled={readOnly}
                  className="w-full text-sm border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue"
                >
                  {TVA_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
            </div>
            <div className="text-right text-sm font-semibold text-zinc-700">
              Total HT : {formatCurrency(lineTotal(line))}
            </div>
            {/* Margin toggle (mobile) */}
            {!readOnly && (
              <button
                type="button"
                onClick={() => toggleMargin(index)}
                className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-600"
              >
                {expandedMargins[index] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Marge
              </button>
            )}
            {expandedMargins[index] && (
              <div className="bg-amber-50 rounded-lg p-2 space-y-1">
                <div>
                  <label className="text-[10px] text-amber-700 block">Prix d&apos;achat HT</label>
                  <input
                    type="number"
                    value={line.cost_price ?? ''}
                    onChange={(e) => updateLine(index, 'cost_price', e.target.value ? Number(e.target.value) : null)}
                    readOnly={readOnly}
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="w-32 text-sm border border-amber-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
                  />
                </div>
                {lineMargin(line) && (
                  <p className="text-[10px] text-amber-700">
                    Marge : {formatCurrency(lineMargin(line)!.margin)} ({lineMargin(line)!.marginPct.toFixed(1)}%) · Coeff : {lineMargin(line)!.coeff.toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-[1fr_80px_80px_100px_80px_90px_40px] gap-2 items-center">
            <div className="flex items-center gap-2 min-w-0">
              {!readOnly && (
                <GripVertical className="h-4 w-4 text-zinc-300 cursor-grab flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={line.designation}
                  onChange={(e) => updateLine(index, 'designation', e.target.value)}
                  placeholder="Désignation *"
                  readOnly={readOnly}
                  className="w-full text-sm font-medium border-0 focus:outline-none bg-transparent"
                />
                <input
                  type="text"
                  value={line.description || ''}
                  onChange={(e) => updateLine(index, 'description', e.target.value || null)}
                  placeholder="Description"
                  readOnly={readOnly}
                  className="w-full text-xs text-zinc-400 border-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            <input
              type="number"
              value={line.quantity}
              onChange={(e) => updateLine(index, 'quantity', Number(e.target.value))}
              readOnly={readOnly}
              min={0}
              step="0.01"
              className="text-sm text-right border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue w-full"
            />
            <select
              value={line.unit}
              onChange={(e) => updateLine(index, 'unit', e.target.value)}
              disabled={readOnly}
              className="text-sm border border-zinc-200 rounded-lg px-1 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue w-full"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              type="number"
              value={line.unit_price_ht}
              onChange={(e) => updateLine(index, 'unit_price_ht', Number(e.target.value))}
              readOnly={readOnly}
              min={0}
              step="0.01"
              className="text-sm text-right border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue w-full"
            />
            <select
              value={line.tva_rate}
              onChange={(e) => updateLine(index, 'tva_rate', Number(e.target.value))}
              disabled={readOnly}
              className="text-sm border border-zinc-200 rounded-lg px-1 py-1.5 focus:outline-none focus:ring-1 focus:ring-rapido-blue w-full"
            >
              {TVA_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
            <span className="text-sm font-semibold text-zinc-700 text-right">
              {formatCurrency(lineTotal(line))}
            </span>
            {!readOnly ? (
              <div className="flex gap-0.5">
                <button type="button" onClick={() => duplicateLine(index)} className="text-zinc-400 hover:text-zinc-600 p-0.5" title="Dupliquer">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => removeLine(index)} className="text-red-400 hover:text-red-600 p-0.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : <span />}
          </div>

          {/* Margin row (desktop) */}
          {!readOnly && (
            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => toggleMargin(index)}
                className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-600 ml-6 mt-1"
              >
                {expandedMargins[index] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Marge (privé)
              </button>
              {expandedMargins[index] && (
                <div className="ml-6 mt-1 flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    <label className="text-[10px] text-amber-700">Coût HT :</label>
                    <input
                      type="number"
                      value={line.cost_price ?? ''}
                      onChange={(e) => updateLine(index, 'cost_price', e.target.value ? Number(e.target.value) : null)}
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      className="w-24 text-xs border border-amber-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
                    />
                  </div>
                  {lineMargin(line) && (
                    <span className="text-[10px] text-amber-700">
                      Marge : {formatCurrency(lineMargin(line)!.margin)} ({lineMargin(line)!.marginPct.toFixed(1)}%) · Coeff : {lineMargin(line)!.coeff.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        )
      })}
      {/* Global margin summary */}
      {globalMargin && !readOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Rentabilité (privé — jamais sur le document client)</p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-[10px] text-amber-600">Total vente HT</p>
              <p className="text-sm font-bold text-zinc-700">{formatCurrency(globalMargin.totalSale)}</p>
            </div>
            <div>
              <p className="text-[10px] text-amber-600">Total coûts</p>
              <p className="text-sm font-bold text-zinc-700">{formatCurrency(globalMargin.totalCost)}</p>
            </div>
            <div>
              <p className="text-[10px] text-amber-600">Marge brute</p>
              <p className="text-sm font-bold text-rapido-green">{formatCurrency(globalMargin.margin)} ({globalMargin.marginPct.toFixed(1)}%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
