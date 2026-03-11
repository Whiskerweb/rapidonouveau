'use client';

import { MarketingLayout } from '@/components/layout/marketing-layout';
import { Hero } from '@/components/marketing/hero';
import { PartnersMarquee } from '@/components/marketing/partners-marquee';
import { Features } from '@/components/marketing/features';
import { FeatureShowcase } from '@/components/marketing/feature-showcase';
import { TargetAudience } from '@/components/marketing/target-audience';
import { TrustBadges } from '@/components/marketing/trust-badges';
import { Testimonials } from '@/components/marketing/testimonials';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import NextImage from 'next/image';
import { Mail, Phone } from 'lucide-react';

export default function Home() {
  return (
    <MarketingLayout>
      <Hero />
      <PartnersMarquee />

      <div className="bg-zinc-50/50 py-10 md:py-24 border-y border-zinc-100">
        <TrustBadges />
      </div>

      <Features />

      <div className="bg-zinc-50/50 border-t border-zinc-100">
        <FeatureShowcase />
      </div>

      <TargetAudience />

      <div className="bg-zinc-50/50 border-y border-zinc-100">
        <Testimonials />
      </div>

      {/* Final CTA Section - Pro Upgrade */}
      <section className="relative py-40 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-50%] left-[-10%] w-[100%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,200,83,0.1)_0%,transparent_70%)] opacity-30" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-12"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-8 py-2.5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase mb-4 inline-flex">
              Démarrage Instantané
            </Badge>

            <h2 className="text-6xl md:text-8xl font-heading font-black text-white leading-[0.9] tracking-tighter">
              Automatisez votre <br />
              <span className="text-primary italic underline decoration-primary/20 underline-offset-[12px]">croissance</span> dès aujourd&apos;hui.
            </h2>

            <p className="text-white/50 text-xl md:text-2xl max-w-3xl mx-auto font-bold">
              Prenez 5 minutes pour tester l&apos;IA de chiffrage la plus précise du marché. Pas de carte bancaire requise.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
              <Link href="/inscription" className="w-full sm:w-auto">
                <Button size="lg" className="h-20 bg-primary hover:bg-primary/95 text-white font-black rounded-3xl px-16 text-2xl shadow-[0_25px_60px_rgba(0,200,83,0.3)] transition-all hover:scale-105">
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link href="https://calendly.com/commercial-rapido/30min" target="_blank" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-20 rounded-3xl border-white/20 bg-white/5 text-white hover:bg-white/10 px-16 text-2xl font-black">
                  Démo Live
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center gap-10 pt-16 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-center gap-10 opacity-50">
                <a href="mailto:contact@rapido-devis.fr" className="flex items-center gap-3 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white">
                  <Mail className="h-5 w-5" /> contact@rapido-devis.fr
                </a>
                <a href="tel:+33668563039" className="flex items-center gap-3 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-white">
                  <Phone className="h-5 w-5" /> 06 68 56 30 39
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <Link href="#" className="transition-transform hover:scale-110 active:scale-95">
                  <NextImage
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="App Store"
                    width={140}
                    height={46}
                    className="h-12 w-auto"
                  />
                </Link>
                <Link href="#" className="transition-transform hover:scale-110 active:scale-95">
                  <NextImage
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    width={158}
                    height={46}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
}
