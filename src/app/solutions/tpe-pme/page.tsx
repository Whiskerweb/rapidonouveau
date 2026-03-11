import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, CheckCircle2, ArrowRight, LineChart, FileSpreadsheet, Building2 } from 'lucide-react';

export const metadata = {
    title: "Logiciel Bâtiment pour TPE et PME (2 à 50+ salariés) | Rapido'Devis",
    description: "Centralisez la gestion de votre entreprise du BTP. Export comptable, analyse de rentabilité, devis et suivi de chantiers pour PME.",
};

export default function TpePmePage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Building2 className="w-4 h-4" />
                                <span>TPE & PME du BTP</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Structurez la <br />
                                croissance de <br /><span className="text-blue-600 italic">votre entreprise.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                Quand l&apos;équipe s&apos;agrandit, le pilotage doit se structurer. Rapido&apos;Devis centralise votre facturation et sécurise votre rentabilité globale.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/contact">
                                    <Button size="lg" className="w-full sm:w-auto h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-10 text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                        Demander une démo
                                    </Button>
                                </Link>
                                <Link href="/inscription">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 border-2 border-zinc-200 hover:border-blue-500/50 hover:bg-zinc-50 font-bold rounded-2xl px-8 text-lg text-secondary transition-all">
                                        Essayer gratuitement
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Feature Highlights Mockup */}
                        <div className="relative animate-in fade-in slide-in-from-left-8 duration-700 delay-200 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-100">
                                    <h3 className="text-xl font-black text-secondary">Rentabilité Globale</h3>
                                    <LineChart className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm font-bold text-secondary/60">Chiffre d&apos;Affaires (Mois)</div>
                                        <div className="text-2xl font-black text-secondary">142 500 €</div>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-[65%]" />
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <div className="text-sm font-bold text-secondary/60">Marge Nette Moyenne</div>
                                        <div className="text-xl font-black text-green-600">32.4%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features specifically for teams */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-secondary">
                            Pensé pour le travail d&apos;équipe.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 hover:border-blue-500/30 transition-colors">
                            <Users className="w-10 h-10 text-blue-600 mb-6" />
                            <h3 className="text-2xl font-black text-secondary mb-4">Multi-utilisateurs</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Donnez des accès spécifiques à votre comptable, votre secrétaire, ou vos conducteurs de travaux. Centralisez l&apos;information sans perdre le contrôle.
                            </p>
                        </div>
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 hover:border-blue-500/30 transition-colors">
                            <FileSpreadsheet className="w-10 h-10 text-blue-600 mb-6" />
                            <h3 className="text-2xl font-black text-secondary mb-4">Export Comptable Automatisé</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Fini les fins de mois difficiles. Exportez vos journaux de ventes et de banque au format de votre logiciel comptable (Cegid, Sage, Quadratus...) en un seul clic.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
