'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function StripePortalButton() {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            className="bg-rapido-blue text-white rounded-full"
        >
            {loading ? 'Redirection...' : 'Gérer mon abonnement'}
        </Button>
    )
}
