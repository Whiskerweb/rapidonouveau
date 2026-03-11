'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Star } from 'lucide-react';

const BENEFITS = [
    "Estimation conforme aux normes bancaires",
    "Analyse IA + Validation par Maître d'œuvre",
    "Données matériaux actualisées localement",
    "Rapport complet en moins de 48 heures"
];

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-10 xl:pb-0 overflow-hidden bg-white">
            {/* Mesh Gradient Background - Subtle Pro Style */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left: Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="flex flex-col space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/10 bg-primary/5 px-4 py-1.5 w-fit"
                            >
                                <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Solution N°1 au bâtiment</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                L&apos;IA qui <br />
                                <span className="text-primary italic">automatise</span> vos <br />
                                estimations travaux.
                            </h1>
                        </div>

                        {/* Benefit Checklist - Obat Style */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                            {BENEFITS.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm font-bold text-secondary/80 leading-snug">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            <Link href="/inscription">
                                <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-[0_20px_40px_rgba(0,200,83,0.3)] transition-all hover:scale-105 active:scale-95">
                                    Démarrer l&apos;essai gratuit
                                </Button>
                            </Link>
                            <Link href="/notre-solution">
                                <Button size="lg" variant="outline" className="h-16 rounded-2xl px-12 text-xl border-secondary/10 text-secondary bg-white hover:bg-zinc-50 transition-all font-bold">
                                    Voir la démo
                                </Button>
                            </Link>
                        </div>

                        {/* Ratings & Trust Block */}
                        <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <div className="flex gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-secondary/60 uppercase tracking-widest leading-none">
                                        4.9/5 • 2 500+ AVIS PROS
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-zinc-200" />
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 shadow-sm" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-black text-secondary/80">Rejoint par 21k+ experts</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                        alt="App Store"
                                        width={120}
                                        height={40}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                                <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                        alt="Google Play"
                                        width={135}
                                        height={40}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Visual Showcase Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10">
                            <Image
                                src="https://rapido-devis.fr/wp-content/uploads/2025/10/tech-startup-hero-mobile-img-2.png-2.png"
                                alt="Rapido'Devis Dashboard"
                                width={800}
                                height={1000}
                                className="w-full h-auto"
                                priority
                            />
                        </div>

                        {/* Professional Floating Data Badge */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-6 z-20 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-zinc-100 hidden lg:block max-w-[200px]"
                        >
                            <div className="space-y-3">
                                <div className="p-2 bg-blue-50 rounded-xl w-fit">
                                    <span className="text-blue-600 font-black text-xs uppercase tracking-tighter">Données locales</span>
                                </div>
                                <p className="text-sm font-black text-secondary leading-tight">Mise à jour en temps réel des tarifs 2026</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-10 -left-10 z-20 bg-secondary p-6 rounded-[2.5rem] shadow-2xl border border-white/10 hidden lg:block"
                        >
                            <div className="flex items-center gap-4 text-white">
                                <CheckCircle2 className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-extrabold text-xs uppercase tracking-widest">Validité Bancaire</p>
                                    <p className="text-[10px] text-white/50 font-semibold italic">Maître d&apos;œuvre certifié</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>


            </div>
        </section>
    );
}
