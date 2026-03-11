import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q')

    let query = supabase
      .from('supplier_catalog_items')
      .select('*')
      .eq('supplier_id', id)
      .eq('artisan_id', user.id)
      .order('category')
      .order('designation')

    if (search) {
      query = query.or(`designation.ilike.%${search}%,reference.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query.limit(200)
    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (error) {
    console.error('Get catalog error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { reference, designation, description, unit, price_ht, tva_rate, category } = body

    if (!designation || price_ht === undefined) {
      return NextResponse.json({ error: 'Désignation et prix requis' }, { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('supplier_catalog_items')
      .insert({
        supplier_id: id,
        artisan_id: user.id,
        reference: reference || null,
        designation,
        description: description || null,
        unit: unit || 'u',
        price_ht: Number(price_ht),
        tva_rate: Number(tva_rate ?? 20),
        category: category || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ item })
  } catch (error) {
    console.error('Create catalog item error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
