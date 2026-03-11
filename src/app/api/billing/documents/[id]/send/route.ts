import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createDocumentPDF } from '@/components/billing/document-pdf'
import { sendDocumentEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Fetch document with lines
    const { data: doc } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    if (!doc.client_email) {
      return NextResponse.json({ error: 'Email client requis' }, { status: 400 })
    }

    // Sort lines
    if (doc.billing_document_lines) {
      doc.billing_document_lines.sort(
        (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
      )
    }

    // Fetch artisan profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, first_name, last_name, email, phone')
      .eq('id', user.id)
      .single()

    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('company_name, siret, insurance_decennale_name, insurance_decennale_number, logo_url, primary_color, bank_iban, bank_bic')
      .eq('user_id', user.id)
      .single()

    const artisan = {
      company_name: artisanProfile?.company_name || profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
      siret: artisanProfile?.siret || undefined,
      email: profile?.email || undefined,
      phone: profile?.phone || undefined,
      insurance_decennale_name: artisanProfile?.insurance_decennale_name || undefined,
      insurance_decennale_number: artisanProfile?.insurance_decennale_number || undefined,
      logo_url: artisanProfile?.logo_url || undefined,
      primary_color: artisanProfile?.primary_color || undefined,
      bank_iban: artisanProfile?.bank_iban || undefined,
      bank_bic: artisanProfile?.bank_bic || undefined,
    }

    // Generate PDF
    const pdfElement = createDocumentPDF({ document: doc, artisan })
    const pdfBuffer = await renderToBuffer(pdfElement)

    // Build sign URL for devis
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const signUrl = doc.document_type === 'devis' && doc.sign_token
      ? `${appUrl}/signer/${doc.sign_token}`
      : undefined

    // Send email
    const result = await sendDocumentEmail(
      doc.client_email,
      doc.client_name || 'Client',
      doc.document_type,
      doc.document_number,
      Number(doc.total_ttc),
      Buffer.from(pdfBuffer),
      signUrl
    )

    if (!result.success) {
      return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
    }

    // Update status to 'sent' if draft
    if (doc.status === 'draft') {
      await supabase
        .from('billing_documents')
        .update({ status: 'sent' })
        .eq('id', id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
