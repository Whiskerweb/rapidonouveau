import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { reason, partialLines } = body as {
      reason?: string
      partialLines?: Array<{ lineId: string; quantity: number }>
    }

    // Fetch original document
    const { data: originalDoc } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', documentId)
      .eq('artisan_id', user.id)
      .single()

    if (!originalDoc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    if (!['facture', 'acompte', 'situation'].includes(originalDoc.document_type)) {
      return NextResponse.json({ error: 'Les avoirs ne peuvent être créés que sur des factures' }, { status: 400 })
    }

    // Get next number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: 'avoir',
    })

    // Determine which lines to include
    const originalLines = originalDoc.billing_document_lines || []
    let avoirLines: Array<{
      sort_order: number
      designation: string
      description: string | null
      unit: string
      quantity: number
      unit_price_ht: number
      tva_rate: number
      section_title?: string | null
    }>

    if (partialLines && partialLines.length > 0) {
      // Partial avoir: only specified lines with specified quantities
      const partialMap = new Map(partialLines.map((pl) => [pl.lineId, pl.quantity]))
      avoirLines = originalLines
        .filter((l: { id: string; is_section_header?: boolean }) => partialMap.has(l.id) && !l.is_section_header)
        .map((l: {
          id: string
          sort_order: number
          designation: string
          description: string | null
          unit: string
          unit_price_ht: number
          tva_rate: number
          section_title?: string | null
        }) => ({
          sort_order: l.sort_order,
          designation: l.designation,
          description: l.description,
          unit: l.unit,
          quantity: -(partialMap.get(l.id) || 0),
          unit_price_ht: l.unit_price_ht,
          tva_rate: l.tva_rate,
          section_title: l.section_title,
        }))
    } else {
      // Full avoir: all lines negated
      avoirLines = originalLines
        .filter((l: { is_section_header?: boolean }) => !l.is_section_header)
        .map((l: {
          sort_order: number
          designation: string
          description: string | null
          unit: string
          quantity: number
          unit_price_ht: number
          tva_rate: number
          section_title?: string | null
        }) => ({
          sort_order: l.sort_order,
          designation: l.designation,
          description: l.description,
          unit: l.unit,
          quantity: -l.quantity,
          unit_price_ht: l.unit_price_ht,
          tva_rate: l.tva_rate,
          section_title: l.section_title,
        }))
    }

    // Calculate totals (negative)
    let totalHt = 0
    let totalTva = 0
    for (const line of avoirLines) {
      const lineHt = line.quantity * line.unit_price_ht
      totalHt += lineHt
      totalTva += Math.round(lineHt * line.tva_rate / 100 * 100) / 100
    }
    totalHt = Math.round(totalHt * 100) / 100
    totalTva = Math.round(totalTva * 100) / 100

    // Create avoir document
    const { data: avoir, error: avoirError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: 'avoir',
        document_number: numResult || `AV-${new Date().getFullYear()}-001`,
        avoir_reference_id: documentId,
        client_name: originalDoc.client_name,
        client_email: originalDoc.client_email,
        client_phone: originalDoc.client_phone,
        client_address: originalDoc.client_address,
        client_siret: originalDoc.client_siret,
        project_address: originalDoc.project_address,
        project_description: originalDoc.project_description,
        total_ht: totalHt,
        total_tva: totalTva,
        total_ttc: Math.round((totalHt + totalTva) * 100) / 100,
        payment_terms: originalDoc.payment_terms,
        notes: reason || `Avoir sur ${originalDoc.document_number}`,
        legal_mentions: originalDoc.legal_mentions,
      })
      .select()
      .single()

    if (avoirError) throw avoirError

    // Insert lines
    if (avoirLines.length > 0) {
      const lines = avoirLines.map((l) => ({
        document_id: avoir.id,
        ...l,
      }))
      await supabase.from('billing_document_lines').insert(lines)
    }

    return NextResponse.json({ avoir })
  } catch (error) {
    console.error('Create avoir error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
