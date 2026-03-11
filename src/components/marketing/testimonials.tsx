'use client';

import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';
import { motion } from 'framer-motion';

export function Testimonials({ metier }: { metier?: string }) {
    // Filter by metier if provided, otherwise show first 6
    const filtered = metier
        ? TESTIMONIALS.filter(t => t.metier === metier.toLowerCase())
        : TESTIMONIALS;

    const displayTestimonials = filtered.length > 0 ? filtered : TESTIMONIALS.slice(0, 3);

    return (
        <section className="py-32 bg-[#F9FBFF]">
            <div className="container px-4">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full font-black text-[10px] tracking-[0.3em] uppercase mb-4">
                        Témoignages
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-secondary leading-tight">
                        Ils font confiance à <br />
                        <span className="text-primary italic">Rapido&apos;Devis.</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl font-bold text-secondary/40 leading-relaxed">
                        Découvrez comment nous aidons les professionnels du bâtiment à gagner du temps et à sécuriser leurs chantiers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayTestimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="space-y-6">
                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                                        <Star key={starIndex} className="w-5 h-5 fill-primary text-primary" />
                                    ))}
                                </div>
                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-4 w-12 h-12 text-zinc-50 group-hover:text-primary/5 transition-colors" />
                                    <p className="relative z-10 text-lg font-bold text-secondary leading-relaxed italic">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-zinc-50 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary font-black text-xl shadow-sm">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-secondary">{testimonial.name}</p>
                                    <p className="text-xs font-bold text-secondary/30 uppercase tracking-widest leading-none mt-1">
                                        {testimonial.role}, {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
