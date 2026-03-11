import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Fetch original document with lines
    const { data: original } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (!original) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })

    // Get next number for same type
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: original.document_type,
    })

    // Create duplicate
    const { data: duplicate, error: dupError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: original.document_type,
        document_number: numResult || original.document_number + '-COPIE',
        status: 'draft',
        client_name: original.client_name,
        client_email: original.client_email,
        client_phone: original.client_phone,
        client_address: original.client_address,
        client_siret: original.client_siret,
        project_address: original.project_address,
        project_description: original.project_description,
        total_ht: original.total_ht,
        total_tva: original.total_tva,
        total_ttc: original.total_ttc,
        deposit_percentage: original.deposit_percentage,
        payment_terms: original.payment_terms,
        payment_method: original.payment_method,
        notes: original.notes,
        legal_mentions: original.legal_mentions,
        validity_date: original.validity_date,
        retenue_garantie_active: original.retenue_garantie_active,
        retenue_garantie_pct: original.retenue_garantie_pct,
      })
      .select()
      .single()

    if (dupError) throw dupError

    // Copy lines
    const lines = original.billing_document_lines || []
    if (lines.length > 0) {
      const newLines = lines.map((l: {
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        section_title: string | null
        is_section_header: boolean
        library_item_id: string | null
      }) => ({
        document_id: duplicate.id,
        sort_order: l.sort_order,
        designation: l.designation,
        description: l.description,
        unit: l.unit,
        quantity: l.quantity,
        unit_price_ht: l.unit_price_ht,
        tva_rate: l.tva_rate,
        section_title: l.section_title,
        is_section_header: l.is_section_header,
        library_item_id: l.library_item_id,
      }))

      await supabase.from('billing_document_lines').insert(newLines)
    }

    return NextResponse.json({ duplicate })
  } catch (error) {
    console.error('Duplicate document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
