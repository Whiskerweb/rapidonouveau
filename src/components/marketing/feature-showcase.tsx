'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { AnimatedQuoteEditor } from '@/components/marketing/animated-quote-editor';
import { AnimatedPriceLibrary } from '@/components/marketing/animated-price-library';
import { AnimatedSignaturePayment } from '@/components/marketing/animated-signature-payment';

const SHOWCASE_ITEMS = [
    {
        title: "Éditeur de devis ultra-rapide",
        subtitle: "Créez, modifiez, envoyez.",
        desc: "L'interface a été purgée de toute complexité. Oubliez les 40 colonnes sur Excel. Ajoutez vos ouvrages, ajustez vos marges, et le PDF conforme se génère de l'autre côté.",
        features: ["Marges garanties", "TVA auto-calculée", "Mentions légales incluses"],
        Component: AnimatedQuoteEditor,
        link: "/fonctionnalites/devis-factures",
        align: "left"
    },
    {
        title: "Bibliothèque de prix intelligente",
        subtitle: "La fin des recherches interminables.",
        desc: "Fini de chercher les tarifs de vos fournisseurs sur 4 sites différents. L'IA analyse votre saisie et vous propose les matériaux avec leurs prix actualisés par région.",
        features: ["Plus de 40 000 ouvrages", "Mise à jour en temps réel", "Calcul des temps de pose"],
        Component: AnimatedPriceLibrary,
        link: "/fonctionnalites/bibliotheque-prix",
        align: "right"
    },
    {
        title: "Paiements débloqués instantanément",
        subtitle: "Signature en ligne & Acomptes.",
        desc: "Envoyez le lien du devis par SMS. Le client signe sur son écran et paie l'acompte de 30% par carte bancaire. Les fonds arrivent sur votre compte de dépôt sous 48h.",
        features: ["Division des délais moyens par 2", "Validation juridique instantanée", "Stripe sécurisé"],
        Component: AnimatedSignaturePayment,
        link: "/fonctionnalites/signature-paiement",
        align: "left"
    }
];

export function FeatureShowcase() {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container px-4">
                <div className="text-center max-w-3xl mx-auto space-y-6 mb-24">
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary leading-tight">
                        De la visite client à
                        <span className="text-primary italic block">l&apos;encaissement de l&apos;acompte.</span>
                    </h2>
                    <p className="text-xl text-secondary/60 font-bold">
                        Trois étapes clés couvertes par un outil conçu avec des artisans, pour des artisans.
                    </p>
                </div>

                <div className="space-y-32">
                    {SHOWCASE_ITEMS.map((item, idx) => (
                        <div key={idx} className={`flex flex-col gap-12 lg:gap-24 items-center ${item.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: item.align === 'left' ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="lg:w-1/2 flex flex-col space-y-8"
                            >
                                <div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase inline-flex mb-4">
                                        {item.subtitle}
                                    </Badge>
                                    <h3 className="text-4xl lg:text-5xl font-heading font-black text-secondary leading-[1.1] tracking-tight">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-xl text-secondary/70 font-bold leading-relaxed">
                                    {item.desc}
                                </p>

                                <ul className="space-y-4">
                                    {item.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-4 text-secondary font-bold text-lg">
                                            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4">
                                    <Link href={item.link}>
                                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black text-lg transition-all hover:scale-105 shadow-xl shadow-secondary/10">
                                            En savoir plus <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Image Showcase */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="lg:w-1/2 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/20 rounded-[3rem] transform rotate-3" />
                                <div className="relative rounded-[3rem] border border-zinc-100 bg-white p-4 shadow-2xl overflow-hidden">
                                    {/* Fake UI Header */}
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="w-full h-full min-h-[400px] bg-zinc-50 rounded-3xl relative overflow-hidden">
                                        <item.Component />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
