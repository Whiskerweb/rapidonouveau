'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const PARTNERS = [
    { name: 'CAPEB', url: 'https://rapido-devis.fr/wp-content/uploads/2023/03/CAPEBLOGO.png' },
    { name: 'Zolpan', url: 'https://rapido-devis.fr/wp-content/uploads/2023/04/Zolpan.png' },
    { name: 'Point P', url: 'https://rapido-devis.fr/wp-content/uploads/2023/04/POINT.P.png' },
    { name: 'Jefco', url: 'https://rapido-devis.fr/wp-content/uploads/2023/04/Jefco.png' },
    { name: 'Apihom', url: 'https://rapido-devis.fr/wp-content/uploads/2023/04/apihom.png' },
    { name: 'Investibat', url: 'https://rapido-devis.fr/wp-content/uploads/2023/03/Investibat.png' },
];

export function PartnersMarquee() {
    return (
        <section className="pt-4 pb-16 bg-white overflow-hidden relative">
            <div className="container px-4 text-center mb-8">
                <p className="text-secondary/40 font-bold text-sm tracking-widest uppercase">
                    Ces leaders de l&apos;industrie ont signé avec nous
                </p>
            </div>

            {/* Overlay gradients for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex w-[200%] gap-12 sm:gap-24 items-center">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed as needed
                    }}
                    className="flex w-1/2 gap-12 sm:gap-24 items-center justify-around flex-none"
                >
                    {PARTNERS.map((partner, idx) => (
                        <div key={`first-${idx}`} className="relative h-12 w-32 sm:h-16 sm:w-40 opacity-40 hover:opacity-100 hover:grayscale-0 grayscale transition-all duration-300">
                            <Image
                                src={partner.url}
                                alt={partner.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                    className="flex w-1/2 gap-12 sm:gap-24 items-center justify-around flex-none"
                >
                    {PARTNERS.map((partner, idx) => (
                        <div key={`second-${idx}`} className="relative h-12 w-32 sm:h-16 sm:w-40 opacity-40 hover:opacity-100 hover:grayscale-0 grayscale transition-all duration-300">
                            <Image
                                src={partner.url}
                                alt={partner.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
