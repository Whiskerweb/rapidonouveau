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

    // Fetch parent devis
    const { data: devis } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', devisId)
      .eq('artisan_id', user.id)
      .single()

    if (!devis) return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    if (devis.document_type !== 'devis') {
      return NextResponse.json({ error: 'La facture de solde ne peut être créée que depuis un devis' }, { status: 400 })
    }

    // Check no existing solde
    const { data: existingSolde } = await supabase
      .from('billing_documents')
      .select('id')
      .eq('parent_devis_id', devisId)
      .eq('document_type', 'facture')
      .eq('notes', `Facture de solde - Devis ${devis.document_number}`)
      .limit(1)

    if (existingSolde && existingSolde.length > 0) {
      return NextResponse.json({ error: 'Une facture de solde existe déjà pour ce devis' }, { status: 400 })
    }

    // Get all child documents (acomptes + situations) already invoiced
    const { data: childDocs } = await supabase
      .from('billing_documents')
      .select('id, document_type, document_number, total_ht, total_tva, total_ttc')
      .eq('parent_devis_id', devisId)
      .in('document_type', ['acompte', 'situation', 'facture'])
      .neq('status', 'cancelled')

    // Also get avoirs that reduce amounts
    const { data: avoirs } = await supabase
      .from('billing_documents')
      .select('total_ht, total_tva, total_ttc')
      .eq('document_type', 'avoir')
      .in('avoir_reference_id', (childDocs || []).map(d => d.id))
      .neq('status', 'cancelled')

    const totalAlreadyHt = (childDocs || []).reduce((s, d) => s + Number(d.total_ht), 0)
    const totalAlreadyTva = (childDocs || []).reduce((s, d) => s + Number(d.total_tva), 0)
    // Avoirs have negative amounts, so adding them reduces the total
    const avoirsHt = (avoirs || []).reduce((s, d) => s + Number(d.total_ht), 0)
    const avoirsTva = (avoirs || []).reduce((s, d) => s + Number(d.total_tva), 0)

    const cumulHt = totalAlreadyHt + avoirsHt
    const cumulTva = totalAlreadyTva + avoirsTva

    const soldeHt = Math.round((Number(devis.total_ht) - cumulHt) * 100) / 100
    const soldeTva = Math.round((Number(devis.total_tva) - cumulTva) * 100) / 100
    const soldeTtc = Math.round((soldeHt + soldeTva) * 100) / 100

    if (soldeHt <= 0) {
      return NextResponse.json({ error: 'Le solde est nul ou négatif. Tout a déjà été facturé.' }, { status: 400 })
    }

    // Get next number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: 'facture',
    })

    // Build recap notes
    const recapLines = (childDocs || []).map(d =>
      `${d.document_number} (${d.document_type}) : ${Number(d.total_ttc).toFixed(2)} EUR`
    ).join('\n')

    const notesText = [
      `Facture de solde - Devis ${devis.document_number}`,
      '',
      `Total du marché HT : ${Number(devis.total_ht).toFixed(2)} EUR`,
      recapLines ? `\nDéjà facturé :\n${recapLines}` : '',
      `\nSolde restant HT : ${soldeHt.toFixed(2)} EUR`,
    ].filter(Boolean).join('\n')

    // Create solde facture
    const { data: solde, error: soldeError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: 'facture',
        document_number: numResult || `FA-${new Date().getFullYear()}-001`,
        parent_devis_id: devisId,
        client_name: devis.client_name,
        client_email: devis.client_email,
        client_phone: devis.client_phone,
        client_address: devis.client_address,
        client_siret: devis.client_siret,
        project_address: devis.project_address,
        project_description: devis.project_description,
        total_ht: soldeHt,
        total_tva: soldeTva,
        total_ttc: soldeTtc,
        payment_terms: devis.payment_terms,
        payment_method: devis.payment_method,
        notes: notesText,
        legal_mentions: devis.legal_mentions,
        retenue_garantie_active: devis.retenue_garantie_active,
        retenue_garantie_pct: devis.retenue_garantie_pct,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single()

    if (soldeError) throw soldeError

    // Copy lines from devis with proportional amounts for solde
    const devisLines = (devis.billing_document_lines || [])
      .filter((l: { is_section_header?: boolean }) => !l.is_section_header)

    if (devisLines.length > 0) {
      const ratio = soldeHt / Number(devis.total_ht)
      const soldeLines = devisLines.map((l: {
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        section_title?: string | null
      }) => ({
        document_id: solde.id,
        sort_order: l.sort_order,
        designation: l.designation,
        description: l.description,
        unit: l.unit,
        quantity: Math.round(l.quantity * ratio * 100) / 100,
        unit_price_ht: l.unit_price_ht,
        tva_rate: l.tva_rate,
        section_title: l.section_title,
      }))

      await supabase.from('billing_document_lines').insert(soldeLines)
    }

    return NextResponse.json({ solde })
  } catch (error) {
    console.error('Create solde error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
