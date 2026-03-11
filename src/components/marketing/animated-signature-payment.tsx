'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileSignature, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AnimatedSignaturePayment() {
    const [step, setStep] = useState<0 | 1 | 2>(0);
    // 0: document preview
    // 1: signature drawing
    // 2: success/stripe

    useEffect(() => {
        // Manage sequence timing
        const timer1 = setTimeout(() => setStep(1), 2000);
        const timer2 = setTimeout(() => setStep(2), 5500); // Wait for signature to draw then transition

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="relative w-[300px] h-[600px] mx-auto bg-black rounded-[3rem] p-3 shadow-2xl border-[6px] border-zinc-800">
            {/* Mobile Screen Area */}
            <div className="w-full h-full bg-[#f8f9fa] rounded-[2.2rem] overflow-hidden relative flex flex-col font-sans">

                {/* Status Bar Fake */}
                <div className="h-6 w-full flex justify-between items-center px-5 pt-1">
                    <span className="text-[10px] font-bold text-black">9:41</span>
                    <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 rounded-full bg-black" />
                        <div className="w-4 h-2.5 bg-black rounded-sm" />
                    </div>
                </div>

                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50" />

                <div className="flex-1 relative overflow-hidden">

                    {/* STEP 0: Document Preview */}
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: step === 0 ? 1 : 0, x: step === 0 ? 0 : -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 p-5 flex flex-col pointer-events-none"
                        style={{ pointerEvents: step === 0 ? 'auto' : 'none' }}
                    >
                        <div className="h-10" /> {/* Notch spacer */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200 flex-1 flex flex-col">
                            <div className="w-10 h-10 bg-zinc-100 rounded-lg mb-4" />
                            <h4 className="font-black text-sm text-zinc-800">Devis Rénovation</h4>
                            <div className="h-2 w-2/3 bg-zinc-100 rounded mt-2" />
                            <div className="h-2 w-1/2 bg-zinc-100 rounded mt-2 mb-6" />

                            <div className="mt-auto border-t border-zinc-100 pt-4 flex justify-between items-end">
                                <span className="text-[10px] text-zinc-400 font-bold uppercase">Total TTC</span>
                                <span className="font-black text-lg text-primary">14 500 €</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 justify-center font-medium">
                                <ShieldCheck className="w-3 h-3" /> Document juridiquement valide
                            </div>
                            <button className="w-full h-12 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/30 flex justify-center items-center gap-2 relative overflow-hidden">
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                                />
                                <FileSignature className="w-4 h-4" /> Signer & Payer
                            </button>
                        </div>
                    </motion.div>


                    {/* STEP 1: Drawing Signature */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : (step > 1 ? -50 : 50) }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-white p-5 flex flex-col z-10"
                        style={{ pointerEvents: step === 1 ? 'auto' : 'none' }}
                    >
                        <div className="h-12" /> {/* Notch spacer */}
                        <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400 mb-2">Signature Électronique</h3>
                        <p className="text-sm font-bold text-zinc-800 mb-6">M. Dupont Jean</p>

                        <div className="flex-1 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 relative flex items-center justify-center">
                            <span className="absolute bottom-4 left-4 text-[10px] font-bold text-zinc-300 uppercase">Signez ici</span>

                            {/* SVG Path Animation */}
                            {step >= 1 && (
                                <svg viewBox="0 0 200 100" className="w-[80%] h-auto absolute z-20 overflow-visible">
                                    <motion.path
                                        d="M20,60 Q40,30 60,60 T100,60 T140,50 Q160,20 180,70"
                                        fill="transparent"
                                        stroke="var(--color-primary)" // Assuming tailwind config maps primary correctly inside SVG or we fallback to color code
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ stroke: '#00C853' }} // Hardcoded fallback for absolute certainty in showcase
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: step >= 1 ? 1 : 0 }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="mt-6 mb-2">
                            <div className="w-full h-12 bg-zinc-100 text-zinc-400 rounded-xl font-black text-sm flex justify-center items-center">
                                Valider la signature
                            </div>
                        </div>
                    </motion.div>


                    {/* STEP 2: Success / Stripe Acompte */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.9 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="absolute inset-0 bg-primary p-5 flex flex-col items-center justify-center text-white z-20"
                        style={{ pointerEvents: step === 2 ? 'auto' : 'none' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: step === 2 ? 1 : 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl"
                        >
                            <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={3} />
                        </motion.div>

                        <h2 className="text-2xl font-black text-center mb-2">Devis Signé !</h2>
                        <p className="text-center font-medium text-white/80 text-sm mb-8 px-4">
                            Votre acompte de 30% a été versé avec succès.
                        </p>

                        <div className="bg-white/10 p-4 rounded-xl w-full border border-white/20 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-white text-primary text-[8px] font-black uppercase px-2 py-1 rounded-bl-lg">Stripe</div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span>Montant versé</span>
                                <span>4 350 €</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
