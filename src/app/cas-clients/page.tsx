import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, TrendingUp, Clock, FileText, ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: "Avis Clients BTP et Témoignages | Rapido'Devis",
    description: "Découvrez comment nos clients artisans et entreprises du bâtiment gagnent du temps et signent plus de chantiers grâce à Rapido'Devis.",
};

const testimonials = [
    {
        name: "Jean-Baptiste R.",
        role: "Gérant Mçonnerie JBR",
        image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop",
        quote: "J'ai passé 15 ans à faire mes devis le soir sur Excel. Maintenant, je les fais dans mon camion sur mon téléphone entre deux chantiers. Ça m'a changé la vie.",
        stats: [
            { label: "Temps gagné", value: "-4h/sem" },
            { label: "Devis signés", value: "+20%" }
        ],
        metier: "Maçonnerie"
    },
    {
        name: "Sarah M.",
        role: "Auto-entrepreneuse Peintre",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        quote: "La bibliothèque de prix est incroyable. Quand je tape 'peinture acrylique', j'ai tout le descriptif technique et le prix moyen. Mes devis ont l'air tellement plus pros !",
        stats: [
            { label: "Ouvrages", value: "+30 000" },
            { label: "CA Annuel", value: "+15%" }
        ],
        metier: "Peinture"
    },
    {
        name: "David L.",
        role: "Directeur ÉlecTech",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        quote: "Le système d'acompte par carte bancaire a divisé nos délais de paiement par deux. Le client signe et paie sur son smartphone le jour même de l'envoi du devis.",
        stats: [
            { label: "Délai paiement", value: "-15j" },
            { label: "Trésorerie", value: "Sécurisée" }
        ],
        metier: "Électricité"
    }
];

export default function CasClientsPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-yellow-500/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 font-black text-xs uppercase tracking-widest mx-auto">
                            <Star className="w-4 h-4" />
                            <span>Ils nous font confiance</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                            Des résultats <span className="text-yellow-500 italic">concrets</span><br />
                            pour des pros concrets.
                        </h1>
                        <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-2xl mx-auto">
                            Ne nous croyez pas sur parole. Découvrez l&apos;impact réel de Rapido&apos;Devis sur le quotidien et le chiffre d&apos;affaires de nos artisans.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonial Grid */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="space-y-16">
                        {testimonials.map((client, idx) => (
                            <div key={idx} className={`flex flex-col md:flex-row gap-12 bg-white rounded-[3rem] p-8 md:p-12 border border-zinc-100 shadow-xl shadow-zinc-200/40 relative overflow-hidden group ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-secondary">
                                    <Quote className="w-32 h-32" />
                                </div>
                                <div className="md:w-1/3 flex flex-col items-center text-center space-y-4 relative z-10">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                                        <Image src={client.image} alt={client.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-secondary">{client.name}</h3>
                                        <p className="text-primary font-bold">{client.role}</p>
                                    </div>
                                </div>
                                <div className="md:w-2/3 space-y-8 relative z-10 flex flex-col justify-center">
                                    <p className="text-2xl font-bold leading-relaxed text-secondary/80 italic">
                                        &quot;{client.quote}&quot;
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        {client.stats.map((stat, i) => (
                                            <div key={i} className="bg-zinc-50 px-6 py-4 rounded-2xl border border-zinc-100">
                                                <div className="text-sm font-bold text-secondary/50 uppercase tracking-widest">{stat.label}</div>
                                                <div className="text-2xl font-black text-secondary">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-secondary text-white text-center">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-heading font-black">Prêt à rejoindre le mouvement ?</h2>
                        <p className="text-xl text-white/60 font-bold">14 jours d&apos;essai gratuit. Sans engagement ni carte bancaire.</p>
                        <Link href="/inscription" className="inline-block">
                            <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-2xl transition-all hover:scale-105">
                                Démarrer l'essai <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
