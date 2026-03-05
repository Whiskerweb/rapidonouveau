import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function EstimationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/connexion');

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col bg-rapido-blue text-white fixed inset-y-0 left-0 z-50">
                <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
                    <span className="font-heading text-xl font-bold">Rapido&apos;Devis</span>
                </div>
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
                <div className="px-4 py-4 border-t border-white/10 text-xs text-white/50">
                    {user.email}
                </div>
            </aside>

            <div className="flex-1 lg:ml-64 flex flex-col">
                <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-rapido-blue text-white">
                    <span className="font-heading font-bold">Rapido&apos;Devis</span>
                </header>
                <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
