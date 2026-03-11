import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowRight, MessageCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-20">
            <div className="max-w-3xl w-full text-center space-y-12">
                {/* Animated 404 Illustration */}
                <div className="relative inline-block">
                    <span className="text-[12rem] md:text-[16rem] font-heading font-black text-zinc-50 leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 rotate-3">
                            <Search className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-secondary uppercase tracking-tight">
                        Page non trouvée
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Désolé, la page que vous recherchez semble s&apos;être volatilisée du chantier.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
                    <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Accueil
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="rounded-2xl h-16 border-zinc-200 text-secondary font-bold hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        <Link href="/nos-tarifs">
                            Nos Tarifs
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="rounded-2xl h-16 text-muted-foreground font-bold hover:bg-zinc-100 transition-all active:scale-95"
                    >
                        <Link href="/contact">
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Support
                        </Link>
                    </Button>
                </div>

                <div className="pt-12 border-t border-zinc-100 mt-12">
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-[0.3em]">
                        Rapido&apos;Devis - Système de Chiffrage IA
                    </p>
                </div>
            </div>
        </div>
    );
}
