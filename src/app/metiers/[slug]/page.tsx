'use client';

import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { METIERS_DATA } from '@/data/metiers';
import { CheckCircle2, PlayCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Testimonials } from '@/components/marketing/testimonials';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import * as React from 'react';

export default function MetierPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = React.use(params);
    const slug = resolvedParams.slug;
    const data = METIERS_DATA[slug as keyof typeof METIERS_DATA];

    if (!data) notFound();

    const Icon = data.icon;

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Estimation travaux ${data.title}`,
        "description": data.description,
        "provider": {
            "@type": "Organization",
            "name": "Rapido'Devis"
        },
        "areaServed": "France"
    };

    return (
        <MarketingLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[100px]" />
                </div>

                <div className="container relative z-10 px-4">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                        <div className="p-4 bg-white rounded-3xl shadow-xl border border-zinc-100 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Icon className="w-10 h-10" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary leading-[1.1] tracking-tight">
                            {data.heroTitle}
                            <span className="text-primary italic">{data.heroTitleAccent}</span>
                        </h1>

                        <p className="text-secondary/50 text-xl md:text-2xl font-bold leading-relaxed max-w-2xl">
                            {data.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4 w-full justify-center">
                            <Link href="/inscription" className="sm:w-auto">
                                <Button size="lg" className="h-16 w-full bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-[0_20px_40px_rgba(0,200,83,0.3)] transition-all hover:scale-105">
                                    Essayer gratuitement
                                </Button>
                            </Link>
                            <Link href="/notre-solution" className="sm:w-auto">
                                <Button size="lg" variant="outline" className="h-16 w-full rounded-2xl px-12 text-xl border-secondary/10 text-secondary bg-white hover:bg-zinc-50 font-bold">
                                    Voir la démo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 shadow-sm" />
                                ))}
                            </div>
                            <p className="text-xs font-black text-secondary/40 uppercase tracking-widest">
                                Rejoint par <span className="text-secondary">21 000+</span> experts
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 bg-[#F9FBFF]">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.benefits.map((benefit, i) => (
                            <div key={i} className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 hover:shadow-md transition-all group">
                                <CheckCircle2 className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                                <p className="font-bold text-secondary leading-snug">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works - Mini */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="bg-secondary/5 text-secondary/40 border-secondary/10 px-6 py-2 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">Processus</Badge>
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary mt-4">Comment ça <span className="text-primary italic">marche ?</span></h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { step: '01', title: 'Upload de plans', desc: 'Envoyez vos plans PDF, photos ou descriptifs sommaires sur la plateforme.' },
                                { step: '02', title: 'Analyse IA + Humaine', desc: 'Notre IA extrait les données et un expert métier valide la cohérence technique.' },
                                { step: '03', title: 'Rapport 48h', desc: 'Recevez votre estimation détaillée, prête à être présentée à vos clients ou partenaires.' },
                            ].map((s, i) => (
                                <div key={i} className="relative p-10 rounded-[3rem] bg-zinc-50 border border-zinc-100 space-y-4">
                                    <span className="text-6xl font-heading font-black text-primary/10 absolute top-6 right-8">{s.step}</span>
                                    <h3 className="text-2xl font-black text-secondary relative z-10">{s.title}</h3>
                                    <p className="text-secondary/40 font-bold relative z-10">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Arguments Section */}
            <section className="py-32 bg-[#F9FBFF]">
                <div className="container px-4">
                    <div className="flex flex-col items-center text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary">
                            L&apos;alliance de l&apos;IA et de <br />
                            <span className="text-primary italic">l&apos;expertise métier.</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        {data.arguments.map((arg, i) => (
                            <div key={i} className="relative p-10 rounded-[3.5rem] bg-white border border-zinc-100 space-y-6 group hover:shadow-2xl transition-all duration-500">
                                <div className="p-5 bg-zinc-50 rounded-3xl shadow-sm text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                                    <arg.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary">{arg.title}</h3>
                                <p className="text-secondary/50 font-bold leading-relaxed">{arg.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Testimonials metier={slug} />

            {/* FAQ Section */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-heading font-black text-secondary">Questions <span className="text-primary italic">Fréquentes.</span></h2>
                            <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs">Spécificités {data.title}</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {data.faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border-2 border-zinc-100 rounded-[2rem] px-8 overflow-hidden bg-zinc-50/50 hover:bg-white hover:border-primary/20 transition-all data-[state=open]:border-primary/30 data-[state=open]:bg-white data-[state=open]:shadow-xl">
                                    <AccordionTrigger className="text-xl font-black text-secondary text-left hover:no-underline py-8">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-secondary/50 font-bold text-lg leading-relaxed pb-8">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.15)_0%,transparent_70%)] opacity-30" />
                <div className="container px-4 relative z-10">
                    <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-[4rem] p-12 md:p-24 text-center space-y-12">
                        <h2 className="text-4xl md:text-7xl font-heading font-black text-white leading-tight">
                            Prêt à révolutionner votre <br />
                            chiffrage en <span className="text-primary italic">{data.slug}</span> ?
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <Link href="/inscription" className="w-full sm:w-auto">
                                <Button size="lg" className="h-20 w-full bg-primary hover:bg-primary/95 text-white font-black rounded-3xl px-16 text-2xl shadow-2xl transition-all hover:scale-105">
                                    C&apos;est parti !
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="h-20 w-full rounded-3xl border-white/10 text-white hover:bg-white/10 px-16 text-2xl font-black">
                                    Nous contacter
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
