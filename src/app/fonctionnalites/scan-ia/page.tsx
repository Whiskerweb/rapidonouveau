import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Sparkles, FileText, Zap, Search, ArrowRight, MousePointer2, Layers } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: "Le Scan IA : L'extraction de données par Rapido'Devis",
    description: "Comment notre IA propriétaire analyse vos documents techniques (PDF, Plans, Photos) pour en extraire les postes de travaux en quelques secondes.",
};

export default function ScanIAPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-white overflow-hidden">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">Intelligence Artificielle</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Transformez vos plans <br />
                                en <span className="text-primary italic">données actionnables.</span>
                            </h1>

                            <p className="text-secondary/50 text-xl font-bold leading-relaxed max-w-xl">
                                Finis les métrés manuels et les heures passées sur des fichiers PDF illisibles. Notre Scan IA extrait chaque détail pour vous.
                            </p>

                            <div className="flex gap-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-xl transition-all hover:scale-105 active:scale-95">
                                        Essayer le scan
                                    </Button>
                                </Link>
                                <Button size="lg" variant="ghost" className="h-16 text-secondary font-bold text-lg hover:bg-zinc-50 rounded-2xl group">
                                    Comment ça marche ? <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* Interactive Visual Placeholder */}
                        <div className="relative group animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] scale-90 -z-10 animate-pulse" />
                            <div className="bg-white rounded-[3rem] shadow-2xl border border-zinc-100 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm bg-white/80">
                                {/* Mock Scan UI */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-primary w-5 h-5" />
                                            <span className="text-xs font-black uppercase text-secondary/40 tracking-widest">Plan_Chantier_V2.pdf</span>
                                        </div>
                                        <Badge className="bg-primary/20 text-primary border-primary/10">Extraction en cours...</Badge>
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        {[
                                            { label: 'Surface Sol', val: '124.5 m²', color: 'bg-primary' },
                                            { label: 'Linéaire Murs', val: '48.2 m', color: 'bg-blue-500' },
                                            { label: 'Menuiseries', val: '12 unités', color: 'bg-orange-500' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 group/item hover:border-primary/30 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                    <span className="text-sm font-bold text-secondary">{item.label}</span>
                                                </div>
                                                <span className="text-sm font-black text-secondary">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex justify-center">
                                        <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[75%] animate-scan-progress" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analysis Steps */}
            <section className="py-32 bg-zinc-50">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary">La technologie derrière le scan.</h2>
                        <p className="text-secondary/50 text-xl font-bold">Un processus en trois couches pour une précision absolue.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Search,
                                title: "Reconnaissance de Formes",
                                desc: "Identification des symboles, annotations et structures architecturales sur tout type de document."
                            },
                            {
                                icon: Layers,
                                title: "Calcul de métrés",
                                desc: "Traduction automatique des échelles et conversion en surfaces, volumes ou linéaires."
                            },
                            {
                                icon: Zap,
                                title: "Mapping Matériaux",
                                desc: "Lien direct entre les éléments détectés et notre base de données de 50 000+ tarifs matériaux."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-zinc-100 space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-primary">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary">{item.title}</h3>
                                <p className="text-secondary/50 font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="max-w-6xl mx-auto rounded-[4rem] bg-secondary text-white p-12 md:p-24 overflow-hidden relative">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-6xl font-heading font-black">Plus vite, <br /><span className="text-primary italic">plus juste.</span></h2>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                                            <span className="font-black">8X</span>
                                        </div>
                                        <p className="font-bold text-white/70">8 fois plus rapide qu&apos;une saisie manuelle classique.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                                            <span className="font-black">1%</span>
                                        </div>
                                        <p className="font-bold text-white/70">Marge d&apos;erreur technique réduite au minimum.</p>
                                    </div>
                                </div>
                                <Link href="/inscription" className="inline-block">
                                    <Button className="bg-primary hover:bg-primary/95 text-white font-black h-16 px-10 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105">
                                        Lancer un test gratuit
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative aspect-video rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl transform rotate-3">
                                {/* Placeholder for real dashboard screenshot or animation */}
                                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-700">
                                    <MousePointer2 className="w-12 h-12 animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
