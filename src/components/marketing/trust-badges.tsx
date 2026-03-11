'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Globe, CheckCircle } from 'lucide-react';

const BADGES = [
    {
        icon: ShieldCheck,
        label: "RGPD Compliant",
        desc: "Données sécurisées"
    },
    {
        icon: Lock,
        label: "Paiement Sécurisé",
        desc: "Stripe & SSL"
    },
    {
        icon: Globe,
        label: "Normes Bancaires",
        desc: "Validé en banque"
    },
    {
        icon: CheckCircle,
        label: "Certifié MOE",
        desc: "Expertise humaine"
    }
];

export function TrustBadges() {
    return (
        <section className="py-12 bg-zinc-50/50 border-y border-zinc-100">
            <div className="container px-4">
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {BADGES.map((badge, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-100">
                                <badge.icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-secondary uppercase tracking-widest">{badge.label}</span>
                                <span className="text-[10px] text-secondary/40 font-bold">{badge.desc}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
