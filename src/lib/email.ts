import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM_EMAIL = 'Rapido\'Devis <notifications@rapido-devis.fr>'

export async function sendDocumentEmail(
  toEmail: string,
  clientName: string,
  docType: string,
  docNumber: string,
  totalTtc: number,
  pdfBuffer: Buffer,
  signUrl?: string
) {
  const typeLabel = docType === 'devis' ? 'Devis' : docType === 'facture' ? 'Facture' : docType === 'acompte' ? 'Acompte' : docType === 'situation' ? 'Situation' : 'Document'
  const amount = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalTtc)

  const signBlock = signUrl && docType === 'devis'
    ? `<div style="text-align: center; margin: 24px 0;">
        <a href="${signUrl}" style="background-color: #38a169; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block;">
          Signer le devis en ligne
        </a>
        <p style="color: #718096; font-size: 12px; margin-top: 8px;">Ce lien vous permet de consulter et signer le devis directement en ligne.</p>
      </div>`
    : ''

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${typeLabel} ${docNumber}`,
      attachments: [
        {
          filename: `${docNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a365d; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Rapido'Devis</h1>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <h2 style="color: #1a365d; margin-top: 0;">Bonjour ${clientName},</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Veuillez trouver ci-joint votre ${typeLabel.toLowerCase()} <strong>${docNumber}</strong>
              d'un montant de <strong>${amount} TTC</strong>.
            </p>
            ${signBlock}
            <p style="color: #4a5568; line-height: 1.6;">
              Le document est également disponible en pièce jointe de cet email.
            </p>
            <p style="color: #718096; font-size: 14px; margin-top: 24px;">
              Pour toute question, n'hésitez pas à répondre directement à cet email.
            </p>
          </div>
          <div style="padding: 16px 24px; background-color: #f7fafc; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Rapido'Devis. Tous droits réservés.
            </p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Document email send error:', error)
    return { success: false, error }
  }
}

export async function sendEstimationReadyEmail(
  toEmail: string,
  userName: string,
  estimationId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const estimationUrl = `${appUrl}/estimations/${estimationId}`

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Votre estimation est prête !',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a365d; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Rapido'Devis</h1>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <h2 style="color: #1a365d; margin-top: 0;">Bonjour ${userName},</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Votre estimation de travaux est prête ! Un expert a traité votre demande et
              le document est maintenant disponible dans votre espace client.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${estimationUrl}"
                 style="background-color: #38a169; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block;">
                Consulter mon estimation
              </a>
            </div>
            <p style="color: #718096; font-size: 14px;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
          </div>
          <div style="padding: 16px 24px; background-color: #f7fafc; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Rapido'Devis. Tous droits réservés.
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Email send error:', error)
  }
}
