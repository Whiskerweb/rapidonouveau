import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { estimationId, notes, maxDistanceKm } = body

    // Verify estimation belongs to user and is delivered
    const { data: estimation } = await supabase
      .from('estimations')
      .select('id, status, user_id, city, postal_code')
      .eq('id', estimationId)
      .single()

    if (!estimation || estimation.user_id !== user.id) {
      return NextResponse.json({ error: 'Estimation non trouvée' }, { status: 404 })
    }

    if (estimation.status !== 'delivered' && estimation.status !== 'validated') {
      return NextResponse.json({ error: 'L\'estimation doit être livrée avant de demander un artisan' }, { status: 400 })
    }

    // Check if request already exists
    const { data: existing } = await supabase
      .from('matching_requests')
      .select('id')
      .eq('estimation_id', estimationId)
      .eq('status', 'open')
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Une demande est déjà en cours pour cette estimation' }, { status: 400 })
    }

    // Get work categories from estimation items
    const { data: items } = await supabase
      .from('estimation_items')
      .select('category')
      .eq('estimation_id', estimationId)

    const requiredTrades = items?.map(i => i.category).filter(Boolean) || []

    // Get user profile for location
    const { data: profile } = await supabase
      .from('profiles')
      .select('address_lat, address_lng')
      .eq('id', user.id)
      .single()

    const { data: matchingRequest, error } = await supabase
      .from('matching_requests')
      .insert({
        estimation_id: estimationId,
        user_id: user.id,
        required_trades: requiredTrades,
        latitude: profile?.address_lat || null,
        longitude: profile?.address_lng || null,
        max_distance_km: maxDistanceKm || 50,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ matchingRequest })
  } catch (error) {
    console.error('Matching request error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data: requests } = await supabase
      .from('matching_requests')
      .select(`
        *,
        estimations (id, project_type, city, status),
        matching_proposals (
          id, artisan_id, status, artisan_message, estimated_start_date, estimated_price, score, user_accepted,
          artisan_profiles (user_id, company_name, main_trade, rating, total_reviews)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ requests: requests || [] })
  } catch (error) {
    console.error('Get matching requests error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
