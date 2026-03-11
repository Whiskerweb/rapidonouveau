'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Check, FileText } from 'lucide-react';

export function AnimatedQuoteEditor() {
    const [totalHT, setTotalHT] = useState(0);

    useEffect(() => {
        // Animate total counter
        const timer = setTimeout(() => {
            let current = 0;
            const target = 14500.50;
            const duration = 2000;
            const fps = 60;
            const step = target / (duration / (1000 / fps));

            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    setTotalHT(target);
                    clearInterval(interval);
                } else {
                    setTotalHT(current);
                }
            }, 1000 / fps);

            return () => clearInterval(interval);
        }, 1500); // Start counting after lines animate in

        return () => clearTimeout(timer);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    return (
        <div className="w-full h-full bg-[#FAFAFA] rounded-2xl overflow-hidden font-sans border border-zinc-200 shadow-sm flex flex-col">
            {/* Editor App Header */}
            <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <span className="text-sm font-bold text-zinc-800">Devis #DEV-2024-089</span>
                        </motion.div>
                        <div className="text-[10px] text-zinc-400 font-medium">Client: Dupont Rénovation</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-zinc-100 rounded-md animate-pulse" />
                    <div className="h-6 w-20 bg-primary/10 rounded-md animate-pulse" />
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 p-4 flex flex-col gap-3 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-zinc-400 px-2 mt-2">
                    <div className="col-span-6">Ouvrage / Désignation</div>
                    <div className="col-span-2 text-center">Qté</div>
                    <div className="col-span-2 text-right">PU HT</div>
                    <div className="col-span-2 text-right">Total HT</div>
                </div>

                <div className="flex-1 space-y-2 relative z-10">
                    {/* Line Item 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                        className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm grid grid-cols-12 gap-2 items-center"
                    >
                        <div className="col-span-6 flex flex-col">
                            <span className="text-xs font-bold text-zinc-800">Démolition mur porteur</span>
                            <span className="text-[10px] text-zinc-400">Inclut évacuation gravats</span>
                        </div>
                        <div className="col-span-2 text-center text-xs font-medium text-zinc-600">12 m³</div>
                        <div className="col-span-2 text-right text-xs font-medium text-zinc-600">145,00 €</div>
                        <div className="col-span-2 text-right text-xs font-bold text-zinc-800">1 740,00 €</div>
                    </motion.div>

                    {/* Line Item 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm grid grid-cols-12 gap-2 items-center"
                    >
                        <div className="col-span-6 flex flex-col">
                            <span className="text-xs font-bold text-zinc-800">Coulage chape béton</span>
                            <span className="text-[10px] text-zinc-400">Béton fibré épaisseur 12cm</span>
                        </div>
                        <div className="col-span-2 text-center text-xs font-medium text-zinc-600">45 m²</div>
                        <div className="col-span-2 text-right text-xs font-medium text-zinc-600">65,00 €</div>
                        <div className="col-span-2 text-right text-xs font-bold text-zinc-800">2 925,00 €</div>
                    </motion.div>

                    {/* Line Item 3 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1.2, type: "spring" }}
                        className="bg-white rounded-lg p-3 border-2 border-primary/20 bg-primary/5 shadow-sm grid grid-cols-12 gap-2 items-center relative overflow-hidden"
                    >
                        {/* Subtle highlight sweep */}
                        <motion.div
                            initial={{ left: "-100%" }}
                            animate={{ left: "100%" }}
                            transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                        />
                        <div className="col-span-6 flex flex-col z-10">
                            <span className="text-xs font-bold text-zinc-800">Menuiserie Alu Noir Mat</span>
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Validé via IA Prix</span>
                        </div>
                        <div className="col-span-2 text-center text-xs font-medium text-zinc-600 z-10">4 u</div>
                        <div className="col-span-2 text-right text-xs font-medium text-zinc-600 z-10">2 458,87 €</div>
                        <div className="col-span-2 text-right text-xs font-bold text-zinc-800 z-10">9 835,50 €</div>
                    </motion.div>

                    {/* Add Button Mock */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="mt-2 flex items-center gap-2 text-primary font-bold text-xs cursor-pointer w-fit px-2 py-1 rounded hover:bg-primary/5"
                    >
                        <Plus className="w-3 h-3" /> Ajouter un ouvrage
                    </motion.div>
                </div>
            </div>

            {/* Editor Footer / Total */}
            <div className="bg-zinc-800 text-white p-4">
                <div className="flex justify-end pr-2">
                    <div className="flex flex-col items-end w-48">
                        <div className="flex justify-between w-full text-xs text-zinc-400 mb-1">
                            <span>Total HT</span>
                            <span>{formatPrice(totalHT)}</span>
                        </div>
                        <div className="flex justify-between w-full text-xs text-zinc-400 mb-2 border-b border-zinc-600 pb-2">
                            <span>TVA (20%)</span>
                            <span>{formatPrice(totalHT * 0.20)}</span>
                        </div>
                        <div className="flex justify-between w-full text-sm font-black text-white">
                            <span>TOTAL TTC</span>
                            <span className="text-primary">{formatPrice(totalHT * 1.20)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
