import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const allowedFields = ['name', 'contact_name', 'email', 'phone', 'website', 'notes']
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field] || null
      }
    }
    if (body.name) updates.name = body.name.trim()

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Update supplier error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await params

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('artisan_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete supplier error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
