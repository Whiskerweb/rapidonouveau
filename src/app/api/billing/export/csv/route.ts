import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const type = searchParams.get('type')

    let query = supabase
      .from('billing_documents')
      .select('document_number, document_type, client_name, status, total_ht, total_tva, total_ttc, created_at, due_date')
      .eq('artisan_id', user.id)
      .order('created_at', { ascending: false })

    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to + 'T23:59:59')
    if (type) query = query.eq('document_type', type)

    const { data: docs, error } = await query
    if (error) throw error

    // Build CSV
    const typeLabels: Record<string, string> = { devis: 'Devis', facture: 'Facture', acompte: 'Acompte', situation: 'Situation', avoir: 'Avoir' }
    const statusLabels: Record<string, string> = {
      draft: 'Brouillon', sent: 'Envoyé', signed: 'Signé', accepted: 'Accepté',
      rejected: 'Refusé', paid: 'Payé', partially_paid: 'Part. payé', overdue: 'En retard', cancelled: 'Annulé',
    }

    const header = 'Numéro;Type;Client;Date;Échéance;Statut;Total HT;TVA;Total TTC'
    const rows = (docs || []).map((d) => {
      const date = new Date(d.created_at).toLocaleDateString('fr-FR')
      const due = d.due_date ? new Date(d.due_date).toLocaleDateString('fr-FR') : ''
      return [
        d.document_number,
        typeLabels[d.document_type] || d.document_type,
        `"${(d.client_name || '').replace(/"/g, '""')}"`,
        date,
        due,
        statusLabels[d.status] || d.status,
        Number(d.total_ht).toFixed(2).replace('.', ','),
        Number(d.total_tva).toFixed(2).replace('.', ','),
        Number(d.total_ttc).toFixed(2).replace('.', ','),
      ].join(';')
    })

    const csv = '\uFEFF' + [header, ...rows].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="export-facturation-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
