'use client'

import type { ProfileType } from '@/types/database'

const PROFILE_TYPES: {
  type: ProfileType
  title: string
  description: string
  icon: string
}[] = [
  {
    type: 'artisan',
    title: 'Artisan',
    description:
      'Plombier, électricien, maçon... Recevez des demandes de travaux et gérez vos devis et factures.',
    icon: '🔧',
  },
  {
    type: 'immobilier',
    title: 'Professionnel de l\'immobilier',
    description:
      'Agent immobilier, marchand de biens, promoteur... Obtenez des estimations de travaux rapidement.',
    icon: '🏢',
  },
  {
    type: 'particulier',
    title: 'Particulier',
    description:
      'Propriétaire ou locataire, estimez le coût de vos travaux et trouvez des artisans qualifiés.',
    icon: '🏠',
  },
]

interface ProfileTypeSelectorProps {
  onSelect: (type: ProfileType) => void
  selected: ProfileType | null
}

export function ProfileTypeSelector({ onSelect, selected }: ProfileTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-extrabold text-rapido-blue">
          Quel est votre profil ?
        </h2>
        <p className="text-zinc-500 mt-2 text-sm">
          Choisissez le profil qui correspond le mieux à votre activité.
        </p>
      </div>

      <div className="grid gap-4">
        {PROFILE_TYPES.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onSelect(item.type)}
            className={`w-full text-left rounded-xl border-2 p-5 transition-all hover:shadow-md ${
              selected === item.type
                ? 'border-rapido-green bg-rapido-green/5 shadow-md'
                : 'border-zinc-200 bg-white hover:border-rapido-blue/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-heading font-bold text-rapido-blue">{item.title}</h3>
                <p className="text-sm text-zinc-500 mt-1">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
