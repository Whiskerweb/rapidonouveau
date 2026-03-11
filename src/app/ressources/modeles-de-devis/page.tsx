import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
    title: "Modèles de Devis Bâtiment Gratuits (PDF, Excel, Word) | Rapido'Devis",
    description: "Téléchargez nos modèles de devis BTP gratuits par métier : Maçonnerie, Peinture, Électricité, Plomberie. Formats Excel, Word et PDF.",
};

const metiers = [
    { title: "Maçonnerie", slug: "maconnerie", color: "orange" },
    { title: "Peinture", slug: "peintre", color: "blue" },
    { title: "Électricité", slug: "electricien", color: "yellow" },
    { title: "Plomberie", slug: "plomberie", color: "cyan" },
    { title: "Menuiserie", slug: "menuiserie", color: "amber" },
    { title: "Couverture", slug: "couvreur", color: "red" },
];

export default function ModelesDevisPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mx-auto">
                            <FileText className="w-4 h-4" />
                            <span>Ressources Gratuites</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                            Modèles de devis BTP <br />
                            <span className="text-primary italic">gratuits.</span>
                        </h1>
                        <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-2xl mx-auto">
                            Ne partez plus d&apos;une page blanche. Téléchargez nos exemples de chiffrages complets par corps d&apos;état, ou utilisez notre générateur IA gratuit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dynamic Grid of Models */}
            <section className="py-20 bg-zinc-50">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {metiers.map((metier, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group group-hover:block">
                                <h3 className="text-2xl font-black text-secondary mb-2">Devis {metier.title}</h3>
                                <p className="text-secondary/60 font-bold mb-6 text-sm">Exemples de chiffrages type ({metier.title}) avec mentions légales.</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm font-bold text-secondary">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Format Excel (.xlsx)
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-secondary">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Format Word (.docx)
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-secondary">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Exemple PDF chiffré
                                    </div>
                                </div>

                                <Link href={`/metiers/${metier.slug}`}>
                                    <Button className="w-full bg-zinc-100 hover:bg-primary text-secondary hover:text-white font-bold h-12 rounded-xl transition-colors">
                                        Voir les modèles <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why use software instead of Excel */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="bg-secondary rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-heading font-black">
                                Fatigué de modifier des fichiers Excel ?
                            </h2>
                            <p className="text-xl text-white/70 font-bold leading-relaxed">
                                Les modèles Word et Excel c&apos;est bien pour dépanner, mais ça ne remplace pas un vrai logiciel de facturation avec bibliothèque intégrée et suivi des paiements.
                            </p>
                            <Link href="/inscription" className="inline-block mt-8">
                                <Button size="lg" className="h-16 bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-2xl transition-all hover:scale-105">
                                    Générer un vrai devis <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
