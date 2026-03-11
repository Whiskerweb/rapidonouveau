'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  particulierProfileSchema,
  type ParticulierFormData,
  PROPERTY_TYPES,
  BUDGET_RANGES,
} from '@/lib/validations/profile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface ParticulierFormProps {
  onSubmit: (data: ParticulierFormData) => void
  onBack: () => void
  isLoading: boolean
}

export function ParticulierForm({ onSubmit, onBack, isLoading }: ParticulierFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParticulierFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(particulierProfileSchema) as any,
    defaultValues: {
      profileType: 'particulier',
      isOwner: true,
      isFirstProject: true,
    },
  })

  const isOwner = watch('isOwner')
  const isFirstProject = watch('isFirstProject')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-bold text-rapido-blue">Profil Particulier</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Quelques informations pour personnaliser votre expérience.
        </p>
      </div>

      {/* Infos personnelles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input id="firstName" {...register('firstName')} placeholder="Pierre" />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Durand" />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" {...register('phone')} placeholder="06 12 34 56 78" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="addressCity">Ville</Label>
          <Input id="addressCity" {...register('addressCity')} placeholder="Plougastel-Daoulas" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressDepartment">Département</Label>
          <Input id="addressDepartment" {...register('addressDepartment')} placeholder="29" maxLength={3} />
        </div>
      </div>

      {/* Situation */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-rapido-blue text-sm">Votre situation</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="isOwner">Je suis propriétaire</Label>
          <Switch
            id="isOwner"
            checked={isOwner}
            onCheckedChange={(checked) => setValue('isOwner', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyType">Type de bien</Label>
          <Select onValueChange={(val) => setValue('propertyType', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type de bien" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedBudgetRange">Budget estimatif</Label>
          <Select onValueChange={(val) => setValue('estimatedBudgetRange', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une fourchette" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isFirstProject">C&apos;est mon premier projet de travaux</Label>
          <Switch
            id="isFirstProject"
            checked={isFirstProject}
            onCheckedChange={(checked) => setValue('isFirstProject', checked)}
          />
        </div>
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
