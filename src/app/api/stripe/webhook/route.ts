import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

// Map Stripe subscription status to our DB status
const mapStatus = (stripeStatus: string) => {
    switch (stripeStatus) {
        case 'active':
        case 'trialing':
            return 'active';
        case 'past_due':
        case 'unpaid':
            return 'past_due';
        case 'canceled':
            return 'canceled';
        case 'incomplete':
        case 'incomplete_expired':
            return 'incomplete';
        default:
            return 'unknown';
    }
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    let event: import('stripe').Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as import('stripe').Stripe.Checkout.Session;

                // Handling Packs (one-time payments)
                if (session.mode === 'payment' && session.payment_status === 'paid') {
                    // Identify the pack purchased.
                    // Normally you'd match the LineItem or Price ID here to determine credit amount via Stripe API
                    // For simplicity we retrieve line items:
                    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                    const priceId = lineItems.data[0]?.price?.id;

                    let creditsToAdd = 0;
                    let planName = 'Inconnu';

                    // Based on PRD configuration (you might move this logic to a constants file)
                    // Adjust these logic checks to match your actual Stripe Price IDs created in dashboard.
                    if (priceId === process.env.NEXT_PUBLIC_PRICE_PACK_DECOUVERTE) {
                        creditsToAdd = 1; planName = 'Pack Découverte';
                    } else if (priceId === process.env.NEXT_PUBLIC_PRICE_PACK_STANDARD) {
                        creditsToAdd = 3; planName = 'Pack Standard';
                    } else if (priceId === process.env.NEXT_PUBLIC_PRICE_PACK_PRO) {
                        creditsToAdd = 5; planName = 'Pack Pro';
                    } else if (priceId === process.env.NEXT_PUBLIC_PRICE_PACK_VOLUME) {
                        creditsToAdd = 10; planName = 'Pack Volume';
                    }

                    if (creditsToAdd > 0) {
                        const uid = session.metadata?.supabase_uid || session.client_reference_id;

                        if (uid) {
                            // Determine expiration (e.g. 3 years from now)
                            const expiresAt = new Date();
                            expiresAt.setFullYear(expiresAt.getFullYear() + 3);

                            const { data: packResult, error: packError } = await supabaseAdmin
                                .from('packs')
                                .insert({
                                    user_id: uid,
                                    credits_total: creditsToAdd,
                                    credits_used: 0,
                                    expires_at: expiresAt.toISOString(),
                                })
                                .select('id')
                                .single();

                            if (packError) throw packError;

                            // Create a transaction record
                            if (packResult) {
                                await supabaseAdmin.from('credit_transactions').insert({
                                    user_id: uid,
                                    pack_id: packResult.id,
                                    type: 'credit',
                                    amount: creditsToAdd,
                                    balance_after: creditsToAdd, // Requires more complex query if multiple active packs exist, kept simple here
                                    description: `Achat ${planName}`,
                                });
                            }
                        } else {
                            console.error('No User ID found in session metadata for Pack purchase.');
                        }
                    }
                }
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as import('stripe').Stripe.Subscription;

                // Find user by stripe_customer_id
                const customerId = subscription.customer as string;
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                if (profile) {
                    const priceId = subscription.items.data[0].price.id;
                    // Determine Plan type
                    let planName = 'essentiel';
                    if (
                        priceId === process.env.NEXT_PUBLIC_PRICE_EXPERT_MONTHLY ||
                        priceId === process.env.NEXT_PUBLIC_PRICE_EXPERT_YEARLY
                    ) {
                        planName = 'expert';
                    }

                    // Upsert subscription data
                    const sub = subscription as any;
                    const { error: subError } = await supabaseAdmin
                        .from('subscriptions')
                        .upsert({
                            user_id: profile.id, // Primary key composite or unique constraint ideally needed here or handled by logic
                            stripe_subscription_id: subscription.id,
                            plan: planName,
                            status: mapStatus(subscription.status),
                            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                        });

                    if (subError) throw subError;
                } else {
                    console.error(`Received subscription update for unknown customer: ${customerId}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as import('stripe').Stripe.Subscription;
                const { error: delError } = await supabaseAdmin
                    .from('subscriptions')
                    .update({ status: 'canceled' })
                    .eq('stripe_subscription_id', subscription.id);

                if (delError) throw delError;
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook handler failed:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed.' },
            { status: 500 }
        );
    }
}
