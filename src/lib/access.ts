import { createClient } from '@/lib/supabase/server';

export type UserAccess = {
    hasAccess: boolean;
    accessType: 'subscription' | 'pack' | 'none';
    plan?: string;
    creditsRemaining?: number;
    creditsTotal?: number;
    expiresAt?: string;
};

export async function checkUserAccess(): Promise<UserAccess> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { hasAccess: false, accessType: 'none' };
    }

    // 1. Vérifier abonnement actif
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .gte('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (subscription) {
        return {
            hasAccess: true,
            accessType: 'subscription',
            plan: subscription.plan,
            expiresAt: subscription.current_period_end || undefined,
        };
    }

    // 2. Vérifier pack avec crédits restants
    const { data: packs } = await supabase
        .from('packs')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (packs && packs.length > 0) {
        // Sommer les crédits de tous les packs actifs
        const totalCredits = packs.reduce((sum, p) => sum + p.credits_total, 0);
        const usedCredits = packs.reduce((sum, p) => sum + p.credits_used, 0);
        const remaining = totalCredits - usedCredits;

        if (remaining > 0) {
            return {
                hasAccess: true,
                accessType: 'pack',
                creditsRemaining: remaining,
                creditsTotal: totalCredits,
            };
        }
    }

    // 3. Aucun accès
    return { hasAccess: false, accessType: 'none' };
}
