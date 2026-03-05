import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'Aucun client Stripe trouvé' }, { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/abonnement`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Erreur Stripe Portal:', error);
        return NextResponse.json(
            { error: error.message || 'Une erreur est survenue lors de l\'accès au portail.' },
            { status: 500 }
        );
    }
}
