'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('System Error:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-200/50">
                <div className="mx-auto w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-heading font-black text-secondary uppercase tracking-tight">
                        Oups ! Une erreur est survenue
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Nous avons rencontré un problème technique imprévu. Nos équipes ont été alertées.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => reset()}
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Réessayer maintenant
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full h-12 border-zinc-200 text-secondary font-bold hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Retourner à l'accueil
                        </Link>
                    </Button>
                </div>

                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-[0.2em]">
                    ID Erreur: {error.digest || 'REF-INTERNAL-RAPIDO'}
                </p>
            </div>
        </div>
    );
}
