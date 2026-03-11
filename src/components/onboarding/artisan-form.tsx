'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artisanProfileSchema, type ArtisanFormData, TRADES, CERTIFICATIONS } from '@/lib/validations/profile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface ArtisanFormProps {
  onSubmit: (data: ArtisanFormData) => void
  onBack: () => void
  isLoading: boolean
}

export function ArtisanForm({ onSubmit, onBack, isLoading }: ArtisanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArtisanFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(artisanProfileSchema) as any,
    defaultValues: {
      profileType: 'artisan',
      specializations: [],
      certifications: [],
      interventionRadiusKm: 50,
    },
  })

  const selectedCertifications = watch('certifications') || []

  const toggleCertification = (cert: string) => {
    const current = selectedCertifications
    if (current.includes(cert)) {
      setValue('certifications', current.filter((c) => c !== cert))
    } else {
      setValue('certifications', [...current, cert])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-bold text-rapido-blue">Profil Artisan</h2>
        <p className="text-zinc-500 text-sm mt-1">Renseignez les informations de votre entreprise.</p>
      </div>

      {/* Infos personnelles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input id="firstName" {...register('firstName')} placeholder="Jean" />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Dupont" />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" {...register('phone')} placeholder="06 12 34 56 78" />
      </div>

      {/* Infos entreprise */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-rapido-blue text-sm">Entreprise</h3>

        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
          <Input id="companyName" {...register('companyName')} placeholder="Entreprise Martin SARL" />
          {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siret">Numéro SIRET *</Label>
          <Input id="siret" {...register('siret')} placeholder="12345678901234" maxLength={14} />
          {errors.siret && <p className="text-xs text-red-500">{errors.siret.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainTrade">Métier principal *</Label>
          <Select onValueChange={(val) => setValue('mainTrade', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre métier" />
            </SelectTrigger>
            <SelectContent>
              {TRADES.map((trade) => (
                <SelectItem key={trade} value={trade}>
                  {trade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mainTrade && <p className="text-xs text-red-500">{errors.mainTrade.message}</p>}
        </div>
      </div>

      {/* Assurance et certifications */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-rapido-blue text-sm">Assurance & Certifications</h3>

        <div className="space-y-2">
          <Label htmlFor="insuranceDecennaleNumber">N° assurance décennale</Label>
          <Input id="insuranceDecennaleNumber" {...register('insuranceDecennaleNumber')} />
        </div>

        <div className="space-y-2">
          <Label>Certifications</Label>
          <div className="grid grid-cols-2 gap-2">
            {CERTIFICATIONS.map((cert) => (
              <label key={cert} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedCertifications.includes(cert)}
                  onCheckedChange={() => toggleCertification(cert)}
                />
                {cert}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Zone d'intervention */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-rapido-blue text-sm">Zone d&apos;intervention</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="addressCity">Ville</Label>
            <Input id="addressCity" {...register('addressCity')} placeholder="Brest" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressDepartment">Département</Label>
            <Input id="addressDepartment" {...register('addressDepartment')} placeholder="29" maxLength={3} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interventionRadiusKm">Rayon d&apos;intervention (km)</Label>
          <Input
            id="interventionRadiusKm"
            type="number"
            {...register('interventionRadiusKm', { valueAsNumber: true })}
            placeholder="50"
          />
        </div>
      </div>

      {/* Tarif */}
      <div className="border-t pt-4 space-y-2">
        <Label htmlFor="hourlyRate">Taux horaire (€/h) — optionnel</Label>
        <Input
          id="hourlyRate"
          type="number"
          step="0.01"
          {...register('hourlyRate', { valueAsNumber: true })}
          placeholder="45.00"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 rounded-full">
          Retour
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-rapido-green hover:bg-rapido-green-600 text-white rounded-full"
        >
          {isLoading ? 'Enregistrement...' : 'Valider mon profil'}
        </Button>
      </div>
    </form>
  )
}
