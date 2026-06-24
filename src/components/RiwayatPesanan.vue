<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/useOrderStore'

const router = useRouter()
const orderStore = useOrderStore()

const activeTab = ref('semua') // 'semua' | 'pending' | 'success' | 'failed'
const payingOrderId = ref(null)

const tabs = [
  { key: 'semua', label: 'Semua' },
  { key: 'pending', label: 'Menunggu Bayar' },
  { key: 'success', label: 'Lunas' },
  { key: 'failed', label: 'Gagal' },
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'semua') return orderStore.orders
  return orderStore.orders.filter(o => o.status === activeTab.value)
})

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (isoString) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(isoString))
}

const getStatusLabel = (status) => {
  const map = {
    pending: 'Menunggu Pembayaran',
    success: 'Pembayaran Berhasil',
    failed: 'Pembayaran Gagal'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    pending: 'status-pending',
    success: 'status-success',
    failed: 'status-failed'
  }
  return map[status] || ''
}

// Bayar order yang pending — buka ulang popup Midtrans pakai snapToken yang sudah tersimpan
const handleBayarSekarang = async (order) => {
  if (payingOrderId.value) return
  payingOrderId.value = order.id

  try {
    if (order.snapToken) {
      window.snap.pay(order.snapToken, {
        onSuccess: function(result) {
          console.log('Success!', result)
          orderStore.updateOrderStatus(order.id, 'success')
          payingOrderId.value = null
        },
        onPending: function(result) {
          console.log('Pending', result)
          orderStore.updateOrderStatus(order.id, 'pending')
          payingOrderId.value = null
        },
        onError: function(result) {
          console.log('Error', result)
          orderStore.updateOrderStatus(order.id, 'failed')
          payingOrderId.value = null
        },
        onClose: function() {
          console.log('Popup ditutup lagi')
          payingOrderId.value = null
        }
      })
    } else {
      alert('Token pembayaran tidak ditemukan. Silakan buat pesanan baru.')
      payingOrderId.value = null
    }
  } catch (error) {
    console.error('Error membuka pembayaran:', error)
    alert('Gagal membuka halaman pembayaran.')
    payingOrderId.value = null
  }
}

const goToDetail = (orderId) => {
  router.push(`/riwayat-pesanan/${orderId}`)
}

const goBack = () => {
  router.push('/')
}

const goToKatalog = () => {
  router.push('/').then(() => {
    setTimeout(() => {
      const el = document.getElementById('katalog-produk')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  })
}

const pendingCount = computed(() => orderStore.pendingOrders.length)
</script>

<template>
  <div class="riwayat-page">
    <!-- Header -->
    <div class="riwayat-header">
      <div class="header-inner">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div>
          <h1 class="header-title">Riwayat Pesanan</h1>
          <p class="header-sub" v-if="pendingCount > 0">
            {{ pendingCount }} pesanan menunggu pembayaran
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-wrapper">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'pending' && pendingCount > 0"
            class="tab-badge"
          >{{ pendingCount }}</span>
        </button>
      </div>
    </div>

    <!-- Order List -->
    <div class="order-list-wrapper">
      <!-- Kosong -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <p>Belum ada pesanan di sini</p>
        <button class="btn-belanja" @click="goToKatalog">Mulai Belanja</button>
      </div>

      <!-- Order Cards -->
      <div v-else class="order-list">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
          :class="{ 'card-pending': order.status === 'pending' }"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="order-id-wrap">
              <span class="order-id">{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.date) }}</span>
            </div>
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- Item Preview (maks 2 item) -->
          <div class="card-items">
            <div
              v-for="item in order.items.slice(0, 2)"
              :key="item.id"
              class="preview-item"
            >
              <img :src="item.image" :alt="item.title" class="preview-img" />
              <div class="preview-info">
                <span class="preview-name">{{ item.title }}</span>
                <span class="preview-qty">x{{ item.qty }}</span>
              </div>
            </div>
            <div v-if="order.items.length > 2" class="more-items">
              +{{ order.items.length - 2 }} produk lainnya
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="total-wrap">
              <span class="total-label">Total</span>
              <span class="total-value">{{ formatRupiah(order.totalPrice) }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-detail" @click="goToDetail(order.id)">
                Lihat Detail
              </button>
              <button
                v-if="order.status === 'pending'"
                class="btn-bayar"
                @click="handleBayarSekarang(order)"
                :disabled="payingOrderId === order.id"
              >
                <span v-if="payingOrderId === order.id">Memproses...</span>
                <span v-else>Bayar Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.riwayat-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* ===== HEADER ===== */
.riwayat-header {
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  padding: 1.25rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background-color: #fef9c3;
  border-color: #eab308;
  color: #ca8a04;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.03em;
}

.header-sub {
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0.1rem 0 0;
}

/* ===== TABS ===== */
.tabs-wrapper {
  background-color: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  padding: 0 2rem;
}

.tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.9rem 1.1rem;
  border: none;
  border-bottom: 2.5px solid transparent;
  background: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}

.tab-btn.active {
  color: #ca8a04;
  border-bottom-color: #eab308;
}

.tab-btn:hover:not(.active) {
  color: #374151;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  width: 17px;
  height: 17px;
  border-radius: 50%;
}

/* ===== ORDER LIST ===== */
.order-list-wrapper {
  padding: 1.5rem 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-state p {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.btn-belanja {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(234,179,8,0.32);
}

.btn-belanja:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(234,179,8,0.42);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== ORDER CARD ===== */
.order-card {
  background-color: #ffffff;
  border-radius: 1.25rem;
  border: 1.5px solid #f1f5f9;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
}

.card-pending {
  border-color: #fde68a;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f9fafb;
}

.order-id-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.order-id {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.order-date {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Status badges */
.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-success {
  background-color: #dcfce7;
  color: #166534;
}

.status-failed {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Item preview */
.card-items {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-img {
  width: 44px;
  height: 44px;
  border-radius: 0.6rem;
  object-fit: cover;
  background-color: #fef9c3;
  flex-shrink: 0;
}

.preview-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 0.5rem;
}

.preview-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.preview-qty {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 600;
  flex-shrink: 0;
}

.more-items {
  font-size: 0.78rem;
  color: #ca8a04;
  font-weight: 600;
  padding-left: 0.25rem;
}

/* Card footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f9fafb;
  background-color: #fafafa;
}

.total-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.total-label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
}

.total-value {
  font-size: 1rem;
  font-weight: 800;
  color: #ca8a04;
  letter-spacing: -0.02em;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-detail {
  background: none;
  border: 1.5px solid #e5e7eb;
  color: #374151;
  padding: 0.55rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail:hover {
  border-color: #eab308;
  color: #ca8a04;
  background-color: #fef9c3;
}

.btn-bayar {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(234,179,8,0.32);
}

.btn-bayar:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(234,179,8,0.42);
}

.btn-bayar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 576px) {
  .riwayat-header {
    padding: 1rem 4%;
  }

  .tabs-wrapper {
    padding: 0 4%;
  }

  .order-list-wrapper {
    padding: 1rem 4%;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .card-actions {
    width: 100%;
  }

  .btn-detail,
  .btn-bayar {
    flex: 1;
    justify-content: center;
    text-align: center;
  }

  .btn-detail {
    display: block;
  }
  .btn-bayar {
    display: block;
  }
}
</style>
