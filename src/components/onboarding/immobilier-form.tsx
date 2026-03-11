'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  immobilierProfileSchema,
  type ImmobilierFormData,
  IMMOBILIER_ROLES,
  NETWORKS,
} from '@/lib/validations/profile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ImmobilierFormProps {
  onSubmit: (data: ImmobilierFormData) => void
  onBack: () => void
  isLoading: boolean
}

export function ImmobilierForm({ onSubmit, onBack, isLoading }: ImmobilierFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ImmobilierFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(immobilierProfileSchema) as any,
    defaultValues: {
      profileType: 'immobilier',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-bold text-rapido-blue">
          Profil Immobilier
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Renseignez les informations de votre activité immobilière.
        </p>
      </div>

      {/* Infos personnelles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input id="firstName" {...register('firstName')} placeholder="Marie" />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Martin" />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" {...register('phone')} placeholder="06 12 34 56 78" />
      </div>

      {/* Rôle */}
      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="immobilierRole">Votre rôle *</Label>
          <Select onValueChange={(val) => setValue('immobilierRole', val as ImmobilierFormData['immobilierRole'])}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre rôle" />
            </SelectTrigger>
            <SelectContent>
              {IMMOBILIER_ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.immobilierRole && (
            <p className="text-xs text-red-500">{errors.immobilierRole.message}</p>
          )}
        </div>
      </div>

      {/* Entreprise */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-rapido-blue text-sm">Entreprise / Agence</h3>

        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
          <Input id="companyName" {...register('companyName')} placeholder="Immobilier Martin" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agencyName">Nom de l&apos;agence</Label>
          <Input id="agencyName" {...register('agencyName')} placeholder="Agence du Centre" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="network">Réseau</Label>
          <Select onValueChange={(val) => setValue('network', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre réseau" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((network) => (
                <SelectItem key={network} value={network}>
                  {network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="siret">Numéro SIRET</Label>
          <Input id="siret" {...register('siret')} placeholder="12345678901234" maxLength={14} />
          {errors.siret && <p className="text-xs text-red-500">{errors.siret.message}</p>}
        </div>
      </div>

      {/* Volume */}
      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="annualVolume">Nombre de biens gérés par an</Label>
          <Input
            id="annualVolume"
            type="number"
            {...register('annualVolume', { valueAsNumber: true })}
            placeholder="50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="addressCity">Ville</Label>
            <Input id="addressCity" {...register('addressCity')} placeholder="Quimper" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressDepartment">Département</Label>
            <Input id="addressDepartment" {...register('addressDepartment')} placeholder="29" maxLength={3} />
          </div>
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
