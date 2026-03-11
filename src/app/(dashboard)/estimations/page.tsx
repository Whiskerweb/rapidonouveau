import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { checkUserAccess } from '@/lib/access';

export default async function EstimationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    const access = await checkUserAccess();

    const { data: estimations } = await supabase
        .from('estimations')
        .select('id, property_type, status, created_at, address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const statusConfig: Record<string, { label: string; className: string }> = {
        draft: { label: 'Brouillon', className: 'bg-zinc-100 text-zinc-500' },
        submitted: { label: 'En attente', className: 'bg-amber-50 text-amber-600' },
        in_progress: { label: 'En cours', className: 'bg-blue-50 text-blue-600' },
        validated: { label: 'Validé', className: 'bg-indigo-50 text-indigo-600' },
        delivered: { label: 'Prêt', className: 'bg-rapido-green/10 text-rapido-green' },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                        Mes estimations
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {estimations?.length ?? 0} estimation{(estimations?.length ?? 0) !== 1 ? 's' : ''}
                    </p>
                </div>
                {access.hasAccess && (
                    <Link href="/estimations/nouveau">
                        <Button className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full">
                            + Nouvelle estimation
                        </Button>
                    </Link>
                )}
            </div>
            {estimations && estimations.length > 0 ? (
                <div className="space-y-3">
                    {estimations.map((e) => {
                        const config = statusConfig[e.status] ?? { label: e.status, className: 'bg-zinc-100 text-zinc-500' };
                        return (
                            <Link
                                key={e.id}
                                href={`/estimations/${e.id}`}
                                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-rapido-blue/5 flex items-center justify-center text-lg flex-shrink-0">
                                        📋
                                    </div>
                                    <div>
                                        <p className="font-medium text-rapido-blue text-sm group-hover:text-rapido-green transition-colors">
                                            {e.property_type ? (e.property_type.charAt(0).toUpperCase() + e.property_type.slice(1)) : 'Estimation'}
                                            {e.address ? ` - ${e.address}` : ''}
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            {new Date(e.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium flex-shrink-0 ${config.className}`}>
                                    {config.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-5xl">📋</div>
                    <div>
                        <p className="font-semibold text-rapido-blue text-lg">Aucune estimation</p>
                        <p className="text-zinc-400 text-sm mt-1">
                            {access.hasAccess
                                ? 'Créez votre première estimation pour commencer.'
                                : 'Souscrivez à un abonnement pour démarrer.'}
                        </p>
                    </div>
                    {access.hasAccess ? (
                        <Link href="/estimations/nouveau">
                            <Button className="bg-rapido-blue text-white rounded-full">
                                Créer une estimation
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/nos-tarifs">
                            <Button className="bg-rapido-green text-white rounded-full">
                                Voir les offres
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
