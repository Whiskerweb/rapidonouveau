'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Info, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { MarketingLayout } from '@/components/layout/marketing-layout';
import { PricingComparison } from '@/components/marketing/pricing-comparison';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const PACKS = [
    { credits: 5, price: 29, priceId: 'price_pack_5', tag: 'Trial' },
    { credits: 10, price: 49, priceId: 'price_pack_10', tag: 'Populaire', popular: true },
    { credits: 20, price: 89, priceId: 'price_pack_20', tag: 'Best Value' },
];

const PLANS = [
    {
        name: 'Rapido Essentiel',
        price: 39,
        description: "L'essentiel pour automatiser vos estimations au quotidien.",
        commitment: 'Engagement 3 mois',
        features: [
            'Estimations illimitées',
            'Livraison sous 48h',
            'Accès Application Mobile',
            'Chiffrage poste par poste',
            'Données locales & régionales',
            'Validation recevable en banque',
            'Support client standard',
        ],
        cta: 'S\'abonner à Essentiel',
        highlighted: false,
        priceId: 'price_essentiel_monthly',
    },
    {
        name: 'Rapido Expert',
        price: 69,
        description: 'La puissance totale pour une transformation commerciale maximale.',
        commitment: 'Engagement 3 mois',
        features: [
            'Tout le plan Essentiel',
            'Validation maître d\'œuvre incluse',
            'Rapport personnalisé avec votre LOGO',
            'Division foncière & aménagement',
            'Accompagnement jusqu\'au devis artisans',
            'Export Word / PDF éditable',
            'Support prioritaire 6j/7',
        ],
        cta: 'S\'abonner à Expert',
        highlighted: true,
        priceId: 'price_expert_monthly',
    },
];

export default function NosTarifsPage() {
    const [promoCode, setPromoCode] = useState('');

    const startCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, mode, promoCode: promoCode || undefined }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
    };

    return (
        <MarketingLayout>
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": "Rapido'Devis",
                        "description": "Logiciel d'estimation travaux par IA pour les professionnels de l'immobilier.",
                        "offers": {
                            "@type": "AggregateOffer",
                            "lowPrice": "29",
                            "highPrice": "69",
                            "priceCurrency": "EUR"
                        }
                    })
                }}
            />

            {/* Hero Header */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-secondary">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.15)_0%,transparent_50%)]" />
                    <div className="absolute top-[20%] right-[-20%] w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.08)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                </div>
                <div className="container relative z-10 px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-5xl mx-auto space-y-8"
                    >
                        <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                            TARIFS 2026
                        </Badge>
                        <h1 className="text-6xl md:text-8xl font-heading font-black text-white leading-[0.9] tracking-tighter">
                            Investissez dans votre <br />
                            <span className="text-primary italic underline decoration-primary/20 underline-offset-[12px]">croissance</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-white/60 text-xl md:text-2xl font-bold mt-8">
                            Des tarifs transparents, sans frais cachés. Choisissez la formule adaptée à votre volume d&apos;activité.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Subscriptions */}
            <section className="py-32 bg-[#F9FBFF] -mt-10 relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary to-transparent opacity-10" />
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                            Abonnements
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary">La puissance en <span className="text-primary italic">continu</span></h2>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-2 max-w-5xl mx-auto">
                        {PLANS.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                                className={`relative flex flex-col rounded-[3.5rem] border-2 p-12 bg-white transition-all duration-500 overflow-hidden group ${plan.highlighted ? 'border-primary/30 shadow-[0_45px_100px_-20px_rgba(0,200,83,0.15)] ring-4 ring-primary/5 hover:scale-[1.02]' : 'border-zinc-100 shadow-[0_30px_60px_-15px_rgba(28,36,75,0.05)] hover:shadow-[0_45px_100px_-20px_rgba(28,36,75,0.1)] hover:border-zinc-200'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <>
                                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1s] ease-in-out bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-[-30deg] pointer-events-none" />
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-2.5 rounded-full text-xs font-black shadow-lg shadow-primary/30 flex items-center gap-2 uppercase tracking-[0.2em]">
                                            <Zap className="h-4 w-4 fill-white" /> Recommandé
                                        </div>
                                    </>
                                )}

                                <div className="mb-10 text-center relative z-10">
                                    <h2 className="text-3xl lg:text-4xl font-heading font-black text-secondary mb-4">{plan.name}</h2>
                                    <p className="text-secondary/50 font-bold text-sm mb-8">{plan.description}</p>
                                    <div className="flex items-baseline justify-center gap-3">
                                        <span className="text-7xl font-heading font-black tracking-tighter text-secondary">{plan.price}€</span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-secondary/60 font-black tracking-widest uppercase text-xs">HT / mois</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md inline-block ${plan.highlighted ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-500'}`}>{plan.commitment}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-zinc-100 mb-8" />

                                <ul className="flex-1 space-y-5 mb-12 relative z-10 w-full max-w-sm mx-auto">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-4">
                                            <div className="mt-0.5 bg-primary/10 rounded-full p-1 border border-primary/20 shadow-sm shrink-0">
                                                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                                            </div>
                                            <span className="text-secondary/80 font-bold text-sm leading-snug">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => startCheckout(plan.priceId, 'subscription')}
                                    className={`w-full rounded-[1.5rem] h-16 text-lg font-black transition-all duration-300 relative z-10 ${plan.highlighted
                                        ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_15px_30px_rgba(0,200,83,0.25)] hover:shadow-[0_20px_40px_rgba(0,200,83,0.35)] hover:-translate-y-1'
                                        : 'bg-secondary hover:bg-secondary/90 text-white hover:-translate-y-1 shadow-[0_10px_20px_rgba(28,36,75,0.1)]'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <PricingComparison />

            {/* Packs Section */}
            <section className="py-32 bg-white relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto space-y-6 mb-20">
                        <Badge className="bg-accent/10 text-accent border-accent/20 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                            Packs de Crédits
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary leading-[1.1]">
                            À court de temps ? <br className="hidden md:block" /> Optez pour la <span className="text-accent italic">flexibilité absolue</span>.
                        </h2>
                        <p className="text-secondary/60 text-lg font-bold">
                            Pas d&apos;engagement. Utilisez vos crédits quand vous en avez besoin, valable 3 ans.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
                        {PACKS.map((pack) => (
                            <motion.div
                                key={pack.credits}
                                whileHover={{ y: -5 }}
                                className={`relative flex flex-col items-center rounded-[3rem] border-2 p-10 text-center bg-white transition-all overflow-hidden ${pack.popular ? 'border-accent shadow-[0_30px_60px_-15px_rgba(255,107,0,0.15)] ring-4 ring-accent/5' : 'border-zinc-100 shadow-[0_20px_40px_-10px_rgba(28,36,75,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(28,36,75,0.1)] hover:border-zinc-200'
                                    }`}
                            >
                                {pack.tag && (
                                    <span className={`absolute -top-4 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${pack.popular ? 'bg-accent text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {pack.tag}
                                    </span>
                                )}
                                <p className="text-6xl font-heading font-black text-secondary mb-2">{pack.credits}</p>
                                <p className="text-xs font-black text-secondary/40 uppercase tracking-widest mb-8">Demandes d&apos;estimation</p>
                                <p className="text-4xl font-heading font-black text-secondary mb-1">{pack.price}€</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-secondary/40 mb-10 bg-zinc-50 py-1.5 px-4 rounded-full">{(pack.price / pack.credits).toFixed(1)}€ HT par rep.</p>
                                <Button
                                    variant={pack.popular ? "default" : "outline"}
                                    onClick={() => startCheckout(pack.priceId, 'payment')}
                                    className={`w-full rounded-[1.25rem] font-black h-14 text-sm transition-all ${pack.popular ? 'bg-accent hover:bg-accent/90 text-white shadow-[0_10px_20px_rgba(255,107,0,0.2)]' : 'border-zinc-200 text-secondary hover:bg-zinc-50'}`}
                                >
                                    Choisir ce pack
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Promo Section */}
                    <div className="mt-24 max-w-lg mx-auto p-10 rounded-[3rem] bg-white border-2 border-zinc-100 shadow-[0_30px_60px_-15px_rgba(28,36,75,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                        <div className="flex flex-col gap-6 text-center relative z-10">
                            <div className="flex items-center justify-center gap-3 text-secondary font-black text-sm uppercase tracking-[0.2em]">
                                <span className="p-2 bg-primary/10 rounded-xl">🎟️</span> Code Promotionnel
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    placeholder="ÉCONOMIE20..."
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="h-14 rounded-2xl text-center font-black tracking-widest uppercase text-lg border-2 border-zinc-200 focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="shrink-0 h-14 w-14 rounded-2xl border-2 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300">
                                                <Info className="h-6 w-6 text-zinc-400" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent sideOffset={10} className="bg-secondary text-white font-bold p-4 max-w-[250px] shadow-xl rounded-2xl border-none">
                                            <p className="text-sm">Le code s&apos;appliquera automatiquement lors du paiement final sécurisé sur Stripe.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-32 bg-secondary text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,83,0.15)_0%,transparent_60%)]" />
                <div className="container px-4 relative z-10">
                    <div className="flex justify-center gap-1 mb-8">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]" />)}
                    </div>
                    <p className="text-3xl md:text-5xl font-heading font-black italic max-w-4xl mx-auto leading-tight text-white/90">
                        &quot;En tant que marchand de biens, Rapido&apos;Devis est devenu mon bras droit. Je valide mes projets 72h plus vite qu&apos;avant.&quot;
                    </p>
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20">
                            JD
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-black text-xl">Jean-Daniel R.</p>
                            <p className="text-white/50 uppercase tracking-[0.2em] text-[10px] font-black mt-1">Marchand de biens - Paris</p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
