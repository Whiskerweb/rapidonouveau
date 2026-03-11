import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data: doc, error } = await supabase
      .from('billing_documents')
      .select(`
        *,
        billing_document_lines (*)
      `)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (error || !doc) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    // Sort lines by sort_order
    if (doc.billing_document_lines) {
      doc.billing_document_lines.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    }

    return NextResponse.json({ document: doc })
  } catch (error) {
    console.error('Get billing document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const allowedFields = [
      'client_name', 'client_email', 'client_phone', 'client_address', 'client_siret',
      'status', 'project_address', 'project_description', 'notes', 'payment_terms',
      'payment_method', 'validity_date', 'due_date', 'deposit_percentage',
      'total_ht', 'total_tva', 'total_ttc', 'legal_mentions',
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field]
    }

    const { data: doc, error } = await supabase
      .from('billing_documents')
      .update(updates)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ document: doc })
  } catch (error) {
    console.error('Update billing document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Only allow deleting drafts
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('status')
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    if (doc.status !== 'draft') return NextResponse.json({ error: 'Seuls les brouillons peuvent être supprimés' }, { status: 400 })

    const { error } = await supabase
      .from('billing_documents')
      .delete()
      .eq('id', id)
      .eq('artisan_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete billing document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
