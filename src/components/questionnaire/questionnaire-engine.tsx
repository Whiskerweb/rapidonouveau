'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { questionnaireConfig, getSectionFlow } from '@/data/questionnaire-config'
import { QuestionRenderer } from './question-renderer'
import { AiFollowupBubble } from './ai-followup-bubble'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAiFollowup } from '@/hooks/use-ai-followup'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send, Upload, X, FileText, MapPin, Ruler, Paperclip, Clock, CheckCircle2, Mic, MicOff } from 'lucide-react'

type ResponseValue = string | number | boolean | string[]

export function QuestionnaireEngine() {
  const router = useRouter()
  const { toast } = useToast()

  const [responses, setResponses] = useState<Record<string, ResponseValue>>({})
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const { followUp, isLoading: aiLoading, checkForFollowUp, submitFollowUp, skipFollowUp } = useAiFollowup()

  const sectionFlow = useMemo(
    () => getSectionFlow(responses),
    [responses]
  )

  const currentSectionId = sectionFlow[currentSectionIndex]
  const currentSection = questionnaireConfig.sections.find((s) => s.id === currentSectionId)

  const isFirstSection = currentSectionIndex === 0
  const isLastSection = currentSectionIndex === sectionFlow.length - 1
  const isDocumentsSection = currentSectionId === 'documents'

  const handleChange = useCallback((questionId: string, value: ResponseValue) => {
    setResponses((prev) => {
      const updated = { ...prev, [questionId]: value }

      // Check for AI follow-up on relevant questions
      const allSections = questionnaireConfig.sections
      let question = null
      for (const section of allSections) {
        question = section.questions.find(q => q.id === questionId)
        if (question) break
      }

      if (question?.ai_follow_up && value && typeof value === 'string' && value.length > 10) {
        checkForFollowUp(questionId, String(value), updated)
      }

      return updated
    })
  }, [checkForFollowUp])

  const handleFollowUpSubmit = useCallback((answer: string) => {
    if (followUp) {
      const key = `ai_followup_${followUp.questionId}`
      setResponses(prev => ({ ...prev, [key]: answer }))
      submitFollowUp(answer)
    }
  }, [followUp, submitFollowUp])

  const canProceed = () => {
    if (!currentSection) return false
    if (isDocumentsSection) return true
    if (followUp || aiLoading) return false

    return currentSection.questions.every((q) => {
      if (!q.required) return true
      const val = responses[q.id]
      if (val === undefined || val === '' || val === null) return false
      if (Array.isArray(val) && val.length === 0) return false
      return true
    })
  }

  const handleNext = () => {
    if (currentSectionIndex < sectionFlow.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const buildStructuredPrompt = () => {
    return {
      project_context: {
        type: responses['type_travaux'],
        surface_m2: responses['surface'],
        location: {
          address: responses['adresse'],
          city: responses['ville'],
          postal_code: responses['code_postal'],
        },
        property: {
          type: responses['type_bien'],
          year_built: responses['annee_construction'],
          rooms: responses['nombre_pieces'],
          levels: responses['nombre_niveaux'],
        },
        details: {
          postes_travaux: responses['postes_travaux'],
          etat_actuel: responses['etat_actuel'],
          gamme: responses['gamme_souhaitee'],
          pieces_concernees: responses['pieces_concernees'],
          type_construction: responses['type_construction'],
          type_extension: responses['type_extension'],
          surface_extension: responses['surface_extension'],
          type_amenagement: responses['type_amenagement'],
        },
        contraintes: responses['contraintes_specifiques'],
        budget_indicatif: responses['budget_indicatif'],
        urgence: responses['urgence'],
        description: responses['description_libre'],
      },
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      const uploadedFiles = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'estimations')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error(`Erreur lors de l'upload de ${file.name}`)

        const uploadData = await uploadRes.json()
        uploadedFiles.push({
          url: uploadData.url,
          filename: file.name,
          type: file.type.startsWith('image/') ? 'photo' : 'plan',
        })
      }

      const structuredPrompt = buildStructuredPrompt()

      const submitRes = await fetch('/api/estimations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_type: responses['type_bien'] || 'autre',
          surface_m2: responses['surface'],
          address: responses['adresse'],
          postal_code: responses['code_postal'],
          city: responses['ville'],
          description: responses['description_libre'],
          files: uploadedFiles,
          work_categories: Array.isArray(responses['postes_travaux'])
            ? responses['postes_travaux']
            : [],
          questionnaire_responses: responses,
          project_type: responses['type_travaux'],
          location_department: typeof responses['code_postal'] === 'string'
            ? responses['code_postal'].substring(0, 2)
            : undefined,
          ai_prompt: JSON.stringify(structuredPrompt, null, 2),
        }),
      })

      const submitData = await submitRes.json()

      if (!submitRes.ok) {
        throw new Error(submitData.error || 'Erreur lors de la soumission')
      }

      toast({
        title: 'Estimation envoyée !',
        description: 'Votre demande est en cours de traitement par nos experts.',
      })

      router.push(`/estimations/${submitData.estimationId}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const progress = ((currentSectionIndex + 1) / sectionFlow.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rapido-blue">
            Nouvelle estimation
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Répondez aux questions pour obtenir une estimation précise.
          </p>
        </div>

        {/* Voice mode toggle */}
        <button
          type="button"
          onClick={() => setVoiceMode(!voiceMode)}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-all flex-shrink-0 ${
            voiceMode
              ? 'bg-rapido-green text-white shadow-md shadow-rapido-green/20'
              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
          }`}
        >
          {voiceMode ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{voiceMode ? 'Vocal actif' : 'Mode vocal'}</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-zinc-400">
              Étape {currentSectionIndex + 1} sur {sectionFlow.length}
            </p>
            <p className="text-sm font-medium text-rapido-blue mt-0.5">
              {currentSection?.title}
            </p>
          </div>
          <span className="text-xs font-medium text-rapido-green">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-100">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-rapido-green to-rapido-green/80"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSectionId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-zinc-100 bg-white p-5 sm:p-8 shadow-sm space-y-6"
        >
          {currentSection && (
            <>
              <div>
                <h2 className="font-heading font-bold text-xl text-rapido-blue">
                  {currentSection.title}
                </h2>
                {currentSection.description && (
                  <p className="text-sm text-zinc-400 mt-1.5">{currentSection.description}</p>
                )}
              </div>

              {currentSection.questions.map((question) => (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  value={responses[question.id]}
                  onChange={handleChange}
                  voiceEnabled={voiceMode}
                />
              ))}

              {/* AI Follow-up bubble */}
              <AiFollowupBubble
                followUp={followUp}
                isLoading={aiLoading}
                onSubmit={handleFollowUpSubmit}
                onSkip={skipFollowUp}
                voiceEnabled={voiceMode}
              />

              {/* Documents section */}
              {isDocumentsSection && (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500">
                    Ajoutez des plans, photos ou tout document utile.
                    Formats acceptés : PDF, JPG, PNG (max 20 Mo par fichier).
                  </p>

                  <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 cursor-pointer p-8 sm:p-10 hover:border-rapido-green hover:bg-rapido-green/3 transition-all group text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rapido-blue/5 text-rapido-blue group-hover:bg-rapido-green/10 group-hover:text-rapido-green transition-all">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-rapido-blue group-hover:text-rapido-green transition-colors">
                        Glissez vos fichiers ici
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        ou cliquez pour parcourir
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
                        }
                      }}
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-sm group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Paperclip className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                            <span className="text-zinc-700 truncate">{file.name}</span>
                            <span className="text-[10px] text-zinc-400 flex-shrink-0">
                              {(file.size / 1024 / 1024).toFixed(1)} Mo
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            className="ml-3 text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Récapitulatif */}
      {isLastSection && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-rapido-green/20 bg-rapido-green/3 p-5 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-rapido-green" />
            <h3 className="font-heading font-bold text-rapido-blue">Récapitulatif</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {responses['type_travaux'] && (
              <RecapItem
                icon={<FileText className="h-4 w-4" />}
                label="Type de projet"
                value={
                  questionnaireConfig.sections[0].questions[0].options?.find(
                    (o) => o.value === responses['type_travaux']
                  )?.label || String(responses['type_travaux'])
                }
              />
            )}
            {responses['type_bien'] && (
              <RecapItem
                icon={<FileText className="h-4 w-4" />}
                label="Type de bien"
                value={String(responses['type_bien'])}
              />
            )}
            {responses['surface'] && (
              <RecapItem
                icon={<Ruler className="h-4 w-4" />}
                label="Surface"
                value={`${responses['surface']} m²`}
              />
            )}
            {responses['ville'] && (
              <RecapItem
                icon={<MapPin className="h-4 w-4" />}
                label="Localisation"
                value={`${responses['code_postal'] || ''} ${responses['ville']}`}
              />
            )}
            <RecapItem
              icon={<Paperclip className="h-4 w-4" />}
              label="Fichiers joints"
              value={`${files.length} fichier(s)`}
            />
          </div>

          <div className="rounded-xl bg-white border border-rapido-blue/10 p-4 flex items-start gap-3">
            <Clock className="h-4 w-4 text-rapido-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-zinc-600">
              Votre estimation vous sera envoyée sous <strong className="text-rapido-blue">48h ouvrées</strong> à compter de la réception de votre demande.
            </p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pb-4">
        <Button
          variant="outline"
          onClick={isFirstSection ? () => router.push('/dashboard') : handlePrev}
          className="rounded-full gap-2 border-zinc-200 hover:border-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFirstSection ? 'Retour' : 'Précédent'}
        </Button>

        {isLastSection ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-rapido-green hover:bg-rapido-green/90 text-white rounded-full gap-2 shadow-sm hover:shadow-md transition-all"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Soumettre l&apos;estimation
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-rapido-blue hover:bg-rapido-blue/90 text-white rounded-full gap-2 disabled:opacity-40 transition-all"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function RecapItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white border border-zinc-100 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rapido-blue/5 text-rapido-blue flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{label}</p>
        <p className="text-sm font-medium text-zinc-700 truncate">{value}</p>
      </div>
    </div>
  )
}
