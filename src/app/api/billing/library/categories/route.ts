import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data, error } = await supabase
      .from('library_categories')
      .select('*')
      .eq('artisan_id', user.id)
      .order('sort_order')
      .order('name')

    if (error) throw error
    return NextResponse.json({ categories: data || [] })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { name, color } = await request.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    const { data: category, error } = await supabase
      .from('library_categories')
      .insert({ artisan_id: user.id, name: name.trim(), color: color || '#6366f1' })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 409 })
      }
      throw error
    }
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id, name, color, sort_order } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name.trim()
    if (color !== undefined) updates.color = color
    if (sort_order !== undefined) updates.sort_order = sort_order

    const { data: category, error } = await supabase
      .from('library_categories')
      .update(updates)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    // Detach items from category first
    await supabase
      .from('work_items_library')
      .update({ category_id: null })
      .eq('category_id', id)
      .eq('artisan_id', user.id)

    const { error } = await supabase
      .from('library_categories')
      .delete()
      .eq('id', id)
      .eq('artisan_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
