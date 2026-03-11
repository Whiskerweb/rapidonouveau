import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/dashboard/sign-out-button';
import { User, Building2, Pencil, Mail, Phone, MapPin } from 'lucide-react';

const PROFILE_TYPE_LABELS: Record<string, string> = {
    artisan: 'Artisan',
    immobilier: 'Professionnel immobilier',
    particulier: 'Particulier',
};

const TRADE_LABELS: Record<string, string> = {
    plomberie: 'Plomberie',
    electricite: 'Électricité',
    maconnerie: 'Maçonnerie',
    peinture: 'Peinture',
    carrelage: 'Carrelage',
    menuiserie: 'Menuiserie',
    couverture: 'Couverture',
    charpente: 'Charpente',
    isolation: 'Isolation',
    chauffage: 'Chauffage / Climatisation',
    cuisine: 'Cuisine / Salle de bain',
    renovation_generale: 'Rénovation générale',
    demolition: 'Démolition',
    autre: 'Autre',
};

const ROLE_LABELS: Record<string, string> = {
    agent: 'Agent immobilier',
    marchand_biens: 'Marchand de biens',
    promoteur: 'Promoteur',
    diagnostiqueur: 'Diagnostiqueur',
};

export default async function ComptePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch profile-type-specific data
    let typeDetails: Record<string, unknown> | null = null;

    if (profile?.profile_type === 'artisan') {
        const { data } = await supabase
            .from('artisan_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
        typeDetails = data;
    } else if (profile?.profile_type === 'immobilier') {
        const { data } = await supabase
            .from('immobilier_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
        typeDetails = data;
    } else if (profile?.profile_type === 'particulier') {
        const { data } = await supabase
            .from('particulier_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
        typeDetails = data;
    }

    const artisan = typeDetails as {
        company_name?: string;
        siret?: string;
        main_trade?: string;
        specializations?: string[];
        certifications?: string[];
        insurance_decennale_number?: string;
        intervention_radius_km?: number;
    } | null;

    const immobilier = typeDetails as {
        company_name?: string;
        siret?: string;
        immobilier_role?: string;
        agency_name?: string;
        network?: string;
        annual_volume?: number;
    } | null;

    const particulier = typeDetails as {
        is_owner?: boolean;
        property_type?: string;
        estimated_budget_range?: string;
        is_first_project?: boolean;
    } | null;

    const initials = profile?.first_name && profile?.last_name
        ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
        : (profile?.full_name || profile?.email || 'U').substring(0, 2).toUpperCase();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header with avatar */}
            <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rapido-blue to-rapido-blue/80 text-white text-xl font-heading font-bold shadow-sm">
                    {initials}
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rapido-blue">
                        Mon compte
                    </h1>
                    <p className="text-zinc-400 text-sm mt-0.5">
                        Gérez vos informations personnelles et professionnelles.
                    </p>
                </div>
            </div>

            {/* Informations personnelles */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-blue/8 text-rapido-blue">
                        <User className="h-4 w-4" />
                    </div>
                    <h2 className="font-heading font-bold text-rapido-blue">Informations personnelles</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Prénom" value={profile?.first_name} />
                    <InfoField label="Nom" value={profile?.last_name} />
                    <InfoField label="Nom complet" value={profile?.full_name} />
                    <InfoField label="Email" value={profile?.email} />
                    <InfoField label="Téléphone" value={profile?.phone} />
                    <InfoField label="Ville" value={profile?.address_city} />
                    <InfoField label="Département" value={profile?.address_department} />
                </div>
            </div>

            {/* Profil métier */}
            {profile?.profile_type && (
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-green/10 text-rapido-green">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <h2 className="font-heading font-bold text-rapido-blue">Profil métier</h2>
                        <span className="rounded-full bg-rapido-blue/10 px-2.5 py-0.5 text-xs font-medium text-rapido-blue">
                            {PROFILE_TYPE_LABELS[profile.profile_type] || profile.profile_type}
                        </span>
                    </div>

                    {profile.profile_type === 'artisan' && artisan && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoField label="Entreprise" value={artisan.company_name} />
                            <InfoField label="SIRET" value={artisan.siret} />
                            <InfoField label="Corps de métier" value={artisan.main_trade ? (TRADE_LABELS[artisan.main_trade] || artisan.main_trade) : undefined} />
                            <InfoField label="Rayon d'intervention" value={artisan.intervention_radius_km ? `${artisan.intervention_radius_km} km` : undefined} />
                            <InfoField label="Assurance décennale" value={artisan.insurance_decennale_number} />
                            {artisan.specializations && artisan.specializations.length > 0 && (
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Spécialisations</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {artisan.specializations.map((s) => (
                                            <span key={s} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                                                {TRADE_LABELS[s] || s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {artisan.certifications && artisan.certifications.length > 0 && (
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Certifications</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {artisan.certifications.map((c) => (
                                            <span key={c} className="rounded-full bg-rapido-green/10 px-2.5 py-0.5 text-xs text-rapido-green font-medium">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {profile.profile_type === 'immobilier' && immobilier && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoField label="Entreprise" value={immobilier.company_name} />
                            <InfoField label="SIRET" value={immobilier.siret} />
                            <InfoField label="Rôle" value={immobilier.immobilier_role ? (ROLE_LABELS[immobilier.immobilier_role] || immobilier.immobilier_role) : undefined} />
                            <InfoField label="Agence" value={immobilier.agency_name} />
                            <InfoField label="Réseau" value={immobilier.network} />
                            <InfoField label="Volume annuel" value={immobilier.annual_volume ? `${immobilier.annual_volume} biens/an` : undefined} />
                        </div>
                    )}

                    {profile.profile_type === 'particulier' && particulier && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoField label="Propriétaire" value={particulier.is_owner ? 'Oui' : 'Non'} />
                            <InfoField label="Type de bien" value={particulier.property_type} />
                            <InfoField label="Budget estimé" value={particulier.estimated_budget_range} />
                            <InfoField label="Premier projet" value={particulier.is_first_project ? 'Oui' : 'Non'} />
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/onboarding">
                    <Button variant="outline" className="rounded-full gap-2 border-zinc-200 hover:border-rapido-blue/30">
                        <Pencil className="h-3.5 w-3.5" />
                        Modifier mon profil
                    </Button>
                </Link>
                <SignOutButton />
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{label}</p>
            <p className="text-sm font-medium text-zinc-700">{value || 'Non renseigné'}</p>
        </div>
    );
}
