import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import Link from 'next/link';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/connexion');
    }

    const access = await checkUserAccess();

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col bg-rapido-blue text-white fixed inset-y-0 left-0 z-50">
                {/* Logo */}
                <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
                    <span className="font-heading text-xl font-bold">Rapido&apos;Devis</span>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { href: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
                        { href: '/estimations', icon: '📋', label: 'Mes estimations' },
                        { href: '/abonnement', icon: '💳', label: 'Abonnement' },
                        { href: '/compte', icon: '👤', label: 'Mon compte' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom user info */}
                <div className="px-4 py-4 border-t border-white/10 text-xs text-white/50">
                    {user.email}
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 lg:ml-64 flex flex-col">
                {/* Access status banner */}
                {!access.hasAccess && (
                    <div className="bg-amber-500 text-white px-6 py-3 text-sm flex items-center justify-between">
                        <span>
                            {access.accessType === 'none'
                                ? '⚠️ Vous n\'avez pas d\'abonnement actif.'
                                : '⚠️ Vos crédits sont épuisés.'}
                            {' '}Souscrivez pour continuer à utiliser le service.
                        </span>
                        <Link
                            href="/nos-tarifs"
                            className="ml-4 rounded-full bg-white/20 hover:bg-white/30 px-4 py-1 font-semibold text-xs transition-colors flex-shrink-0"
                        >
                            Voir les tarifs →
                        </Link>
                    </div>
                )}

                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-rapido-blue text-white">
                    <span className="font-heading font-bold">Rapido&apos;Devis</span>
                </header>

                {/* Page content */}
                <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
