// Product API — Open Food Facts (https://world.openfoodfacts.org)
//
// Kenapa Open Food Facts:
// - Database produk kemasan terbuka, banyak produk Indonesia (Indomie,
//   Kapal Api, Bango, Ultra Milk, dll) lengkap dengan foto kemasan asli.
// - Gratis, tanpa API key, dan CORS terbuka -> bisa dipanggil dari browser.
//
// Batasannya (dan cara kita menanganinya):
// - Tidak ada harga -> harga tetap dari katalog toko (src/data/catalog.js).
// - Endpoint search kadang balas 503 -> 1x retry, lalu fallback ke snapshot.
// - Rate limit search ±10 req/menit -> cukup SATU request batch per load,
//   hasilnya di-cache 24 jam di localStorage.

import { CATALOG } from '../data/catalog'

const ENDPOINT = 'https://world.openfoodfacts.org/api/v2/search'
const FIELDS = 'code,brands,image_front_url,image_front_small_url'
const CACHE_KEY = 'tk-off-cache-v1'
const CACHE_TTL = 24 * 60 * 60 * 1000
const TIMEOUT_MS = 8000

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    return Date.now() - at < CACHE_TTL ? data : null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage penuh / diblokir: abaikan, cache bersifat opsional */
  }
}

async function requestOnce(codes) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const params = new URLSearchParams({ code: codes.join(','), fields: FIELDS, page_size: String(codes.length) })
    const res = await fetch(`${ENDPOINT}?${params}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`Open Food Facts ${res.status}`)
    const json = await res.json()
    const byCode = {}
    for (const p of json.products ?? []) {
      byCode[p.code] = {
        image: p.image_front_url || p.image_front_small_url || null,
        brand: p.brands?.split(',')[0]?.trim() || null,
      }
    }
    return byCode
  } finally {
    clearTimeout(timer)
  }
}

async function fetchFromOff(codes) {
  try {
    return await requestOnce(codes)
  } catch {
    await new Promise((r) => setTimeout(r, 1200))
    return requestOnce(codes)
  }
}

/**
 * Detail satu produk kemasan dari Open Food Facts (endpoint per-barcode,
 * lebih stabil daripada search). Hasil disimpan di memori selama sesi.
 * @returns {Promise<{ quantity: string|null, ingredients: string|null, halal: boolean } | null>}
 */
const detailCache = new Map()

export async function fetchProductDetail(barcode) {
  if (!barcode) return null
  if (detailCache.has(barcode)) return detailCache.get(barcode)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const fields = 'quantity,lang,ingredients_text,ingredients_text_id,ingredients_text_en,labels'
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=${fields}`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Open Food Facts ${res.status}`)
    const { product: p = {} } = await res.json()

    // Hanya tampilkan komposisi berbahasa Indonesia/Inggris
    const generic = ['id', 'en'].includes(p.lang) ? p.ingredients_text : null
    const ingredients = (p.ingredients_text_id || p.ingredients_text_en || generic || '').trim() || null

    const detail = {
      quantity: p.quantity?.trim() || null,
      ingredients,
      halal: /halal/i.test(p.labels || ''),
    }
    detailCache.set(barcode, detail)
    return detail
  } catch (err) {
    console.warn('[productApi] Detail produk tidak tersedia.', err)
    return null
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Ambil katalog produk.
 * @returns {Promise<{ products: Array, source: 'openfoodfacts' | 'cache' | 'snapshot' }>}
 */
export async function fetchProducts() {
  const codes = CATALOG.filter((p) => p.barcode).map((p) => p.barcode)

  let remote = readCache()
  let source = remote ? 'cache' : 'snapshot'

  if (!remote) {
    try {
      remote = await fetchFromOff(codes)
      writeCache(remote)
      source = 'openfoodfacts'
    } catch (err) {
      console.warn('[productApi] Open Food Facts tidak tersedia, pakai snapshot lokal.', err)
    }
  }

  const products = CATALOG.map((p) => {
    const live = p.barcode && remote?.[p.barcode]
    if (!live) return { ...p }
    return { ...p, image: live.image || p.image, brand: p.brand || live.brand }
  })

  return { products, source }
}
