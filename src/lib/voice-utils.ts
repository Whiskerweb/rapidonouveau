// Utilitaires pour la commande vocale

import type { QuestionOption } from '@/data/questionnaire-config'

/**
 * Normalise une chaîne : supprime les accents et met en minuscules
 */
export function normalizeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Trouve la meilleure option correspondante au transcript vocal
 */
export function matchVoiceToOption(
  transcript: string,
  options: QuestionOption[]
): string | null {
  const normalized = normalizeAccents(transcript)

  // 1. Match exact sur le label
  for (const opt of options) {
    if (normalizeAccents(opt.label) === normalized) {
      return opt.value
    }
  }

  // 2. Le transcript contient le label ou vice versa
  for (const opt of options) {
    const normalizedLabel = normalizeAccents(opt.label)
    if (normalized.includes(normalizedLabel) || normalizedLabel.includes(normalized)) {
      return opt.value
    }
  }

  // 3. Match partiel — le premier mot significatif du label est dans le transcript
  for (const opt of options) {
    const labelWords = normalizeAccents(opt.label).split(/\s+/).filter(w => w.length > 3)
    const matchCount = labelWords.filter(w => normalized.includes(w)).length
    if (matchCount >= Math.max(1, Math.ceil(labelWords.length / 2))) {
      return opt.value
    }
  }

  return null
}

/**
 * Mapping des nombres en français vers leur valeur numérique
 */
const FRENCH_NUMBERS: Record<string, number> = {
  zero: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4,
  cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15,
  seize: 16, vingt: 20, trente: 30, quarante: 40, cinquante: 50,
  soixante: 60, cent: 100, mille: 1000,
}

/**
 * Extrait un nombre d'un texte vocal en français
 */
export function extractNumberFromSpeech(transcript: string): number | null {
  // 1. Chercher un nombre directement dans le texte
  const directMatch = transcript.match(/\d+([.,]\d+)?/)
  if (directMatch) {
    return parseFloat(directMatch[0].replace(',', '.'))
  }

  // 2. Parser les nombres en français
  const normalized = normalizeAccents(transcript)
  const words = normalized.split(/[\s-]+/)

  let total = 0
  let current = 0
  let found = false

  for (const word of words) {
    const num = FRENCH_NUMBERS[word]
    if (num !== undefined) {
      found = true
      if (num === 1000) {
        current = current === 0 ? 1000 : current * 1000
      } else if (num === 100) {
        current = current === 0 ? 100 : current * 100
      } else {
        current += num
      }
    } else if (found && current > 0) {
      total += current
      current = 0
    }
  }

  total += current

  return found ? total : null
}
