import { defineStore } from 'pinia'
import { fetchProducts } from '../services/productApi'

// Satu sumber data produk untuk rail, katalog, dan detail produk.
export const useProductStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: false,
    loaded: false,
  }),

  getters: {
    onSale: (s) => s.items.filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount),
    bestSellers: (s) => [...s.items].sort((a, b) => b.sold - a.sold).slice(0, 10),
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      const { products } = await fetchProducts()
      this.items = products
      this.loading = false
      this.loaded = true
    },
  },
})
