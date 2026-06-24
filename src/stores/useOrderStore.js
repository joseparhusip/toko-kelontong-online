import { defineStore } from 'pinia'

const STORAGE_KEY = 'toko-kelontong-orders'

export const useOrderStore = defineStore('order', {
  state: () => {
    const storedOrders = localStorage.getItem(STORAGE_KEY)
    return {
      orders: storedOrders ? JSON.parse(storedOrders) : []
    }
  },

  getters: {
    pendingOrders: (state) => state.orders.filter(o => o.status === 'pending'),
    paidOrders: (state) => state.orders.filter(o => o.status === 'success'),
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders))
    },

    // Simpan order baru dengan snapToken sebelum popup Midtrans dibuka
    // Jadi kalau user nutup popup, order tetap ada & bisa dibayar nanti
    addOrder(orderData) {
      this.orders.unshift({
        ...orderData,
        date: new Date().toISOString(),
        status: 'pending' // default pending dulu
      })
      this.saveToLocalStorage()
    },

    // Update snapToken kalau perlu refresh token (misal token expired)
    updateSnapToken(orderId, snapToken) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.snapToken = snapToken
        this.saveToLocalStorage()
      }
    },

    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = newStatus
        this.saveToLocalStorage()
      }
    },

    deleteOrder(orderId) {
      this.orders = this.orders.filter(o => o.id !== orderId)
      this.saveToLocalStorage()
    }
  }
})
