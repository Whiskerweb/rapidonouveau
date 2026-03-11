import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createDocumentPDF } from '@/components/billing/document-pdf'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

    // Fetch document with lines
    const { data: doc, error: docError } = await supabase
      .from('billing_documents')
      .select(`
        *,
        billing_document_lines (*)
      `)
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Document non trouve' }, { status: 404 })
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

    // Render PDF
    const pdfElement = createDocumentPDF({ document: doc, artisan })
    const buffer = await renderToBuffer(pdfElement)

    const filename = `${doc.document_number || 'document'}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Erreur generation PDF' }, { status: 500 })
  }
}
