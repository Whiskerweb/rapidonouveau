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
    const categoryId = searchParams.get('category_id')
    const supplierId = searchParams.get('supplier_id')
    const favorite = searchParams.get('favorite')
    const sort = searchParams.get('sort') || 'name'

    let query = supabase
      .from('work_items_library')
      .select('*, supplier:suppliers(id, name), cat:library_categories(id, name, color)')
      .eq('artisan_id', user.id)

    if (search) {
      query = query.or(`designation.ilike.%${search}%,description.ilike.%${search}%,supplier_reference.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (supplierId) {
      query = query.eq('supplier_id', supplierId)
    }
    if (favorite === 'true') {
      query = query.eq('is_favorite', true)
    }

    switch (sort) {
      case 'recent':
        query = query.order('last_used_at', { ascending: false, nullsFirst: false })
        break
      case 'popular':
        query = query.order('use_count', { ascending: false })
        break
      case 'price':
        query = query.order('unit_price_ht', { ascending: true })
        break
      default:
        query = query.order('category').order('designation')
    }

    const { data, error } = await query.limit(200)
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
    const { designation, description, unit, unitPriceHt, tvaRate, category, costPrice, supplierId, supplierReference, isFavorite, categoryId } = body

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
        cost_price: costPrice != null ? Number(costPrice) : null,
        supplier_id: supplierId || null,
        supplier_reference: supplierReference || null,
        is_favorite: isFavorite || false,
        category_id: categoryId || null,
      })
      .select('*, supplier:suppliers(id, name), cat:library_categories(id, name, color)')
      .single()

    if (error) throw error

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Create library item error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
