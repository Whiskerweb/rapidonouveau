import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const EXTRACTION_PROMPT = `Tu es un extracteur de données produit. On te donne le contenu HTML brut d'une page produit d'un fournisseur BTP (Point.P, Leroy Merlin, BigMat, Cedeo, Rexel, Bricoman, Castorama, etc.).

Extrais les informations suivantes au format JSON strict :
{
  "designation": "nom du produit (court et clair)",
  "description": "description courte du produit (1-2 lignes max, optionnel)",
  "unit_price_ht": nombre (prix HT en euros, si seul le TTC est dispo, divise par 1.20),
  "unit": "u" ou "m" ou "m²" ou "m³" ou "kg" ou "lot" ou "ens" (déduis l'unité appropriée),
  "tva_rate": 20 (ou 10 ou 5.5 si c'est un produit à TVA réduite),
  "reference": "référence fournisseur / SKU (si trouvée)",
  "supplier_name": "nom du fournisseur (déduit du site)",
  "image_url": "URL de l'image principale (si trouvée, optionnel)"
}

Règles :
- Retourne UNIQUEMENT le JSON, rien d'autre
- Si le prix est TTC, convertis en HT (divise par 1 + tva_rate/100)
- Si tu ne trouves pas un champ, mets null
- Pour le prix, garde 2 décimales
- Privilégie le prix unitaire, pas le prix au lot
- Si la page ne contient pas de produit identifiable, retourne {"error": "Pas de produit trouvé sur cette page"}`

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Anthropic non configurée (ANTHROPIC_API_KEY)' }, { status: 500 })
    }

    const { url } = await request.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL requise' }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    // Fetch the page
    const pageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })

    if (!pageRes.ok) {
      return NextResponse.json({ error: `Impossible de charger la page (${pageRes.status})` }, { status: 400 })
    }

    let html = await pageRes.text()

    // Clean HTML — keep only relevant content, strip scripts/styles/nav
    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Limit to ~8000 chars to stay within token limits
    if (html.length > 8000) {
      html = html.substring(0, 8000)
    }

    if (html.length < 50) {
      return NextResponse.json({ error: 'Page vide ou protégée (anti-bot)' }, { status: 400 })
    }

    // Use Claude to extract product data
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20241022',
      max_tokens: 500,
      system: EXTRACTION_PROMPT,
      messages: [{
        role: 'user',
        content: `URL: ${url}\nDomaine: ${parsedUrl.hostname}\n\nContenu de la page :\n${html}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // Parse JSON response
    let product: Record<string, unknown>
    try {
      // Extract JSON from potential markdown code block
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      product = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'Impossible d\'extraire les données produit', raw: text }, { status: 400 })
    }

    if (product.error) {
      return NextResponse.json({ error: product.error as string }, { status: 400 })
    }

    return NextResponse.json({
      product: {
        designation: product.designation || null,
        description: product.description || null,
        unit_price_ht: product.unit_price_ht ? Number(product.unit_price_ht) : null,
        unit: product.unit || 'u',
        tva_rate: product.tva_rate ? Number(product.tva_rate) : 20,
        reference: product.reference || null,
        supplier_name: product.supplier_name || parsedUrl.hostname,
        image_url: product.image_url || null,
        source_url: url,
      },
    })
  } catch (error) {
    console.error('Scrape error:', error)
    const message = error instanceof Error && error.name === 'TimeoutError'
      ? 'Timeout — la page met trop de temps à répondre'
      : 'Erreur lors du scraping'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
