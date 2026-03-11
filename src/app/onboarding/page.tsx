'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileTypeSelector } from '@/components/onboarding/profile-type-selector'
import { ArtisanForm } from '@/components/onboarding/artisan-form'
import { ImmobilierForm } from '@/components/onboarding/immobilier-form'
import { ParticulierForm } from '@/components/onboarding/particulier-form'
import type { ProfileType } from '@/types/database'
import type { OnboardingFormData } from '@/lib/validations/profile'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectType = (type: ProfileType) => {
    setSelectedType(type)
    setStep('form')
  }

  const handleSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profiles/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Une erreur est survenue')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('select')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-rapido-light flex flex-col items-center justify-center p-4 sm:p-8">
      <Link href="/" className="mb-8">
        <span className="font-heading font-extrabold text-2xl text-rapido-blue">
          Rapido&apos;Devis
        </span>
      </Link>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full ${step === 'select' || step === 'form' ? 'bg-rapido-green' : 'bg-zinc-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step === 'form' ? 'bg-rapido-green' : 'bg-zinc-200'}`} />
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 'select' && (
          <ProfileTypeSelector onSelect={handleSelectType} selected={selectedType} />
        )}

        {step === 'form' && selectedType === 'artisan' && (
          <ArtisanForm onSubmit={handleSubmit} onBack={handleBack} isLoading={isLoading} />
        )}

        {step === 'form' && selectedType === 'immobilier' && (
          <ImmobilierForm onSubmit={handleSubmit} onBack={handleBack} isLoading={isLoading} />
        )}

        {step === 'form' && selectedType === 'particulier' && (
          <ParticulierForm onSubmit={handleSubmit} onBack={handleBack} isLoading={isLoading} />
        )}
      </div>

      <div className="mt-8 text-sm text-center text-rapido-blue/70">
        &copy; {new Date().getFullYear()} Rapido&apos;Devis. Tous droits réservés.
      </div>
    </div>
  )
}
