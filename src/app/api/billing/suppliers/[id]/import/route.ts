import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const firstLine = text.split('\n')[0] || ''
  const delimiter = firstLine.includes(';') ? ';' : ','

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return { headers: [], rows: [] }

  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows = lines.slice(1).map(line => {
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === delimiter && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current.trim())
    return fields
  })

  return { headers, rows }
}

function mapHeader(header: string): string | null {
  const h = header.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a')
  if (['designation', 'nom', 'produit', 'libelle', 'article'].includes(h)) return 'designation'
  if (['description', 'detail'].includes(h)) return 'description'
  if (['unite', 'unit', 'u'].includes(h)) return 'unit'
  if (['prix_ht', 'prix ht', 'prix', 'pu_ht', 'pu ht', 'tarif'].includes(h)) return 'price_ht'
  if (['tva', 'tva_rate', 'taux_tva', 'tva%'].includes(h)) return 'tva_rate'
  if (['categorie', 'category', 'famille'].includes(h)) return 'category'
  if (['reference', 'ref', 'sku', 'code'].includes(h)) return 'reference'
  return null
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id: supplierId } = await params

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })
    }

    const text = await file.text()
    const { headers, rows } = parseCSV(text)

    if (headers.length === 0) {
      return NextResponse.json({ error: 'Fichier vide ou format invalide' }, { status: 400 })
    }

    const fieldMap: Record<number, string> = {}
    headers.forEach((h, i) => {
      const mapped = mapHeader(h)
      if (mapped) fieldMap[i] = mapped
    })

    if (!Object.values(fieldMap).includes('designation')) {
      return NextResponse.json({ error: 'Colonne "designation" introuvable', headers }, { status: 400 })
    }

    // Fetch existing items by reference for price change detection
    const { data: existingItems } = await supabase
      .from('supplier_catalog_items')
      .select('id, reference, price_ht')
      .eq('supplier_id', supplierId)
      .eq('artisan_id', user.id)

    const existingByRef = new Map(
      (existingItems || []).filter(i => i.reference).map(i => [i.reference, i])
    )

    const toInsert: unknown[] = []
    const toUpdate: { id: string; price_ht: number }[] = []
    const priceChanges: { reference: string; designation: string; oldPrice: number; newPrice: number }[] = []
    const errors: { line: number; message: string }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const record: Record<string, unknown> = {
        supplier_id: supplierId,
        artisan_id: user.id,
        unit: 'u',
        tva_rate: 20,
        last_updated: new Date().toISOString(),
      }

      for (const [colIdx, field] of Object.entries(fieldMap)) {
        const val = row[Number(colIdx)]?.replace(/['"]/g, '') || ''
        if (!val) continue
        if (['price_ht', 'tva_rate'].includes(field)) {
          const num = Number(val.replace(',', '.').replace(/\s/g, ''))
          if (isNaN(num)) continue
          record[field] = num
        } else {
          record[field] = val
        }
      }

      if (!record.designation) {
        errors.push({ line: i + 2, message: 'Désignation manquante' })
        continue
      }
      if (!record.price_ht) record.price_ht = 0

      // Check if existing item (by reference)
      const ref = record.reference as string | undefined
      if (ref && existingByRef.has(ref)) {
        const existing = existingByRef.get(ref)!
        const newPrice = record.price_ht as number
        if (existing.price_ht !== newPrice) {
          priceChanges.push({
            reference: ref,
            designation: record.designation as string,
            oldPrice: existing.price_ht,
            newPrice,
          })
          toUpdate.push({ id: existing.id, price_ht: newPrice })
        }
      } else {
        toInsert.push(record)
      }
    }

    // Insert new items
    let insertedCount = 0
    for (let i = 0; i < toInsert.length; i += 100) {
      const batch = toInsert.slice(i, i + 100)
      const { data, error } = await supabase
        .from('supplier_catalog_items')
        .insert(batch)
        .select('id')
      if (error) {
        errors.push({ line: 0, message: `Erreur insertion: ${error.message}` })
      } else {
        insertedCount += data?.length || 0
      }
    }

    // Update existing items with new prices
    let updatedCount = 0
    for (const item of toUpdate) {
      const { error } = await supabase
        .from('supplier_catalog_items')
        .update({ price_ht: item.price_ht, last_updated: new Date().toISOString() })
        .eq('id', item.id)
      if (!error) updatedCount++
    }

    return NextResponse.json({
      imported: insertedCount,
      updated: updatedCount,
      priceChanges,
      errors,
    })
  } catch (error) {
    console.error('Import supplier catalog error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
