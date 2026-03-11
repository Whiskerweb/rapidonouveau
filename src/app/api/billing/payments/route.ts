import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { documentId, amount, paymentDate, paymentMethod, reference, notes } = body

    if (!documentId || !amount) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Verify document ownership
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('id, total_ttc, status')
      .eq('id', documentId)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        document_id: documentId,
        amount: Number(amount),
        payment_date: paymentDate || new Date().toISOString().split('T')[0],
        payment_method: paymentMethod || null,
        reference: reference || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    // Get total payments for this document
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('document_id', documentId)

    const totalPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0)

    // Update document status based on payment
    let newStatus = doc.status
    if (totalPaid >= Number(doc.total_ttc)) {
      newStatus = 'paid'
    } else if (totalPaid > 0) {
      newStatus = 'partially_paid'
    }

    if (newStatus !== doc.status) {
      await supabase
        .from('billing_documents')
        .update({ status: newStatus })
        .eq('id', documentId)
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: 'documentId requis' }, { status: 400 })
    }

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('document_id', documentId)
      .order('payment_date', { ascending: false })

    return NextResponse.json({ payments: payments || [] })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
