import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const FEATURES = [
    {
        icon: '🤖',
        title: "IA de dernière génération",
        description: "Notre modèle d'IA a été entraîné sur des milliers de devis réels validés par des experts du bâtiment français.",
    },
    {
        icon: '📊',
        title: "Base de tarifs actualisée",
        description: "Prix des matériaux et main d'œuvre mis à jour en temps réel selon les indices de la construction.",
    },
    {
        icon: '📋',
        title: "Devis PDF professionnel",
        description: "Générez un devis avec votre logo, vos couleurs et votre identité. Prêt à envoyer au client en 1 clic.",
    },
    {
        icon: '🔒',
        title: "Données 100% sécurisées",
        description: "Vos documents et données sont stockés en France (Supabase EU), cryptés et jamais partagés.",
    },
    {
        icon: '⚡',
        title: "Réponse en 48h garanties",
        description: "Chaque estimation est vérifiée par un expert humain avant livraison. Rapidité sans compromis sur la qualité.",
    },
    {
        icon: '🔄',
        title: "Révisions illimitées",
        description: "Besoin d'ajuster un poste ? Demandez des révisions gratuitement jusqu'à validation du devis.",
    },
];

const USE_CASES = [
    { role: 'Agents immobiliers', text: "Estimez le coût de remise en état de vos biens avant mise en vente ou location." },
    { role: 'Promoteurs', text: "Budgétisez vos projets de réhabilitation ou de construction neuve avec précision." },
    { role: 'Marchands de biens', text: "Calculez votre budget travaux en quelques heures et optimisez votre marge." },
    { role: 'Architectes', text: "Offrez à vos clients une estimation préliminaire fiable dès la phase de conception." },
    { role: 'Gestionnaires de patrimoine', text: "Planifiez les travaux de votre parc immobilier avec une vision budgétaire claire." },
    { role: 'Investisseurs', text: "Évaluez la rentabilité de vos projets locatifs en maîtrisant le coût des travaux." },
];

export default function NotreSolutionPage() {
    return (
        <MarketingLayout>

            {/* HERO */}
            <section className="bg-background pt-16 pb-16 md:pt-24 md:pb-20">
                <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                    <Badge variant="outline" className="rounded-full">Notre Solution</Badge>
                    <h1 className="text-4xl font-heading font-extrabold sm:text-5xl text-rapido-blue">
                        L&apos;estimation travaux, réinventée pour les pros.
                    </h1>
                    <p className="text-zinc-500 md:text-xl leading-relaxed">
                        Rapido&apos;Devis combine intelligence artificielle et expertise humaine pour vous
                        fournir des estimations de travaux précises, rapides et professionnelles.
                    </p>
                    <Link href="/inscription">
                        <Button size="lg" className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full px-8">
                            Essayer gratuitement →
                        </Button>
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-zinc-50 py-20">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-heading font-extrabold text-rapido-blue text-center mb-12">
                        Tout ce dont vous avez besoin
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="rounded-2xl bg-white border border-zinc-100 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-3xl">{f.icon}</div>
                                <h3 className="font-bold text-rapido-blue">{f.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW TO USE */}
            <section className="py-20">
                <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
                    <div className="space-y-6">
                        <Badge variant="outline" className="rounded-full">Le processus</Badge>
                        <h2 className="text-3xl font-heading font-extrabold text-rapido-blue">
                            De vos documents à votre devis, sans friction.
                        </h2>
                        <div className="space-y-5">
                            {[
                                { n: '01', title: "Upload de vos documents", desc: "Plans PDF, photos, tableur Excel ou simple description textuelle — notre système s'adapte à vos habitudes." },
                                { n: '02', title: "Analyse automatique", desc: "Notre IA identifie les postes de travaux, les surfaces et les corps de métier en quelques secondes." },
                                { n: '03', title: "Validation humaine", desc: "Un expert Rapido'Devis vérifie et affine l'estimation selon les prix réels de votre région." },
                                { n: '04', title: "Livraison du devis", desc: "Vous recevez votre devis PDF en moins de 48h, prêt à être présenté." },
                            ].map((step) => (
                                <div key={step.n} className="flex gap-4">
                                    <span className="font-heading text-3xl font-extrabold text-rapido-blue/20 leading-none">{step.n}</span>
                                    <div>
                                        <p className="font-semibold text-rapido-blue">{step.title}</p>
                                        <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Visual */}
                    <div className="rounded-2xl bg-rapido-blue p-8 text-white space-y-4">
                        <p className="font-heading text-lg font-bold">Exemple de devis généré</p>
                        <div className="space-y-2">
                            {['Démolition', 'Maçonnerie', 'Plomberie', 'Électricité', 'Peinture & finitions'].map((item) => (
                                <div key={item} className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-sm">
                                    <span>{item}</span>
                                    <div className="h-3 w-16 rounded bg-white/20" />
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                            <span className="font-semibold">TOTAL HT</span>
                            <span className="font-heading text-2xl font-extrabold text-rapido-green">24 800 €</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO IS IT FOR */}
            <section className="bg-zinc-50 py-20">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-heading font-extrabold text-rapido-blue text-center mb-12">
                        Pour qui ?
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                        {USE_CASES.map((uc, i) => (
                            <div key={i} className="rounded-xl bg-white border border-zinc-100 p-5 space-y-2">
                                <p className="font-bold text-rapido-blue text-sm">{uc.role}</p>
                                <p className="text-zinc-500 text-sm leading-relaxed">{uc.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-rapido-blue py-16">
                <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl font-heading font-extrabold text-white">
                        Commencez votre première estimation gratuite
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/inscription">
                            <Button size="lg" className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full px-8">
                                Démarrer maintenant →
                            </Button>
                        </Link>
                        <Link href="/nos-tarifs">
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10">
                                Voir les tarifs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </MarketingLayout>
    );
}
