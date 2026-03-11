'use client'

import { TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface StatsCardsProps {
  stats: {
    ca_total: number
    ca_month: number
    unpaid_count: number
    unpaid_amount: number
    overdue_count: number
    draft_count: number
    paid_count: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'CA du mois',
      value: formatCurrency(stats.ca_month),
      icon: TrendingUp,
      color: 'text-rapido-green',
      bg: 'bg-rapido-green/10',
    },
    {
      label: 'CA total',
      value: formatCurrency(stats.ca_total),
      icon: TrendingDown,
      color: 'text-rapido-blue',
      bg: 'bg-rapido-blue/10',
    },
    {
      label: 'Impayées',
      value: `${stats.unpaid_count}`,
      subtitle: formatCurrency(stats.unpaid_amount),
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'En retard',
      value: `${stats.overdue_count}`,
      icon: AlertTriangle,
      color: stats.overdue_count > 0 ? 'text-red-500' : 'text-zinc-400',
      bg: stats.overdue_count > 0 ? 'bg-red-50' : 'bg-zinc-50',
    },
    {
      label: 'Brouillons',
      value: `${stats.draft_count}`,
      icon: FileText,
      color: 'text-zinc-500',
      bg: 'bg-zinc-50',
    },
    {
      label: 'Payées',
      value: `${stats.paid_count}`,
      icon: CheckCircle,
      color: 'text-rapido-green',
      bg: 'bg-rapido-green/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-zinc-100 bg-white p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{card.label}</span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </span>
          </div>
          <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-zinc-400">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  )
}
