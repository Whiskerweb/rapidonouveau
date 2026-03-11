import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    let query = supabase
      .from('billing_clients')
      .select('*')
      .eq('artisan_id', user.id)
      .order('name', { ascending: true })

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,address.ilike.%${q}%`)
    }

    const { data: clients, error } = await query
    if (error) throw error

    return NextResponse.json({ clients: clients || [] })
  } catch (error) {
    console.error('Clients error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { name, email, phone, address, siret, clientType, notes } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const { data: client, error } = await supabase
      .from('billing_clients')
      .insert({
        artisan_id: user.id,
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        address: address || null,
        siret: siret || null,
        client_type: clientType || 'particulier',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ client })
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
