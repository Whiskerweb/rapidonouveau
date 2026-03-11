import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', icon: 'T' },
  { href: '/admin/estimations', label: 'Demandes', icon: 'D' },
  { href: '/admin/clients', label: 'Clients', icon: 'C' },
  { href: '/admin/blog', label: 'Blog', icon: 'B' },
  { href: '/admin/contenu', label: 'Contenu', icon: 'E' },
  { href: '/admin/promo', label: 'Codes promo', icon: 'P' },
  { href: '/admin/reglages', label: 'Réglages', icon: 'R' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-zinc-900 text-white fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <span className="font-heading text-xl font-bold">Admin</span>
          <span className="text-xs bg-rapido-orange px-2 py-0.5 rounded-full font-medium">
            Rapido
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs font-bold">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-sm font-medium text-white/90">{profile.full_name || 'Admin'}</p>
          <p className="text-xs text-white/50">{profile.email}</p>
          <Link
            href="/dashboard"
            className="mt-3 block text-xs text-rapido-green hover:underline"
          >
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-zinc-900 text-white">
          <span className="font-heading font-bold">Admin Rapido</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
