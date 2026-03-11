import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Tu es un assistant expert en estimation de travaux de rénovation et construction en France pour Rapido'Devis.

Ton rôle : analyser la réponse de l'utilisateur à une question du questionnaire et poser UNE SEULE question de suivi pertinente et précise.

Règles :
- Pose UNE seule question courte et claire (max 2 phrases)
- La question doit aider à affiner l'estimation (matériaux, dimensions, état, contraintes techniques)
- Sois naturel et amical, tutoie l'utilisateur
- Ne répète pas la question d'origine
- Si la réponse est suffisamment détaillée, réponds avec exactement : NO_FOLLOWUP
- Exemples de bonnes questions de suivi :
  - "Tu mentionnes une salle de bain — tu préfères une douche à l'italienne ou une baignoire ?"
  - "Pour le budget, c'est avec ou sans les matériaux ?"
  - "L'accès au chantier est-il possible pour un camion de livraison ?"
`

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ noFollowUp: true })
    }

    const { questionId, answer, allResponses } = await request.json()

    if (!questionId || !answer) {
      return NextResponse.json({ noFollowUp: true })
    }

    const client = new Anthropic({ apiKey })

    // Build context from all responses
    const contextParts: string[] = []
    if (allResponses.type_travaux) contextParts.push(`Type de travaux: ${allResponses.type_travaux}`)
    if (allResponses.type_bien) contextParts.push(`Type de bien: ${allResponses.type_bien}`)
    if (allResponses.surface) contextParts.push(`Surface: ${allResponses.surface} m²`)
    if (allResponses.ville) contextParts.push(`Ville: ${allResponses.ville}`)
    if (allResponses.postes_travaux) contextParts.push(`Postes: ${Array.isArray(allResponses.postes_travaux) ? allResponses.postes_travaux.join(', ') : allResponses.postes_travaux}`)

    const userMessage = `Contexte du projet :
${contextParts.join('\n')}

Question posée à l'utilisateur (id: ${questionId}) :
L'utilisateur vient de répondre : "${answer}"

Analyse cette réponse et pose une question de suivi pertinente, ou réponds NO_FOLLOWUP si la réponse est suffisante.`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    if (text === 'NO_FOLLOWUP' || text.includes('NO_FOLLOWUP') || !text) {
      return NextResponse.json({ noFollowUp: true })
    }

    return NextResponse.json({
      followUpQuestion: text,
      questionId,
    })
  } catch (error) {
    console.error('AI followup error:', error)
    return NextResponse.json({ noFollowUp: true })
  }
}
