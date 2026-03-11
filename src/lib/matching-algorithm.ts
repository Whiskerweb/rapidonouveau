/**
 * Algorithme de matching artisan-client
 * Score sur 100 points :
 * - Trade match : 40 pts
 * - Distance : 30 pts
 * - Rating : 20 pts
 * - Disponibilité : 10 pts
 */

interface ArtisanData {
  user_id: string
  main_trade: string | null
  specializations: string[] | null
  intervention_radius_km: number | null
  rating: number | null
  total_reviews: number | null
  is_available: boolean | null
  hourly_rate: number | null
  address_lat: number | null
  address_lng: number | null
  company_name: string | null
  full_name: string | null
  email: string | null
  phone: string | null
}

interface MatchingRequest {
  required_trades: string[]
  latitude: number | null
  longitude: number | null
  max_distance_km: number
}

/**
 * Calcul distance Haversine entre deux points GPS (en km)
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calcule le score de matching pour un artisan
 */
export function computeMatchingScore(
  artisan: ArtisanData,
  request: MatchingRequest
): number {
  let score = 0

  // 1. Trade match (40 pts)
  const artisanTrades = [
    artisan.main_trade,
    ...(artisan.specializations || [])
  ].filter(Boolean) as string[]

  if (request.required_trades.length > 0 && artisanTrades.length > 0) {
    const matchCount = request.required_trades.filter(t =>
      artisanTrades.some(at => at.toLowerCase() === t.toLowerCase())
    ).length
    score += (matchCount / request.required_trades.length) * 40
  }

  // 2. Distance (30 pts)
  if (request.latitude && request.longitude && artisan.address_lat && artisan.address_lng) {
    const distance = haversineDistance(
      request.latitude, request.longitude,
      artisan.address_lat, artisan.address_lng
    )
    const maxDist = request.max_distance_km || 50
    const radiusKm = artisan.intervention_radius_km || 50

    if (distance <= Math.min(maxDist, radiusKm)) {
      score += (1 - distance / Math.max(maxDist, radiusKm)) * 30
    }
  } else {
    // Pas de coordonnées → score neutre
    score += 15
  }

  // 3. Rating (20 pts)
  const rating = artisan.rating || 0
  const reviews = artisan.total_reviews || 0
  if (reviews > 0) {
    score += (rating / 5) * 20
  } else {
    score += 10 // Nouvel artisan → score neutre
  }

  // 4. Disponibilité (10 pts)
  if (artisan.is_available) {
    score += 10
  }

  return Math.round(score * 100) / 100
}

/**
 * Filtre et trie les artisans par score de matching
 */
export function rankArtisans(
  artisans: ArtisanData[],
  request: MatchingRequest
): (ArtisanData & { score: number })[] {
  return artisans
    .map(artisan => ({
      ...artisan,
      score: computeMatchingScore(artisan, request),
    }))
    .filter(a => a.score > 10) // Score minimum
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // Top 10
}
