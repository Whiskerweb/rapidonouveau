import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  // Detect delimiter (French CSVs often use ;)
  const firstLine = text.split('\n')[0] || ''
  const delimiter = firstLine.includes(';') ? ';' : ','

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return { headers: [], rows: [] }

  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows = lines.slice(1).map(line => {
    // Simple CSV parsing (handles quoted fields)
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

// Map French header names to our fields
function mapHeader(header: string): string | null {
  const h = header.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u')
  if (['designation', 'nom', 'produit', 'libelle', 'article'].includes(h)) return 'designation'
  if (['description', 'detail', 'details'].includes(h)) return 'description'
  if (['unite', 'unit', 'u'].includes(h)) return 'unit'
  if (['prix_ht', 'prix ht', 'prix', 'pu_ht', 'pu ht', 'prix_vente', 'prix vente', 'tarif'].includes(h)) return 'unit_price_ht'
  if (['tva', 'tva_rate', 'taux_tva', 'taux tva', 'tva%'].includes(h)) return 'tva_rate'
  if (['categorie', 'category', 'famille', 'groupe'].includes(h)) return 'category'
  if (['prix_achat', 'prix achat', 'cout', 'cost', 'pa_ht', 'pa ht', 'debourse'].includes(h)) return 'cost_price'
  if (['reference', 'ref', 'ref_fournisseur', 'sku', 'code'].includes(h)) return 'supplier_reference'
  return null
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const supplierId = formData.get('supplier_id') as string | null
    const categoryId = formData.get('category_id') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })
    }

    const text = await file.text()
    const { headers, rows } = parseCSV(text)

    if (headers.length === 0) {
      return NextResponse.json({ error: 'Fichier vide ou format invalide' }, { status: 400 })
    }

    // Map headers to fields
    const fieldMap: Record<number, string> = {}
    headers.forEach((h, i) => {
      const mapped = mapHeader(h)
      if (mapped) fieldMap[i] = mapped
    })

    if (!Object.values(fieldMap).includes('designation')) {
      return NextResponse.json({
        error: 'Colonne "designation" (ou "nom", "produit", "libellé") introuvable',
        headers,
      }, { status: 400 })
    }

    const imported: unknown[] = []
    const errors: { line: number; message: string }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const record: Record<string, unknown> = {
        artisan_id: user.id,
        unit: 'u',
        tva_rate: 20,
      }

      for (const [colIdx, field] of Object.entries(fieldMap)) {
        const val = row[Number(colIdx)]?.replace(/['"]/g, '') || ''
        if (!val) continue

        if (['unit_price_ht', 'tva_rate', 'cost_price'].includes(field)) {
          // Handle French number format (comma as decimal)
          const num = Number(val.replace(',', '.').replace(/\s/g, ''))
          if (isNaN(num)) {
            errors.push({ line: i + 2, message: `Valeur numérique invalide pour ${field}: "${val}"` })
            continue
          }
          record[field] = num
        } else {
          record[field] = val
        }
      }

      if (!record.designation) {
        errors.push({ line: i + 2, message: 'Désignation manquante' })
        continue
      }

      if (!record.unit_price_ht) {
        record.unit_price_ht = 0
      }

      if (supplierId) record.supplier_id = supplierId
      if (categoryId) record.category_id = categoryId

      imported.push(record)
    }

    if (imported.length === 0) {
      return NextResponse.json({ imported: 0, errors })
    }

    // Batch insert (max 100 at a time)
    let insertedCount = 0
    for (let i = 0; i < imported.length; i += 100) {
      const batch = imported.slice(i, i + 100)
      const { data, error } = await supabase
        .from('work_items_library')
        .insert(batch)
        .select('id')

      if (error) {
        errors.push({ line: 0, message: `Erreur d'insertion batch: ${error.message}` })
      } else {
        insertedCount += data?.length || 0
      }
    }

    return NextResponse.json({ imported: insertedCount, total: rows.length, errors })
  } catch (error) {
    console.error('Import library error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
