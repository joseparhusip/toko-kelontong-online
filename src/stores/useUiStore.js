import { defineStore } from 'pinia'

// State UI global yang dibagi antar komponen (Navbar, ProductCard, PromoStrip).
export const useUiStore = defineStore('ui', {
  state: () => ({
    cartOpen: false,
    detailProduct: null,
  }),
  actions: {
    openCart() {
      this.detailProduct = null
      this.cartOpen = true
    },
    closeCart() {
      this.cartOpen = false
    },
    openDetail(product) {
      this.detailProduct = product
    },
    closeDetail() {
      this.detailProduct = null
    },
  },
})
