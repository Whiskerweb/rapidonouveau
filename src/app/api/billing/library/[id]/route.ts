import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      'designation', 'description', 'unit', 'unit_price_ht', 'tva_rate',
      'category', 'cost_price', 'supplier_id', 'supplier_reference',
      'is_favorite', 'category_id', 'last_used_at', 'use_count',
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('work_items_library')
      .update(updates)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .select('*, supplier:suppliers(id, name), cat:library_categories(id, name, color)')
      .single()

    if (error) throw error
    return NextResponse.json({ item })
  } catch (error) {
    console.error('Update library item error:', error)
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
      .from('work_items_library')
      .delete()
      .eq('id', id)
      .eq('artisan_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete library item error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
