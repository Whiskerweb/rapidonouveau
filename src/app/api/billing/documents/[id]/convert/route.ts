import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Convert devis to facture
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: devisId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Get the devis
    const { data: devis } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', devisId)
      .eq('artisan_id', user.id)
      .single()

    if (!devis) return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    if (devis.document_type !== 'devis') {
      return NextResponse.json({ error: 'Seuls les devis peuvent être convertis' }, { status: 400 })
    }

    // Get next facture number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: 'facture',
    })

    // Create facture
    const { data: facture, error: factureError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: 'facture',
        document_number: numResult || `F-${new Date().getFullYear()}-001`,
        parent_devis_id: devisId,
        client_name: devis.client_name,
        client_email: devis.client_email,
        client_phone: devis.client_phone,
        client_address: devis.client_address,
        client_siret: devis.client_siret,
        project_address: devis.project_address,
        project_description: devis.project_description,
        total_ht: devis.total_ht,
        total_tva: devis.total_tva,
        total_ttc: devis.total_ttc,
        payment_terms: devis.payment_terms,
        payment_method: devis.payment_method,
        notes: devis.notes,
        legal_mentions: devis.legal_mentions,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single()

    if (factureError) throw factureError

    // Copy lines
    if (devis.billing_document_lines && devis.billing_document_lines.length > 0) {
      const lines = devis.billing_document_lines.map((line: {
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        library_item_id: string | null
        cost_price: number | null
        margin_percentage: number | null
      }) => ({
        document_id: facture.id,
        sort_order: line.sort_order,
        designation: line.designation,
        description: line.description,
        unit: line.unit,
        quantity: line.quantity,
        unit_price_ht: line.unit_price_ht,
        tva_rate: line.tva_rate,
        library_item_id: line.library_item_id,
        cost_price: line.cost_price,
        margin_percentage: line.margin_percentage,
      }))

      await supabase.from('billing_document_lines').insert(lines)
    }

    // Update devis status
    await supabase
      .from('billing_documents')
      .update({ status: 'accepted' })
      .eq('id', devisId)

    return NextResponse.json({ facture })
  } catch (error) {
    console.error('Convert devis error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
