import { ref } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'

// Buka ulang popup Midtrans untuk order yang masih pending,
// memakai snapToken yang tersimpan saat checkout.
export function usePayOrder() {
  const orderStore = useOrderStore()
  const payingId = ref(null)
  const payError = ref('')

  const pay = (order) => {
    if (payingId.value || !order) return
    payError.value = ''

    if (!order.snapToken || !window.snap) {
      payError.value = 'Token pembayaran tidak ditemukan. Silakan buat pesanan baru.'
      return
    }

    payingId.value = order.id
    const done = (status) => {
      if (status) orderStore.updateOrderStatus(order.id, status)
      payingId.value = null
    }

    try {
      window.snap.pay(order.snapToken, {
        onSuccess: () => done('success'),
        onPending: () => done('pending'),
        onError: () => done('failed'),
        onClose: () => done(null),
      })
    } catch (err) {
      console.error('Gagal membuka pembayaran:', err)
      payError.value = 'Halaman pembayaran gagal dibuka. Coba lagi.'
      payingId.value = null
    }
  }

  return { pay, payingId, payError }
}
