'use client';

import { useState } from 'react';
import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const FAQ = [
    {
        q: "Combien de temps pour recevoir mon estimation ?",
        a: "Nous garantissons un délai de 48h ouvrées à partir de la réception de vos documents. La plupart des estimations sont livrées en 24h.",
    },
    {
        q: "Quels types de projets pouvez-vous chiffrer ?",
        a: "Tous les travaux de rénovation intérieure et extérieure : maçonnerie, plomberie, électricité, menuiserie, peinture, isolation, carrelage, etc.",
    },
    {
        q: "Mes données sont-elles confidentielles ?",
        a: "Absolument. Vos documents sont stockés de manière sécurisée et chiffrée en Europe. Nous ne les partageons jamais avec des tiers.",
    },
    {
        q: "Puis-je demander une révision du devis ?",
        a: "Oui, les révisions sont incluses et illimitées. Nous nous engageons à ce que vous repartiez avec un devis qui vous convient.",
    },
    {
        q: "Une estimation remplace-t-elle un vrai devis d'artisan ?",
        a: "Non, notre estimation est une base de référence fiable qui vous permet de valider la faisabilité et le budget d'un projet. Elle ne remplace pas le devis définitif de l'artisan qui réalisera les travaux.",
    },
    {
        q: "Comment fonctionne le crédit d'estimation ?",
        a: "Chaque estimation soumise consomme 1 crédit. Avec un abonnement, vous bénéficiez d'un quota mensuel. Les packs à la carte permettent d'acheter des crédits supplémentaires.",
    },
];

export default function ContactPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: connect to email sending API
        setSent(true);
    };

    return (
        <MarketingLayout>

            <section className="bg-background pt-16 pb-12 text-center">
                <div className="container px-4 md:px-6 flex flex-col items-center space-y-4 max-w-2xl mx-auto">
                    <Badge variant="outline" className="rounded-full">Contact & FAQ</Badge>
                    <h1 className="text-4xl font-heading font-extrabold text-rapido-blue">
                        Une question ? On est là.
                    </h1>
                    <p className="text-zinc-500 md:text-lg">
                        Consultez notre FAQ ou envoyez-nous un message. Nous répondons sous 24h.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-12">
                <div className="container px-4 md:px-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-heading font-bold text-rapido-blue mb-6">Questions fréquentes</h2>
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <div key={i} className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                                <button
                                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-rapido-blue hover:bg-zinc-50 transition-colors text-sm"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {item.q}
                                    <span className="ml-4 text-rapido-green text-xl flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="border-t px-5 pb-5 pt-3 text-sm text-zinc-600 leading-relaxed">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact form */}
            <section className="bg-zinc-50 py-16">
                <div className="container px-4 md:px-6 max-w-lg mx-auto">
                    <h2 className="text-2xl font-heading font-bold text-rapido-blue mb-2">Nous contacter</h2>
                    <p className="text-zinc-500 text-sm mb-8">Remplissez le formulaire et nous vous répondrons sous 24h ouvrées.</p>

                    {sent ? (
                        <div className="rounded-2xl bg-rapido-green/10 border border-rapido-green/30 p-8 text-center space-y-2">
                            <p className="text-3xl">✅</p>
                            <p className="font-semibold text-rapido-green">Message envoyé !</p>
                            <p className="text-sm text-zinc-500">Nous vous répondrons sous 24h.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nom</label>
                                    <Input
                                        placeholder="Jean Dupont"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="jean@email.fr"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Décrivez votre besoin..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-rapido-blue hover:bg-rapido-blue-700 text-white rounded-full">
                                Envoyer le message
                            </Button>
                        </form>
                    )}
                </div>
            </section>

        </MarketingLayout>
    );
}
