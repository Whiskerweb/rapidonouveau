import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Vérifier le rôle admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { id: estimationId } = await params
  const body = await request.json()
  const { storagePath, filename, fileSize, documentType } = body

  const adminClient = createAdminClient()

  // Vérifier que l'estimation existe
  const { data: estimation } = await adminClient
    .from('estimations')
    .select('id, user_id')
    .eq('id', estimationId)
    .single()

  if (!estimation) {
    return NextResponse.json({ error: 'Estimation non trouvée' }, { status: 404 })
  }

  // Créer le document
  const { data: doc, error: docError } = await adminClient
    .from('estimation_documents')
    .insert({
      estimation_id: estimationId,
      uploaded_by: user.id,
      document_type: documentType || 'estimation_pdf',
      storage_path: storagePath,
      filename,
      file_size: fileSize,
      is_visible_to_user: true,
      notified_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 })
  }

  // Mettre à jour le statut de l'estimation si pas déjà livré
  await adminClient
    .from('estimations')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
    })
    .eq('id', estimationId)

  // Créer une notification pour l'utilisateur
  await adminClient.from('notifications').insert({
    user_id: estimation.user_id,
    type: 'document_ready',
    title: 'Votre estimation est prête !',
    body: 'Un nouveau document a été ajouté à votre estimation. Consultez-le dès maintenant.',
    data: {
      estimation_id: estimationId,
      document_id: doc.id,
      filename,
    },
  })

  // Logger l'action
  await adminClient.from('admin_activity_log').insert({
    admin_id: user.id,
    action: 'estimation.document_uploaded',
    entity_type: 'estimation',
    entity_id: estimationId,
    details: { document_id: doc.id, filename },
  })

  return NextResponse.json({ success: true, documentId: doc.id })
}
