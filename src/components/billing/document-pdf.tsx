import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { calculateDocumentTotals, formatCurrency } from '@/lib/billing-utils'

// Register a font that supports French characters
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: '#1a202c',
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  artisanBlock: {
    width: '55%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  artisanDetail: {
    fontSize: 8,
    color: '#4a5568',
    lineHeight: 1.5,
  },
  docTypeBlock: {
    width: '40%',
    textAlign: 'right',
  },
  docTypeBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  docNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  docMeta: {
    fontSize: 8,
    color: '#4a5568',
    lineHeight: 1.5,
  },
  // Separator
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 12,
  },
  separatorThick: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a365d',
    marginVertical: 12,
  },
  // Client + Chantier row
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clientBlock: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  blockTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  blockText: {
    fontSize: 9,
    color: '#2d3748',
    lineHeight: 1.5,
  },
  blockTextBold: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 2,
  },
  // Table
  table: {
    marginTop: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a365d',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f7fafc',
  },
  tableCell: {
    fontSize: 8.5,
    color: '#2d3748',
  },
  tableCellBold: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  // Column widths
  colDesignation: { width: '40%' },
  colQty: { width: '8%', textAlign: 'right' },
  colUnit: { width: '8%', textAlign: 'center' },
  colPuHt: { width: '14%', textAlign: 'right' },
  colTva: { width: '10%', textAlign: 'center' },
  colTotalHt: { width: '20%', textAlign: 'right' },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    backgroundColor: '#edf2f7',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a365d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Section subtotal
  sectionSubtotal: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#cbd5e0',
    backgroundColor: '#f7fafc',
  },
  // Totals block
  totalsContainer: {
    marginLeft: 'auto',
    width: '45%',
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 9,
    color: '#4a5568',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  totalRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#1a365d',
    borderRadius: 4,
    marginTop: 4,
  },
  totalMainLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalMainValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Acompte
  acompteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  acompteLabel: {
    fontSize: 9,
    color: '#2563eb',
  },
  acompteValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  // Conditions
  conditionsBlock: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  conditionsTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#718096',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  conditionsText: {
    fontSize: 7.5,
    color: '#4a5568',
    lineHeight: 1.6,
  },
  // Legal
  legalBlock: {
    marginTop: 12,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  legalText: {
    fontSize: 6.5,
    color: '#718096',
    lineHeight: 1.5,
  },
  // Signature
  signatureBlock: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureZone: {
    width: '45%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 4,
    minHeight: 80,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#718096',
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 7.5,
    color: '#4a5568',
    lineHeight: 1.6,
  },
  signatureImage: {
    width: 150,
    height: 60,
    marginTop: 4,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#a0aec0',
  },
  // Logo
  logo: {
    width: 40,
    height: 40,
    marginBottom: 6,
    borderRadius: 4,
  },
  // Description sub-text
  lineDescription: {
    fontSize: 7,
    color: '#718096',
    marginTop: 1,
  },
})

// Types
interface DocumentLine {
  id?: string
  sort_order: number
  designation: string
  description: string | null
  unit: string
  quantity: number
  unit_price_ht: number
  tva_rate: number
  section_title?: string | null
  is_section_header?: boolean
  previous_pct?: number
  current_pct?: number
}

interface ArtisanInfo {
  company_name?: string
  siret?: string
  address?: string
  city?: string
  postal_code?: string
  phone?: string
  email?: string
  insurance_decennale_name?: string
  insurance_decennale_number?: string
  logo_url?: string
  primary_color?: string
  bank_iban?: string
  bank_bic?: string
}

interface DocumentData {
  id: string
  document_type: string
  document_number: string
  status: string
  client_name: string
  client_email: string | null
  client_phone: string | null
  client_address: string | null
  client_siret: string | null
  project_address: string | null
  project_description: string | null
  total_ht: number
  total_tva: number
  total_ttc: number
  deposit_percentage: number | null
  payment_terms: string | null
  payment_method: string | null
  validity_date: string | null
  due_date: string | null
  notes: string | null
  legal_mentions: string | null
  created_at: string
  signed_at: string | null
  signature_data: string | null
  retenue_garantie_active?: boolean
  retenue_garantie_pct?: number
  autoliquidation_active?: boolean
  parent_devis_id?: string | null
  billing_document_lines: DocumentLine[]
}

interface DocumentPDFProps {
  document: DocumentData
  artisan: ArtisanInfo
}

const DOC_TYPE_LABELS: Record<string, string> = {
  devis: 'DEVIS',
  facture: 'FACTURE',
  acompte: 'FACTURE D\'ACOMPTE',
  situation: 'FACTURE DE SITUATION',
  avoir: 'AVOIR',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' \u20AC'
}

export function createDocumentPDF(props: DocumentPDFProps) {
  return DocumentPDF(props)
}

function DocumentPDF({ document: doc, artisan }: DocumentPDFProps) {
  const lines = (doc.billing_document_lines || []).sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const totals = calculateDocumentTotals(
    lines.filter((l) => !l.is_section_header)
  )

  // Group lines by section
  const sections: { title: string | null; lines: DocumentLine[] }[] = []
  let currentSection: { title: string | null; lines: DocumentLine[] } = { title: null, lines: [] }

  for (const line of lines) {
    if (line.is_section_header) {
      if (currentSection.lines.length > 0 || sections.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { title: line.section_title || line.designation, lines: [] }
    } else {
      currentSection.lines.push(line)
    }
  }
  sections.push(currentSection)

  const isAutoliq = doc.autoliquidation_active
  const effectiveTotals = isAutoliq
    ? { ...totals, total_tva: 0, total_ttc: totals.total_ht, tva_summary: [] }
    : totals

  const retenueActive = doc.retenue_garantie_active && doc.retenue_garantie_pct
  const retenueMontant = retenueActive ? effectiveTotals.total_ttc * (doc.retenue_garantie_pct! / 100) : 0
  const netAPayer = effectiveTotals.total_ttc - retenueMontant

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.artisanBlock}>
            {artisan.logo_url && (
              <Image src={artisan.logo_url} style={styles.logo} />
            )}
            <Text style={styles.companyName}>
              {artisan.company_name || 'Artisan'}
            </Text>
            <Text style={styles.artisanDetail}>
              {artisan.address && `${artisan.address}\n`}
              {artisan.postal_code && artisan.city && `${artisan.postal_code} ${artisan.city}\n`}
              {artisan.phone && `Tel : ${artisan.phone}\n`}
              {artisan.email && `${artisan.email}\n`}
              {artisan.siret && `SIRET : ${artisan.siret}\n`}
              {artisan.insurance_decennale_name && artisan.insurance_decennale_number &&
                `Assurance decennale : ${artisan.insurance_decennale_name} n\u00B0${artisan.insurance_decennale_number}`}
            </Text>
          </View>

          <View style={styles.docTypeBlock}>
            <Text style={styles.docTypeBadge}>
              {DOC_TYPE_LABELS[doc.document_type] || doc.document_type.toUpperCase()}
            </Text>
            <Text style={styles.docNumber}>N\u00B0 {doc.document_number}</Text>
            <Text style={styles.docMeta}>
              Date : {formatDate(doc.created_at)}{'\n'}
              {doc.document_type === 'devis' && doc.validity_date &&
                `Validite : ${formatDate(doc.validity_date)}\n`}
              {doc.due_date && `Echeance : ${formatDate(doc.due_date)}\n`}
            </Text>
          </View>
        </View>

        <View style={styles.separatorThick} />

        {/* Client + Chantier */}
        <View style={styles.clientRow}>
          <View style={styles.clientBlock}>
            <Text style={styles.blockTitle}>Client</Text>
            <Text style={styles.blockTextBold}>{doc.client_name}</Text>
            <Text style={styles.blockText}>
              {doc.client_address && `${doc.client_address}\n`}
              {doc.client_email && `${doc.client_email}\n`}
              {doc.client_phone && `Tel : ${doc.client_phone}\n`}
              {doc.client_siret && `SIRET : ${doc.client_siret}`}
            </Text>
          </View>

          {doc.project_address && (
            <View style={styles.clientBlock}>
              <Text style={styles.blockTitle}>Chantier</Text>
              <Text style={styles.blockText}>
                {doc.project_address}
                {doc.project_description && `\n${doc.project_description}`}
              </Text>
            </View>
          )}
        </View>

        {/* Lines Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesignation]}>Designation</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qte</Text>
            <Text style={[styles.tableHeaderText, styles.colUnit]}>Unite</Text>
            <Text style={[styles.tableHeaderText, styles.colPuHt]}>PU HT</Text>
            <Text style={[styles.tableHeaderText, styles.colTva]}>TVA</Text>
            <Text style={[styles.tableHeaderText, styles.colTotalHt]}>Total HT</Text>
          </View>

          {/* Table Body */}
          {sections.map((section, sIdx) => (
            <View key={sIdx}>
              {section.title && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
              )}
              {section.lines.map((line, lIdx) => {
                const lineHt = line.quantity * line.unit_price_ht
                return (
                  <View
                    key={lIdx}
                    style={[
                      styles.tableRow,
                      lIdx % 2 === 1 ? styles.tableRowAlt : {},
                    ]}
                  >
                    <View style={styles.colDesignation}>
                      <Text style={styles.tableCellBold}>{line.designation}</Text>
                      {line.description && (
                        <Text style={styles.lineDescription}>{line.description}</Text>
                      )}
                    </View>
                    <Text style={[styles.tableCell, styles.colQty]}>
                      {line.quantity}
                    </Text>
                    <Text style={[styles.tableCell, styles.colUnit]}>
                      {line.unit}
                    </Text>
                    <Text style={[styles.tableCell, styles.colPuHt]}>
                      {formatAmount(line.unit_price_ht)}
                    </Text>
                    <Text style={[styles.tableCell, styles.colTva]}>
                      {line.tva_rate}%
                    </Text>
                    <Text style={[styles.tableCellBold, styles.colTotalHt]}>
                      {formatAmount(lineHt)}
                    </Text>
                  </View>
                )
              })}
              {section.title && section.lines.length > 0 && (
                <View style={styles.sectionSubtotal}>
                  <Text style={[styles.tableCell, styles.colDesignation, { fontWeight: 'bold', fontSize: 8 }]}>
                    Sous-total {section.title}
                  </Text>
                  <Text style={[styles.tableCellBold, styles.colTotalHt, { marginLeft: 'auto' }]}>
                    {formatAmount(
                      section.lines.reduce((s, l) => s + l.quantity * l.unit_price_ht, 0)
                    )}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{formatAmount(effectiveTotals.total_ht)}</Text>
          </View>
          {isAutoliq ? (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: '#d97706' }]}>TVA autoliquidee (0%)</Text>
              <Text style={[styles.totalValue, { color: '#d97706' }]}>0,00 EUR</Text>
            </View>
          ) : (
            effectiveTotals.tva_summary.map((tva) => (
              <View key={tva.rate} style={styles.totalRow}>
                <Text style={styles.totalLabel}>TVA {tva.rate}%</Text>
                <Text style={styles.totalValue}>{formatAmount(tva.tva_amount)}</Text>
              </View>
            ))
          )}
          <View style={styles.totalRowMain}>
            <Text style={styles.totalMainLabel}>{isAutoliq ? 'Total HT a payer' : 'Total TTC'}</Text>
            <Text style={styles.totalMainValue}>{formatAmount(effectiveTotals.total_ttc)}</Text>
          </View>

          {isAutoliq && (
            <View style={{ paddingHorizontal: 8, marginTop: 4 }}>
              <Text style={{ fontSize: 7.5, fontWeight: 'bold', color: '#92400e' }}>
                Autoliquidation de la TVA - Article 283-2 nonies du CGI. TVA due par le preneur.
              </Text>
            </View>
          )}

          {retenueActive && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Retenue de garantie ({doc.retenue_garantie_pct}%)</Text>
                <Text style={styles.totalValue}>- {formatAmount(retenueMontant)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Net a payer</Text>
                <Text style={[styles.totalValue, { color: '#2563eb' }]}>{formatAmount(netAPayer)}</Text>
              </View>
              <View style={{ paddingHorizontal: 8, marginTop: 2 }}>
                <Text style={{ fontSize: 6.5, color: '#718096', fontStyle: 'italic' }}>
                  La retenue de garantie sera liberee dans un delai d&apos;un an a compter de la reception des travaux (art. 1799-1 du Code civil).
                </Text>
              </View>
            </>
          )}

          {doc.deposit_percentage && doc.deposit_percentage > 0 && (
            <View style={styles.acompteRow}>
              <Text style={styles.acompteLabel}>
                Acompte {doc.deposit_percentage}% a la signature
              </Text>
              <Text style={styles.acompteValue}>
                {formatAmount((retenueActive ? netAPayer : effectiveTotals.total_ttc) * doc.deposit_percentage / 100)}
              </Text>
            </View>
          )}
        </View>

        {/* Conditions */}
        {(doc.payment_terms || doc.payment_method || doc.notes) && (
          <View style={styles.conditionsBlock}>
            <Text style={styles.conditionsTitle}>Conditions</Text>
            <Text style={styles.conditionsText}>
              {doc.payment_terms && `Conditions de paiement : ${doc.payment_terms}\n`}
              {doc.payment_method && `Mode de paiement : ${doc.payment_method}\n`}
              {artisan.bank_iban && `IBAN : ${artisan.bank_iban}\n`}
              {artisan.bank_bic && `BIC : ${artisan.bank_bic}\n`}
              {doc.notes && `\n${doc.notes}`}
            </Text>
          </View>
        )}

        {/* Attestation TVA réduite */}
        {lines.some((l) => !l.is_section_header && (l.tva_rate === 5.5 || l.tva_rate === 10)) && (
          <View style={[styles.legalBlock, { borderColor: '#2563eb', backgroundColor: '#eff6ff', marginTop: 12 }]}>
            <Text style={[styles.conditionsTitle, { color: '#1d4ed8' }]}>Attestation TVA taux reduit</Text>
            <Text style={[styles.legalText, { color: '#1e40af' }]}>
              Le client soussigne atteste que les travaux vises par le present document sont realises dans un logement acheve depuis plus de deux ans a la date de commencement des travaux et affecte a l&apos;habitation. Le client est informe que si ces conditions ne sont pas remplies, il est redevable du complement de TVA. (Art. 279-0 bis du CGI)
            </Text>
          </View>
        )}

        {/* Legal mentions */}
        {doc.legal_mentions && (
          <View style={styles.legalBlock}>
            <Text style={styles.legalText}>{doc.legal_mentions}</Text>
          </View>
        )}

        {/* Signature zone (for devis) */}
        {doc.document_type === 'devis' && (
          <View style={styles.signatureBlock}>
            <View style={styles.signatureZone}>
              <Text style={styles.signatureLabel}>DATE</Text>
              <Text style={styles.signatureText}>Le ____/____/________</Text>
            </View>
            <View style={styles.signatureZone}>
              <Text style={styles.signatureLabel}>SIGNATURE CLIENT</Text>
              <Text style={styles.signatureText}>
                Devis recu avant l&apos;execution des travaux.{'\n'}
                Lu et accepte, bon pour accord.
              </Text>
              {doc.signature_data && (
                <Image src={doc.signature_data} style={styles.signatureImage} />
              )}
              {doc.signed_at && (
                <Text style={[styles.signatureText, { marginTop: 4, color: '#38a169' }]}>
                  Signe le {formatDate(doc.signed_at)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {artisan.company_name} - {doc.document_number}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber}/${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
