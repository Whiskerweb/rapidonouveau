import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    const access = await checkUserAccess();

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

    // Fetch recent estimations
    const { data: recentEstimations } = await supabase
        .from('estimations')
        .select('id, title, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const profileData = profile as { full_name?: string; email?: string } | null;
    const firstName = profileData?.full_name?.split(' ')[0] ?? 'vous';

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                        Bonjour, {firstName} 👋
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Voici un aperçu de votre activité.</p>
                </div>
                {access.hasAccess && (
                    <Link href="/estimations/nouveau">
                        <Button className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full">
                            + Nouvelle estimation
                        </Button>
                    </Link>
                )}
            </div>

            {/* Access status cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Statut</p>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${access.hasAccess ? 'bg-rapido-green' : 'bg-amber-400'}`} />
                        <p className="font-semibold text-rapido-blue">
                            {access.hasAccess ? 'Accès actif' : 'Accès limité'}
                        </p>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                        {access.accessType === 'subscription'
                            ? 'Abonnement actif'
                            : access.accessType === 'pack'
                                ? `${access.creditsRemaining} crédit${(access.creditsRemaining ?? 0) > 1 ? 's' : ''} restant${(access.creditsRemaining ?? 0) > 1 ? 's' : ''}`
                                : 'Aucun accès actif'}
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Estimations</p>
                    <p className="font-heading text-3xl font-extrabold text-rapido-blue">
                        {recentEstimations?.length ?? 0}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">estimations créées</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-3">Action rapide</p>
                    {access.hasAccess ? (
                        <Link href="/estimations/nouveau">
                            <Button className="w-full bg-rapido-blue text-white rounded-full text-sm" size="sm">
                                Démarrer une estimation
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/nos-tarifs">
                            <Button className="w-full bg-rapido-orange text-white rounded-full text-sm" size="sm">
                                Voir les offres →
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Recent estimations */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-bold text-rapido-blue">Estimations récentes</h2>
                    <Link href="/estimations" className="text-sm text-rapido-green hover:underline">
                        Voir tout →
                    </Link>
                </div>

                {recentEstimations && recentEstimations.length > 0 ? (
                    <div className="space-y-3">
                        {recentEstimations.map((estimation: { id: string; title: string; status: string; created_at: string }) => (
                            <Link
                                key={estimation.id}
                                href={`/estimations/${estimation.id}`}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <p className="font-medium text-rapido-blue text-sm">{estimation.title || 'Estimation sans titre'}</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {new Date(estimation.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estimation.status === 'completed'
                                        ? 'bg-rapido-green/10 text-rapido-green'
                                        : estimation.status === 'pending'
                                            ? 'bg-amber-50 text-amber-600'
                                            : 'bg-zinc-100 text-zinc-500'
                                    }`}>
                                    {estimation.status === 'completed' ? 'Terminé' : estimation.status === 'pending' ? 'En cours' : 'Brouillon'}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="text-4xl">📋</div>
                        <div>
                            <p className="font-semibold text-rapido-blue">Aucune estimation pour l&apos;instant</p>
                            <p className="text-zinc-400 text-sm mt-1">
                                {access.hasAccess
                                    ? 'Créez votre première estimation pour commencer.'
                                    : 'Souscrivez à un abonnement pour démarrer.'}
                            </p>
                        </div>
                        {access.hasAccess ? (
                            <Link href="/estimations/nouveau">
                                <Button className="bg-rapido-blue text-white rounded-full" size="sm">
                                    Créer une estimation
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/nos-tarifs">
                                <Button className="bg-rapido-green text-white rounded-full" size="sm">
                                    Voir les offres
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
