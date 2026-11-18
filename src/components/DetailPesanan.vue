<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '../stores/useOrderStore'
import { usePayOrder } from '../composables/usePayOrder'
import { formatRupiah, formatDate, ORDER_STATUS } from '../utils/format'
import Navbar from './Navbar.vue'
import AppFooter from './Footer.vue'
import AppIcon from './ui/AppIcon.vue'

const route = useRoute()
const orderStore = useOrderStore()
const { pay, payingId, payError } = usePayOrder()

const order = computed(() => orderStore.orders.find((o) => o.id === route.params.id))
const subtotal = computed(() => order.value?.items.reduce((s, i) => s + i.price * i.qty, 0) ?? 0)
const status = computed(() => ORDER_STATUS[order.value?.status] ?? { label: order.value?.status, badge: '' })
const statusIcon = computed(
  () => ({ success: 'check-circle', pending: 'clock', failed: 'x-circle' })[order.value?.status] ?? 'alert',
)
</script>

<template>
  <Navbar />

  <main class="page">
    <div class="container narrow">
      <RouterLink to="/riwayat-pesanan" class="back">
        <AppIcon name="arrow-left" :size="16" />
        Pesanan saya
      </RouterLink>

      <div v-if="!order" class="empty">
        <AppIcon name="alert" :size="28" />
        <h1>Pesanan tidak ditemukan</h1>
        <RouterLink to="/riwayat-pesanan" class="btn btn-secondary">Kembali</RouterLink>
      </div>

      <template v-else>
        <header class="head">
          <div>
            <h1>Detail pesanan</h1>
            <p class="num">{{ order.id }}</p>
          </div>
        </header>

        <div class="status" :class="order.status">
          <AppIcon :name="statusIcon" :size="22" />
          <div>
            <p class="status-label">{{ status.label }}</p>
            <p class="status-date">{{ formatDate(order.date, true) }}</p>
          </div>
        </div>

        <section class="card block">
          <h2>Barang</h2>
          <ul class="items">
            <li v-for="item in order.items" :key="item.id">
              <img :src="item.image" :alt="item.title" loading="lazy" />
              <div class="item-main">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-sub num">{{ item.qty }} × {{ formatRupiah(item.price) }}</p>
              </div>
              <p class="item-total num">{{ formatRupiah(item.price * item.qty) }}</p>
            </li>
          </ul>

          <dl class="totals num">
            <div>
              <dt>Subtotal</dt>
              <dd>{{ formatRupiah(subtotal) }}</dd>
            </div>
            <div v-if="order.discountAmount">
              <dt>Promo {{ order.promoCode }}</dt>
              <dd class="minus">−{{ formatRupiah(order.discountAmount) }}</dd>
            </div>
            <div>
              <dt>Ongkir</dt>
              <dd>Gratis</dd>
            </div>
            <div class="grand">
              <dt>Total</dt>
              <dd>{{ formatRupiah(order.totalPrice) }}</dd>
            </div>
          </dl>
        </section>

        <p v-if="payError" class="error" role="alert">{{ payError }}</p>

        <div v-if="order.status === 'pending'" class="paybar">
          <div class="container narrow paybar-inner">
            <div>
              <p class="pay-label">Total tagihan</p>
              <p class="pay-total num">{{ formatRupiah(order.totalPrice) }}</p>
            </div>
            <button class="btn btn-primary btn-lg" :disabled="payingId === order.id" @click="pay(order)">
              {{ payingId === order.id ? 'Membuka…' : 'Bayar sekarang' }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.page {
  padding: 24px 0 120px;
}

.narrow {
  max-width: calc(680px + var(--gutter) * 2);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
}

.back:hover {
  color: var(--ink);
}

.head {
  margin-top: 16px;
}

.head h1 {
  font-size: 28px;
}

.head p {
  margin-top: 2px;
  font-size: 13px;
  color: var(--ink-3);
}

.status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  padding: 14px 16px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  color: var(--ink-2);
}

.status.pending {
  background: var(--warn-soft);
  color: var(--warn);
}

.status.success {
  background: var(--ok-soft);
  color: var(--ok);
}

.status.failed {
  background: var(--danger-soft);
  color: var(--danger);
}

.status-label {
  font-weight: 600;
}

.status-date {
  font-size: 13px;
  color: var(--ink-2);
}

.block {
  padding: 20px;
}

.block h2 {
  font-size: 16px;
  margin-bottom: 4px;
}

.items li {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.items img {
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  object-fit: cover;
  background: var(--surface-2);
}

.item-title {
  font-size: 14px;
  font-weight: 600;
}

.item-sub {
  font-size: 13px;
  color: var(--ink-3);
}

.item-total {
  font-size: 14px;
  font-weight: 600;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 14px;
  font-size: 14px;
}

.totals div {
  display: flex;
  justify-content: space-between;
}

.totals dt {
  color: var(--ink-2);
}

.totals .minus {
  color: var(--sale);
}

.totals .grand {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed var(--line-strong);
  font-size: 17px;
  font-weight: 700;
}

.totals .grand dt {
  color: var(--ink);
}

.error {
  margin-top: 12px;
  font-size: 14px;
  color: var(--danger);
}

.empty {
  padding: 48px 0;
  color: var(--ink-3);
}

.empty h1 {
  margin: 14px 0 20px;
  font-size: 20px;
}

.paybar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
}

.paybar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pay-label {
  font-size: 12px;
  color: var(--ink-3);
}

.pay-total {
  font-size: 18px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .page {
    padding-top: 40px;
  }
  .head h1 {
    font-size: 32px;
  }
}
</style>
