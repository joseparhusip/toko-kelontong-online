<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '../stores/useOrderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const orderId = route.params.id
const isPaying = ref(false)

const order = computed(() => orderStore.orders.find(o => o.id === orderId))

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (isoString) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
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

const handleBayarSekarang = async () => {
  if (isPaying.value || !order.value) return
  isPaying.value = true

  try {
    if (order.value.snapToken) {
      window.snap.pay(order.value.snapToken, {
        onSuccess: function(result) {
          console.log('Success!', result)
          orderStore.updateOrderStatus(order.value.id, 'success')
          isPaying.value = false
        },
        onPending: function(result) {
          console.log('Pending', result)
          orderStore.updateOrderStatus(order.value.id, 'pending')
          isPaying.value = false
        },
        onError: function(result) {
          console.log('Error', result)
          orderStore.updateOrderStatus(order.value.id, 'failed')
          isPaying.value = false
        },
        onClose: function() {
          isPaying.value = false
        }
      })
    } else {
      alert('Token pembayaran tidak ditemukan. Silakan buat pesanan baru.')
      isPaying.value = false
    }
  } catch (error) {
    console.error('Error membuka pembayaran:', error)
    alert('Gagal membuka halaman pembayaran.')
    isPaying.value = false
  }
}

const goBack = () => {
  router.push('/riwayat-pesanan')
}
</script>

<template>
  <div class="detail-page">
    <!-- Header -->
    <div class="detail-header">
      <div class="header-inner">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 class="header-title">Detail Pesanan</h1>
      </div>
    </div>

    <!-- Order not found -->
    <div v-if="!order" class="not-found">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>Pesanan tidak ditemukan</p>
      <button class="btn-back-list" @click="goBack">Kembali ke Riwayat</button>
    </div>

    <!-- Order Detail -->
    <div v-else class="detail-content">
      <!-- Status Banner -->
      <div class="status-banner" :class="getStatusClass(order.status)">
        <div class="status-icon">
          <!-- Success icon -->
          <svg v-if="order.status === 'success'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <!-- Pending icon -->
          <svg v-else-if="order.status === 'pending'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <!-- Failed icon -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div>
          <p class="status-text">{{ getStatusLabel(order.status) }}</p>
          <p class="status-date">{{ formatDate(order.date) }}</p>
        </div>
      </div>

      <!-- Order Info Card -->
      <div class="info-card">
        <h2 class="section-title">Informasi Pesanan</h2>
        <div class="info-row">
          <span class="info-label">ID Pesanan</span>
          <span class="info-value mono">{{ order.id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tanggal Pesan</span>
          <span class="info-value">{{ formatDate(order.date) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="status-badge" :class="getStatusClass(order.status)">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>
      </div>

      <!-- Item List Card -->
      <div class="info-card">
        <h2 class="section-title">Daftar Produk</h2>
        <div class="items-list">
          <div v-for="item in order.items" :key="item.id" class="detail-item">
            <img :src="item.image" :alt="item.title" class="item-img" />
            <div class="item-info">
              <p class="item-name">{{ item.title }}</p>
              <p class="item-price">{{ formatRupiah(item.price) }} × {{ item.qty }}</p>
            </div>
            <p class="item-subtotal">{{ formatRupiah(item.price * item.qty) }}</p>
          </div>
        </div>
      </div>

      <!-- Ringkasan Pembayaran -->
      <div class="info-card summary-card">
        <h2 class="section-title">Ringkasan Pembayaran</h2>
        <div class="summary-rows">
          <div class="summary-row" v-for="item in order.items" :key="item.id">
            <span class="summary-label">{{ item.title.substring(0, 30) }}{{ item.title.length > 30 ? '...' : '' }} (x{{ item.qty }})</span>
            <span class="summary-val">{{ formatRupiah(item.price * item.qty) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total-row">
            <span class="summary-label">Total Pembayaran</span>
            <span class="summary-total">{{ formatRupiah(order.totalPrice) }}</span>
          </div>
        </div>
      </div>

      <!-- Tombol Bayar (hanya untuk pending) -->
      <div v-if="order.status === 'pending'" class="sticky-footer">
        <div class="footer-inner">
          <div>
            <p class="footer-label">Total Tagihan</p>
            <p class="footer-total">{{ formatRupiah(order.totalPrice) }}</p>
          </div>
          <button
            class="btn-bayar-besar"
            @click="handleBayarSekarang"
            :disabled="isPaying"
          >
            <svg v-if="!isPaying" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>{{ isPaying ? 'Memproses...' : 'Bayar Sekarang' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.detail-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 5rem;
}

/* ===== HEADER ===== */
.detail-header {
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
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.03em;
}

/* ===== NOT FOUND ===== */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 1rem;
  text-align: center;
}

.not-found p {
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-back-list {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(234,179,8,0.32);
}

/* ===== CONTENT ===== */
.detail-content {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Status banner */
.status-banner {
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-banner.status-success {
  background-color: #dcfce7;
  color: #166534;
}

.status-banner.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-banner.status-failed {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-icon {
  flex-shrink: 0;
}

.status-text {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.status-date {
  font-size: 0.78rem;
  font-weight: 500;
  opacity: 0.8;
  margin: 0.2rem 0 0;
}

/* Info card */
.info-card {
  background-color: #ffffff;
  border-radius: 1.25rem;
  border: 1.5px solid #f1f5f9;
  padding: 1.25rem 1.5rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.info-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f9fafb;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 0.82rem;
  color: #9ca3af;
  font-weight: 600;
  flex-shrink: 0;
}

.info-value {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  text-align: right;
}

.info-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: #6b7280;
  word-break: break-all;
}

/* Status badge */
.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.status-pending { background-color: #fef3c7; color: #92400e; }
.status-success { background-color: #dcfce7; color: #166534; }
.status-failed  { background-color: #fee2e2; color: #991b1b; }

/* Item list */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.item-img {
  width: 52px;
  height: 52px;
  border-radius: 0.75rem;
  object-fit: cover;
  background-color: #fef9c3;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.item-price {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 600;
  margin: 0.2rem 0 0;
}

.item-subtotal {
  font-size: 0.88rem;
  font-weight: 800;
  color: #111827;
  flex-shrink: 0;
  margin: 0;
}

/* Summary */
.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.summary-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-val {
  font-size: 0.8rem;
  color: #374151;
  font-weight: 700;
}

.summary-divider {
  border-top: 1.5px dashed #e5e7eb;
  margin: 0.25rem 0;
}

.total-row .summary-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}

.summary-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ca8a04;
  letter-spacing: -0.02em;
}

/* ===== STICKY FOOTER BAYAR ===== */
.sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1.5px solid #f1f5f9;
  padding: 1rem 2rem;
  z-index: 50;
  box-shadow: 0 -8px 24px -4px rgba(0,0,0,0.06);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
  margin: 0;
}

.footer-total {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ca8a04;
  margin: 0.1rem 0 0;
  letter-spacing: -0.02em;
}

.btn-bayar-besar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 16px rgba(234,179,8,0.35);
  white-space: nowrap;
}

.btn-bayar-besar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(234,179,8,0.45);
}

.btn-bayar-besar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 576px) {
  .detail-header {
    padding: 1rem 4%;
  }

  .detail-content {
    padding: 1rem 4%;
  }

  .sticky-footer {
    padding: 0.85rem 4%;
  }

  .footer-inner {
    gap: 0.75rem;
  }

  .btn-bayar-besar {
    padding: 0.75rem 1.25rem;
    font-size: 0.88rem;
  }
}
</style>
