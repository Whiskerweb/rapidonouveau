'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    const navigation = [
        { name: 'Notre Solution', href: '/notre-solution' },
        { name: 'Nos Tarifs', href: '/nos-tarifs' },
        { name: 'À Propos', href: '/a-propos' },
        { name: 'Actualités', href: '/actualites' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-heading text-xl font-bold tracking-tight text-rapido-blue bg-clip-text">
                            Rapido&apos;Devis
                        </span>
                        <span className="rounded-md bg-rapido-orange px-1.5 py-0.5 text-xs font-semibold leading-none text-white hidden sm:inline-block">
                            V2
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-rapido-blue ${isActive(item.href)
                                        ? 'text-rapido-blue font-semibold'
                                        : 'text-muted-foreground'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/connexion">
                            <Button variant="ghost" className="text-sm font-medium">
                                Se connecter
                            </Button>
                        </Link>
                        <Link href="/inscription">
                            <Button className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full">
                                Commencer gratuitement
                            </Button>
                        </Link>
                    </div>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="pl-1 pr-0 flex flex-col justify-between">
                            <div className="px-7">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="font-heading font-bold">Rapido&apos;Devis</span>
                                </Link>
                                <div className="my-8 flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-lg font-medium ${isActive(item.href) ? 'text-rapido-blue' : 'text-muted-foreground'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="px-7 pb-8 flex flex-col gap-4">
                                <Link href="/connexion" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center">
                                        Se connecter
                                    </Button>
                                </Link>
                                <Link href="/inscription" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full justify-center bg-rapido-green text-white">
                                        Commencer gratuitement
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
