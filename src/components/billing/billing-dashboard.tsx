'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, AlertTriangle, Clock, Loader2, Bell, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface DashboardStats {
  revenue: { current: number; previous: number; change: number }
  pending: { amount: number; count: number }
  overdue: { amount: number; count: number }
  monthlyRevenue: { month: string; amount: number }[]
  actionRequired: {
    type: string
    documentId: string
    documentNumber: string
    clientName: string
    amount: number
    daysLate?: number
    daysSent?: number
  }[]
  totalDocuments: number
}

export function BillingDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/billing/stats')
      const data = await res.json()
      setStats(data.stats)
    } catch {
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-rapido-blue" />
      </div>
    )
  }

  if (!stats) return null

  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.amount), 1)

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">CA ce mois</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-green/10">
              <TrendingUp className="h-4 w-4 text-rapido-green" />
            </span>
          </div>
          <p className="text-lg font-bold text-rapido-green">{formatCurrency(stats.revenue.current)}</p>
          {stats.revenue.change !== 0 && (
            <div className={`flex items-center gap-1 mt-1 ${stats.revenue.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {stats.revenue.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span className="text-[10px] font-medium">{stats.revenue.change > 0 ? '+' : ''}{stats.revenue.change}% vs mois préc.</span>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">En attente</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-4 w-4 text-amber-500" />
            </span>
          </div>
          <p className="text-lg font-bold text-amber-600">{formatCurrency(stats.pending.amount)}</p>
          <p className="text-[10px] text-zinc-400 mt-1">{stats.pending.count} facture{stats.pending.count > 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Impayés</span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stats.overdue.count > 0 ? 'bg-red-50' : 'bg-zinc-50'}`}>
              <AlertTriangle className={`h-4 w-4 ${stats.overdue.count > 0 ? 'text-red-500' : 'text-zinc-400'}`} />
            </span>
          </div>
          <p className={`text-lg font-bold ${stats.overdue.count > 0 ? 'text-red-600' : 'text-zinc-400'}`}>
            {formatCurrency(stats.overdue.amount)}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">{stats.overdue.count} facture{stats.overdue.count > 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Documents</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-blue/10">
              <TrendingUp className="h-4 w-4 text-rapido-blue" />
            </span>
          </div>
          <p className="text-lg font-bold text-rapido-blue">{stats.totalDocuments}</p>
          <p className="text-[10px] text-zinc-400 mt-1">total</p>
        </div>
      </div>

      {/* Chart + Actions side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-100 bg-white p-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4">CA mensuel (12 mois)</h3>
          <div className="flex items-end gap-1 h-32">
            {stats.monthlyRevenue.map((m, i) => {
              const height = maxRevenue > 0 ? (m.amount / maxRevenue) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-rapido-blue/70 hover:bg-rapido-blue transition-colors min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${m.month}: ${formatCurrency(m.amount)}`}
                  />
                  <span className="text-[8px] text-zinc-400 truncate w-full text-center">{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions required */}
        <div className="rounded-xl border border-zinc-100 bg-white p-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Actions requises</h3>
          {stats.actionRequired.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4 text-center">Aucune action en attente</p>
          ) : (
            <div className="space-y-2">
              {stats.actionRequired.map((action, i) => (
                <Link
                  key={i}
                  href={`/artisan/facturation/${action.documentId}`}
                  className="block p-2.5 rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 flex-shrink-0 ${
                      action.type === 'overdue' ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {action.type === 'overdue' ? <Bell className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-zinc-700 truncate">{action.documentNumber}</span>
                        <span className="text-xs font-bold text-zinc-600 flex-shrink-0">{formatCurrency(action.amount)}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate">{action.clientName}</p>
                      <p className={`text-[10px] font-medium ${
                        action.type === 'overdue' ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        {action.type === 'overdue'
                          ? `En retard (${action.daysLate}j)`
                          : `Envoyé (${action.daysSent}j sans réponse)`
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
