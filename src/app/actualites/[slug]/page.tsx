import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';
import { ARTICLES } from '@/data/articles';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = ARTICLES.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.image,
        "datePublished": article.date,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Rapido'Devis",
            "logo": {
                "@type": "ImageObject",
                "url": "https://rapido-devis.fr/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://rapido-devis.fr/actualites/${article.slug}`
        }
    };

    return (
        <MarketingLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {/* Hero Header */}
            <section className="pt-32 pb-16 bg-white">
                <div className="container px-4">
                    <Link
                        href="/actualites"
                        className="inline-flex items-center gap-2 text-secondary/40 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour aux actualités
                    </Link>

                    <div className="max-w-4xl space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 text-primary rounded-xl font-black text-[10px] tracking-widest uppercase">
                            {article.category}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-heading font-black text-secondary leading-[1.1] tracking-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-secondary/40 border-b border-zinc-100 pb-12">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                {article.author}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="pb-24 bg-white">
                <div className="container px-4">
                    <div className="aspect-[21/9] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-zinc-100">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Content & Sidebar */}
            <section className="pb-32 bg-white">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-[1fr_300px] gap-20">
                        {/* Article Content */}
                        <div className="prose prose-zinc prose-2xl max-w-none 
                            prose-headings:font-heading prose-headings:font-black prose-headings:text-secondary 
                            prose-p:text-secondary/60 prose-p:font-bold prose-p:leading-relaxed
                            prose-li:text-secondary/60 prose-li:font-bold prose-li:leading-relaxed
                            prose-strong:text-secondary prose-strong:font-black
                            prose-img:rounded-[2rem] prose-img:shadow-xl
                        ">
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-12">
                            {/* Share */}
                            <div className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100 space-y-6 sticky top-32">
                                <h3 className="text-xl font-black text-secondary">Partager</h3>
                                <div className="flex flex-col gap-3">
                                    <Button variant="outline" className="justify-start gap-4 h-14 rounded-2xl border-zinc-200 font-bold text-secondary bg-white hover:bg-zinc-50">
                                        <Linkedin className="w-5 h-5 text-[#0077b5]" /> LinkedIn
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-4 h-14 rounded-2xl border-zinc-200 font-bold text-secondary bg-white hover:bg-zinc-50">
                                        <Facebook className="w-5 h-5 text-[#1877f2]" /> Facebook
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-4 h-14 rounded-2xl border-zinc-200 font-bold text-secondary bg-white hover:bg-zinc-50">
                                        <Twitter className="w-5 h-5 text-[#1da1f2]" /> Twitter
                                    </Button>
                                </div>
                            </div>

                            {/* Related Product CTA */}
                            <div className="bg-secondary p-10 rounded-[2.5rem] text-white space-y-6">
                                <h3 className="text-xl font-black">Besoin d&apos;un devis ?</h3>
                                <p className="text-white/60 font-bold leading-relaxed">
                                    Testez notre IA et recevez un chiffrage certifié en un temps record.
                                </p>
                                <Link href="/inscription" className="block">
                                    <Button className="w-full h-14 bg-primary text-white font-black rounded-2xl hover:bg-primary/95 shadow-lg">
                                        Commencer
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Bottom Navigation */}
            <section className="py-24 bg-zinc-50">
                <div className="container px-4 text-center">
                    <h2 className="text-3xl font-heading font-black text-secondary mb-12">Dernières actualités</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {ARTICLES.slice(0, 3).map((a) => (
                            <Link key={a.slug} href={`/actualites/${a.slug}`} className="group space-y-4">
                                <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-200">
                                    <img src={a.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={a.title} />
                                </div>
                                <h4 className="font-black text-secondary group-hover:text-primary transition-colors leading-tight">{a.title}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
