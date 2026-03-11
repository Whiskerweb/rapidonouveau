import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ShieldCheck, HardHat, FileCheck, Award, ArrowRight, UserCheck, Star, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: "Expertise Humaine : La validation certifiée Rapido'Devis",
    description: "Chaque estimation générée par notre IA est auditée et validée par un expert du bâtiment (Economiste, MOE) avant envoi final.",
};

export default function ExpertiseHumainePage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Certification Humaine</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Parce que l&apos;IA seule <br />
                                ne suffit <span className="text-primary italic">pas toujours.</span>
                            </h1>

                            <p className="text-secondary/50 text-xl font-bold leading-relaxed max-w-xl">
                                Chez Rapido&apos;Devis, chaque dossier est audité par un Maître d&apos;Œuvre ou un Économiste de la construction. La puissance du numérique alliée à l&apos;expérience du terrain.
                            </p>

                            <div className="flex gap-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-xl transition-all hover:scale-105 active:scale-95">
                                        Demander ma validation
                                    </Button>
                                </Link>
                                <Button size="lg" variant="ghost" className="h-16 text-secondary font-bold text-lg hover:bg-zinc-100 rounded-2xl group">
                                    Nos experts <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* Profile/Trust Card */}
                        <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                            <div className="absolute inset-0 bg-primary/10 blur-[80px] scale-110 -z-10" />
                            <div className="bg-white rounded-[4rem] shadow-2xl p-10 md:p-14 border border-zinc-100 flex flex-col items-center text-center space-y-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-zinc-100 overflow-hidden border-4 border-white shadow-xl">
                                        {/* Expert Profile Placeholder */}
                                        <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center text-white">
                                            <HardHat className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white">
                                        <Award className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-secondary">Expert Validateur</h3>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest">Maître d&apos;œuvre certifié</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 text-left">
                                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Dernier Audit</p>
                                        <p className="text-sm font-bold text-secondary">Maçonnerie - 12 items</p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 text-left">
                                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Statut</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-sm font-bold text-secondary">Certifié</span>
                                        </div>
                                    </div>
                                </div>

                                <blockquote className="text-sm font-bold italic text-secondary/60 bg-zinc-50 p-6 rounded-3xl">
                                    &quot;Je vérifie chaque ratio matériaux et chaque temps de main d&apos;œuvre pour m&apos;assurer que l&apos;estimation est réaliste pour l&apos;artisan.&quot;
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Human Input */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">Garantie Qualité</Badge>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary">Votre réputation ne peut pas dépendre d&apos;un algorithme seul.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: UserCheck,
                                title: "Audit Métier",
                                desc: "Vérification des ratios techniques propres à chaque corps d'état (DTU)."
                            },
                            {
                                icon: FileCheck,
                                title: "Relecture Prix",
                                desc: "Ajustement des tarifs selon la réalité du marché local et de l'inflation."
                            },
                            {
                                icon: Star,
                                title: "Crédibilité",
                                desc: "Des estimations solides qui résistent aux expertises contradictoires."
                            },
                            {
                                icon: ThumbsUp,
                                title: "Sérénité",
                                desc: "Déléguez le chiffrage en toute confiance et concentrez-vous sur vos chantiers."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 space-y-6 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500">
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-primary w-fit">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-secondary">{item.title}</h3>
                                <p className="text-secondary/50 font-bold text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-32">
                <div className="container px-4">
                    <div className="relative group overflow-hidden rounded-[4rem] bg-primary p-12 md:p-24 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-7xl font-heading font-black text-white leading-tight">
                                Obtenez votre première <br />
                                estimation <span className="text-secondary italic">validée par un expert.</span>
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <Link href="/inscription" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-20 w-full bg-white text-primary hover:bg-zinc-50 font-black rounded-3xl px-16 text-2xl shadow-2xl transition-all hover:scale-105">
                                        Démarrer gratuitement
                                    </Button>
                                </Link>
                                <Link href="/contact" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-20 w-full rounded-3xl border-white/20 text-white hover:bg-white/10 px-16 text-2xl font-black">
                                        Parler à un expert
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
