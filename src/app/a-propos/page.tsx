import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const TEAM = [
    { name: 'Équipe Fondatrice', role: 'Experts en immobilier & tech', initials: 'EF' },
    { name: 'Pôle IA & Data', role: 'Ingénieurs en machine learning', initials: 'IA' },
    { name: 'Experts Bâtiment', role: 'Artisans et économistes de la construction', initials: 'EB' },
];

const VALUES = [
    { icon: '🎯', title: 'Précision', text: "Chaque estimation est vérifiée par des experts humains. Nous ne sacrifions jamais la qualité pour la vitesse." },
    { icon: '⚡', title: 'Rapidité', text: "48h, c'est notre promesse. Parce que dans l'immobilier, le temps est de l'argent." },
    { icon: '🤝', title: 'Transparence', text: "Tarifs clairs, processus lisible, sans surprise. Nous construisons une relation de confiance durable." },
    { icon: '🔒', title: 'Confidentialité', text: "Vos données restent les vôtres. Stockage sécurisé en France, jamais revendues." },
];

export default function AProposPage() {
    return (
        <MarketingLayout>

            {/* HERO */}
            <section className="bg-background pt-16 pb-16 md:pt-24">
                <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                    <Badge variant="outline" className="rounded-full">À Propos</Badge>
                    <h1 className="text-4xl font-heading font-extrabold sm:text-5xl text-rapido-blue">
                        Notre mission : démocratiser<br />l&apos;estimation travaux.
                    </h1>
                    <p className="text-zinc-500 md:text-xl leading-relaxed">
                        Rapido&apos;Devis est né d&apos;un constat simple : obtenir une estimation de travaux fiable était
                        trop long, trop cher et trop opaque pour les professionnels de l&apos;immobilier.
                        Nous avons décidé de changer ça.
                    </p>
                </div>
            </section>

            {/* STORY */}
            <section className="bg-zinc-50 py-20">
                <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-heading font-extrabold text-rapido-blue">Notre histoire</h2>
                        <div className="space-y-4 text-zinc-600 leading-relaxed">
                            <p>
                                Fondé par des professionnels de l&apos;immobilier et de la tech, Rapido&apos;Devis a vu le
                                jour en 2023 avec une conviction : les technologies d&apos;IA pouvaient transformer
                                radicalement la façon dont les professionnels estiment les travaux.
                            </p>
                            <p>
                                Après avoir testé notre solution avec des agents immobiliers, promoteurs et
                                architectes, nous avons affiné notre approche pour combiner la puissance de
                                l&apos;IA avec l&apos;expertise irremplaçable des professionnels du bâtiment.
                            </p>
                            <p>
                                Aujourd&apos;hui, plus de 1 000 professionnels utilisent Rapido&apos;Devis chaque mois pour
                                gagner du temps, impressionner leurs clients et prendre de meilleures décisions.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: '2023', label: 'Année de création' },
                            { value: '+1 000', label: 'Professionnels' },
                            { value: '+10 000', label: 'Devis générés' },
                            { value: '98%', label: 'Satisfaction' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl bg-rapido-blue p-6 text-center text-white">
                                <p className="font-heading text-3xl font-extrabold">{s.value}</p>
                                <p className="text-rapido-blue-200 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-20">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-heading font-extrabold text-rapido-blue text-center mb-12">
                        Nos valeurs
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {VALUES.map((v, i) => (
                            <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-3 shadow-sm">
                                <div className="text-3xl">{v.icon}</div>
                                <h3 className="font-bold text-rapido-blue">{v.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="bg-zinc-50 py-20">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-heading font-extrabold text-rapido-blue text-center mb-12">
                        Notre équipe
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {TEAM.map((m, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-3 rounded-2xl bg-white border border-zinc-100 p-8 shadow-sm">
                                <div className="h-16 w-16 rounded-full bg-rapido-blue flex items-center justify-center font-heading font-bold text-white">
                                    {m.initials}
                                </div>
                                <p className="font-semibold text-rapido-blue">{m.name}</p>
                                <p className="text-zinc-500 text-sm">{m.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-rapido-blue py-16">
                <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-heading font-extrabold text-white">
                        Rejoignez l&apos;aventure Rapido&apos;Devis
                    </h2>
                    <div className="flex gap-4">
                        <Link href="/inscription">
                            <Button size="lg" className="bg-rapido-green text-white rounded-full px-8">
                                Commencer →
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10">
                                Nous contacter
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </MarketingLayout>
    );
}
