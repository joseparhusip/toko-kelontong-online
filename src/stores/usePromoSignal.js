import { defineStore } from 'pinia'

// Store kecil ini cuma jembatan "sinyal" antar komponen yang gak
// punya hubungan parent-child langsung (PromoStrip -> Navbar).
// Navbar tetap pemilik sah dari state cart & promo (appliedPromo,
// isCartOpen, dll) — store ini gak nyimpen state itu, cuma ngasih tahu
// Navbar "tolong apply kode ini & buka cart-nya".
export const usePromoSignal = defineStore('promoSignal', {
  state: () => ({
    requestedCode: null
  }),
  actions: {
    request(code) {
      this.requestedCode = code
    },
    clear() {
      this.requestedCode = null
    }
  }
})
