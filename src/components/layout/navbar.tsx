'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Sparkles, ShieldCheck, HardHat, Paintbrush, Zap, Droplets, Hammer, Smartphone, Newspaper, FileText, LayoutDashboard, Database, PenTool, FileWarning, Users, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FONCTIONNALITES = [
    { name: 'Scan IA', href: '/fonctionnalites/scan-ia', icon: Sparkles, desc: 'Extraction des plans' },
    { name: 'Devis & Facturation', href: '/fonctionnalites/devis-factures', icon: LayoutDashboard, desc: 'Éditeur ultra-rapide' },
    { name: 'Bibliothèque de Prix', href: '/fonctionnalites/bibliotheque-prix', icon: Database, desc: 'Ouvrages réels intégrés' },
    { name: 'Signature & Paiement', href: '/fonctionnalites/signature-paiement', icon: PenTool, desc: 'Acomptes CB en ligne' },
    { name: 'Facturation Électronique', href: '/fonctionnalites/facturation-electronique', icon: FileWarning, desc: 'Prêt pour 2026' },
    { name: 'Solution Terrain', href: '/fonctionnalites/mobile', icon: Smartphone, desc: 'App mobile & tablette' },
];

const SOLUTIONS = [
    { name: 'Auto-entrepreneurs', href: '/solutions/auto-entrepreneurs', icon: Users, desc: 'Micro-entreprise BTP' },
    { name: 'TPE / PME', href: '/solutions/tpe-pme', icon: Building2, desc: 'Croissance structurée' },
];

const METIERS = [
    { name: 'Maçonnerie', href: '/metiers/maconnerie', icon: HardHat },
    { name: 'Peinture', href: '/metiers/peinture', icon: Paintbrush },
    { name: 'Électricité', href: '/metiers/electricite', icon: Zap },
    { name: 'Plomberie', href: '/metiers/plomberie', icon: Droplets },
    { name: 'Menuiserie', href: '/metiers/menuiserie', icon: Hammer },
];

const RESSOURCES = [
    { name: 'Tarifs', href: '/nos-tarifs', icon: Zap, desc: 'Voir nos offres' },
    { name: 'Avis Clients', href: '/cas-clients', icon: Star, desc: 'Ils nous recommandent' },
    { name: 'Modèles de devis', href: '/ressources/modeles-de-devis', icon: FileText, desc: 'Exemples gratuits' },
    { name: 'Actualités & Guides', href: '/actualites', icon: Newspaper, desc: 'Astuces du bâtiment' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-700 ease-in-out ${scrolled
                ? 'py-2 bg-white/90 backdrop-blur-2xl border-b border-zinc-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        animate={{ scale: scrolled ? 0.95 : 1 }}
                        className="relative h-12 w-52 transition-transform duration-500 group-hover:scale-[1.05]"
                    >
                        <Image
                            src="https://rapido-devis.fr/wp-content/uploads/2023/03/cropped-400PngdpiLogo-1-3.png"
                            alt="Rapido'Devis"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/40 p-1 rounded-2.5xl border border-zinc-200/50 backdrop-blur-md">

                    {/* Fonctionnalités Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-sm font-bold tracking-tight text-zinc-500 hover:text-secondary transition-all outline-none">
                                Fonctionnalités <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-2xl mt-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="grid gap-1">
                                {FONCTIONNALITES.map((f) => (
                                    <DropdownMenuItem key={f.href} asChild className="p-0 focus:bg-transparent">
                                        <Link href={f.href} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
                                            <div className="p-2.5 rounded-xl bg-zinc-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <f.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-secondary leading-none mb-1">{f.name}</p>
                                                <p className="text-[11px] text-zinc-400 font-bold">{f.desc}</p>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Solutions Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-sm font-bold tracking-tight text-zinc-500 hover:text-secondary transition-all outline-none">
                                Solutions <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-2xl mt-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="grid gap-1">
                                {SOLUTIONS.map((s) => (
                                    <DropdownMenuItem key={s.href} asChild className="p-0 focus:bg-transparent">
                                        <Link href={s.href} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
                                            <div className="p-2.5 rounded-xl bg-zinc-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <s.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-secondary leading-none mb-1">{s.name}</p>
                                                <p className="text-[11px] text-zinc-400 font-bold">{s.desc}</p>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Métiers Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-sm font-bold tracking-tight text-zinc-500 hover:text-secondary transition-all outline-none">
                                Métiers <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-3 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-2xl mt-2">
                            <div className="grid grid-cols-1 gap-1">
                                {METIERS.map((m) => (
                                    <DropdownMenuItem key={m.href} asChild className="p-0 focus:bg-transparent">
                                        <Link href={m.href} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
                                            <div className="p-2 rounded-lg bg-zinc-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <m.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-bold text-secondary">{m.name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Ressources Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-sm font-bold tracking-tight text-zinc-500 hover:text-secondary transition-all outline-none">
                                Ressources <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-2xl mt-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="grid gap-1">
                                {RESSOURCES.map((r) => (
                                    <DropdownMenuItem key={r.href} asChild className="p-0 focus:bg-transparent">
                                        <Link href={r.href} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group">
                                            <div className="p-2.5 rounded-xl bg-zinc-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <r.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-secondary leading-none mb-1">{r.name}</p>
                                                <p className="text-[11px] text-zinc-400 font-bold">{r.desc}</p>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link
                        href="/a-propos"
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-500 relative group/nav ${pathname === '/a-propos'
                            ? 'bg-white text-secondary shadow-sm ring-1 ring-zinc-200/50'
                            : 'text-zinc-500 hover:text-secondary'
                            }`}
                    >
                        À Propos
                    </Link>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden lg:flex items-center gap-5">
                    <Link href="/connexion">
                        <Button variant="ghost" className="text-sm font-black text-secondary hover:bg-primary/5 hover:text-primary transition-all rounded-xl">
                            Connexion
                        </Button>
                    </Link>
                    <Link href="/inscription">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-12 font-black shadow-[0_10px_20px_rgba(0,200,83,0.2)] transition-all hover:scale-105 active:scale-95">
                            S&apos;inscrire
                        </Button>
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`lg:hidden p-3 rounded-2xl transition-all duration-500 ${scrolled ? 'bg-zinc-100 text-secondary' : 'bg-white/10 text-secondary border-2 border-secondary/10 hover:bg-white/20'}`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="lg:hidden absolute top-full left-4 right-4 bg-white/95 backdrop-blur-2xl border border-zinc-100 mt-4 rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[85vh] z-50 p-8"
                    >
                        <div className="flex flex-col gap-8">

                            {/* Mobile Fonctionnalités */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Fonctionnalités</p>
                                <div className="grid gap-2">
                                    {FONCTIONNALITES.map((f) => (
                                        <Link key={f.href} href={f.href} onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100">
                                            <div className="p-3 rounded-2xl bg-white shadow-sm text-primary">
                                                <f.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-heading font-black text-secondary">{f.name}</p>
                                                <p className="text-[11px] text-zinc-400 font-bold uppercase">{f.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Solutions */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Solutions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {SOLUTIONS.map((s) => (
                                        <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-zinc-50 border border-zinc-100 text-center">
                                            <div className="p-3 rounded-2xl bg-white shadow-sm text-secondary">
                                                <s.icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-black text-secondary">{s.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Métiers */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Métiers</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {METIERS.map((m) => (
                                        <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-zinc-50 border border-zinc-100 text-center">
                                            <div className="p-2 rounded-xl bg-white shadow-sm text-secondary">
                                                <m.icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs font-black text-secondary">{m.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Ressources */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-1">Ressources</p>
                                <div className="grid gap-2">
                                    {RESSOURCES.map((r) => (
                                        <Link key={r.href} href={r.href} onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100">
                                            <div className="p-3 rounded-2xl bg-white shadow-sm text-secondary">
                                                <r.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-heading font-black text-secondary">{r.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="/a-propos"
                                onClick={() => setOpen(false)}
                                className="text-2xl font-heading font-black text-secondary hover:text-primary transition-all px-1 mt-4"
                            >
                                À Propos
                            </Link>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 flex flex-col gap-4"
                            >
                                <Link href="/inscription" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-16 rounded-[1.5rem] bg-primary text-white text-xl font-black shadow-xl shadow-primary/20">
                                        Essayer gratuitement
                                    </Button>
                                </Link>
                                <Link href="/connexion" onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full h-16 rounded-[1.5rem] border-secondary/10 text-secondary text-xl font-black bg-zinc-50">
                                        Connexion
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
