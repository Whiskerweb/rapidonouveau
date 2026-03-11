'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    User,
    Bell,
    Shield,
    ExternalLink,
    Hammer,
    Receipt,
    type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
    LayoutDashboard,
    FileText,
    CreditCard,
    User,
    Bell,
    Hammer,
    Receipt,
}

export interface NavItem {
    href: string
    icon: string
    label: string
}

interface SidebarNavProps {
    items: NavItem[]
    artisanItems?: NavItem[]
    isAdmin: boolean
}

export function SidebarNav({ items, artisanItems = [], isAdmin }: SidebarNavProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    const renderNavItem = (item: NavItem) => {
        const Icon = ICON_MAP[item.icon]
        const active = isActive(item.href)

        return (
            <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
            >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    active
                        ? 'bg-rapido-green text-white shadow-sm'
                        : 'bg-white/8 text-white/50 group-hover:bg-white/12 group-hover:text-white/80'
                }`}>
                    {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs font-bold">{item.icon}</span>}
                </span>
                {item.label}
            </Link>
        )
    }

    return (
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {items.map(renderNavItem)}

            {artisanItems.length > 0 && (
                <>
                    <div className="border-t border-white/10 my-4" />
                    <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Artisan</p>
                    {artisanItems.map(renderNavItem)}
                </>
            )}

            {isAdmin && (
                <>
                    <div className="border-t border-white/10 my-4" />
                    <Link
                        href="/admin"
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            pathname.startsWith('/admin')
                                ? 'bg-rapido-orange/15 text-rapido-orange'
                                : 'text-rapido-orange/70 hover:bg-rapido-orange/10 hover:text-rapido-orange'
                        }`}
                    >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                            pathname.startsWith('/admin')
                                ? 'bg-rapido-orange text-white'
                                : 'bg-rapido-orange/15 text-rapido-orange/60 group-hover:text-rapido-orange'
                        }`}>
                            <Shield className="h-4 w-4" />
                        </span>
                        Administration
                    </Link>
                </>
            )}

            <div className="border-t border-white/10 my-4" />
            <Link
                href="/"
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white/70 transition-all duration-200"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/30 group-hover:text-white/50 transition-all duration-200">
                    <ExternalLink className="h-4 w-4" />
                </span>
                Retour au site
            </Link>
        </nav>
    )
}
