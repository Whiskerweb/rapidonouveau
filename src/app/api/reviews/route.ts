import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { proposalId, reviewedId, rating, comment } = await request.json()

    if (!proposalId || !reviewedId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        matching_proposal_id: proposalId,
        reviewer_id: user.id,
        reviewed_id: reviewedId,
        rating,
        comment: comment || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Vous avez déjà laissé un avis' }, { status: 400 })
      }
      throw error
    }

    // Update artisan rating if reviewed is an artisan
    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('user_id, rating, total_reviews')
      .eq('user_id', reviewedId)
      .single()

    if (artisanProfile) {
      const currentRating = artisanProfile.rating || 0
      const currentReviews = artisanProfile.total_reviews || 0
      const newRating = ((currentRating * currentReviews) + rating) / (currentReviews + 1)

      await supabase
        .from('artisan_profiles')
        .update({
          rating: Math.round(newRating * 100) / 100,
          total_reviews: currentReviews + 1,
        })
        .eq('user_id', reviewedId)
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewed_id', userId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })

    return NextResponse.json({ reviews: reviews || [] })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
