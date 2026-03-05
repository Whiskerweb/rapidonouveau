import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockkey', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2026-02-25.clover',
    appInfo: {
        name: "Rapido'Devis V2",
        url: 'https://rapido-devis.fr',
    },
});
