'use client';

import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Eye, Users, Building2, Rocket, Heart } from 'lucide-react';

const VALUES = [
    { icon: Target, title: 'Précision Chiffrée', text: "L'IA calcule, l'humain valide. Cette double couche garantit un taux d'erreur proche de zéro pour vos dossiers financiers." },
    { icon: Zap, title: 'Vitesse de Réaction', text: "Le temps est votre ressource la plus précieuse. Nous livrons en 48h maximum pour que vous ne ratiez aucune opportunité." },
    { icon: Shield, title: 'Conformité Bancaire', text: "Nos rapports ne sont pas de simples estimations, ce sont des documents structurés acceptés par les courtiers et les banques." },
    { icon: Eye, title: 'Transparence Radicale', text: "Pas d'abonnement caché, pas de jargon complexe. Nous parlons le langage des artisans et de la tech." },
];

const TIMELINE = [
    { year: '2023', title: 'La Genèse', desc: "Rencontre entre un maître d'œuvre et un expert en IA. Le prototype de Scan IA est né." },
    { year: '2024', title: 'Lancement Pro', desc: "Ouverture de la plateforme aux premiers agents immobiliers et marchands de biens." },
    { year: '2025', title: 'Expertise Humaine', desc: "Intégration systématique de la validation par des économistes de la construction." },
    { year: '2026', title: 'Expansion 2.0', desc: "Lancement de la solution mobile et de l'IA générative spécialisée par métier." },
];

export default function AProposPage() {
    return (
        <MarketingLayout>
            {/* Mission Hero */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-white">
                <div className="container relative z-10 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                            Notre Mission
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-heading font-black text-secondary leading-[0.9] tracking-tighter">
                            Démocratiser l&apos;expertise <br />
                            <span className="text-primary italic">du bâtiment.</span>
                        </h1>
                        <p className="text-secondary/50 text-xl md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto">
                            Rapido&apos;Devis est né pour supprimer la barrière entre l&apos;idée de travaux et son estimation chiffrée réelle.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-32 bg-[#F9FBFF]">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {VALUES.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <v.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary mb-4">{v.title}</h3>
                                <p className="text-secondary/40 font-bold leading-relaxed">{v.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-40 bg-white overflow-hidden">
                <div className="container px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/3 space-y-8">
                            <h2 className="text-5xl font-heading font-black text-secondary leading-tight">
                                Notre <br />
                                <span className="text-primary italic">évolution.</span>
                            </h2>
                            <p className="text-secondary/50 text-xl font-bold leading-relaxed">
                                De l&apos;idée brute à l&apos;outil de référence pour des milliers de professionnels.
                            </p>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-10">
                            {TIMELINE.map((item, i) => (
                                <div key={i} className="relative p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 space-y-4">
                                    <span className="text-5xl font-heading font-black text-primary/20">{item.year}</span>
                                    <h4 className="text-2xl font-black text-secondary">{item.title}</h4>
                                    <p className="text-secondary/40 font-bold">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision / Team Numbers */}
            <section className="py-32 bg-secondary text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.1)_0%,transparent_70%)] opacity-30" />
                <div className="container relative z-10 px-4">
                    <div className="grid md:grid-cols-4 gap-12 text-center">
                        {[
                            { icon: Users, value: '21 000+', label: 'Utilisateurs' },
                            { icon: Building2, value: '15+', label: 'Métiers couverts' },
                            { icon: Rocket, value: '48h', label: 'Délai garanti' },
                            { icon: Heart, value: '4.8/5', label: 'Satisfaction' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-5xl font-heading font-black text-primary">{stat.value}</p>
                                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-40 bg-white">
                <div className="container px-4">
                    <div className="bg-zinc-50 rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
                        <h2 className="text-4xl md:text-7xl font-heading font-black text-secondary leading-tight relative z-10">
                            Prêt à nous rejoindre <br />
                            dans cette <span className="text-primary italic">aventure ?</span>
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
                            <Link href="/inscription" className="w-full sm:w-auto">
                                <Button size="lg" className="h-20 w-full bg-primary hover:bg-primary/95 text-white font-black rounded-3xl px-16 text-2xl shadow-2xl transition-all hover:scale-105">
                                    Essayer l&apos;outil
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="h-20 w-full rounded-3xl border-secondary/10 text-secondary bg-white hover:bg-zinc-50 px-16 text-2xl font-black">
                                    Poser une question
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
