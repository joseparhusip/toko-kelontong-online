<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import { usePayOrder } from '../composables/usePayOrder'
import { useSectionNav } from '../composables/useSectionNav'
import { formatRupiah, formatDate, ORDER_STATUS } from '../utils/format'
import Navbar from './Navbar.vue'
import AppFooter from './Footer.vue'
import AppIcon from './ui/AppIcon.vue'

const orderStore = useOrderStore()
const { pay, payingId, payError } = usePayOrder()
const { goToSection } = useSectionNav()

const tabs = [
  { key: 'semua', label: 'Semua' },
  { key: 'pending', label: 'Belum dibayar' },
  { key: 'success', label: 'Lunas' },
  { key: 'failed', label: 'Gagal' },
]
const active = ref('semua')

const countOf = (key) =>
  key === 'semua' ? orderStore.orders.length : orderStore.orders.filter((o) => o.status === key).length

const orders = computed(() =>
  active.value === 'semua' ? orderStore.orders : orderStore.orders.filter((o) => o.status === active.value),
)

const itemCount = (o) => o.items.reduce((s, i) => s + i.qty, 0)
</script>

<template>
  <Navbar />

  <main class="page">
    <div class="container narrow">
      <header class="head">
        <h1>Pesanan saya</h1>
        <p v-if="orderStore.pendingOrders.length" class="num">
          {{ orderStore.pendingOrders.length }} pesanan menunggu pembayaran.
        </p>      </header>

      <div class="tabs" role="tablist">
        <button
          v-for="t in tabs"
          :key="t.key"
          role="tab"
          :aria-selected="active === t.key"
          :class="{ on: active === t.key }"
          @click="active = t.key"
        >
          {{ t.label }}
          <span class="num">{{ countOf(t.key) }}</span>
        </button>
      </div>

      <p v-if="payError" class="error" role="alert">{{ payError }}</p>

      <div v-if="!orders.length" class="empty">
        <AppIcon name="receipt" :size="28" />
        <h2>{{ active === 'semua' ? 'Belum ada pesanan' : 'Tidak ada pesanan di sini' }}</h2>
        <p>Pesanan yang kamu buat akan muncul di halaman ini.</p>
        <button class="btn btn-primary" @click="goToSection('katalog-produk')">Mulai belanja</button>
      </div>

      <ul v-else class="list">
        <li v-for="o in orders" :key="o.id" class="order card">
          <RouterLink :to="`/riwayat-pesanan/${o.id}`" class="order-link">
            <div class="order-top">
              <div>
                <p class="date">{{ formatDate(o.date) }}</p>
                <p class="id num">{{ o.id }}</p>
              </div>
              <span class="badge badge-dot" :class="ORDER_STATUS[o.status]?.badge">
                {{ ORDER_STATUS[o.status]?.label ?? o.status }}
              </span>
            </div>

            <div class="order-mid">
              <div class="thumbs">
                <img v-for="i in o.items.slice(0, 4)" :key="i.id" :src="i.image" :alt="i.title" loading="lazy" />
                <span v-if="o.items.length > 4" class="more num">+{{ o.items.length - 4 }}</span>
              </div>
              <p class="summary">
                {{ o.items[0]?.title }}<template v-if="o.items.length > 1"> dan {{ o.items.length - 1 }} lainnya</template>
              </p>
            </div>
          </RouterLink>

          <div class="order-bottom">
            <p class="total num">
              <span>{{ itemCount(o) }} barang</span>
              <strong>{{ formatRupiah(o.totalPrice) }}</strong>
            </p>
            <div class="actions">
              <RouterLink :to="`/riwayat-pesanan/${o.id}`" class="btn btn-ghost btn-sm">Detail</RouterLink>
              <button
                v-if="o.status === 'pending'"
                class="btn btn-primary btn-sm"
                :disabled="payingId === o.id"
                @click="pay(o)"
              >
                {{ payingId === o.id ? 'Membuka…' : 'Bayar' }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.page {
  padding: 32px 0 64px;
}

.narrow {
  max-width: calc(760px + var(--gutter) * 2);
}

.head h1 {
  font-size: 28px;
}

.head p {
  margin-top: 4px;
  color: var(--ink-2);
}

.tabs {
  display: flex;
  gap: 4px;
  margin: 24px calc(var(--gutter) * -1) 20px;
  padding: 0 var(--gutter);
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tabs button span {
  font-size: 12px;
  color: var(--ink-3);
}

.tabs button.on {
  color: var(--ink);
  font-weight: 600;
  border-bottom-color: var(--ink);
}

.error {
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--danger);
}

.empty {
  padding: 48px 0;
  color: var(--ink-3);
}

.empty h2 {
  margin-top: 14px;
  font-size: 18px;
}

.empty p {
  margin: 4px 0 20px;
  color: var(--ink-2);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order {
  overflow: hidden;
}

.order-link {
  display: block;
  padding: 16px 16px 0;
}

.order-link:hover .summary {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.date {
  font-size: 14px;
  font-weight: 600;
}

.id {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 2px;
}

.order-mid {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
}

.thumbs {
  display: flex;
  flex: 0 0 auto;
}

.thumbs img,
.thumbs .more {
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  object-fit: cover;
  background: var(--surface-2);
  border: 2px solid var(--surface);
}

.thumbs img + img,
.thumbs .more {
  margin-left: -12px;
}

.thumbs .more {
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
}

.summary {
  font-size: 14px;
  color: var(--ink-2);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.total {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.total span {
  font-size: 12px;
  color: var(--ink-3);
}

.total strong {
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 6px;
}

@media (min-width: 768px) {
  .page {
    padding-top: 48px;
  }
  .head h1 {
    font-size: 32px;
  }
  .tabs {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }
}
</style>
