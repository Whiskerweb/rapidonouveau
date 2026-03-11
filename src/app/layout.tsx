import type { Metadata } from 'next';
import { League_Spartan, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Rapido'Devis | Estimation travaux en ligne par IA & Experts",
    template: "%s | Rapido'Devis"
  },
  description: "Obtenez une estimation travaux fiable, détaillée et validée par des experts en moins de 48h. L'outil indispensable pour les professionnels de l'immobilier.",
  keywords: ["estimation travaux", "IA immobilier", "chiffrage travaux", "devis bâtiment", "expert bâtiment", "marchand de biens"],
  authors: [{ name: "Rapido'Devis" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://rapido-devis.fr",
    siteName: "Rapido'Devis",
    title: "Rapido'Devis | L'IA qui transforme votre façon de chiffrer vos travaux",
    description: "Estimation travaux fiable et détaillée sous 48h. Validée par un maître d'œuvre.",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Rapido'Devis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rapido'Devis | Estimation travaux en ligne",
    description: "Obtenez un chiffrage précis sous 48h validé par des experts.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Rapido'Devis",
  "url": "https://rapido-devis.fr",
  "logo": "https://rapido-devis.fr/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/rapido-devis",
    "https://www.facebook.com/rapidodevis"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${leagueSpartan.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/gtm.ns?id=${process.env.NEXT_PUBLIC_GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
