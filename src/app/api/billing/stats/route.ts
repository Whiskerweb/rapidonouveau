import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Get all documents for this artisan
    const { data: docs } = await supabase
      .from('billing_documents')
      .select('id, document_type, document_number, client_name, status, total_ht, total_ttc, created_at, due_date')
      .eq('artisan_id', user.id)
      .order('created_at', { ascending: false })

    if (!docs) return NextResponse.json({ stats: null })

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Revenue this month (paid factures, acomptes, situations)
    const invoiceTypes = ['facture', 'acompte', 'situation']
    const paidThisMonth = docs.filter(d =>
      invoiceTypes.includes(d.document_type) &&
      d.status === 'paid' &&
      new Date(d.created_at) >= thisMonth
    )
    const revenueThisMonth = paidThisMonth.reduce((s, d) => s + Number(d.total_ttc), 0)

    // Revenue last month
    const paidLastMonth = docs.filter(d =>
      invoiceTypes.includes(d.document_type) &&
      d.status === 'paid' &&
      new Date(d.created_at) >= lastMonth &&
      new Date(d.created_at) <= lastMonthEnd
    )
    const revenueLastMonth = paidLastMonth.reduce((s, d) => s + Number(d.total_ttc), 0)

    const revenueChange = revenueLastMonth > 0
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 1000) / 10
      : 0

    // Pending (sent/partially_paid invoices)
    const pending = docs.filter(d =>
      invoiceTypes.includes(d.document_type) &&
      ['sent', 'partially_paid'].includes(d.status)
    )
    const pendingAmount = pending.reduce((s, d) => s + Number(d.total_ttc), 0)

    // Overdue
    const overdue = docs.filter(d =>
      invoiceTypes.includes(d.document_type) &&
      (d.status === 'overdue' || (
        ['sent', 'partially_paid'].includes(d.status) &&
        d.due_date && new Date(d.due_date) < now
      ))
    )
    const overdueAmount = overdue.reduce((s, d) => s + Number(d.total_ttc), 0)

    // Monthly revenue for last 12 months
    const monthlyRevenue: { month: string; amount: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthLabel = mStart.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      const amount = docs
        .filter(d =>
          invoiceTypes.includes(d.document_type) &&
          d.status === 'paid' &&
          new Date(d.created_at) >= mStart &&
          new Date(d.created_at) <= mEnd
        )
        .reduce((s, d) => s + Number(d.total_ttc), 0)
      monthlyRevenue.push({ month: monthLabel, amount })
    }

    // Actions required
    const actionRequired: {
      type: string
      documentId: string
      documentNumber: string
      clientName: string
      amount: number
      daysLate?: number
      daysSent?: number
    }[] = []

    for (const d of overdue.slice(0, 5)) {
      const daysLate = d.due_date
        ? Math.floor((now.getTime() - new Date(d.due_date).getTime()) / (1000 * 60 * 60 * 24))
        : 0
      actionRequired.push({
        type: 'overdue',
        documentId: d.id,
        documentNumber: d.document_number,
        clientName: d.client_name,
        amount: Number(d.total_ttc),
        daysLate,
      })
    }

    // Devis sent but not signed (waiting > 5 days)
    const pendingDevis = docs.filter(d =>
      d.document_type === 'devis' &&
      d.status === 'sent' &&
      (now.getTime() - new Date(d.created_at).getTime()) > 5 * 24 * 60 * 60 * 1000
    )
    for (const d of pendingDevis.slice(0, 3)) {
      const daysSent = Math.floor((now.getTime() - new Date(d.created_at).getTime()) / (1000 * 60 * 60 * 24))
      actionRequired.push({
        type: 'devis_no_response',
        documentId: d.id,
        documentNumber: d.document_number,
        clientName: d.client_name,
        amount: Number(d.total_ttc),
        daysSent,
      })
    }

    return NextResponse.json({
      stats: {
        revenue: { current: revenueThisMonth, previous: revenueLastMonth, change: revenueChange },
        pending: { amount: pendingAmount, count: pending.length },
        overdue: { amount: overdueAmount, count: overdue.length },
        monthlyRevenue,
        actionRequired,
        totalDocuments: docs.length,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
