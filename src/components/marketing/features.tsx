import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Smartphone, BarChart3, ShieldCheck, Landmark, ArrowRight } from 'lucide-react';

const FEATURES = [
    {
        title: "IA & Analyse Matériaux",
        tag: "Incontournable",
        desc: "Analyse en temps réel de vos quantitatifs avec les tarifs matériaux actualisés localement.",
        image: "https://rapido-devis.fr/wp-content/uploads/2025/10/image-4-1.png",
        icon: Sparkles,
        link: "/fonctionnalites/scan-ia",
        className: "md:col-span-2 lg:col-span-2 row-span-2 bg-[#F9FBFF] border-blue-50",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100/50"
    },
    {
        title: "Application Chantier",
        tag: "Nouveau",
        desc: "Capturez vos mesures et photos en direct du chantier pour une précision sans faille.",
        icon: Smartphone,
        link: "/fonctionnalites/mobile",
        className: "bg-primary/5 border-primary/10",
        iconColor: "text-primary",
        iconBg: "bg-primary/10"
    },
    {
        title: "Analyse des Marges",
        tag: "Gestion",
        desc: "Chaque poste est décomposé pour garantir la rentabilité de vos travaux.",
        icon: BarChart3,
        link: "/dashboard",
        className: "bg-orange-50/50 border-orange-100",
        iconColor: "text-orange-500",
        iconBg: "bg-orange-100/50"
    },
    {
        title: "Validation par Expert",
        tag: "Certifié",
        desc: "Toutes nos estimations sont auditées par un maître d'œuvre avant envoi final.",
        image: "https://rapido-devis.fr/wp-content/uploads/2025/10/image-5-1.png",
        icon: ShieldCheck,
        link: "/fonctionnalites/expertise-humaine",
        className: "md:col-span-2 lg:col-span-1 row-span-2 bg-secondary text-white border-secondary/20",
        iconColor: "text-primary",
        iconBg: "bg-white/10"
    },
    {
        title: "Compatible Normes TVA",
        tag: "Fiscalité",
        desc: "Générez des rapports conformes aux exigences administratives et bancaires.",
        icon: Landmark,
        link: "/notre-solution/fiscalite",
        className: "bg-zinc-50 border-zinc-200",
        iconColor: "text-secondary",
        iconBg: "bg-secondary/5"
    },
];

export function Features() {
    return (
        <section className="py-40 bg-white relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-8 py-2.5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase">
                            Prenez une longueur d&apos;avance
                        </Badge>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black text-secondary max-w-4xl leading-[1] tracking-tight">
                        La puissance de l&apos;IA au service <br />
                        <span className="text-primary italic">des bâtisseurs agile.</span>
                    </h2>
                    <p className="text-secondary/60 text-xl max-w-3xl leading-relaxed font-bold">
                        Plus qu&apos;un simple chiffrage, un véritable assistant stratégique qui sécurise vos marges et crédibilise vos dossiers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-[340px] max-w-7xl mx-auto">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
                            className={`group relative rounded-3xl border-2 overflow-hidden p-8 lg:p-12 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${f.className}`}
                        >
                            {/* Pro Shine Effect Overlay */}
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <div className={`p-5 rounded-3xl ${f.iconBg} backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                                        <f.icon className={`w-9 h-9 ${f.iconColor}`} strokeWidth={2.5} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full border shadow-sm ${f.className.includes('bg-secondary') ? 'bg-white/10 border-white/10 text-white' : 'bg-white border-zinc-100 text-secondary/40'}`}>
                                        {f.tag}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className={`text-3xl md:text-4xl font-heading font-black tracking-tighter leading-none ${f.className.includes('bg-secondary') ? 'text-white' : 'text-secondary'}`}>
                                        {f.title}
                                    </h3>
                                    <p className={`text-base leading-relaxed font-bold ${f.className.includes('bg-secondary') ? 'text-white/60' : 'text-secondary/50'}`}>
                                        {f.desc}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center pointer-events-auto">
                                    <Link href={f.link} className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all ${f.className.includes('bg-secondary') ? 'text-primary' : 'text-secondary hover:text-primary'}`}>
                                        Découvrir <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </Link>
                                </div>
                            </div>

                            {/* Image Background */}
                            {f.image && (
                                <div className="absolute bottom-0 right-[-10%] w-[90%] md:w-[70%] lg:w-[60%] lg:right-0 lg:left-auto -mb-12 origin-bottom-right transition-all duration-700 z-0 pointer-events-none opacity-20 sm:opacity-40 lg:opacity-100 group-hover:rotate-0 rotate-[-5deg]">
                                    <div className="relative">
                                        <Image
                                            src={f.image}
                                            alt={f.title}
                                            width={600}
                                            height={400}
                                            className="w-full h-auto transform scale-105 group-hover:scale-115 transition-transform duration-1000 object-right-bottom"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
