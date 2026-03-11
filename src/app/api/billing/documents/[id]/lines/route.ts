import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateDocumentTotals } from '@/lib/billing-utils'

async function recalculateTotals(supabase: Awaited<ReturnType<typeof createClient>>, documentId: string) {
  const { data: lines } = await supabase
    .from('billing_document_lines')
    .select('quantity, unit_price_ht, tva_rate, is_section_header')
    .eq('document_id', documentId)

  if (lines) {
    const totals = calculateDocumentTotals(lines.filter((l) => !l.is_section_header))
    await supabase
      .from('billing_documents')
      .update({
        total_ht: totals.total_ht,
        total_tva: totals.total_tva,
        total_ttc: totals.total_ttc,
      })
      .eq('id', documentId)
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Verify ownership
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('id')
      .eq('id', documentId)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })

    const body = await request.json()
    const { designation, description, unit, quantity, unitPriceHt, tvaRate, libraryItemId, sectionTitle, isSectionHeader } = body

    if (!isSectionHeader && (!designation || !quantity || !unitPriceHt)) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Get next sort_order
    const { data: lastLine } = await supabase
      .from('billing_document_lines')
      .select('sort_order')
      .eq('document_id', documentId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (lastLine?.sort_order || 0) + 1

    const { data: line, error } = await supabase
      .from('billing_document_lines')
      .insert({
        document_id: documentId,
        sort_order: sortOrder,
        designation,
        description: description || null,
        unit: unit || 'u',
        quantity: Number(quantity),
        unit_price_ht: Number(unitPriceHt),
        tva_rate: Number(tvaRate ?? 20),
        library_item_id: libraryItemId || null,
        section_title: sectionTitle || null,
        is_section_header: isSectionHeader || false,
      })
      .select()
      .single()

    if (error) throw error

    await recalculateTotals(supabase, documentId)

    return NextResponse.json({ line })
  } catch (error) {
    console.error('Add line error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const lineId = searchParams.get('lineId')
    if (!lineId) return NextResponse.json({ error: 'lineId requis' }, { status: 400 })

    // Verify ownership via document
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('id')
      .eq('id', documentId)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })

    const { error } = await supabase
      .from('billing_document_lines')
      .delete()
      .eq('id', lineId)
      .eq('document_id', documentId)

    if (error) throw error

    await recalculateTotals(supabase, documentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete line error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
