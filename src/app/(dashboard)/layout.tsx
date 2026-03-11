import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserAccess } from '@/lib/access';
import Link from 'next/link';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { MobileMenu } from '@/components/dashboard/mobile-menu';

const PROFILE_TYPE_LABELS: Record<string, string> = {
    artisan: 'Artisan',
    immobilier: 'Immobilier',
    particulier: 'Particulier',
};

const NAV_ITEMS = [
    { href: '/dashboard', icon: 'LayoutDashboard', label: 'Tableau de bord' },
    { href: '/estimations', icon: 'FileText', label: 'Mes estimations' },
    { href: '/abonnement', icon: 'CreditCard', label: 'Abonnement' },
    { href: '/compte', icon: 'User', label: 'Mon compte' },
    { href: '/notifications', icon: 'Bell', label: 'Notifications' },
];

const ARTISAN_NAV_ITEMS = [
    { href: '/artisan/demandes', icon: 'Hammer', label: 'Demandes' },
    { href: '/artisan/facturation', icon: 'Receipt', label: 'Facturation' },
];

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

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name, email, profile_type, role')
        .eq('id', user.id)
        .single();

    const profileData = profile as {
        full_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        profile_type?: string;
        role?: string;
    } | null;

    const displayName = profileData?.first_name
        ? `${profileData.first_name} ${profileData.last_name || ''}`
        : profileData?.full_name || profileData?.email || '';

    const initials = profileData?.first_name && profileData?.last_name
        ? `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase()
        : displayName.substring(0, 2).toUpperCase();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';

    return (
        <div className="flex min-h-screen bg-zinc-50/50">
            {/* Sidebar desktop */}
            <aside className="hidden lg:flex w-[260px] flex-col bg-gradient-to-b from-rapido-blue to-[#151b3a] text-white fixed inset-y-0 left-0 z-50">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rapido-green text-white font-heading font-bold text-sm">
                        R
                    </div>
                    <span className="font-heading text-lg font-bold tracking-tight">Rapido&apos;Devis</span>
                </div>

                <SidebarNav
                    items={NAV_ITEMS}
                    artisanItems={profileData?.profile_type === 'artisan' ? ARTISAN_NAV_ITEMS : []}
                    isAdmin={isAdmin}
                />

                {/* User info */}
                <div className="px-4 py-4 border-t border-white/8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rapido-green/20 text-rapido-green text-xs font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white/90 truncate">{displayName}</p>
                            <div className="flex items-center gap-1.5">
                                {profileData?.profile_type && (
                                    <span className="text-[10px] bg-rapido-green/15 text-rapido-green px-1.5 py-0.5 rounded-full font-medium">
                                        {PROFILE_TYPE_LABELS[profileData.profile_type] || profileData.profile_type}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 lg:ml-[260px] flex flex-col">
                {/* Access status banner */}
                {!access.hasAccess && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">!</span>
                            {access.accessType === 'none'
                                ? 'Vous n\'avez pas d\'abonnement actif.'
                                : 'Vos crédits sont épuisés.'}
                            {' '}Souscrivez pour continuer.
                        </span>
                        <Link
                            href="/nos-tarifs"
                            className="ml-4 rounded-full bg-white text-amber-600 hover:bg-white/90 px-4 py-1.5 font-semibold text-xs transition-colors flex-shrink-0"
                        >
                            Voir les tarifs
                        </Link>
                    </div>
                )}

                {/* Mobile header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-rapido-blue text-white sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <MobileMenu
                        items={NAV_ITEMS}
                        artisanItems={profileData?.profile_type === 'artisan' ? ARTISAN_NAV_ITEMS : []}
                        isAdmin={isAdmin}
                        displayName={displayName}
                        initials={initials}
                    />
                        <span className="font-heading font-bold text-base">Rapido&apos;Devis</span>
                    </div>
                    <NotificationBell userId={user.id} />
                </header>

                {/* Desktop top bar */}
                <div className="hidden lg:flex items-center justify-between px-8 py-3 border-b border-zinc-100 bg-white sticky top-0 z-40">
                    <p className="text-sm text-zinc-400">
                        Bienvenue, <span className="text-rapido-blue font-medium">{profileData?.first_name || displayName}</span>
                    </p>
                    <NotificationBell userId={user.id} />
                </div>

                {/* Page content */}
                <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
