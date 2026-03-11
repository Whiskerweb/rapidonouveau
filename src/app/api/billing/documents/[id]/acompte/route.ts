import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: devisId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { percentage, fixedAmount } = body

    if (!percentage && !fixedAmount) {
      return NextResponse.json({ error: 'Pourcentage ou montant requis' }, { status: 400 })
    }

    // Fetch parent devis
    const { data: devis } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', devisId)
      .eq('artisan_id', user.id)
      .single()

    if (!devis) return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    if (devis.document_type !== 'devis') {
      return NextResponse.json({ error: 'Seuls les devis peuvent générer des acomptes' }, { status: 400 })
    }
    if (!['signed', 'accepted', 'sent'].includes(devis.status)) {
      return NextResponse.json({ error: 'Le devis doit être signé ou accepté' }, { status: 400 })
    }

    // Calculate acompte ratio
    const ratio = percentage
      ? Number(percentage) / 100
      : Number(fixedAmount) / Number(devis.total_ttc)

    // Get next number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: 'acompte',
    })

    // Create acompte document
    const { data: acompte, error: acompteError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: 'acompte',
        document_number: numResult || `FA-${new Date().getFullYear()}-001`,
        parent_devis_id: devisId,
        client_name: devis.client_name,
        client_email: devis.client_email,
        client_phone: devis.client_phone,
        client_address: devis.client_address,
        client_siret: devis.client_siret,
        project_address: devis.project_address,
        project_description: devis.project_description,
        total_ht: Math.round(Number(devis.total_ht) * ratio * 100) / 100,
        total_tva: Math.round(Number(devis.total_tva) * ratio * 100) / 100,
        total_ttc: Math.round(Number(devis.total_ttc) * ratio * 100) / 100,
        deposit_percentage: percentage ? Number(percentage) : null,
        payment_terms: devis.payment_terms,
        payment_method: devis.payment_method,
        notes: `Acompte de ${percentage ? percentage + '%' : formatAmount(fixedAmount)} sur devis ${devis.document_number}`,
        legal_mentions: devis.legal_mentions,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single()

    if (acompteError) throw acompteError

    // Copy lines with prorated amounts
    if (devis.billing_document_lines?.length > 0) {
      const lines = devis.billing_document_lines.map((line: {
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        section_title?: string | null
        is_section_header?: boolean
      }) => ({
        document_id: acompte.id,
        sort_order: line.sort_order,
        designation: line.designation,
        description: line.description,
        unit: line.unit,
        quantity: Math.round(line.quantity * ratio * 100) / 100,
        unit_price_ht: line.unit_price_ht,
        tva_rate: line.tva_rate,
        section_title: line.section_title,
        is_section_header: line.is_section_header,
      }))

      await supabase.from('billing_document_lines').insert(lines)
    }

    return NextResponse.json({ acompte })
  } catch (error) {
    console.error('Create acompte error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}
