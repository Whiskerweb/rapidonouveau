'use client';

import { Check, X, Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const FEATURES = [
    { name: 'Estimation par IA (Scan)', essentiel: true, expert: true, tooltip: "Notre algorithme extrait les surfaces et volumes de vos documents." },
    { name: 'Validation Maître d\'œuvre', essentiel: false, expert: true, tooltip: "Un expert vérifie et valide techniquement chaque ligne de votre dossier." },
    { name: 'Délai de livraison', essentiel: '48h', expert: '48h', tooltip: "Temps moyen constaté entre la soumission et le rapport final." },
    { name: 'Rapport avec votre LOGO', essentiel: false, expert: true, tooltip: "Personnalisez le document final pour vos clients." },
    { name: 'Export Word éditable', essentiel: false, expert: true, tooltip: "Récupérez le texte pour l'intégrer dans vos propres outils." },
    { name: 'Division foncière', essentiel: false, expert: true, tooltip: "Prise en compte des projets complexes de division." },
    { name: 'Dossier Bank-Ready', essentiel: true, expert: true, tooltip: "Document conforme aux exigences des organismes de crédit." },
    { name: 'Support technique', essentiel: 'Standard', expert: 'Prioritaire 6j/7', tooltip: "Rapidité de réponse de notre équipe support." },
];

export function PricingComparison() {
    return (
        <section className="py-32 bg-white">
            <div className="container px-4">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-secondary">
                        Comparez nos <span className="text-primary italic">solutions.</span>
                    </h2>
                    <p className="text-secondary/40 font-bold max-w-2xl mx-auto">
                        Choisissez le niveau d&apos;expertise dont vous avez besoin pour vos projets.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto overflow-hidden rounded-[3rem] border border-zinc-100 shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="p-8 text-xs font-black uppercase tracking-widest text-secondary/40 w-1/2">Fonctionnalité</th>
                                <th className="p-8 text-center">
                                    <p className="text-sm font-black text-secondary">ESSENTIEL</p>
                                </th>
                                <th className="p-8 text-center bg-primary/5">
                                    <p className="text-sm font-black text-primary">EXPERT</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {FEATURES.map((feature, i) => (
                                <tr key={i} className="hover:bg-zinc-50/30 transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-secondary">{feature.name}</span>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-secondary text-white border-none rounded-xl p-3 max-w-[200px]">
                                                        <p className="text-xs font-bold leading-relaxed">{feature.tooltip}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        {typeof feature.essentiel === 'boolean' ? (
                                            feature.essentiel ? (
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <X className="w-4 h-4 text-zinc-200 mx-auto" strokeWidth={3} />
                                            )
                                        ) : (
                                            <span className="text-sm font-black text-secondary/60">{feature.essentiel}</span>
                                        )}
                                    </td>
                                    <td className="p-8 text-center bg-primary/5">
                                        {typeof feature.expert === 'boolean' ? (
                                            feature.expert ? (
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <X className="w-4 h-4 text-zinc-200 mx-auto" strokeWidth={3} />
                                            )
                                        ) : (
                                            <span className="text-sm font-black text-primary">{feature.expert}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
