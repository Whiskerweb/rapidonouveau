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
    const { lineAdvancements } = body as { lineAdvancements: Record<string, number> }

    if (!lineAdvancements || Object.keys(lineAdvancements).length === 0) {
      return NextResponse.json({ error: 'Avancements requis' }, { status: 400 })
    }

    // Fetch parent devis with lines
    const { data: devis } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', devisId)
      .eq('artisan_id', user.id)
      .single()

    if (!devis) return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    if (devis.document_type !== 'devis') {
      return NextResponse.json({ error: 'Seuls les devis peuvent générer des situations' }, { status: 400 })
    }

    // Get previous situations for this devis to compute previous_pct per line
    const { data: prevSituations } = await supabase
      .from('billing_documents')
      .select('id')
      .eq('parent_devis_id', devisId)
      .eq('document_type', 'situation')
      .order('created_at', { ascending: true })

    // Get latest advancement for each line from previous situations
    const previousPctByLine: Record<string, number> = {}
    if (prevSituations && prevSituations.length > 0) {
      const prevIds = prevSituations.map((s) => s.id)
      const { data: prevLines } = await supabase
        .from('billing_document_lines')
        .select('designation, current_pct')
        .in('document_id', prevIds)

      if (prevLines) {
        for (const pl of prevLines) {
          const key = pl.designation
          const pct = Number(pl.current_pct) || 0
          if (!previousPctByLine[key] || pct > previousPctByLine[key]) {
            previousPctByLine[key] = pct
          }
        }
      }
    }

    // Get next number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: 'situation',
    })

    // Calculate totals for this situation
    let totalHt = 0
    let totalTva = 0

    const devisLines = devis.billing_document_lines || []
    const situationLines = devisLines
      .filter((l: { is_section_header?: boolean }) => !l.is_section_header)
      .map((line: {
        id: string
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        section_title?: string | null
      }) => {
        const currentPct = lineAdvancements[line.id] ?? 0
        const prevPct = previousPctByLine[line.designation] ?? 0
        const advancementDelta = Math.max(0, currentPct - prevPct) / 100

        const lineHt = line.quantity * line.unit_price_ht * advancementDelta
        const lineTva = Math.round(lineHt * line.tva_rate / 100 * 100) / 100
        totalHt += lineHt
        totalTva += lineTva

        return {
          sort_order: line.sort_order,
          designation: line.designation,
          description: line.description,
          unit: line.unit,
          quantity: line.quantity,
          unit_price_ht: line.unit_price_ht,
          tva_rate: line.tva_rate,
          section_title: line.section_title,
          previous_pct: prevPct,
          current_pct: currentPct,
        }
      })

    totalHt = Math.round(totalHt * 100) / 100
    totalTva = Math.round(totalTva * 100) / 100

    // Create situation document
    const { data: situation, error: sitError } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: 'situation',
        document_number: numResult || `FS-${new Date().getFullYear()}-001`,
        parent_devis_id: devisId,
        client_name: devis.client_name,
        client_email: devis.client_email,
        client_phone: devis.client_phone,
        client_address: devis.client_address,
        client_siret: devis.client_siret,
        project_address: devis.project_address,
        project_description: devis.project_description,
        total_ht: totalHt,
        total_tva: totalTva,
        total_ttc: Math.round((totalHt + totalTva) * 100) / 100,
        payment_terms: devis.payment_terms,
        payment_method: devis.payment_method,
        notes: `Situation d'avancement - Devis ${devis.document_number}`,
        legal_mentions: devis.legal_mentions,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      .select()
      .single()

    if (sitError) throw sitError

    // Insert lines
    if (situationLines.length > 0) {
      const lines = situationLines.map((l: {
        sort_order: number
        designation: string
        description: string | null
        unit: string
        quantity: number
        unit_price_ht: number
        tva_rate: number
        section_title?: string | null
        previous_pct: number
        current_pct: number
      }) => ({
        document_id: situation.id,
        ...l,
      }))

      await supabase.from('billing_document_lines').insert(lines)
    }

    return NextResponse.json({ situation })
  } catch (error) {
    console.error('Create situation error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
