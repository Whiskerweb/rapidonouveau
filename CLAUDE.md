# Rapido'Devis — CLAUDE.md

Plateforme SaaS française pour artisans BTP : estimation de travaux avec IA + facturation complète conforme législation 2026.

## Commandes

```bash
npm run dev      # Serveur dev (http://localhost:3000)
npm run build    # Build production (vérifier après chaque feature)
npm run lint     # ESLint
```

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| UI | React 19, TypeScript strict |
| BDD + Auth | **Supabase** (PostgreSQL + Auth) — PAS Prisma |
| Paiements | Stripe (abonnements + packs crédits) |
| CSS | Tailwind 3, Shadcn/Radix UI |
| Formulaires | react-hook-form + zod |
| PDF | @react-pdf/renderer (serverExternalPackages) |
| Email | Resend + @react-email/components |
| IA | @anthropic-ai/sdk (Claude Haiku) |
| Drag & Drop | @dnd-kit |
| Icônes | lucide-react |
| Charts | recharts |
| Animations | framer-motion |

## Structure du projet

```
src/
├── app/
│   ├── (admin)/          # Back-office admin
│   ├── (auth)/           # Connexion, inscription, mot de passe oublié
│   ├── (blog)/           # Articles/actualités
│   ├── (dashboard)/      # Espace connecté (estimations, facturation, compte)
│   ├── (marketing)/      # Pages publiques (tarifs, fonctionnalités, à propos)
│   ├── api/              # API routes (REST)
│   └── signer/[token]/   # Page publique signature devis (hors auth)
├── components/
│   ├── billing/          # Facturation (document-form, line-item-editor, library-picker, PDF...)
│   ├── dashboard/        # Layout dashboard (sidebar-nav, notification-bell)
│   ├── ui/               # Composants Shadcn (Button, Dialog, Tabs, etc.)
│   └── [autres]/         # admin, auth, estimation-form, marketing, onboarding, questionnaire
├── lib/
│   ├── supabase/         # client.ts (browser), server.ts (SSR), admin.ts (service role)
│   ├── billing-utils.ts  # Calculs totaux, TVA, pénalités, retenue garantie
│   ├── email.ts          # Templates email (Resend)
│   ├── access.ts         # Vérification abonnement/crédits
│   ├── stripe.ts         # Client Stripe serveur
│   └── validations/      # Schémas Zod (auth, profile, questionnaire)
├── hooks/                # use-toast, use-notifications, use-ai-followup, use-voice-input
├── data/                 # Données statiques (articles, métiers, questionnaire-config)
└── types/                # Types TypeScript
```

## Conventions de code

- **TypeScript strict** — path alias `@/*` → `./src/*`
- **Fichiers** : kebab-case (`line-item-editor.tsx`)
- **Composants** : PascalCase (`export function LineItemEditor()`)
- **UI entièrement en français** — "Non autorisé", "Erreur serveur", "Champs requis manquants"
- **Types dynamiques Supabase** : `Record<string, unknown>` pour les rows
- **Unknown → boolean dans JSX** : `{!!(document.due_date) && ...}` (pattern `!!()`)
- **Pas de Prisma** — requêtes Supabase directes : `.from('table').select().eq().single()`
- **Pas d'ORM** — SQL brut dans les migrations, Supabase client dans les API routes

## Pattern API route

```typescript
// src/app/api/billing/[resource]/route.ts
export async function GET(request: Request) {
  try {
    const supabase = await createClient()                    // 1. Client serveur
    const { data: { user } } = await supabase.auth.getUser() // 2. Auth check
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)            // 3. Params
    const { data, error } = await supabase                   // 4. Query
      .from('table').select('*').eq('artisan_id', user.id)
    if (error) throw error

    return NextResponse.json({ items: data || [] })          // 5. Response
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
```

Pour les routes dynamiques Next.js 16 : `{ params }: { params: Promise<{ id: string }> }` avec `const { id } = await params`.

## Pattern Supabase

| Usage | Import | Fichier |
|-------|--------|---------|
| Browser (client component) | `createClient()` de `@/lib/supabase/client` | client.ts |
| Serveur (API route, RSC) | `await createClient()` de `@/lib/supabase/server` | server.ts |
| Admin (bypass RLS) | `createAdminClient()` de `@/lib/supabase/admin` | admin.ts |

## Base de données

- **PostgreSQL** via Supabase, **13 migrations** (000-012) dans `supabase/migrations/`
- **RLS** sur toutes les tables : `artisan_id = auth.uid()`
- **UUID** pour toutes les PK (`gen_random_uuid()`)
- **Timestamps** : `TIMESTAMPTZ DEFAULT NOW()` + triggers `updated_at`
- **Tables principales** : `profiles`, `estimations`, `artisan_profiles`, `billing_documents`, `billing_document_lines`, `work_items_library`, `billing_clients`, `suppliers`, `supplier_catalog_items`, `library_categories`, `subscriptions`, `packs`
- **Fonctions RPC** : `next_document_number(type)` pour numérotation séquentielle

## Design system

| Token | Couleur | Usage |
|-------|---------|-------|
| `rapido-blue` | #1C244B | Couleur principale, boutons, liens |
| `rapido-green` | #73C257 | Succès, CA, actions positives |
| `rapido-orange` | #EF7B45 | Accent, alertes, CTA secondaires |
| `rapido-white` | #F8F8F8 | Fond clair |

- **Fonts** : League Spartan (titres), Poppins (corps)
- **Icônes** : Lucide React
- **Composants UI** : Shadcn/Radix (Dialog, Tabs, Select, etc.)
- **Border radius** : `rounded-xl` (boutons/cartes), `rounded-2xl` (modales)
- **Responsive** : mobile-first, breakpoints `sm:` `md:` `lg:`

## Variables d'environnement

```bash
# Supabase (requis)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (requis pour paiements)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optionnel
ANTHROPIC_API_KEY=          # Scraping IA + follow-up questions
RESEND_API_KEY=             # Envoi emails (factures, relances)
NEXT_PUBLIC_GTM_ID=         # Google Tag Manager
```

## Modules principaux

### Estimations
Questionnaire IA multi-étapes → estimation chiffrée → matching artisans. Gating par abonnement Stripe ou packs crédits.

### Facturation (`/artisan/facturation`)
Module complet conforme 2026 : devis, factures, acomptes, situations de travaux, avoirs, facture de solde. PDF serveur avec @react-pdf/renderer. Signature électronique (page publique `/signer/[token]`). Envoi email avec PDF en PJ. Relances automatiques (3 niveaux). Export CSV. Retenue de garantie 5%. Autoliquidation TVA (article 283-2 nonies CGI). Attestation TVA réduite.

### Bibliothèque produits (`/artisan/facturation/bibliotheque`)
CRUD produits avec catégories couleur, favoris, marges (prix achat/vente). Import CSV. Scraping web de pages fournisseur via IA. Recherche de prix marché via IA. Library Picker V2 (panel glissant, multi-select, onglets catégories/favoris/récents/catalogues fournisseurs).

### Fournisseurs (`/artisan/facturation/fournisseurs`)
CRUD fournisseurs. Catalogues par fournisseur. Import CSV catalogue avec détection changements prix. Ajout en 1 clic vers la bibliothèque.

### Stripe
Abonnements (Découverte/Standard/Pro) + packs crédits (1/3/5/10). Webhooks pour sync status. Portail client Stripe.
