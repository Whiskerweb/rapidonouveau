'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Zap } from 'lucide-react';

import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const PLANS = [
    {
        id: 'essentiel',
        name: 'Essentiel',
        price: { monthly: 49, yearly: 39 },
        description: 'Pour les professionnels qui débutent avec la digitalisation de leurs devis.',
        features: [
            '5 estimations / mois',
            'Devis PDF généré automatiquement',
            'Support par email',
            'Accès à la base de tarifs',
        ],
        cta: 'Commencer avec Essentiel',
        highlighted: false,
        priceId: { monthly: 'price_essentiel_monthly', yearly: 'price_essentiel_yearly' },
    },
    {
        id: 'expert',
        name: 'Expert',
        price: { monthly: 99, yearly: 79 },
        description: 'Pour les pros qui veulent maximiser leur productivité et impressionner leurs clients.',
        features: [
            'Estimations illimitées',
            'Devis PDF avec votre logo',
            'Support prioritaire',
            'Base de tarifs mise à jour en temps réel',
            'Export Excel & Word',
            'Codes promo & parrainage',
        ],
        cta: 'Commencer avec Expert',
        highlighted: true,
        priceId: { monthly: 'price_expert_monthly', yearly: 'price_expert_yearly' },
    },
];

const PACKS = [
    { credits: 3, price: 29, priceId: 'price_pack_3' },
    { credits: 10, price: 79, priceId: 'price_pack_10', popular: true },
    { credits: 25, price: 149, priceId: 'price_pack_25' },
];

const FAQ = [
    {
        q: "Puis-je changer de plan à tout moment ?",
        a: "Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. La facturation est au prorata.",
    },
    {
        q: "Les crédits des packs ont-ils une date d'expiration ?",
        a: "Oui, les crédits expirent 12 mois après leur achat. Vous recevrez une notification avant l'expiration.",
    },
    {
        q: "Comment fonctionne l'essai gratuit ?",
        a: "Votre première estimation est offerte, sans CB requise. Vous pouvez tester la qualité de notre service avant de vous engager.",
    },
    {
        q: "Acceptez-vous les paiements par virement ou chèque ?",
        a: "Pour les entreprises, nous pouvons établir une facturation annuelle par virement. Contactez-nous.",
    },
];

export default function NosTarifsPage() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [promoCode, setPromoCode] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const startCheckout = async (priceId: string) => {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, mode: 'subscription' }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
    };

    const startPackCheckout = async (priceId: string) => {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, mode: 'payment', promoCode }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
    };

    return (
        <MarketingLayout>

            {/* HEADER */}
            <section className="bg-background pt-16 pb-12 text-center">
                <div className="container px-4 md:px-6 flex flex-col items-center space-y-4">
                    <Badge variant="outline" className="rounded-full">Tarifs transparents</Badge>
                    <h1 className="text-4xl font-heading font-extrabold sm:text-5xl text-rapido-blue">
                        Choisissez votre formule
                    </h1>
                    <p className="max-w-xl text-zinc-500 md:text-lg">
                        Abonnement mensuel ou packs à la carte — adaptez-vous à votre rythme de travail.
                    </p>

                    {/* Billing toggle */}
                    <div className="flex items-center gap-3 mt-4 p-1 rounded-full bg-zinc-100">
                        <button
                            onClick={() => setBilling('monthly')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white shadow text-rapido-blue' : 'text-zinc-500'}`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setBilling('yearly')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white shadow text-rapido-blue' : 'text-zinc-500'}`}
                        >
                            Annuel
                            <span className="rounded-full bg-rapido-green text-white text-[10px] px-2 py-0.5 font-bold">-20%</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* PLANS */}
            <section className="py-8 pb-20">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-2xl border p-8 ${plan.highlighted
                                        ? 'border-rapido-green bg-rapido-blue text-white shadow-2xl shadow-rapido-blue/20 scale-[1.02]'
                                        : 'border-zinc-200 bg-white'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="flex items-center gap-1 rounded-full bg-rapido-green px-4 py-1 text-xs font-bold text-white">
                                            <Zap className="h-3 w-3" /> Recommandé
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className={`font-heading text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-rapido-blue'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`mt-1 text-sm ${plan.highlighted ? 'text-rapido-blue-200' : 'text-zinc-500'}`}>
                                        {plan.description}
                                    </p>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className={`font-heading text-5xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-rapido-blue'}`}>
                                            {billing === 'monthly' ? plan.price.monthly : plan.price.yearly}€
                                        </span>
                                        <span className={`text-sm ${plan.highlighted ? 'text-rapido-blue-200' : 'text-zinc-400'}`}>/mois</span>
                                    </div>
                                    {billing === 'yearly' && (
                                        <p className={`mt-1 text-xs ${plan.highlighted ? 'text-rapido-green' : 'text-rapido-green-600'}`}>
                                            Économisez {(plan.price.monthly - plan.price.yearly) * 12}€/an
                                        </p>
                                    )}
                                </div>

                                <ul className="flex-1 space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm">
                                            <Check className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? 'text-rapido-green' : 'text-rapido-green'}`} />
                                            <span className={plan.highlighted ? 'text-rapido-blue-100' : 'text-zinc-600'}>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => startCheckout(plan.priceId[billing])}
                                    className={`w-full rounded-full ${plan.highlighted
                                            ? 'bg-rapido-green hover:bg-rapido-green-600 text-white'
                                            : 'bg-rapido-blue hover:bg-rapido-blue-700 text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PACKS À LA CARTE */}
            <section className="bg-zinc-50 py-20">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center text-center space-y-3 mb-12">
                        <Badge variant="outline" className="rounded-full">Sans abonnement</Badge>
                        <h2 className="text-3xl font-heading font-extrabold text-rapido-blue">
                            Packs de crédits à la carte
                        </h2>
                        <p className="max-w-lg text-zinc-500 md:text-lg">
                            Payez seulement ce que vous utilisez. Idéal pour tester ou pour les petits volumes.
                        </p>
                    </div>

                    {/* Promo code input */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-10">
                        <Input
                            placeholder="Code promo..."
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="rounded-full"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
                        {PACKS.map((pack) => (
                            <div
                                key={pack.credits}
                                className={`relative flex flex-col items-center rounded-2xl border p-6 text-center ${pack.popular ? 'border-rapido-green bg-rapido-green/5 ring-2 ring-rapido-green' : 'border-zinc-200 bg-white'
                                    }`}
                            >
                                {pack.popular && (
                                    <span className="absolute -top-3 rounded-full bg-rapido-green px-3 py-0.5 text-xs font-bold text-white">
                                        Populaire
                                    </span>
                                )}
                                <p className="font-heading text-4xl font-extrabold text-rapido-blue">{pack.credits}</p>
                                <p className="text-sm text-zinc-500 mb-4">crédits</p>
                                <p className="font-heading text-2xl font-bold text-rapido-blue">{pack.price}€</p>
                                <p className="text-xs text-zinc-400 mb-6">{(pack.price / pack.credits).toFixed(0)}€ / crédit</p>
                                <Button
                                    onClick={() => startPackCheckout(pack.priceId)}
                                    variant={pack.popular ? 'default' : 'outline'}
                                    className={`w-full rounded-full ${pack.popular ? 'bg-rapido-green hover:bg-rapido-green-600 text-white' : ''}`}
                                >
                                    Acheter
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20">
                <div className="container px-4 md:px-6 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-heading font-extrabold text-rapido-blue text-center mb-10">
                        Questions fréquentes
                    </h2>
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <div key={i} className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                                <button
                                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-rapido-blue hover:bg-zinc-50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {item.q}
                                    <span className="ml-4 text-rapido-green text-xl">{openFaq === i ? '−' : '+'}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="border-t px-5 pb-5 pt-3 text-sm text-zinc-600 leading-relaxed">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </MarketingLayout>
    );
}
