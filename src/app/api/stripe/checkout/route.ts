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

        const body = await req.json();
        const { priceId, mode = 'subscription', quantity = 1, couponCode } = body;

        if (!priceId) {
            return NextResponse.json({ error: 'L\'ID du prix est requis' }, { status: 400 });
        }

        // Récupérer le profile pour obtenir ou créer le stripe_customer_id
        const { data } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email, full_name')
            .eq('id', user.id)
            .single();

        const profile = data as any;
        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customerData: any = {
                email: user.email,
                metadata: {
                    supabase_uid: user.id,
                },
            };
            if (profile?.full_name) customerData.name = profile.full_name;

            const customer = await stripe.customers.create(customerData);

            customerId = customer.id;

            // Update profile with new Stripe customer ID
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId } as any)
                .eq('id', user.id);
        }

        // Prepare session parameters
        const sessionParams: import('stripe').Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            mode: mode as 'subscription' | 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/nos-tarifs`,
            metadata: {
                supabase_uid: user.id,
            },
            locale: 'fr',
        };

        // Promotion / Coupon logic
        if (couponCode) {
            // If a specific coupon is provided (we assume it's pre-validated on front-end, but Stripe will validate its existence anyway)
            // Here couponCode should be the Promotion Code ID or Coupon ID string.
            // For simplicity if we expect an ID:
            sessionParams.discounts = [{ coupon: couponCode }];
        } else {
            // Only allow promotion codes if no specific discount is applied programmatically
            sessionParams.allow_promotion_codes = true;
        }

        // Specific logic for subscriptions
        if (mode === 'subscription') {
            sessionParams.subscription_data = {
                metadata: {
                    supabase_uid: user.id,
                },
            };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Erreur Stripe Checkout:', error);
        return NextResponse.json(
            { error: error.message || 'Une erreur système est survenue.' },
            { status: 500 }
        );
    }
}
