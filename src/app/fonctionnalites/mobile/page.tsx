import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Camera, CloudSync, MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const metadata = {
    title: "Application Mobile : Le chiffrage sur le terrain par Rapido'Devis",
    description: "Emportez la puissance du chiffrage IA partout avec vous. Capturez vos photos de chantiers et générez vos estimations en direct depuis votre smartphone.",
};

export default function MobileSolutionPage() {
    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-white overflow-hidden">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">Solution Terrain</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-black text-secondary leading-[1.05] tracking-tight">
                                Votre bureau tient <br />
                                dans <span className="text-primary italic">votre poche.</span>
                            </h1>

                            <p className="text-secondary/50 text-xl font-bold leading-relaxed max-w-xl">
                                Ne remettez plus le chiffrage à plus tard. Avec l&apos;application Rapido&apos;Devis, documentez vos chantiers et lancez vos estimations entre deux rendez-vous.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href="/inscription">
                                    <Button size="lg" className="h-16 w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-black rounded-2xl px-12 text-xl shadow-xl transition-all hover:scale-105">
                                        Essayer gratuitement
                                    </Button>
                                </Link>
                                <div className="flex gap-3">
                                    <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                            alt="App Store"
                                            width={140}
                                            height={46}
                                            className="h-12 w-auto"
                                        />
                                    </Link>
                                    <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                            alt="Google Play"
                                            width={158}
                                            height={46}
                                            className="h-12 w-auto"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Device Mockup Visual */}
                        <div className="relative group flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
                            <div className="relative w-[280px] h-[580px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden ring-4 ring-white/10">
                                {/* Mock App UI */}
                                <div className="absolute inset-0 bg-white flex flex-col p-6 space-y-6">
                                    <div className="flex justify-between items-center bg-zinc-50 -mx-6 -mt-6 p-6 pb-4 border-b border-zinc-100">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Nouvelle Estimation</span>
                                        <div className="w-8 h-8 rounded-full bg-zinc-100" />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="h-40 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 text-zinc-400 group-hover:border-primary/50 transition-colors">
                                            <Camera className="w-10 h-10" />
                                            <span className="text-xs font-bold">Prendre une photo</span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-4 w-full bg-zinc-100 rounded-full" />
                                            <div className="h-4 w-2/3 bg-zinc-100 rounded-full" />
                                        </div>

                                        <div className="pt-4">
                                            <div className="h-12 w-full bg-primary rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">
                                                Générer le devis
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex justify-between border-t border-zinc-100 pt-4 -mx-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-lg bg-zinc-50" />
                                        ))}
                                    </div>
                                </div>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Practical Benefits */}
            <section className="py-32 bg-zinc-50">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary">Pensé pour le chantier.</h2>
                        <p className="text-secondary/50 text-xl font-bold">Gagnez du temps là où ça compte vraiment : sur le terrain.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Camera,
                                title: "Photos & Diagnostic",
                                desc: "Prenez en photo vos supports, l&apos;IA analyse l&apos;état des surfaces et propose les prestations adaptées."
                            },
                            {
                                icon: MapPin,
                                title: "Métrés Géolocalisés",
                                desc: "Enregistrez vos mesures pièce par pièce. Synchronisation automatique avec votre dossier client."
                            },
                            {
                                icon: CloudSync,
                                title: "Synchro Instantanée",
                                desc: "Commencez sur mobile, finissez sur tablette ou ordinateur. Vos données sont toujours à jour."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-zinc-100 space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="p-4 bg-zinc-50 rounded-2xl text-primary w-fit">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary">{item.title}</h3>
                                <p className="text-secondary/50 font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Field Proof */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="max-w-6xl mx-auto rounded-[4rem] bg-secondary text-white p-12 md:p-24 overflow-hidden relative">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">Zéro papier, <br /><span className="text-primary italic">Zéro oubli.</span></h2>
                                <div className="space-y-6">
                                    {[
                                        "Dictée vocale pour annoter vos photos",
                                        "Interface optimisée pour une main",
                                        "Consultation des tarifs matériaux hors-ligne",
                                        "Envoi du pré-devis par SMS au client"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                            <p className="font-bold text-white/70">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/inscription" className="inline-block">
                                    <Button className="bg-primary hover:bg-primary/95 text-white font-black h-16 px-10 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105">
                                        Tester l&apos;App Terrain
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative aspect-square flex items-center justify-center">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse" />
                                <Smartphone className="w-64 h-64 text-primary relative z-10 opacity-20" />
                                <div className="absolute text-7xl font-black italic opacity-10 uppercase tracking-tighter">RAPIDO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-40 bg-white">
                <div className="container px-4">
                    <div className="bg-zinc-50 rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
                        <h2 className="text-4xl md:text-7xl font-heading font-black text-secondary leading-tight">
                            Libérez-vous des <br />
                            <span className="text-primary italic">corvées du soir.</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-xl font-bold text-secondary/40">
                            Faites vos métrés le jour, profitez de votre famille le soir. Rapido&apos;Devis s&apos;occupe de la paperasse.
                        </p>
                        <div className="flex flex-col gap-8 items-center pt-8">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10 w-full max-w-2xl">
                                <Link href="/inscription" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-20 w-full bg-primary hover:bg-primary/95 text-white font-black rounded-3xl px-16 text-2xl shadow-2xl transition-all hover:scale-105">
                                        Créer mon compte
                                    </Button>
                                </Link>
                                <Link href="/contact" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-20 w-full rounded-3xl border-secondary/10 text-secondary bg-white hover:bg-zinc-50 px-16 text-2xl font-black">
                                        Nous contacter
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 relative z-10">
                                <Link href="#" className="transition-transform hover:scale-110 active:scale-95">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                        alt="App Store"
                                        width={180}
                                        height={60}
                                        className="h-16 w-auto"
                                    />
                                </Link>
                                <Link href="#" className="transition-transform hover:scale-110 active:scale-95">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                        alt="Google Play"
                                        width={200}
                                        height={60}
                                        className="h-16 w-auto"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
