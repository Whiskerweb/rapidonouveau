import * as React from 'react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-background">
            <div className="container py-10 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-heading text-2xl font-bold text-rapido-blue">
                                Rapido&apos;Devis
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                            L&apos;IA qui transforme votre façon de chiffrer vos travaux. Devis précis en 48h.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-heading font-semibold text-rapido-blue mb-2">Produit</h3>
                        <Link href="/notre-solution" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Notre Solution
                        </Link>
                        <Link href="/nos-tarifs" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Tarifs
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-heading font-semibold text-rapido-blue mb-2">Ressources</h3>
                        <Link href="/a-propos" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            À Propos
                        </Link>
                        <Link href="/actualites" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Actualités & Blog
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Contact & FAQ
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-heading font-semibold text-rapido-blue mb-2">Légal</h3>
                        <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Mentions Légales
                        </Link>
                        <Link href="/cgv" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            CGV
                        </Link>
                        <Link href="/politique-de-confidentialite" className="text-sm text-muted-foreground hover:text-rapido-blue transition-colors">
                            Politique de Confidentialité
                        </Link>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                    <p>© {currentYear} Rapido&apos;Devis. Tous droits réservés.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {/* Social Icons could go here */}
                        <span>Made with ❤️ in France</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
