/**
 * Utilitaires pour le module de facturation
 */

interface BillingLine {
  quantity: number
  unit_price_ht: number
  tva_rate: number
}

interface TvaSummary {
  rate: number
  base_ht: number
  tva_amount: number
}

/**
 * Calcule les totaux d'un document à partir de ses lignes
 */
export function calculateDocumentTotals(lines: BillingLine[]) {
  let totalHt = 0
  let totalTva = 0

  const tvaByRate: Record<number, TvaSummary> = {}

  for (const line of lines) {
    const lineHt = line.quantity * line.unit_price_ht
    const lineTva = Math.round(lineHt * line.tva_rate / 100 * 100) / 100

    totalHt += lineHt
    totalTva += lineTva

    if (!tvaByRate[line.tva_rate]) {
      tvaByRate[line.tva_rate] = { rate: line.tva_rate, base_ht: 0, tva_amount: 0 }
    }
    tvaByRate[line.tva_rate].base_ht += lineHt
    tvaByRate[line.tva_rate].tva_amount += lineTva
  }

  return {
    total_ht: Math.round(totalHt * 100) / 100,
    total_tva: Math.round(totalTva * 100) / 100,
    total_ttc: Math.round((totalHt + totalTva) * 100) / 100,
    tva_summary: Object.values(tvaByRate),
  }
}

/**
 * Formatte un montant en euros (format français)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Retourne les mentions légales par défaut
 */
export function getDefaultLegalMentions(artisan?: {
  company_name?: string
  siret?: string
  insurance_decennale_number?: string
}): string {
  const parts = [
    'Conditions de paiement : à réception de facture, sauf mention contraire.',
    'En cas de retard de paiement, une pénalité de 3 fois le taux d\'intérêt légal sera appliquée, ainsi qu\'une indemnité forfaitaire de 40€ pour frais de recouvrement.',
    'Pas d\'escompte pour paiement anticipé.',
  ]

  if (artisan?.siret) {
    parts.push(`SIRET : ${artisan.siret}`)
  }

  if (artisan?.insurance_decennale_number) {
    parts.push(`Assurance décennale n° ${artisan.insurance_decennale_number}`)
  }

  parts.push(
    'TVA à 10% applicable pour les travaux de rénovation dans les locaux d\'habitation achevés depuis plus de 2 ans (article 279-0 bis du CGI). TVA à 20% dans les autres cas.',
    'Le client dispose d\'un délai de rétractation de 14 jours à compter de l\'acceptation du devis pour les contrats conclus à distance ou hors établissement.'
  )

  return parts.join('\n\n')
}

/**
 * Retourne le label d'un statut
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    signed: 'Signé',
    accepted: 'Accepté',
    rejected: 'Refusé',
    paid: 'Payé',
    partially_paid: 'Part. payé',
    overdue: 'En retard',
    cancelled: 'Annulé',
  }
  return labels[status] || status
}

/**
 * Retourne le label d'un type de document
 */
export function getDocTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    devis: 'Devis',
    facture: 'Facture',
    acompte: 'Acompte',
    situation: 'Situation',
    avoir: 'Avoir',
  }
  return labels[type] || type
}

/**
 * Calcule les pénalités de retard
 */
export function calculateLatePenalties(
  amountDue: number,
  dueDate: string,
  annualRate: number = 10,
  referenceDate?: Date
) {
  const due = new Date(dueDate)
  const now = referenceDate || new Date()
  const diffMs = now.getTime() - due.getTime()
  if (diffMs <= 0) return null

  const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const penalty = Math.round(amountDue * (annualRate / 100) * (daysLate / 365) * 100) / 100
  const recoveryFee = 40 // Indemnité forfaitaire légale
  const totalDue = Math.round((amountDue + penalty + recoveryFee) * 100) / 100

  return { daysLate, penalty, recoveryFee, totalDue, annualRate }
}

/**
 * Calcule la retenue de garantie
 */
export function calculateRetenueGarantie(totalTtc: number, pct: number = 5) {
  const retenue = Math.round(totalTtc * pct / 100 * 100) / 100
  return {
    retenue,
    netAPayer: Math.round((totalTtc - retenue) * 100) / 100,
  }
}
