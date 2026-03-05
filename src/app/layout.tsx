import type { Metadata } from 'next';
import { League_Spartan, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-heading',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Rapido'Devis - L'IA qui transforme votre façon de chiffrer vos travaux",
  description: "Estimation travaux par IA en 48h pour les professionnels de l'immobilier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${leagueSpartan.variable} ${poppins.variable}`}>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
