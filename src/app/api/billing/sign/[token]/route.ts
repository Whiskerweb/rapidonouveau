import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS for public signature access
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = getAdminClient()

    const { data: doc } = await supabase
      .from('billing_documents')
      .select('id, document_type, document_number, client_name, client_email, project_description, total_ht, total_tva, total_ttc, status, billing_document_lines(sort_order, designation, description, unit, quantity, unit_price_ht, tva_rate, section_title, is_section_header)')
      .eq('sign_token', token)
      .single()

    if (!doc) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    if (doc.status !== 'sent') {
      return NextResponse.json({ error: 'Ce document ne peut plus être signé', status: doc.status }, { status: 400 })
    }

    // Sort lines
    const lines = (doc.billing_document_lines || []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    )

    return NextResponse.json({
      document: {
        id: doc.id,
        document_type: doc.document_type,
        document_number: doc.document_number,
        client_name: doc.client_name,
        project_description: doc.project_description,
        total_ht: doc.total_ht,
        total_tva: doc.total_tva,
        total_ttc: doc.total_ttc,
        status: doc.status,
        lines,
      },
    })
  } catch (error) {
    console.error('Sign GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = getAdminClient()
    const body = await request.json()
    const { signatureData } = body as { signatureData: string }

    if (!signatureData) {
      return NextResponse.json({ error: 'Signature requise' }, { status: 400 })
    }

    // Verify document exists and is in 'sent' status
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('id, status')
      .eq('sign_token', token)
      .single()

    if (!doc) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    if (doc.status !== 'sent') {
      return NextResponse.json({ error: 'Ce document a déjà été signé ou n\'est plus disponible' }, { status: 400 })
    }

    // Get signer IP
    const forwarded = request.headers.get('x-forwarded-for')
    const signerIp = forwarded?.split(',')[0]?.trim() || 'unknown'

    // Update document
    const { error: updateError } = await supabase
      .from('billing_documents')
      .update({
        status: 'signed',
        signature_data: signatureData,
        signed_at: new Date().toISOString(),
        signer_ip: signerIp,
      })
      .eq('id', doc.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
