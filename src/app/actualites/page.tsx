import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { ARTICLES } from '@/data/articles';

export const metadata = {
    title: "Actualités & Conseils BTP | Rapido'Devis",
    description: "Retrouvez nos derniers articles sur l'IA dans la construction, la gestion de chantier et les conseils pour optimiser vos devis.",
};

export default function ActualitesPage() {
    return (
        <MarketingLayout>
            {/* Header */}
            <section className="pt-32 pb-20 bg-zinc-50">
                <div className="container px-4 text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full font-black text-[10px] tracking-[0.3em] uppercase mb-4">
                            Blog & Actualités
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary tracking-tight">
                        Le Mag du <span className="text-primary italic">Chiffrage.</span>
                    </h1>
                    <p className="text-secondary/50 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        Insights, technologies et conseils d&apos;experts pour les professionnels du bâtiment qui voient plus loin.
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {ARTICLES.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/actualites/${article.slug}`}
                                className="group block space-y-6"
                            >
                                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-sm border border-zinc-100">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary shadow-lg">
                                            {article.category}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-4 text-xs font-bold text-secondary/40">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {article.author}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-secondary group-hover:text-primary transition-colors leading-snug">
                                        {article.title}
                                    </h2>

                                    <p className="text-secondary/50 font-bold leading-relaxed line-clamp-2">
                                        {article.excerpt}
                                    </p>

                                    <div className="pt-2 flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                        Lire l&apos;article <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Simple */}
            <section className="py-32 bg-zinc-50">
                <div className="container px-4 text-center">
                    <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-white shadow-xl border border-zinc-100 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                            <Tag className="w-64 h-64 text-secondary" />
                        </div>
                        <h2 className="text-4xl font-heading font-black text-secondary">Ne manquez plus aucun conseil.</h2>
                        <p className="text-secondary/50 text-xl font-bold">1 mail par mois avec l&apos;actualité du chiffrage et les nouvelles fonctionnalités.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 h-14 bg-zinc-50 border-none rounded-2xl px-6 font-bold text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <Button className="h-14 px-8 bg-secondary text-white font-black rounded-2xl hover:bg-secondary/95 shadow-lg">
                                S&apos;inscrire
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
