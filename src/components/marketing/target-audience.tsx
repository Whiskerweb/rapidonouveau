'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

const AUDIENCES = [
    {
        title: "Auto-entrepreneurs",
        icon: User,
        desc: "Parfait pour se lancer. Devis simples, facture en 1 clic, et gestion facile de la TVA non applicable.",
        link: "/solutions/auto-entrepreneurs",
        features: ["100% Gratuit à l'essai", "Mentions légales auto", "Sans engagement"],
        color: "blue"
    },
    {
        title: "TPE / PME Bâtiment",
        icon: Building2,
        desc: "L'outil central pour votre équipe. Gestion des marges, accès multi-utilisateurs et export comptable.",
        link: "/solutions/tpe-pme",
        features: ["Dashboard rentabilité", "Bibliothèque partagée", "Acomptes en ligne"],
        color: "primary"
    }
];

export function TargetAudience() {
    return (
        <section className="py-32 bg-zinc-50 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="container relative z-10 px-4">
                <div className="text-center max-w-2xl mx-auto space-y-6 mb-20">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-8 py-2.5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase inline-flex">
                        Adapté à votre taille
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary leading-tight tracking-tight">
                        Une solution pensée pour <br />
                        <span className="text-primary italic">votre structure.</span>
                    </h2>
                    <p className="text-lg text-secondary/60 font-bold">
                        Que vous soyez seul sur le terrain ou à la tête d&apos;une équipe de 10 personnes, Rapido&apos;Devis s&apos;adapte à votre volume.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {AUDIENCES.map((aud, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-xl shadow-zinc-200/40 relative group hover:border-primary/30 transition-all duration-500 flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-secondary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 z-0 pointer-events-none">
                                <aud.icon className="w-32 h-32" />
                            </div>

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-20 ${aud.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-primary/10 text-primary'}`}>
                                <aud.icon className="w-8 h-8" />
                            </div>

                            <div className="relative z-10 flex-grow">
                                <h3 className="text-3xl font-heading font-black text-secondary mb-4">{aud.title}</h3>
                                <p className="text-secondary/60 font-bold leading-relaxed mb-8">
                                    {aud.desc}
                                </p>

                                <ul className="space-y-4 mb-10 text-secondary font-bold">
                                    {aud.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3">
                                            <CheckCircle2 className={`w-5 h-5 ${aud.color === 'blue' ? 'text-blue-500' : 'text-primary'}`} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href={aud.link} className="relative z-10 mt-auto">
                                <Button size="lg" className={`w-full h-14 rounded-xl font-black text-lg ${aud.color === 'blue' ? 'bg-zinc-100 text-secondary hover:bg-blue-600 hover:text-white' : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'} transition-all`}>
                                    Voir la solution <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
