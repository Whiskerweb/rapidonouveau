'use client'

import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { FileText, Bell, CheckCheck } from 'lucide-react'

function timeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)

    if (diffMin < 1) return "à l'instant"
    if (diffMin < 60) return `il y a ${diffMin}min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `il y a ${diffH}h`
    const diffD = Math.floor(diffH / 24)
    if (diffD < 7) return `il y a ${diffD}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function NotificationsList({ userId }: { userId: string }) {
    const router = useRouter()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId)

    const handleClick = async (notification: typeof notifications[0]) => {
        if (!notification.read_at) {
            await markAsRead(notification.id)
        }
        const estimationId = (notification.data as any)?.estimation_id
        if (estimationId) {
            router.push(`/estimations/${estimationId}`)
        }
    }

    const getIcon = (type: string) => {
        if (type.includes('estimation') || type.includes('document')) {
            return <FileText className="h-4 w-4" />
        }
        return <Bell className="h-4 w-4" />
    }

    return (
        <div className="space-y-6">
            {unreadCount > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-rapido-blue/5 border border-rapido-blue/10 px-4 py-3">
                    <p className="text-sm text-rapido-blue font-medium">
                        {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="rounded-full text-xs gap-1.5 border-rapido-blue/20 text-rapido-blue hover:bg-rapido-blue/10"
                    >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Tout marquer comme lu
                    </Button>
                </div>
            )}

            {notifications.length > 0 ? (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <button
                            key={notification.id}
                            onClick={() => handleClick(notification)}
                            className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md group ${
                                notification.read_at
                                    ? 'border-zinc-100 bg-white hover:border-zinc-200'
                                    : 'border-rapido-blue/15 bg-rapido-blue/3 hover:border-rapido-blue/25'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 transition-colors ${
                                    notification.read_at
                                        ? 'bg-zinc-100 text-zinc-400'
                                        : 'bg-rapido-blue/10 text-rapido-blue'
                                }`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!notification.read_at && (
                                                    <span className="h-2 w-2 rounded-full bg-rapido-green flex-shrink-0" />
                                                )}
                                                <p className={`text-sm font-medium truncate ${
                                                    notification.read_at ? 'text-zinc-700' : 'text-rapido-blue'
                                                }`}>
                                                    {notification.title}
                                                </p>
                                            </div>
                                            {notification.body && (
                                                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-zinc-400 flex-shrink-0 mt-0.5">
                                            {timeAgo(notification.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300">
                        <Bell className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-heading font-bold text-rapido-blue">Aucune notification</p>
                        <p className="text-zinc-400 text-sm mt-1">
                            Vous recevrez des notifications lorsque vos estimations seront traitées.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
