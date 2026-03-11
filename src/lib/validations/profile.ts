import * as z from 'zod'

export const profileTypeSchema = z.enum(['artisan', 'immobilier', 'particulier'])

// Champs communs à tous les profils
const baseProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  phone: z.string().optional(),
  addressCity: z.string().optional(),
  addressDepartment: z.string().optional(),
})

// Profil artisan
export const artisanProfileSchema = baseProfileSchema.extend({
  profileType: z.literal('artisan'),
  siret: z
    .string()
    .length(14, 'Le numéro SIRET doit contenir exactement 14 chiffres.')
    .regex(/^\d+$/, 'Le numéro SIRET ne doit contenir que des chiffres.'),
  companyName: z.string().min(1, 'Le nom de l\'entreprise est requis.'),
  mainTrade: z.string().min(1, 'Le métier principal est requis.'),
  specializations: z.array(z.string()).default([]),
  insuranceDecennaleNumber: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  certifications: z.array(z.string()).default([]),
  interventionRadiusKm: z.number().min(1).max(500).default(50),
  hourlyRate: z.number().min(0).optional(),
})

// Profil immobilier
export const immobilierProfileSchema = baseProfileSchema.extend({
  profileType: z.literal('immobilier'),
  siret: z
    .string()
    .length(14, 'Le numéro SIRET doit contenir exactement 14 chiffres.')
    .regex(/^\d+$/, 'Le numéro SIRET ne doit contenir que des chiffres.')
    .optional(),
  companyName: z.string().optional(),
  immobilierRole: z.enum(['agent', 'marchand_biens', 'promoteur', 'diagnostiqueur'], {
    message: 'Veuillez sélectionner votre rôle.',
  }),
  agencyName: z.string().optional(),
  network: z.string().optional(),
  annualVolume: z.number().min(0).optional(),
})

// Profil particulier
export const particulierProfileSchema = baseProfileSchema.extend({
  profileType: z.literal('particulier'),
  isOwner: z.boolean().default(true),
  propertyType: z.string().optional(),
  estimatedBudgetRange: z.string().optional(),
  isFirstProject: z.boolean().default(true),
})

// Union discriminée par profileType
export const onboardingSchema = z.discriminatedUnion('profileType', [
  artisanProfileSchema,
  immobilierProfileSchema,
  particulierProfileSchema,
])

export type OnboardingFormData = z.infer<typeof onboardingSchema>
export type ArtisanFormData = z.infer<typeof artisanProfileSchema>
export type ImmobilierFormData = z.infer<typeof immobilierProfileSchema>
export type ParticulierFormData = z.infer<typeof particulierProfileSchema>

// Listes de référence pour les formulaires
export const TRADES = [
  'Plomberie',
  'Électricité',
  'Maçonnerie',
  'Peinture',
  'Carrelage',
  'Menuiserie',
  'Couverture / Toiture',
  'Chauffage / Climatisation',
  'Isolation',
  'Plâtrerie / Plaquiste',
  'Charpente',
  'Assainissement',
  'Terrassement',
  'Serrurerie',
  'Vitrerie',
  'Autre',
] as const

export const CERTIFICATIONS = [
  'RGE',
  'Qualibat',
  'Qualifelec',
  'Qualit\'EnR',
  'NF Habitat',
  'Handibat',
  'Éco Artisan',
] as const

export const IMMOBILIER_ROLES = [
  { value: 'agent', label: 'Agent immobilier' },
  { value: 'marchand_biens', label: 'Marchand de biens' },
  { value: 'promoteur', label: 'Promoteur immobilier' },
  { value: 'diagnostiqueur', label: 'Diagnostiqueur immobilier' },
] as const

export const NETWORKS = [
  'Century 21',
  'Orpi',
  'Laforêt',
  'ERA Immobilier',
  'Guy Hoquet',
  'Stéphane Plaza',
  'IAD France',
  'Indépendant',
  'Autre',
] as const

export const BUDGET_RANGES = [
  'Moins de 10 000 €',
  '10 000 € - 30 000 €',
  '30 000 € - 50 000 €',
  '50 000 € - 100 000 €',
  '100 000 € - 200 000 €',
  'Plus de 200 000 €',
] as const

export const PROPERTY_TYPES = [
  'Maison individuelle',
  'Appartement',
  'Immeuble',
  'Local commercial',
  'Terrain',
  'Autre',
] as const
