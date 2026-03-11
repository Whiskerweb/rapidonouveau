import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, CheckCircle2, ArrowRight, Zap, PiggyBank, BriefcaseBusiness } from 'lucide-react';

export const metadata = {
    title: "Logiciel Auto-Entrepreneur Bâtiment (Micro-Entreprise) | Rapido'Devis",
    description: "Le logiciel de facturation le plus simple et rapide pour les micro-entrepreneurs du BTP. Sans engagement, ultra-intuitif.",
};

export default function AutoEntrepreneurPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest">
                                <User className="w-4 h-4" />
                                <span>Spécial Micro-Entreprise</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Le logiciel qui vous <br />
                                libère du <span className="text-primary italic">temps.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                En tant qu&apos;artisan seul, votre temps est votre ressource la plus précieuse. Ne le gaspillez pas sur des fichiers Word ou Excel incompréhensibles.
                            </p>

                            <ul className="space-y-4 pt-2">
                                {[
                                    "Zéro formation requise, prise en main en 2 minutes",
                                    "Mentions légales auto-entrepreneur obligatoires incluses",
                                    "Formule d'abonnement abordable garantie",
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-secondary font-bold">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="w-full sm:w-auto h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-10 text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                        Essai Gratuit (14j)
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Value Prop Cards */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 flex items-start gap-6 transform rotate-1 hover:rotate-0 transition-transform">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-secondary mb-2">Devis en 3 minutes</h3>
                                    <p className="text-secondary/60 font-bold">Le temps moyen mesuré pour créer un devis professionnel depuis son canapé ou dans l&apos;utilitaire.</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 flex items-start gap-6 transform -rotate-2 hover:rotate-0 transition-transform ml-8">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <PiggyBank className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-secondary mb-2">TVA simplifiée</h3>
                                    <p className="text-secondary/60 font-bold">Gérez facilement vos mentions &quot;TVA non applicable&quot; ou facturez la TVA si vous avez dépassé les seuils.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why transition from Excel */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-secondary">
                            Pourquoi abandonner Excel ?
                        </h2>
                        <p className="text-secondary/50 text-xl font-bold">
                            Ne risquez plus de faire une erreur de calcul qui vous coûtera votre marge.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-red-50 p-10 rounded-[2rem] border border-red-100 opacity-70">
                            <div className="text-red-500 font-bold mb-6 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                L&apos;ancienne méthode (Excel/Word)
                            </div>
                            <ul className="space-y-4 text-secondary/60 font-bold">
                                <li>❌ Formules de calcul qui sautent</li>
                                <li>❌ Mentions légales souvent périmées ou manquantes</li>
                                <li>❌ Impossible de faire un devis depuis son téléphone</li>
                                <li>❌ Numérotation des factures compliquée à suivre</li>
                                <li>❌ Perte de temps à relancer les clients</li>
                            </ul>
                        </div>
                        <div className="bg-primary/5 p-10 rounded-[2rem] border border-primary/20 shadow-lg">
                            <div className="text-primary font-black mb-6 flex items-center gap-2 text-lg">
                                <ArrowRight className="w-6 h-6" />
                                La méthode Rapido&apos;Devis
                            </div>
                            <ul className="space-y-4 text-secondary font-bold">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Bibliothèque de prix intégrée</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Numérotation automatique légale</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Application mobile ultra-fluide</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Devis chiffrés avec l&apos;IA en 1 clic</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Transformation Devis -&gt; Facture instantanée</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
