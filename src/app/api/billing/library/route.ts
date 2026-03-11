import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q')
    const category = searchParams.get('category')

    let query = supabase
      .from('work_items_library')
      .select('*')
      .eq('artisan_id', user.id)
      .order('category')
      .order('designation')

    if (search) {
      query = query.ilike('designation', `%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.limit(100)
    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (error) {
    console.error('Get library error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { designation, description, unit, unitPriceHt, tvaRate, category } = body

    if (!designation || unitPriceHt === undefined) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('work_items_library')
      .insert({
        artisan_id: user.id,
        designation,
        description: description || null,
        unit: unit || 'u',
        unit_price_ht: Number(unitPriceHt),
        tva_rate: Number(tvaRate ?? 20),
        category: category || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Create library item error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
