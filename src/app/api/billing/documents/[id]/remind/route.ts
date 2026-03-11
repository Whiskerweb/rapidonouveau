import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendDocumentEmail } from '@/lib/email'
import { renderToBuffer } from '@react-pdf/renderer'
import { createDocumentPDF } from '@/components/billing/document-pdf'

function getReminderTemplate(level: number, docNumber: string, amount: string, dueDate: string): { subject: string, intro: string } {
  if (level <= 1) {
    return {
      subject: `Rappel - Facture ${docNumber}`,
      intro: `Nous nous permettons de vous rappeler que la facture ${docNumber} d'un montant de ${amount} arrivée à échéance le ${dueDate} reste impayée à ce jour. Nous vous remercions de bien vouloir procéder à son règlement dans les meilleurs délais.`,
    }
  }
  if (level === 2) {
    return {
      subject: `Relance - Facture ${docNumber} impayée`,
      intro: `Malgré notre précédent rappel, nous constatons que la facture ${docNumber} d'un montant de ${amount}, échue le ${dueDate}, n'a toujours pas été réglée. Conformément aux conditions générales, des pénalités de retard de 3 fois le taux d'intérêt légal ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement sont désormais applicables.`,
    }
  }
  return {
    subject: `Mise en demeure - Facture ${docNumber}`,
    intro: `La présente constitue une mise en demeure formelle de procéder au règlement de la facture ${docNumber} d'un montant de ${amount}, exigible depuis le ${dueDate}. À défaut de règlement sous 8 jours, nous nous réserverons le droit d'engager toute procédure de recouvrement.`,
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { data: doc } = await supabase
      .from('billing_documents')
      .select('*, billing_document_lines(*)')
      .eq('id', id)
      .eq('artisan_id', user.id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    if (!doc.client_email) return NextResponse.json({ error: 'Email client requis' }, { status: 400 })
    if (!['sent', 'overdue', 'partially_paid'].includes(doc.status)) {
      return NextResponse.json({ error: 'Ce document ne nécessite pas de relance' }, { status: 400 })
    }

    // Determine reminder level from previous reminders
    const { count } = await supabase
      .from('payment_reminders')
      .select('*', { count: 'exact', head: true })
      .eq('document_id', id)

    const level = Math.min((count || 0) + 1, 3)

    const amount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(doc.total_ttc))
    const dueDate = doc.due_date
      ? new Date(doc.due_date).toLocaleDateString('fr-FR')
      : 'N/A'

    const { subject, intro } = getReminderTemplate(level, doc.document_number, amount, dueDate)

    // Sort lines for PDF
    if (doc.billing_document_lines) {
      doc.billing_document_lines.sort(
        (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
      )
    }

    // Fetch artisan profile for PDF
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
      company_name: artisanProfile?.company_name || profile?.full_name || '',
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

    const pdfElement = createDocumentPDF({ document: doc, artisan })
    const pdfBuffer = await renderToBuffer(pdfElement)

    // Send reminder email with custom intro
    const result = await sendDocumentEmail(
      doc.client_email,
      doc.client_name || 'Client',
      doc.document_type,
      doc.document_number,
      Number(doc.total_ttc),
      Buffer.from(pdfBuffer)
    )

    if (!result.success) {
      return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
    }

    // Record reminder
    await supabase.from('payment_reminders').insert({
      document_id: id,
      reminder_level: level,
      sent_via: 'email',
    })

    // Update status to overdue if still sent
    if (doc.status === 'sent') {
      await supabase.from('billing_documents').update({ status: 'overdue' }).eq('id', id)
    }

    return NextResponse.json({ success: true, level, subject })
  } catch (error) {
    console.error('Remind error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
