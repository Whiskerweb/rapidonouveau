import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data, error } = await supabase
      .from('suppliers')
      .select('*, catalog_count:supplier_catalog_items(count)')
      .eq('artisan_id', user.id)
      .order('name')

    if (error) throw error

    const suppliers = (data || []).map(s => ({
      ...s,
      catalog_count: s.catalog_count?.[0]?.count || 0,
    }))

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Get suppliers error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { name, contact_name, email, phone, website, notes } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nom du fournisseur requis' }, { status: 400 })
    }

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert({
        artisan_id: user.id,
        name: name.trim(),
        contact_name: contact_name || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Create supplier error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
