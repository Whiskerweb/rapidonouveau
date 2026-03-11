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

    const { data: client } = await supabase
      .from('billing_clients')
      .select('*')
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (!client) return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })

    // Get associated documents
    const { data: documents } = await supabase
      .from('billing_documents')
      .select('id, document_type, document_number, status, total_ttc, created_at')
      .eq('artisan_id', user.id)
      .eq('client_name', client.name)
      .order('created_at', { ascending: false })

    return NextResponse.json({ client, documents: documents || [] })
  } catch (error) {
    console.error('Get client error:', error)
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
    const updates: Record<string, unknown> = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.email !== undefined) updates.email = body.email || null
    if (body.phone !== undefined) updates.phone = body.phone || null
    if (body.address !== undefined) updates.address = body.address || null
    if (body.siret !== undefined) updates.siret = body.siret || null
    if (body.clientType !== undefined) updates.client_type = body.clientType
    if (body.notes !== undefined) updates.notes = body.notes || null

    const { data: client, error } = await supabase
      .from('billing_clients')
      .update(updates)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ client })
  } catch (error) {
    console.error('Update client error:', error)
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

    const { error } = await supabase
      .from('billing_clients')
      .delete()
      .eq('id', id)
      .eq('artisan_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
