import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StripePortalButton } from '@/components/dashboard/stripe-portal-button';

const PLAN_LABELS: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: 'Actif', color: 'bg-rapido-green/10 text-rapido-green' },
    trialing: { label: 'Période d\'essai', color: 'bg-blue-50 text-blue-600' },
    past_due: { label: 'Paiement en retard', color: 'bg-amber-50 text-amber-600' },
    canceled: { label: 'Annulé', color: 'bg-red-50 text-red-500' },
    unpaid: { label: 'Impayé', color: 'bg-red-50 text-red-500' },
};

export default async function AbonnementPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    const access = await checkUserAccess();

    // Fetch subscription details
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // Fetch packs
    const { data: packs } = await supabase
        .from('packs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Check if user has stripe_customer_id
    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

    const hasStripeCustomer = !!profile?.stripe_customer_id;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                    Abonnement
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Gérez votre abonnement et vos crédits.
                </p>
            </div>

            {/* Statut actuel */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="font-heading font-bold text-rapido-blue">Statut actuel</h2>
                <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${access.hasAccess ? 'bg-rapido-green' : 'bg-zinc-300'}`} />
                    <p className="text-lg font-semibold text-rapido-blue">
                        {access.hasAccess ? 'Accès actif' : 'Aucun accès actif'}
                    </p>
                </div>
                <p className="text-sm text-zinc-500">
                    {access.accessType === 'subscription'
                        ? `Abonnement ${PLAN_LABELS[access.plan || ''] || access.plan || ''} actif`
                        : access.accessType === 'pack'
                            ? `${access.creditsRemaining} crédit${(access.creditsRemaining ?? 0) > 1 ? 's' : ''} restant${(access.creditsRemaining ?? 0) > 1 ? 's' : ''}`
                            : 'Souscrivez à un abonnement ou achetez des crédits pour démarrer.'}
                </p>
            </div>

            {/* Abonnement */}
            {subscription && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="font-heading font-bold text-rapido-blue">Abonnement</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Plan</p>
                            <p className="text-sm font-medium text-zinc-700">
                                {PLAN_LABELS[subscription.plan] || subscription.plan}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Statut</p>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[subscription.status]?.color || 'bg-zinc-100 text-zinc-500'}`}>
                                {STATUS_LABELS[subscription.status]?.label || subscription.status}
                            </span>
                        </div>
                        {subscription.current_period_end && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Prochaine échéance</p>
                                <p className="text-sm font-medium text-zinc-700">
                                    {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Packs / Crédits */}
            {packs && packs.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="font-heading font-bold text-rapido-blue">Crédits</h2>
                    {packs.map((pack: any) => {
                        const remaining = pack.credits_total - pack.credits_used;
                        const percentage = pack.credits_total > 0
                            ? Math.round((pack.credits_used / pack.credits_total) * 100)
                            : 0;
                        const isExpired = new Date(pack.expires_at) < new Date();

                        return (
                            <div key={pack.id} className={`rounded-xl border p-4 space-y-3 ${isExpired ? 'opacity-50' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-zinc-700">
                                        {remaining} / {pack.credits_total} crédits
                                        {isExpired && <span className="ml-2 text-xs text-red-500">(expiré)</span>}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        Expire le {new Date(pack.expires_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="h-2 w-full rounded-full bg-zinc-200">
                                    <div
                                        className="h-2 rounded-full bg-rapido-green transition-all"
                                        style={{ width: `${100 - percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                {hasStripeCustomer && <StripePortalButton />}
                {!access.hasAccess && (
                    <Link href="/nos-tarifs">
                        <Button className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full">
                            Voir les offres
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
