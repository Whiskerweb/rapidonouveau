'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/connexion')
    }

    return (
        <Button
            variant="outline"
            onClick={handleSignOut}
            className="rounded-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
            Se déconnecter
        </Button>
    )
}
