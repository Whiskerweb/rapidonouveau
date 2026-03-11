import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Get the proposal and its matching request
    const { data: proposal } = await supabase
      .from('matching_proposals')
      .select(`
        *,
        matching_requests (id, user_id, estimation_id)
      `)
      .eq('id', proposalId)
      .single()

    if (!proposal) {
      return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 })
    }

    const matchingRequest = proposal.matching_requests as { id: string; user_id: string; estimation_id: string }

    // Verify the user owns the matching request
    if (matchingRequest.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Accept the proposal
    const { error: updateError } = await supabase
      .from('matching_proposals')
      .update({ user_accepted: true, status: 'accepted' })
      .eq('id', proposalId)

    if (updateError) throw updateError

    // Update matching request status
    await supabase
      .from('matching_requests')
      .update({ status: 'matched', matched_at: new Date().toISOString() })
      .eq('id', matchingRequest.id)

    // Decline other proposals
    await supabase
      .from('matching_proposals')
      .update({ status: 'declined' })
      .eq('matching_request_id', matchingRequest.id)
      .neq('id', proposalId)
      .eq('status', 'pending')

    // Get artisan info for notification
    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('company_name')
      .eq('user_id', proposal.artisan_id)
      .single()

    // Notify artisan that they were accepted
    await supabase.from('notifications').insert({
      user_id: proposal.artisan_id,
      type: 'matching_accepted',
      title: 'Proposition acceptée !',
      body: 'Votre proposition a été acceptée. Les coordonnées du client vous sont maintenant disponibles.',
      data: { matching_request_id: matchingRequest.id, estimation_id: matchingRequest.estimation_id },
    })

    // Notify user with artisan contact info
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'matching_confirmed',
      title: 'Mise en relation confirmée',
      body: `Vous êtes maintenant en contact avec ${artisanProfile?.company_name || 'l\'artisan'}.`,
      data: { matching_request_id: matchingRequest.id, artisan_id: proposal.artisan_id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Accept proposal error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
