import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const STATS = [
  { value: '+1 000', label: 'Professionnels' },
  { value: '48h', label: 'Délai moyen' },
  { value: '98%', label: 'Satisfaction client' },
  { value: '10x', label: 'Plus rapide' },
];

const STEPS = [
  {
    icon: '📤',
    title: '1. Transmettez vos infos',
    description: "Uploadez vos plans, listes ou décrivez en texte libre votre projet de rénovation.",
  },
  {
    icon: '🧠',
    title: '2. Notre IA analyse et chiffre',
    description: "Nos algorithmes évaluent les matériaux, la main d'œuvre et les coûts réels du marché.",
  },
  {
    icon: '✅',
    title: '3. Recevez votre devis',
    description: "En 48h max, téléchargez votre devis PDF professionnel, prêt à être présenté à votre client.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Rapido'Devis m'a permis de gagner un temps fou. J'estime maintenant 3x plus de projets par semaine.",
    name: 'Sophie M.',
    role: 'Agent Immobilier, Lyon',
    initials: 'SM',
  },
  {
    quote: "La précision des devis est bluffante. Mes clients sont impressionnés par le niveau de détail.",
    name: 'Thomas L.',
    role: 'Promoteur Immobilier, Paris',
    initials: 'TL',
  },
  {
    quote: "Enfin un outil pensé pour les pros. Simple, rapide et vraiment précis sur les coûts de travaux.",
    name: 'Marie D.',
    role: 'Architecte DPLG, Bordeaux',
    initials: 'MD',
  },
];

export default function Home() {
  return (
    <MarketingLayout>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24">
        {/* Background gradient blob */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-rapido-green/5 blur-3xl" />
        </div>

        <div className="container relative px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <Badge className="rounded-full bg-rapido-orange/10 text-rapido-orange border-rapido-orange/20 hover:bg-rapido-orange/20">
                  Nouveau Rapido&apos;Devis V2 ⚡️
                </Badge>
                <h1 className="text-4xl font-heading font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-rapido-blue leading-tight">
                  Estimez vos travaux <br />
                  <span className="text-rapido-green">10x plus vite</span> avec l&apos;IA.
                </h1>
                <p className="max-w-[580px] text-zinc-600 md:text-xl leading-relaxed">
                  Importez vos plans, listes ou décrivez votre projet. Notre IA génère
                  un devis détaillé en 48h — validé par des experts du bâtiment.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/inscription">
                  <Button size="lg" className="w-full sm:w-auto bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full px-8 shadow-lg shadow-rapido-green/20">
                    Commencer gratuitement →
                  </Button>
                </Link>
                <Link href="/notre-solution">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8">
                    Voir la démo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <div className="flex -space-x-2">
                  {['SM', 'TL', 'MD'].map((initials) => (
                    <div key={initials} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-rapido-blue text-[10px] font-bold text-white">
                      {initials}
                    </div>
                  ))}
                </div>
                <span>+1 000 professionnels nous font confiance</span>
              </div>
            </div>

            {/* App preview mock */}
            <div className="mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b bg-zinc-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-2 flex-1 rounded bg-zinc-100 px-3 py-0.5 text-xs text-zinc-400">
                    app.rapido-devis.fr/estimation
                  </div>
                </div>
                {/* Content mock */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded-md bg-zinc-200 animate-pulse" />
                    <div className="h-5 w-16 rounded-full bg-rapido-green/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-zinc-100" />
                    <div className="h-3 w-5/6 rounded bg-zinc-100" />
                    <div className="h-3 w-4/6 rounded bg-zinc-100" />
                  </div>
                  <div className="rounded-lg border border-zinc-100 p-3 space-y-2">
                    {['Maçonnerie', 'Plomberie', 'Électricité', 'Peinture'].map((item) => (
                      <div key={item} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-rapido-green" />
                          <span className="text-zinc-600">{item}</span>
                        </div>
                        <div className="h-3 w-14 rounded bg-zinc-100" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-rapido-blue px-4 py-3">
                    <span className="text-sm font-semibold text-white">Total estimé</span>
                    <span className="font-heading font-bold text-white">24&nbsp;800 €</span>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 rounded-xl bg-white border border-zinc-200 shadow-lg px-4 py-2 text-sm font-semibold text-rapido-green hidden lg:flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rapido-green animate-pulse" />
                Devis généré en 23h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y bg-rapido-blue py-12">
        <div className="container px-4 md:px-6">
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <dt className="font-heading text-4xl font-extrabold text-white">{stat.value}</dt>
                <dd className="mt-1 text-sm text-rapido-blue-200">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-zinc-50 py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-3 mb-14">
            <Badge variant="outline" className="rounded-full">Comment ça marche</Badge>
            <h2 className="text-3xl font-heading font-extrabold sm:text-4xl text-rapido-blue">
              Simple. Rapide. Précis.
            </h2>
            <p className="max-w-xl text-zinc-500 md:text-lg">
              Transformez vos documents bruts en devis professionnels en 3 étapes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center space-y-4 rounded-2xl bg-white border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Step connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-16 -right-4 hidden md:block w-8 border-t-2 border-dashed border-zinc-200 z-10" />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rapido-blue/5 text-3xl">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-rapido-blue">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-3 mb-14">
            <Badge variant="outline" className="rounded-full">Témoignages</Badge>
            <h2 className="text-3xl font-heading font-extrabold sm:text-4xl text-rapido-blue">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <p className="text-zinc-600 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rapido-blue text-xs font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-rapido-blue">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-rapido-blue py-20">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl font-heading font-extrabold sm:text-4xl text-white">
            Prêt à chiffrer votre prochain projet ?
          </h2>
          <p className="max-w-xl text-rapido-blue-200 md:text-lg">
            Rejoignez +1 000 professionnels qui gagnent du temps chaque semaine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/inscription">
              <Button size="lg" className="bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full px-8 shadow-lg">
                Commencer gratuitement →
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
