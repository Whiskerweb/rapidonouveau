import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeMatchingScore } from '@/lib/matching-algorithm'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { matchingRequestId, message, estimatedStartDate, estimatedPrice } = body

    // Verify user is an artisan
    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!artisanProfile) {
      return NextResponse.json({ error: 'Vous devez être artisan pour proposer' }, { status: 403 })
    }

    // Get matching request
    const { data: matchingRequest } = await supabase
      .from('matching_requests')
      .select('*')
      .eq('id', matchingRequestId)
      .eq('status', 'open')
      .single()

    if (!matchingRequest) {
      return NextResponse.json({ error: 'Demande non trouvée ou fermée' }, { status: 404 })
    }

    // Get artisan profile data for scoring
    const { data: profile } = await supabase
      .from('profiles')
      .select('address_lat, address_lng, full_name, email, phone')
      .eq('id', user.id)
      .single()

    // Compute score
    const score = computeMatchingScore(
      {
        user_id: user.id,
        main_trade: artisanProfile.main_trade,
        specializations: artisanProfile.specializations,
        intervention_radius_km: artisanProfile.intervention_radius_km,
        rating: artisanProfile.rating,
        total_reviews: artisanProfile.total_reviews,
        is_available: artisanProfile.is_available,
        hourly_rate: artisanProfile.hourly_rate,
        address_lat: profile?.address_lat || null,
        address_lng: profile?.address_lng || null,
        company_name: artisanProfile.company_name,
        full_name: profile?.full_name || null,
        email: profile?.email || null,
        phone: profile?.phone || null,
      },
      {
        required_trades: matchingRequest.required_trades || [],
        latitude: matchingRequest.latitude,
        longitude: matchingRequest.longitude,
        max_distance_km: matchingRequest.max_distance_km || 50,
      }
    )

    const { data: proposal, error } = await supabase
      .from('matching_proposals')
      .insert({
        matching_request_id: matchingRequestId,
        artisan_id: user.id,
        artisan_message: message || null,
        estimated_start_date: estimatedStartDate || null,
        estimated_price: estimatedPrice || null,
        score,
        artisan_accepted: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Vous avez déjà proposé pour cette demande' }, { status: 400 })
      }
      throw error
    }

    // Notify the requester
    await supabase.from('notifications').insert({
      user_id: matchingRequest.user_id,
      type: 'matching_proposal',
      title: 'Nouvelle proposition d\'artisan',
      body: `${artisanProfile.company_name || 'Un artisan'} a proposé ses services pour votre projet.`,
      data: { matching_request_id: matchingRequestId, proposal_id: proposal.id },
    })

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Create proposal error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    const forArtisan = searchParams.get('forArtisan') === 'true'

    if (forArtisan) {
      // Get proposals for this artisan
      const { data: proposals } = await supabase
        .from('matching_proposals')
        .select(`
          *,
          matching_requests (
            id, required_trades, notes, status, created_at,
            estimations (id, project_type, city, surface_m2)
          )
        `)
        .eq('artisan_id', user.id)
        .order('created_at', { ascending: false })

      return NextResponse.json({ proposals: proposals || [] })
    }

    if (requestId) {
      // Get proposals for a specific request
      const { data: proposals } = await supabase
        .from('matching_proposals')
        .select(`
          *,
          artisan_profiles (user_id, company_name, main_trade, specializations, rating, total_reviews, certifications)
        `)
        .eq('matching_request_id', requestId)
        .order('score', { ascending: false })

      return NextResponse.json({ proposals: proposals || [] })
    }

    return NextResponse.json({ proposals: [] })
  } catch (error) {
    console.error('Get proposals error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
