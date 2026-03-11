import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { onboardingSchema } from '@/lib/validations/profile'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = onboardingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Update the profiles table with common fields
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      profile_type: data.profileType,
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: `${data.firstName} ${data.lastName}`,
      phone: data.phone || null,
      address_city: data.addressCity || null,
      address_department: data.addressDepartment || null,
    })
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil', details: profileError.message },
      { status: 500 }
    )
  }

  // Insert into the appropriate detail table
  let detailError = null

  if (data.profileType === 'artisan') {
    const { error } = await supabase.from('artisan_profiles').insert({
      user_id: user.id,
      siret: data.siret,
      company_name: data.companyName,
      main_trade: data.mainTrade,
      specializations: data.specializations,
      insurance_decennale_number: data.insuranceDecennaleNumber || null,
      insurance_expiry: data.insuranceExpiry || null,
      certifications: data.certifications,
      intervention_radius_km: data.interventionRadiusKm,
      hourly_rate: data.hourlyRate || null,
    })
    detailError = error
  } else if (data.profileType === 'immobilier') {
    const { error } = await supabase.from('immobilier_profiles').insert({
      user_id: user.id,
      siret: data.siret || null,
      company_name: data.companyName || null,
      immobilier_role: data.immobilierRole,
      agency_name: data.agencyName || null,
      network: data.network || null,
      annual_volume: data.annualVolume || null,
    })
    detailError = error
  } else if (data.profileType === 'particulier') {
    const { error } = await supabase.from('particulier_profiles').insert({
      user_id: user.id,
      is_owner: data.isOwner,
      property_type: data.propertyType || null,
      estimated_budget_range: data.estimatedBudgetRange || null,
      is_first_project: data.isFirstProject,
    })
    detailError = error
  }

  if (detailError) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du profil détaillé', details: detailError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
