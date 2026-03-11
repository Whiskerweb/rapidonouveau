import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    let query = supabase
      .from('billing_documents')
      .select('*, billing_document_lines(count)')
      .eq('artisan_id', user.id)
      .order('created_at', { ascending: false })

    if (type) query = query.eq('document_type', type)
    if (status) query = query.eq('status', status)

    const { data, error } = await query.limit(50)
    if (error) throw error

    return NextResponse.json({ documents: data || [] })
  } catch (error) {
    console.error('Get billing documents error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Verify artisan
    const { data: artisan } = await supabase
      .from('artisan_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!artisan) return NextResponse.json({ error: 'Profil artisan requis' }, { status: 403 })

    const body = await request.json()
    const { documentType, clientName, clientEmail, clientPhone, clientAddress, clientSiret, projectAddress, projectDescription, notes } = body

    if (!documentType || !clientName) {
      return NextResponse.json({ error: 'Type et nom client requis' }, { status: 400 })
    }

    // Get next document number
    const { data: numResult } = await supabase.rpc('next_document_number', {
      p_artisan_id: user.id,
      p_type: documentType,
    })

    const documentNumber = numResult || `${documentType === 'devis' ? 'D' : 'F'}-${new Date().getFullYear()}-001`

    const validityDate = documentType === 'devis'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null

    const { data: doc, error } = await supabase
      .from('billing_documents')
      .insert({
        artisan_id: user.id,
        document_type: documentType,
        document_number: documentNumber,
        client_name: clientName,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        client_address: clientAddress || null,
        client_siret: clientSiret || null,
        project_address: projectAddress || null,
        project_description: projectDescription || null,
        notes: notes || null,
        validity_date: validityDate,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ document: doc })
  } catch (error) {
    console.error('Create billing document error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
