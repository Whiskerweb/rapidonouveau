'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Sparkles, Plus, Loader2 } from 'lucide-react';

const MOCK_RESULTS = [
    { title: "BA13 Standard Placo 2.50x1.20m", price: "7,85 €", unit: "m²", supplier: "Point.P" },
    { title: "Bande à joint papier Placo 150m", price: "4,20 €", unit: "Rlx", supplier: "Plateforme Bat" },
    { title: "Enduit de lissage PR4 (25kg)", price: "24,50 €", unit: "Sac", supplier: "Zolpan" },
];

export function AnimatedPriceLibrary() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        // Typewriter effect
        const term = "Placo BA13 et accessoires";
        let i = 0;

        // Start typing after initial delay
        const startDelay = setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (i < term.length) {
                    setSearchTerm(term.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    setIsSearching(true);

                    // Show skeleton for a bit
                    setTimeout(() => {
                        setIsSearching(false);
                        setShowResults(true);
                    }, 1200);
                }
            }, 50);

            return () => clearInterval(typingInterval);
        }, 500);

        return () => clearTimeout(startDelay);
    }, []);

    return (
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden font-sans border border-zinc-200 shadow-xl flex flex-col p-6">

            {/* Header Title */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-zinc-800">Base de prix IA</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Recherche sémantique actualisée</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className={`absolute inset-0 bg-blue-500/5 rounded-xl transition-opacity duration-300 ${isSearching ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative flex items-center border-2 border-zinc-200 rounded-xl bg-white px-4 py-3 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                    {isSearching ? (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-3" />
                    ) : (
                        <Search className="w-5 h-5 text-zinc-400 mr-3" />
                    )}
                    <span className={`text-sm ${searchTerm ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>
                        {searchTerm || "Rechercher un matériau ou un ouvrage..."}
                    </span>
                    {/* Simulated Cursor */}
                    {!showResults && !isSearching && (
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-0.5 h-5 bg-blue-500 ml-1"
                        />
                    )}
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 relative">

                {/* Skeleton Loading State */}
                {isSearching && (
                    <div className="absolute inset-0 space-y-3 bg-white z-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 rounded-xl border border-zinc-100 flex justify-between items-center animate-pulse">
                                <div className="space-y-2 w-1/2">
                                    <div className="h-4 bg-zinc-200 rounded w-full" />
                                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                                </div>
                                <div className="h-8 w-20 bg-zinc-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Actual Results */}
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{MOCK_RESULTS.length} Résultats</span>
                            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Zone: Île-de-France</span>
                        </div>

                        {MOCK_RESULTS.map((res, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15 }}
                                className="group p-3 rounded-xl border border-zinc-200 hover:border-blue-300 hover:shadow-md transition-all flex justify-between items-center bg-white cursor-pointer"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-zinc-800">{res.title}</span>
                                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                                        Fournisseur repéré: <span className="text-zinc-600">{res.supplier}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-sm font-black text-blue-600 block">{res.price}</span>
                                        <span className="text-[10px] text-zinc-400">/ {res.unit}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-50 group-hover:bg-blue-600 group-hover:text-white text-zinc-400 flex items-center justify-center transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Blank State (Before typing starts) */}
                {!isSearching && !showResults && searchTerm.length < 5 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 pt-10 opacity-50">
                        <Search className="w-10 h-10 mb-4 stroke-1" />
                        <p className="text-xs font-medium">L&apos;IA est prête à chercher parmi 40,000 références</p>
                    </div>
                )}
            </div>
        </div>
    );
}
