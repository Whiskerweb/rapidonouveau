import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) return null
  return user
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const supabase = await createClient()

  const { data: estimation, error } = await supabase
    .from('estimations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !estimation) {
    return NextResponse.json({ error: 'Estimation non trouvée' }, { status: 404 })
  }

  return NextResponse.json(estimation)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const adminClient = createAdminClient()

  const updateData: Record<string, unknown> = {}

  if (body.status) {
    updateData.status = body.status
    if (body.status === 'delivered') {
      updateData.delivered_at = new Date().toISOString()
    }
  }

  if (body.assigned_admin_id !== undefined) {
    updateData.assigned_admin_id = body.assigned_admin_id
  }

  if (body.final_estimation !== undefined) {
    updateData.final_estimation = body.final_estimation
    updateData.reviewed_by = admin.id
  }

  const { error } = await adminClient
    .from('estimations')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log l'action
  await adminClient.from('admin_activity_log').insert({
    admin_id: admin.id,
    action: 'estimation.status_changed',
    entity_type: 'estimation',
    entity_id: id,
    details: updateData,
  })

  return NextResponse.json({ success: true })
}
