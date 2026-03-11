'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

const LINKS = {
    fonctionnalites: [
        { name: 'Scan IA', href: '/fonctionnalites/scan-ia' },
        { name: 'Devis & Facturation', href: '/fonctionnalites/devis-factures' },
        { name: 'Bibliothèque de Prix', href: '/fonctionnalites/bibliotheque-prix' },
        { name: 'Signature & Paiement', href: '/fonctionnalites/signature-paiement' },
        { name: 'Facturation Électronique', href: '/fonctionnalites/facturation-electronique' },
        { name: 'Solution Mobile', href: '/fonctionnalites/mobile' },
    ],
    solutions: [
        { name: 'Auto-entrepreneurs', href: '/solutions/auto-entrepreneurs' },
        { name: 'TPE / PME', href: '/solutions/tpe-pme' },
    ],
    metiers: [
        { name: 'Maçonnerie', href: '/metiers/maconnerie' },
        { name: 'Peinture', href: '/metiers/peinture' },
        { name: 'Électricité', href: '/metiers/electricite' },
        { name: 'Plomberie', href: '/metiers/plomberie' },
        { name: 'Menuiserie', href: '/metiers/menuiserie' },
    ],
    ressources: [
        { name: 'Nos Tarifs', href: '/nos-tarifs' },
        { name: 'Avis Clients', href: '/cas-clients' },
        { name: 'Modèles de devis', href: '/ressources/modeles-de-devis' },
        { name: 'Actualités', href: '/actualites' },
    ],
    compagnie: [
        { name: 'À Propos', href: '/a-propos' },
        { name: 'Contact', href: '/contact' },
    ],
    legal: [
        { name: 'CGV', href: '/legal/cgv' },
        { name: 'CGU', href: '/legal/cgu' },
        { name: 'Mentions Légales', href: '/legal/mentions-legales' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-white border-t border-zinc-100 pt-20 pb-10">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block relative h-8 w-40">
                            <Image
                                src="https://rapido-devis.fr/wp-content/uploads/2023/03/cropped-400PngdpiLogo-1-3.png"
                                alt="Rapido'Devis"
                                fill
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            L&apos;IA qui transforme votre façon de chiffrer vos travaux. Estimation fiable et validée en moins de 48h.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>

                        {/* Store Badges */}
                        <div className="pt-4 flex flex-wrap gap-3">
                            <Link href="#" className="inline-block transition-transform hover:scale-105 active:scale-95">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                    alt="App Store"
                                    width={120}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </Link>
                            <Link href="#" className="inline-block transition-transform hover:scale-105 active:scale-95">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Google Play"
                                    width={135}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-2 gap-8">
                        <div className="space-y-6">
                            <p className="font-bold text-secondary uppercase tracking-widest text-xs">Fonctionnalités</p>
                            <ul className="space-y-4">
                                {LINKS.fonctionnalites.map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <p className="font-bold text-secondary uppercase tracking-widest text-xs">Solutions</p>
                            <ul className="space-y-4">
                                {LINKS.solutions.map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 space-y-6">
                                <p className="font-bold text-secondary uppercase tracking-widest text-xs">Par Métier</p>
                                <ul className="space-y-4">
                                    {LINKS.metiers.map((l) => (
                                        <li key={l.name}>
                                            <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold">
                                                {l.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <p className="font-bold text-secondary uppercase tracking-widest text-xs">Ressources</p>
                            <ul className="space-y-4">
                                {LINKS.ressources.map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <p className="font-bold text-secondary uppercase tracking-widest text-xs">Entreprise</p>
                            <ul className="space-y-4">
                                {LINKS.compagnie.map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold">
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <p className="font-bold text-secondary uppercase tracking-widest text-xs">Contact</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a href="mailto:contact@rapido-devis.fr" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    contact@rapido-devis.fr
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <a href="tel:+33668563039" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    06 68 56 30 39
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-muted-foreground text-sm">
                                    66 Avenue des Champs-Élysées,<br />75008 Paris
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-400 text-xs">
                        © {new Date().getFullYear()} Rapido&apos;Devis. Tous droits réservés.
                    </p>
                    <ul className="flex flex-wrap justify-center gap-6">
                        {LINKS.legal.map(l => (
                            <li key={l.name}>
                                <Link href={l.href} className="text-zinc-400 hover:text-secondary transition-colors text-xs">
                                    {l.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
