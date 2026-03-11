import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const SEARCH_PROMPT = `Tu es un assistant expert en matériaux BTP en France. L'utilisateur cherche le prix d'un produit/matériau.

À partir du nom du produit, donne une estimation des prix du marché en France avec des sources.

Retourne un JSON strict avec ce format :
{
  "product_name": "nom normalisé du produit",
  "price_range": {
    "low": nombre (prix HT bas en €),
    "high": nombre (prix HT haut en €),
    "typical": nombre (prix HT typique en €)
  },
  "unit": "u" ou "m²" ou "ml" ou "kg" etc,
  "sources": [
    {
      "name": "Nom du fournisseur/source",
      "price_ht": nombre,
      "url": "URL si connue ou null"
    }
  ],
  "notes": "remarques utiles (qualité, variations, alternatives)"
}

Règles :
- Retourne UNIQUEMENT le JSON
- Base-toi sur les prix courants en France (2024-2025)
- Prix HT (hors taxes)
- Inclus au moins 2-3 sources/fournisseurs connus (Point.P, Leroy Merlin, BigMat, Cedeo, Bricoman, etc.)
- Si tu ne connais pas le prix exact, donne une fourchette réaliste
- Si le produit est trop vague, retourne {"error": "Précisez le produit (marque, dimensions, type...)"}`

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Anthropic non configurée (ANTHROPIC_API_KEY)' }, { status: 500 })
    }

    const { query } = await request.json()
    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return NextResponse.json({ error: 'Nom du produit requis (min 3 caractères)' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 800,
      system: SEARCH_PROMPT,
      messages: [{
        role: 'user',
        content: `Recherche de prix pour : "${query.trim()}"`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    let result: Record<string, unknown>
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      result = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'Impossible d\'analyser les résultats', raw: text }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error as string }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Search prices error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
