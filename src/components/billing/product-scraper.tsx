'use client'

import { useState } from 'react'
import { Link2, Search, Loader2, X, Plus, ExternalLink, TrendingUp, AlertCircle, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/billing-utils'

interface ScrapedProduct {
  designation: string | null
  description: string | null
  unit_price_ht: number | null
  unit: string
  tva_rate: number
  reference: string | null
  supplier_name: string
  image_url: string | null
  source_url: string
}

interface PriceResult {
  product_name: string
  price_range: { low: number; high: number; typical: number }
  unit: string
  sources: { name: string; price_ht: number; url: string | null }[]
  notes: string
}

interface ProductScraperProps {
  onAddProduct: (product: {
    designation: string
    description: string
    unit: string
    unitPriceHt: number
    tvaRate: number
    costPrice: number | null
    supplierReference: string
  }) => void
  onClose: () => void
}

export function ProductScraper({ onAddProduct, onClose }: ProductScraperProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'search'>('url')

  // URL scraping state
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scraped, setScraped] = useState<ScrapedProduct | null>(null)
  const [scrapeError, setScrapeError] = useState('')

  // Price search state
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null)
  const [searchError, setSearchError] = useState('')

  const handleScrape = async () => {
    if (!url.trim()) return
    setScraping(true)
    setScrapeError('')
    setScraped(null)

    try {
      const res = await fetch('/api/billing/library/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.product) {
        setScraped(data.product)
      } else {
        setScrapeError(data.error || 'Erreur inconnue')
      }
    } catch {
      setScrapeError('Erreur réseau')
    } finally {
      setScraping(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim() || query.trim().length < 3) return
    setSearching(true)
    setSearchError('')
    setPriceResult(null)

    try {
      const res = await fetch('/api/billing/library/search-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setPriceResult(data.result)
      } else {
        setSearchError(data.error || 'Erreur inconnue')
      }
    } catch {
      setSearchError('Erreur réseau')
    } finally {
      setSearching(false)
    }
  }

  const addScraped = () => {
    if (!scraped?.designation || !scraped.unit_price_ht) return
    onAddProduct({
      designation: scraped.designation,
      description: scraped.description || '',
      unit: scraped.unit || 'u',
      unitPriceHt: scraped.unit_price_ht,
      tvaRate: scraped.tva_rate || 20,
      costPrice: scraped.unit_price_ht, // prix fournisseur = prix d'achat
      supplierReference: scraped.reference || '',
    })
  }

  const addFromPrice = (source: { name: string; price_ht: number }, result: PriceResult) => {
    onAddProduct({
      designation: result.product_name,
      description: '',
      unit: result.unit || 'u',
      unitPriceHt: source.price_ht,
      tvaRate: 20,
      costPrice: source.price_ht,
      supplierReference: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Importer un produit</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'text-rapido-blue border-b-2 border-rapido-blue'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Link2 className="h-4 w-4" />
            Depuis une URL
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-rapido-blue border-b-2 border-rapido-blue'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Rechercher les prix
          </button>
        </div>

        <div className="p-4 space-y-4">
          {activeTab === 'url' ? (
            <>
              {/* URL input */}
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1">
                  URL de la page produit
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScrape()}
                    placeholder="https://www.pointp.fr/produit/..."
                    className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                    autoFocus
                  />
                  <button
                    onClick={handleScrape}
                    disabled={scraping || !url.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-lg hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
                  >
                    {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    Extraire
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Supporte : Point.P, Leroy Merlin, BigMat, Cedeo, Bricoman, Castorama, Rexel...
                </p>
              </div>

              {/* Error */}
              {scrapeError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{scrapeError}</p>
                </div>
              )}

              {/* Scraped result */}
              {scraped && (
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rapido-blue/10 flex-shrink-0">
                        <Package className="h-5 w-5 text-rapido-blue" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-800">{scraped.designation || 'Produit sans nom'}</p>
                        {scraped.description && (
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{scraped.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {scraped.unit_price_ht !== null && (
                            <span className="text-sm font-bold text-rapido-green">{formatCurrency(scraped.unit_price_ht)} HT</span>
                          )}
                          <span className="text-[10px] text-zinc-400">/{scraped.unit} · TVA {scraped.tva_rate}%</span>
                          {scraped.reference && (
                            <span className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">Réf: {scraped.reference}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-zinc-400">{scraped.supplier_name}</span>
                          <a
                            href={scraped.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-rapido-blue hover:underline flex items-center gap-0.5"
                          >
                            <ExternalLink className="h-2.5 w-2.5" /> Voir la page
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
                    <button
                      onClick={addScraped}
                      disabled={!scraped.designation || !scraped.unit_price_ht}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-lg hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter à ma bibliothèque
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Search input */}
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1">
                  Nom du produit ou matériau
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Ex: Carrelage grès cérame 60x60, Tube cuivre 22mm..."
                    className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rapido-blue/20 focus:border-rapido-blue"
                    autoFocus
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searching || query.trim().length < 3}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rapido-blue rounded-lg hover:bg-rapido-blue/90 disabled:opacity-50 transition-colors"
                  >
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Chercher
                  </button>
                </div>
              </div>

              {/* Error */}
              {searchError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{searchError}</p>
                </div>
              )}

              {/* Price results */}
              {priceResult && (
                <div className="space-y-3">
                  {/* Price range card */}
                  <div className="p-4 bg-gradient-to-r from-rapido-blue/5 to-rapido-green/5 rounded-xl border border-zinc-200">
                    <p className="text-sm font-semibold text-zinc-800">{priceResult.product_name}</p>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="text-2xl font-bold text-rapido-blue">
                        {formatCurrency(priceResult.price_range.typical)}
                      </span>
                      <span className="text-xs text-zinc-400">/{priceResult.unit} HT (prix moyen)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500">
                        Fourchette : {formatCurrency(priceResult.price_range.low)} — {formatCurrency(priceResult.price_range.high)}
                      </span>
                    </div>
                    {priceResult.notes && (
                      <p className="text-[11px] text-zinc-500 mt-2 italic">{priceResult.notes}</p>
                    )}
                  </div>

                  {/* Sources */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Prix par fournisseur</h3>
                    {priceResult.sources.map((source, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 hover:border-zinc-200 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-zinc-700">{source.name}</p>
                            {source.url && (
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-rapido-blue">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm font-bold text-zinc-800 mt-0.5">{formatCurrency(source.price_ht)} HT/{priceResult.unit}</p>
                        </div>
                        <button
                          onClick={() => addFromPrice(source, priceResult)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-rapido-blue/10 text-rapido-blue rounded-lg hover:bg-rapido-blue/20 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Ajouter
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
