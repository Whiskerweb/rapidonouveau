import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileWarning, CheckCircle2, ArrowRight, ShieldCheck, FileCheck2, Building2, FileText } from 'lucide-react';

export const metadata = {
    title: "Logiciel Facturation Électronique BTP 2026 | Rapido'Devis",
    description: "Soyez prêt pour la réforme de la facturation électronique obligatoire en 2026. Logiciel conforme PDP pour les artisans du bâtiment.",
};

export default function FacturationElectroniquePage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 font-black text-xs uppercase tracking-widest">
                                <FileWarning className="w-4 h-4" />
                                <span>Réforme 2026</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Facturation électronique : <br />
                                <span className="text-purple-600 italic">Anticipez 2026.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                La loi change. À partir de 2026, l&apos;émission et la réception de factures électroniques deviendront obligatoires pour toutes les entreprises. Rapido&apos;Devis est déjà prêt.
                            </p>

                            <ul className="space-y-4 pt-2">
                                {[
                                    "Format Factur-X nativement supporté",
                                    "Connexion directe au Portail Public de Facturation (PPF)",
                                    "Zéro paramétrage technique pour vous",
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-secondary font-bold">
                                        <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="w-full sm:w-auto h-16 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-10 text-lg shadow-xl shadow-purple-500/20 transition-all hover:-translate-y-1">
                                        Mettre mon entreprise en conformité
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* e-Invoicing Mockup */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="absolute inset-0 bg-purple-500/20 blur-[100px] scale-90 -z-10 rounded-full" />
                            <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden">
                                <div className="bg-secondary px-6 py-4 flex items-center gap-3">
                                    <FileCheck2 className="text-purple-400 w-6 h-6" />
                                    <span className="font-bold text-white tracking-widest text-sm uppercase">Centre de Facturation E-Invoicing</span>
                                </div>
                                <div className="p-8 space-y-4 bg-zinc-50">
                                    {[
                                        { ref: "FAC-2025-104", status: "Transmise PPF", color: "text-green-600", bg: "bg-green-100" },
                                        { ref: "FAC-2025-105", status: "En attente signature", color: "text-amber-600", bg: "bg-amber-100" },
                                        { ref: "FAC-2025-106", status: "Convertie Factur-X", color: "text-purple-600", bg: "bg-purple-100" },
                                    ].map((inv, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-zinc-100 flex justify-between items-center shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-secondary">{inv.ref}</div>
                                                    <div className="text-xs font-bold text-zinc-400">PDF + XML structuré</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${inv.color} ${inv.bg}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-purple-50 border-t border-purple-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 animate-pulse">
                                        <Building2 className="w-6 h-6 text-purple-700" />
                                    </div>
                                    <div className="text-sm font-bold text-purple-900">
                                        Votre logiciel est synchronisé avec l&apos;administration fiscale. Aucun export manuel requis.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reform Explanation */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-secondary">
                            Comprendre la réforme en 3 points.
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary font-heading font-black text-2xl mx-auto mb-6 shadow-sm">01</div>
                            <h3 className="text-xl font-black text-secondary mb-4">Fin du papier et du PDF simple</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Les factures devront être émises, transmises et reçues sous un format électronique structuré (comme Factur-X), contenant des données lisibles par la machine.
                            </p>
                        </div>
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary font-heading font-black text-2xl mx-auto mb-6 shadow-sm">02</div>
                            <h3 className="text-xl font-black text-secondary mb-4">Plateformes certifiées obligatoires</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Il ne sera plus possible d&apos;envoyer directement une facture par email à un client pro. Il faudra passer par le PPF (Portail Public de Facturation) ou une PDP.
                            </p>
                        </div>
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 text-center relative overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-100/50 to-transparent -z-10" />
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary font-heading font-black text-2xl mx-auto mb-6 shadow-sm">03</div>
                            <h3 className="text-xl font-black text-secondary mb-4">Rapido&apos;Devis s&apos;occupe de tout</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Continuez à facturer comme d&apos;habitude avec Rapido&apos;Devis. Nos serveurs se chargent de la conversion et de la transmission légale en arrière-plan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
