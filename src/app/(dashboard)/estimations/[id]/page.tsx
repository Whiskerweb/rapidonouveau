import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Info, Calendar, MapPin, Ruler, Users } from 'lucide-react';

export default async function EstimationDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    // Fetch estimation with items, attachments, and documents
    const { data: estimation, error } = await supabase
        .from('estimations')
        .select(`
            *,
            estimation_items (*),
            attachments (*),
            estimation_documents (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !estimation) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-rapido-blue">Estimation introuvable</h2>
                <p className="text-zinc-500 mt-2">Désolé, nous ne parvenons pas à trouver cette estimation.</p>
                <Link href="/estimations" className="mt-6">
                    <Button variant="outline" className="rounded-full">Retour aux estimations</Button>
                </Link>
            </div>
        );
    }

    const statusConfig: Record<string, { label: string; className: string; description: string }> = {
        draft: { label: 'Brouillon', className: 'bg-zinc-100 text-zinc-500', description: 'Cette demande est encore en brouillon.' },
        submitted: { label: 'En attente', className: 'bg-amber-50 text-amber-600', description: 'Votre demande a été reçue et sera traitée prochainement.' },
        in_progress: { label: 'En cours', className: 'bg-blue-50 text-blue-600', description: 'Un expert analyse actuellement vos documents.' },
        validated: { label: 'Validé', className: 'bg-indigo-50 text-indigo-600', description: 'L\'estimation est validée et le devis est en cours de génération.' },
        delivered: { label: 'Prêt', className: 'bg-rapido-green/10 text-rapido-green', description: 'Votre estimation est prête ! Vous pouvez télécharger le devis.' },
    };

    const config = statusConfig[estimation.status] || statusConfig.draft;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                <div className="space-y-1">
                    <Link href="/estimations" className="text-xs text-zinc-400 hover:text-rapido-blue flex items-center gap-1 mb-2">
                        <ChevronLeft className="h-3 w-3" /> Retour à la liste
                    </Link>
                    <h1 className="text-2xl font-heading font-extrabold text-rapido-blue">
                        {estimation.property_type ? (estimation.property_type.charAt(0).toUpperCase() + estimation.property_type.slice(1)) : 'Estimation'}
                        {estimation.address ? ` - ${estimation.address}` : ''}
                    </h1>
                    <p className="text-xs text-zinc-400">
                        Créée le {new Date(estimation.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${config.className}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Alert */}
                    <div className={`rounded-xl border p-4 flex gap-4 ${config.className.split(' ')[0]} border-current opacity-80`}>
                        <Info className="h-5 w-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">{config.label}</p>
                            <p className="text-sm opacity-90">{config.description}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
                        <h3 className="font-bold text-rapido-blue flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Détails du projet
                        </h3>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Type de bien</label>
                                <p className="text-sm font-medium text-zinc-700 capitalize">{estimation.property_type || 'Non spécifié'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Surface</label>
                                <p className="text-sm font-medium text-zinc-700">{estimation.surface_m2 ? `${estimation.surface_m2} m²` : 'Non spécifiée'}</p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Adresse</label>
                                <p className="text-sm font-medium text-zinc-700">{estimation.address || 'Non spécifiée'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-100">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2 block">Description / Notes</label>
                            <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed">
                                {estimation.notes || 'Aucune description fournie.'}
                            </p>
                        </div>
                    </div>

                    {/* Work Items */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-rapido-blue">Catégories de travaux</h3>
                        <div className="flex flex-wrap gap-2">
                            {estimation.estimation_items?.map((item: any) => (
                                <span key={item.id} className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 capitalize">
                                    {item.category.replace('_', ' ')}
                                </span>
                            ))}
                            {(!estimation.estimation_items || estimation.estimation_items.length === 0) && (
                                <p className="text-sm text-zinc-400 italic">Aucune catégorie sélectionnée.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Documents reçus (PDFs de l'admin) */}
                    {estimation.estimation_documents && estimation.estimation_documents.length > 0 && (
                        <div className="rounded-2xl border-2 border-rapido-green/30 bg-rapido-green/5 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-rapido-green mb-2">
                                Votre estimation est prête !
                            </h3>
                            <div className="space-y-3">
                                {estimation.estimation_documents
                                    .filter((doc: any) => doc.is_visible_to_user)
                                    .map((doc: any) => (
                                        <a
                                            key={doc.id}
                                            href={doc.storage_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-rapido-green/20 hover:border-rapido-green hover:shadow-md transition-all"
                                        >
                                            <div className="h-10 w-10 rounded-lg bg-rapido-green/10 flex items-center justify-center text-rapido-green">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-900 truncate">{doc.filename}</p>
                                                <p className="text-xs text-zinc-400">
                                                    {new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <span className="text-xs text-rapido-green font-medium flex-shrink-0">
                                                Télécharger
                                            </span>
                                        </a>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments uploadés par le client */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-rapido-blue mb-4">Vos documents ({estimation.attachments?.length ?? 0})</h3>
                        <div className="space-y-3">
                            {estimation.attachments?.map((file: any) => (
                                <div key={file.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group">
                                    <div className="h-8 w-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-rapido-blue/5 group-hover:text-rapido-blue">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-zinc-700 truncate">{file.filename}</p>
                                        <p className="text-[10px] text-zinc-400 uppercase">{file.type}</p>
                                    </div>
                                </div>
                            ))}
                            {(!estimation.attachments || estimation.attachments.length === 0) && (
                                <p className="text-sm text-zinc-400 italic">Aucun document.</p>
                            )}
                        </div>
                    </div>

                    {/* Matching CTA */}
                    {(estimation.status === 'delivered' || estimation.status === 'validated') && (
                        <Link href={`/estimations/${id}/matching`}>
                            <div className="rounded-2xl border border-rapido-blue/15 bg-rapido-blue/3 p-5 hover:shadow-md hover:border-rapido-blue/25 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rapido-blue/10 text-rapido-blue group-hover:bg-rapido-blue group-hover:text-white transition-all">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-rapido-blue text-sm">Trouver un artisan</p>
                                        <p className="text-xs text-zinc-400 mt-0.5">Mise en relation avec des pros vérifiés</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Timeline / Info */}
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-4 w-4 text-rapido-blue mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-rapido-blue">Délai estimé</p>
                                <p className="text-xs text-zinc-600 mt-1">Généralement sous 48h ouvrées.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Ruler className="h-4 w-4 text-rapido-blue mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-rapido-blue">Précision</p>
                                <p className="text-xs text-zinc-600 mt-1">Basée sur les documents fournis.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
