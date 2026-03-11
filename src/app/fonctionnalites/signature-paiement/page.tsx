import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditCard, PenTool, ArrowRight, ShieldCheck, Euro } from 'lucide-react';

export const metadata = {
    title: "Signature Électronique et Paiement BTP | Rapido'Devis",
    description: "Faites signer vos devis BTP électroniquement et encaissez vos acomptes en ligne instantanément pour sécuriser vos chantiers.",
};

export default function SignaturePaiementPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-zinc-50 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-green-500/5 to-transparent -z-10" />
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 font-black text-xs uppercase tracking-widest">
                                <PenTool className="w-4 h-4" />
                                <span>Signature & Paiement</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Du devis signé <br />
                                à l&apos;<span className="text-green-600 italic">acompte encaissé.</span>
                            </h1>
                            <p className="text-secondary/60 text-xl font-bold leading-relaxed max-w-lg">
                                Réduisez vos délais de paiement. Permettez à vos clients de valider vos devis numériquement et de payer un acompte par carte bancaire dans la foulée.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="w-full sm:w-auto h-16 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl px-10 text-lg shadow-xl shadow-green-500/20 transition-all hover:-translate-y-1">
                                        Accélérer mes encaissements
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Payment Mockup */}
                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="absolute inset-0 bg-green-500/20 blur-[100px] scale-90 -z-10 rounded-full" />
                            <div className="bg-white rounded-[2rem] shadow-2xl border border-zinc-100 overflow-hidden max-w-sm mx-auto">
                                <div className="bg-secondary p-8 text-center text-white">
                                    <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                                        <ShieldCheck className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="font-heading font-black text-2xl">Devis validé !</h3>
                                    <p className="text-white/60 font-bold mt-2">Merci pour votre confiance, Mr. Dupont.</p>
                                </div>
                                <div className="p-8 space-y-6 bg-zinc-50 relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-full text-xs font-black text-green-600 border border-zinc-100 shadow-sm">
                                        Étape 2/2 : Acompte
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <div className="text-sm font-bold text-secondary/50">Montant de l&apos;acompte (30%)</div>
                                        <div className="text-4xl font-black text-secondary flex items-center justify-center gap-1">
                                            <span>2 450,00 €</span>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-green-500 rounded-xl p-4 flex items-center gap-4 cursor-pointer">
                                        <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-white font-black text-[10px]">CB</div>
                                        <div className="font-bold text-secondary flex-1">Carte Bancaire</div>
                                        <div className="w-4 h-4 rounded-full border-4 border-green-500" />
                                    </div>

                                    <Button className="w-full h-14 bg-green-600 hover:bg-green-700 font-black text-lg rounded-xl">
                                        Payer l&apos;acompte
                                    </Button>
                                    <div className="text-center flex items-center justify-center gap-2 text-xs font-bold text-secondary/40">
                                        <ShieldCheck className="w-4 h-4" /> Paiement 100% sécurisé via Stripe
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="py-24 bg-white">
                <div className="container px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 hover:border-green-500/30 transition-colors">
                            <PenTool className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-black text-secondary mb-4">Signature Électronique</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Finis les devis imprimés, signés, scannés et renvoyés. Votre client reçoit un lien sécurisé, lit le devis sur son téléphone et le signe avec le doigt. Valeur légale garantie.
                            </p>
                        </div>
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 hover:border-green-500/30 transition-colors">
                            <CreditCard className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-black text-secondary mb-4">Paiement d&apos;Acompte</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Intégrez un lien de paiement Stripe directement lors de la signature. Plus besoin de courir après les chèques d&apos;acompte pour bloquer une date de chantier.
                            </p>
                        </div>
                        <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 hover:border-green-500/30 transition-colors">
                            <Euro className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-2xl font-black text-secondary mb-4">Relances Automatisées</h3>
                            <p className="text-secondary/60 font-bold leading-relaxed">
                                Facture en retard ? Le logiciel envoie des rappels amicaux (mais fermes) par email automatiquement à vos clients, sans que vous n&apos;ayez à y penser.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
