import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PencilRuler, Zap, CheckCircle2, ArrowRight, LayoutDashboard, Send, FileText } from 'lucide-react';

export const metadata = {
    title: "Logiciel de devis et factures bâtiment | Rapido'Devis",
    description: "Créez vos devis et factures en 1 clic. Éditeur intuitif, transfert devis/facture, relance automatique pour les artisans du BTP.",
};

export default function DevisFacturesPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest">
                                <FileText className="w-4 h-4" />
                                <span>Éditeur de Devis & Factures</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Éditez vos devis en <br />
                                <span className="text-primary italic">temps record.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                Pensé spécifiquement pour les pros du bâtiment. De la première ligne du devis à la facture d&apos;acompte, tout est conçu pour vous faire gagner des heures chaque semaine.
                            </p>

                            <ul className="space-y-4 pt-2">
                                {[
                                    "Interface ultra-intuitive, 0 formation requise",
                                    "Transfert Devis -> Facture en 1 clic",
                                    "Acomptes et situations de travaux gérés",
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
                                        Essayer gratuitement
                                    </Button>
                                </Link>
                                <Link href="/nos-tarifs">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 border-2 border-zinc-200 hover:border-primary/50 hover:bg-zinc-50 font-bold rounded-2xl px-8 text-lg text-secondary transition-all">
                                        Voir les tarifs
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Interactive UI Mockup */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] scale-90 -z-10 rounded-full" />
                            <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="text-zinc-500 text-xs font-mono font-bold">Devis_Renovation_Maconnerie.pdf</div>
                                </div>
                                <div className="p-8 space-y-6 bg-zinc-50">
                                    <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
                                        <div className="w-32 h-10 bg-zinc-200 rounded-lg animate-pulse" />
                                        <div className="text-right space-y-2">
                                            <div className="w-24 h-4 bg-zinc-200 rounded ml-auto" />
                                            <div className="w-32 h-4 bg-zinc-200 rounded ml-auto" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-secondary/40 px-2">
                                            <span>Description</span>
                                            <span>Total HT</span>
                                        </div>
                                        {[
                                            { name: "Démolition mur porteur", price: "1 250,00 €" },
                                            { name: "Pose IPN renforcé", price: "850,00 €" },
                                            { name: "Création ouverture", price: "2 100,00 €" }
                                        ].map((line, i) => (
                                            <div key={i} className="bg-white p-4 rounded-xl border border-zinc-100 flex justify-between items-center shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                                                <span className="font-bold text-secondary group-hover:text-primary transition-colors">{line.name}</span>
                                                <span className="font-black text-secondary">{line.price}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-zinc-200 flex justify-end">
                                        <div className="bg-secondary text-white px-6 py-4 rounded-2xl space-y-1 text-right">
                                            <div className="text-sm font-bold text-white/50">Total TTC</div>
                                            <div className="text-3xl font-black">5 040,00 €</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary">
                            Tout ce dont vous avez besoin pour facturer.
                        </h2>
                        <p className="text-secondary/50 text-xl font-bold">
                            Des outils puissants cachés derrière une interface d&apos;une simplicité redoutable.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: LayoutDashboard,
                                title: "Personnalisation Totale",
                                desc: "Ajoutez votre logo, vos couleurs, et vos mentions légales pour des documents ultra pros qui vous démarquent."
                            },
                            {
                                icon: Zap,
                                title: "Génération Instantanée",
                                desc: "Utilisez nos modèles de chiffrages pré-conçus par métier pour ne pas repartir d'une feuille blanche."
                            },
                            {
                                icon: Send,
                                title: "Envoi direct au client",
                                desc: "Fini les exports PDF fastidieux. Envoyez le devis directement depuis l'application avec suivi d'ouverture."
                            },
                            {
                                icon: PencilRuler,
                                title: "Calcul des Marges",
                                desc: "Visualisez en temps réel votre marge nette sur chaque chantier pendant l'édition du devis."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Factures d'acompte",
                                desc: "Générez vos factures d'acompte (30%, 40%...) en un seul clic depuis un devis signé."
                            },
                            {
                                icon: FileText,
                                title: "Conforme 100% légal",
                                desc: "Mentions légales obligatoires intégrées (TVA, SIRET, assurance décennale, médiateur)."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 hover:border-primary/30 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-secondary mb-3">{feature.title}</h3>
                                <p className="text-secondary/60 font-bold leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-secondary">
                <div className="container px-4 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white">
                            Passez à la vitesse supérieure.
                        </h2>
                        <p className="text-xl font-bold text-white/60">
                            Rejoignez des milliers d&apos;artisans qui facturent plus vite et plus juste.
                            Essai de 14 jours, sans carte bancaire.
                        </p>
                        <Link href="/inscription" className="inline-block mt-8">
                            <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-2xl transition-all hover:scale-105">
                                Créer mon premier devis <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
