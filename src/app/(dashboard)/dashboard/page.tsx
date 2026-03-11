import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, FileText, Bell, Plus, ArrowRight, Clock, MapPin } from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    const access = await checkUserAccess();

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name, email, profile_type')
        .eq('id', user.id)
        .single();

    const { data: recentEstimations } = await supabase
        .from('estimations')
        .select('id, property_type, project_type, address, city, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const { count: unreadCount } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null);

    const profileData = profile as {
        full_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        profile_type?: string;
    } | null;

    const firstName = profileData?.first_name || profileData?.full_name?.split(' ')[0] || 'vous';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    const statusMap: Record<string, { label: string; color: string; dot: string }> = {
        draft: { label: 'Brouillon', color: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' },
        submitted: { label: 'En attente', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
        in_progress: { label: 'En cours', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-400' },
        validated: { label: 'Validé', color: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-400' },
        delivered: { label: 'Prêt', color: 'bg-rapido-green/10 text-rapido-green', dot: 'bg-rapido-green' },
    };

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rapido-blue">
                        {greeting}, {firstName}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Voici un aperçu de votre activité.
                    </p>
                </div>
                {access.hasAccess && (
                    <Link href="/estimations/nouveau">
                        <Button className="bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full shadow-sm hover:shadow-md transition-all gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle estimation
                        </Button>
                    </Link>
                )}
            </div>

            {/* Alerte profil incomplet */}
            {!profileData?.profile_type && (
                <div className="rounded-2xl border border-rapido-orange/20 bg-gradient-to-r from-rapido-orange/5 to-rapido-orange/10 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rapido-orange/15 text-rapido-orange flex-shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-rapido-orange text-sm">Complétez votre profil</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Renseignez votre type de profil pour une meilleure expérience.
                            </p>
                        </div>
                    </div>
                    <Link href="/onboarding">
                        <Button size="sm" className="bg-rapido-orange hover:bg-rapido-orange/90 text-white rounded-full text-xs gap-1.5">
                            Compléter <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            )}

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Statut</p>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${access.hasAccess ? 'bg-rapido-green/10 text-rapido-green' : 'bg-amber-50 text-amber-500'}`}>
                            <Activity className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${access.hasAccess ? 'bg-rapido-green animate-pulse' : 'bg-amber-400'}`} />
                        <p className="font-semibold text-rapido-blue">
                            {access.hasAccess ? 'Accès actif' : 'Accès limité'}
                        </p>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                        {access.accessType === 'subscription'
                            ? 'Abonnement actif'
                            : access.accessType === 'pack'
                                ? `${access.creditsRemaining} crédit${(access.creditsRemaining ?? 0) > 1 ? 's' : ''} restant${(access.creditsRemaining ?? 0) > 1 ? 's' : ''}`
                                : 'Aucun accès actif'}
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Estimations</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-blue/8 text-rapido-blue">
                            <FileText className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="font-heading text-3xl font-extrabold text-rapido-blue">
                        {recentEstimations?.length ?? 0}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">estimations créées</p>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Notifications</p>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${(unreadCount || 0) > 0 ? 'bg-rapido-orange/10 text-rapido-orange' : 'bg-zinc-100 text-zinc-400'}`}>
                            <Bell className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="font-heading text-3xl font-extrabold text-rapido-blue">
                        {unreadCount || 0}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">non lue{(unreadCount || 0) > 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid gap-4 sm:grid-cols-2">
                {access.hasAccess ? (
                    <Link href="/estimations/nouveau" className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-rapido-green/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rapido-green/10 text-rapido-green group-hover:bg-rapido-green group-hover:text-white transition-all">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-rapido-blue text-sm">Nouvelle estimation</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Démarrer un nouveau projet</p>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <Link href="/nos-tarifs" className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-rapido-orange/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rapido-orange/10 text-rapido-orange group-hover:bg-rapido-orange group-hover:text-white transition-all">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-rapido-blue text-sm">Voir les offres</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Démarrez avec un abonnement</p>
                            </div>
                        </div>
                    </Link>
                )}
                <Link href="/estimations" className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-rapido-blue/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rapido-blue/8 text-rapido-blue group-hover:bg-rapido-blue group-hover:text-white transition-all">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-rapido-blue text-sm">Mes estimations</p>
                            <p className="text-xs text-zinc-400 mt-0.5">Consulter l&apos;historique</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent estimations */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-rapido-blue text-lg">Estimations récentes</h2>
                    <Link href="/estimations" className="text-sm text-rapido-green hover:text-rapido-green/80 font-medium flex items-center gap-1 transition-colors">
                        Voir tout <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {recentEstimations && recentEstimations.length > 0 ? (
                    <div className="space-y-2">
                        {recentEstimations.map((estimation) => {
                            const status = statusMap[estimation.status] || statusMap.draft;
                            return (
                                <Link
                                    key={estimation.id}
                                    href={`/estimations/${estimation.id}`}
                                    className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-rapido-blue/15 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rapido-blue/5 text-rapido-blue group-hover:bg-rapido-blue/10 transition-colors">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-rapido-blue text-sm group-hover:text-rapido-green transition-colors">
                                                {estimation.project_type
                                                    ? estimation.project_type.replace(/_/g, ' ').charAt(0).toUpperCase() + estimation.project_type.replace(/_/g, ' ').slice(1)
                                                    : estimation.property_type
                                                        ? estimation.property_type.charAt(0).toUpperCase() + estimation.property_type.slice(1)
                                                        : 'Estimation'}
                                            </p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {(estimation.city || estimation.address) && (
                                                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                                                        <MapPin className="h-3 w-3" />
                                                        {estimation.city || estimation.address}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(estimation.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                        {status.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rapido-blue/5 text-rapido-blue">
                            <FileText className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="font-heading font-bold text-rapido-blue text-lg">Aucune estimation</p>
                            <p className="text-zinc-400 text-sm mt-1 max-w-xs mx-auto">
                                {access.hasAccess
                                    ? 'Commencez par créer votre première estimation. Notre questionnaire intelligent vous guidera.'
                                    : 'Souscrivez à un abonnement pour commencer vos estimations.'}
                            </p>
                        </div>
                        {access.hasAccess ? (
                            <Link href="/estimations/nouveau">
                                <Button className="bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full gap-2 mt-2">
                                    <Plus className="h-4 w-4" /> Créer une estimation
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/nos-tarifs">
                                <Button className="bg-rapido-orange hover:bg-rapido-orange/90 text-white rounded-full gap-2 mt-2">
                                    Voir les offres <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
