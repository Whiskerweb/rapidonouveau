import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Database, Search, ArrowRight, Layers, Box, Cpu } from 'lucide-react';

export const metadata = {
    title: "Bibliothèque de Prix & Ouvrages BTP | Rapido'Devis",
    description: "Accédez à une base de données de milliers d'ouvrages BTP et matériaux pré-chiffrés. Importez votre propre bibliothèque Excel en 1 clic.",
};

export default function BibliothequePrixPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Database className="w-4 h-4" />
                                <span>Bibliothèque de Prix Intégrée</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Ne cherchez plus <br />
                                vos <span className="text-blue-600 italic">prix de marché.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                Plus besoin d&apos;ouvrir des catalogues fournisseurs ou d&apos;inventer des prix. Rapido&apos;Devis intègre une base de données d&apos;ouvrages pré-chiffrés, constamment mise à jour.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="w-full sm:w-auto h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-10 text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                        Accéder à la bibliothèque
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Search Mockup */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] scale-90 -z-10 rounded-full" />
                            <div className="bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 md:p-8 relative">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="text"
                                        readOnly
                                        value="Peinture acrylique velours..."
                                        className="w-full h-14 pl-12 pr-4 bg-zinc-50 border-2 border-zinc-200 rounded-xl font-bold text-secondary focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-black animate-pulse">Recherche IA</div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { title: "Fourniture et pose peinture velours blanche 2 couches", tags: ["Peinture", "Intérieur"], unit: "m²", price: "18,50 €" },
                                        { title: "Préparation support (enduit de lissage complet)", tags: ["Préparation", "Murs"], unit: "m²", price: "22,00 €" },
                                        { title: "Peinture acrylique velours couleur spécifique", tags: ["Peinture", "Déco"], unit: "m²", price: "24,50 €" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-4 border border-zinc-100 rounded-xl hover:border-blue-500 cursor-pointer transition-colors group">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="font-bold text-secondary group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                    <div className="flex gap-2 mt-2">
                                                        {item.tags.map(tag => (
                                                            <span key={tag} className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-sm font-bold text-zinc-400">{item.unit}</div>
                                                    <div className="font-black text-secondary">{item.price}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading font-black text-secondary">
                                L&apos;IA au service de votre chiffrage.
                            </h2>
                            <p className="text-secondary/60 text-lg font-bold leading-relaxed">
                                Notre puissant moteur de recherche comprend ce que vous tapez. Tapez "muret parpaing 1m" et l&apos;IA trouvera automatiquement l&apos;ouvrage "Élévation maçonnerie agglomérés creux 20x20x50" avec les bons temps de pose.
                            </p>
                            <ul className="space-y-3 pt-4">
                                <li className="flex gap-3 text-secondary font-bold">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm">1</div>
                                    Recherche sémantique intelligente
                                </li>
                                <li className="flex gap-3 text-secondary font-bold">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm">2</div>
                                    Ajustement automatique des prix locaux
                                </li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 translate-y-8">
                                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                    <Layers className="w-8 h-8 text-blue-600 mb-4" />
                                    <div className="text-2xl font-black text-secondary">30 000+</div>
                                    <div className="text-sm font-bold text-secondary/50">Ouvrages disponibles</div>
                                </div>
                                <div className="bg-blue-600 text-white p-6 rounded-2xl border border-blue-500 shadow-xl shadow-blue-600/20">
                                    <Box className="w-8 h-8 text-white/80 mb-4" />
                                    <div className="text-2xl font-black text-white">Import Excel</div>
                                    <div className="text-sm font-bold text-white/80">Intégrez votre propre liste en 1 clic</div>
                                </div>
                            </div>
                            <div className="space-y-4 -translate-y-8 mt-16 md:mt-0">
                                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 h-full flex flex-col justify-center">
                                    <h3 className="font-heading font-black text-xl mb-2 text-secondary">Tous corps d&apos;état</h3>
                                    <p className="text-sm font-bold text-secondary/50">Maçonnerie, plomberie, électricité, menuiserie, peinture, plaquiste...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
