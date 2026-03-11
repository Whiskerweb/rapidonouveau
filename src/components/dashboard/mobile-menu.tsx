'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, ExternalLink, LayoutDashboard, FileText, CreditCard, User, Bell, Hammer, Receipt, type LucideIcon } from 'lucide-react'
import type { NavItem } from './sidebar-nav'

const ICON_MAP: Record<string, LucideIcon> = {
    LayoutDashboard,
    FileText,
    CreditCard,
    User,
    Bell,
    Hammer,
    Receipt,
}

interface MobileMenuProps {
    items: NavItem[]
    artisanItems?: NavItem[]
    isAdmin: boolean
    displayName: string
    initials: string
}

export function MobileMenu({ items, artisanItems = [], isAdmin, displayName, initials }: MobileMenuProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    const renderItem = (item: NavItem) => {
        const Icon = ICON_MAP[item.icon]
        const active = isActive(item.href)

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                        ? 'bg-white/15 text-white'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
            >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? 'bg-rapido-green text-white' : 'bg-white/8 text-white/50'
                }`}>
                    {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs">{item.icon}</span>}
                </span>
                {item.label}
            </Link>
        )
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
                <Menu className="h-4 w-4" />
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="relative w-72 max-w-[80vw] bg-gradient-to-b from-rapido-blue to-[#151b3a] text-white flex flex-col animate-in slide-in-from-left duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rapido-green text-white font-heading font-bold text-xs">
                                    R
                                </div>
                                <span className="font-heading font-bold">Rapido&apos;Devis</span>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {items.map(renderItem)}

                            {artisanItems.length > 0 && (
                                <>
                                    <div className="border-t border-white/10 my-3" />
                                    <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Artisan</p>
                                    {artisanItems.map(renderItem)}
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <div className="border-t border-white/10 my-3" />
                                    <Link
                                        href="/admin"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rapido-orange/70 hover:text-rapido-orange transition-all"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-orange/15">
                                            <Shield className="h-4 w-4" />
                                        </span>
                                        Administration
                                    </Link>
                                </>
                            )}

                            <div className="border-t border-white/10 my-3" />
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white/70 transition-all"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                                    <ExternalLink className="h-4 w-4" />
                                </span>
                                Retour au site
                            </Link>
                        </nav>

                        {/* User */}
                        <div className="px-4 py-4 border-t border-white/8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rapido-green/20 text-rapido-green text-xs font-bold">
                                    {initials}
                                </div>
                                <p className="text-sm font-medium text-white/90 truncate">{displayName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
