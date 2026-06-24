import { defineStore } from 'pinia'

const STORAGE_KEY = 'toko-kelontong-cart'

export const useCartStore = defineStore('cart', {
  state: () => {
    // Cek apakah ada data cart di Local Storage saat aplikasi dimuat
    const storedCart = localStorage.getItem(STORAGE_KEY)

    return {
      // Jika ada data, parse menjadi array. Jika tidak, gunakan array kosong
      items: storedCart ? JSON.parse(storedCart) : []
    }
  },

  getters: {
    // Total jumlah barang (dipakai di Navbar: "Keranjang (totalCount)")
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),

    // Total harga semua barang di keranjang
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.qty * item.price, 0),

    // Cek qty produk tertentu (dipakai di ProductCard untuk tahu apakah tombol +/- harus muncul)
    getQty: (state) => (productId) => {
      const found = state.items.find(item => item.id === productId)
      return found ? found.qty : 0
    }
  },

  actions: {
    // Fungsi bantuan untuk memperbarui data di Local Storage
    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    addToCart(product) {
      const existing = this.items.find(item => item.id === product.id)
      if (existing) {
        existing.qty += 1
      } else {
        this.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1
        })
      }
      // Simpan perubahan
      this.saveToLocalStorage()
    },

    increment(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.qty += 1
        // Simpan perubahan
        this.saveToLocalStorage()
      }
    },

    decrement(productId) {
      const item = this.items.find(item => item.id === productId)
      if (!item) return

      if (item.qty <= 1) {
        // qty turun ke 0 -> hapus dari keranjang
        this.items = this.items.filter(i => i.id !== productId)
      } else {
        item.qty -= 1
      }
      // Simpan perubahan
      this.saveToLocalStorage()
    },

    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      // Simpan perubahan
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      // Simpan perubahan
      this.saveToLocalStorage()
    }
  }
})
