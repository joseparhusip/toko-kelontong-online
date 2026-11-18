<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'
import { usePromoSignal } from '../stores/usePromoSignal'
import { useUiStore } from '../stores/useUiStore'
import { formatRupiah } from '../utils/format'
import AppIcon from './ui/AppIcon.vue'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const promoSignal = usePromoSignal()
const ui = useUiStore()
const router = useRouter()

// ============================ PROMO ============================
// Kode harus sama dengan yang dipakai PromoStrip.vue
const promoCodes = [
  { code: 'Toko Kelontong 5', discount: 5 },
  { code: 'Toko Kelontong 10', discount: 10 },
  { code: 'Toko Kelontong 15', discount: 15 },
  { code: 'Toko Kelontong 20', discount: 20 },
  { code: 'Toko Kelontong 25', discount: 25 },
  { code: 'Toko Kelontong 75', discount: 75 },
]

const promoInput = ref('')
const promoError = ref('')
const showCodes = ref(false)
const appliedPromo = ref(null)

const discountAmount = computed(() =>
  appliedPromo.value ? Math.round((cartStore.totalPrice * appliedPromo.value.discount) / 100) : 0,
)
const finalTotal = computed(() => Math.max(cartStore.totalPrice - discountAmount.value, 0))

const applyPromo = (promo) => {
  appliedPromo.value = promo
  promoInput.value = ''
  promoError.value = ''
  showCodes.value = false
}

const applyPromoManual = () => {
  const q = promoInput.value.trim().toLowerCase()
  if (!q) return
  const found = promoCodes.find((p) => p.code.toLowerCase() === q)
  if (found) applyPromo(found)
  else promoError.value = 'Kode tidak dikenal. Pilih dari daftar kode yang tersedia.'
}

const removePromo = () => {
  appliedPromo.value = null
  promoError.value = ''
}

watch(
  () => cartStore.items.length,
  (len) => len === 0 && removePromo(),
)

// Sinyal dari PromoStrip: buka keranjang dan pasang kodenya
watch(
  () => promoSignal.requestedCode,
  (code) => {
    if (!code) return
    const found = promoCodes.find((p) => p.code === code)
    ui.openCart()
    if (found) applyPromo(found)
    promoSignal.clear()
  },
)

// =========================== CHECKOUT ===========================
const isCheckingOut = ref(false)
const checkoutError = ref('')

const handleCheckout = async () => {
  if (!cartStore.items.length || isCheckingOut.value) return
  isCheckingOut.value = true
  checkoutError.value = ''

  try {
    const orderId = 'ORDER-' + Date.now()
    const grossAmount = finalTotal.value

    const itemDetails = cartStore.items.map((item) => ({
      id: item.id.toString(),
      price: item.price,
      quantity: item.qty,
      name: item.title.substring(0, 50),
    }))

    // Diskon sebagai baris negatif supaya total item_details = gross_amount
    if (appliedPromo.value && discountAmount.value > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        price: -discountAmount.value,
        quantity: 1,
        name: `Diskon ${appliedPromo.value.code} (${appliedPromo.value.discount}%)`.substring(0, 50),
      })
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: grossAmount },
        item_details: itemDetails,
      }),
    })
    const data = await response.json()

    if (!data.token) {
      console.error('Gagal dapat token:', data)
      checkoutError.value = 'Pembayaran belum bisa diproses. Coba lagi sebentar lagi.'
      return
    }

    // Simpan order dulu sebelum popup dibuka, supaya bisa dibayar nanti
    orderStore.addOrder({
      id: orderId,
      snapToken: data.token,
      items: cartStore.items.map((item) => ({ ...item })),
      promoCode: appliedPromo.value?.code ?? null,
      discountPercent: appliedPromo.value?.discount ?? 0,
      discountAmount: discountAmount.value,
      totalPrice: grossAmount,
      status: 'pending',
    })

    cartStore.clearCart()
    removePromo()
    ui.closeCart()

    window.snap.pay(data.token, {
      onSuccess: () => orderStore.updateOrderStatus(orderId, 'success'),
      onPending: () => orderStore.updateOrderStatus(orderId, 'pending'),
      onError: () => orderStore.updateOrderStatus(orderId, 'failed'),
      onClose: () => {},
    })
  } catch (error) {
    console.error('Error saat checkout:', error)
    checkoutError.value = 'Koneksi bermasalah. Periksa internet kamu lalu coba lagi.'
  } finally {
    isCheckingOut.value = false
  }
}

const goToRiwayat = () => {
  ui.closeCart()
  router.push('/riwayat-pesanan')
}

// ========================= SCROLL LOCK =========================
const lockScroll = (lock) => {
  const v = lock ? 'hidden' : ''
  document.documentElement.style.overflow = v
  document.body.style.overflow = v
}

const onKeydown = (e) => e.key === 'Escape' && ui.closeCart()

watch(
  () => ui.cartOpen,
  (open) => {
    lockScroll(open)
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
  { immediate: true },
)

onUnmounted(() => {
  lockScroll(false)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="ui.cartOpen" class="scrim" @click="ui.closeCart()" />
    </transition>

    <transition name="slide">
      <aside v-if="ui.cartOpen" class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header class="drawer-head">
          <div>
            <h2 id="cart-title">Keranjang</h2>
            <p v-if="cartStore.totalCount" class="num">{{ cartStore.totalCount }} barang</p>
          </div>
          <button class="icon-btn" aria-label="Tutup keranjang" @click="ui.closeCart()">
            <AppIcon name="x" :size="20" />
          </button>
        </header>

        <!-- Kosong -->
        <div v-if="!cartStore.items.length" class="empty">
          <AppIcon name="bag" :size="28" />
          <h3>Keranjang masih kosong</h3>
          <p>Tambahkan produk dari katalog, nanti muncul di sini.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" @click="ui.closeCart()">Lanjut belanja</button>
            <button class="btn btn-ghost" @click="goToRiwayat">Lihat riwayat pesanan</button>
          </div>
        </div>

        <template v-else>
          <ul class="items">
            <li v-for="item in cartStore.items" :key="item.id" class="item">
              <img :src="item.image" :alt="item.title" class="item-img" loading="lazy" />
              <div class="item-main">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-unit num">{{ formatRupiah(item.price) }}</p>
                <div class="item-row">
                  <div class="stepper">
                    <button aria-label="Kurangi" @click="cartStore.decrement(item.id)">
                      <AppIcon name="minus" :size="14" :stroke="2" />
                    </button>
                    <span class="num">{{ item.qty }}</span>
                    <button aria-label="Tambah" @click="cartStore.increment(item.id)">
                      <AppIcon name="plus" :size="14" :stroke="2" />
                    </button>
                  </div>
                  <button class="remove" @click="cartStore.removeItem(item.id)">Hapus</button>
                </div>
              </div>
              <p class="item-total num">{{ formatRupiah(item.price * item.qty) }}</p>
            </li>
          </ul>

          <footer class="summary">
            <!-- Promo -->
            <div v-if="appliedPromo" class="promo-applied">
              <AppIcon name="tag" :size="16" />
              <div>
                <strong>{{ appliedPromo.code }}</strong>
                <span>Hemat {{ appliedPromo.discount }}%</span>
              </div>
              <button class="remove" @click="removePromo">Lepas</button>
            </div>

            <div v-else class="promo">
              <form class="promo-form" @submit.prevent="applyPromoManual">
                <label for="promo-input" class="sr-only">Kode promo</label>
                <input
                  id="promo-input"
                  v-model="promoInput"
                  class="input"
                  placeholder="Kode promo"
                  autocomplete="off"
                  @input="promoError = ''"
                />
                <button type="submit" class="btn btn-secondary" :disabled="!promoInput.trim()">Pakai</button>
              </form>
              <p v-if="promoError" class="error">{{ promoError }}</p>
              <button class="codes-toggle" :aria-expanded="showCodes" @click="showCodes = !showCodes">
                Kode yang tersedia
                <AppIcon name="chevron-down" :size="16" :class="{ flip: showCodes }" />
              </button>
              <ul v-if="showCodes" class="codes">
                <li v-for="p in promoCodes" :key="p.code">
                  <button @click="applyPromo(p)">
                    <span>{{ p.code }}</span>
                    <span class="num">−{{ p.discount }}%</span>
                  </button>
                </li>
              </ul>
            </div>

            <dl class="totals num">
              <div>
                <dt>Subtotal</dt>
                <dd>{{ formatRupiah(cartStore.totalPrice) }}</dd>
              </div>
              <div v-if="appliedPromo">
                <dt>Diskon {{ appliedPromo.discount }}%</dt>
                <dd class="minus">−{{ formatRupiah(discountAmount) }}</dd>
              </div>
              <div>
                <dt>Ongkir</dt>
                <dd>Gratis</dd>
              </div>
              <div class="grand">
                <dt>Total</dt>
                <dd>{{ formatRupiah(finalTotal) }}</dd>
              </div>
            </dl>

            <p v-if="checkoutError" class="error" role="alert">{{ checkoutError }}</p>

            <button class="btn btn-primary btn-lg btn-block" :disabled="isCheckingOut" @click="handleCheckout">
              {{ isCheckingOut ? 'Memproses…' : 'Bayar sekarang' }}
            </button>
          </footer>
        </template>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(27, 31, 22, 0.4);
  z-index: 200;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(420px, 100%);
  background: var(--surface);
  z-index: 201;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-overlay);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 20px;
  border-bottom: 1px solid var(--line);
}

.drawer-head h2 {
  font-size: 18px;
}

.drawer-head p {
  font-size: 13px;
  color: var(--ink-3);
}

/* Kosong */
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 28px;
  color: var(--ink-3);
}

.empty h3 {
  margin-top: 16px;
  font-size: 17px;
}

.empty p {
  margin-top: 4px;
  color: var(--ink-2);
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

/* Item */
.items {
  flex: 1;
  overflow-y: auto;
  padding: 4px 20px;
}

.item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.item:last-child {
  border-bottom: 0;
}

.item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--surface-2);
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}

.item-unit {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 2px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
}

.stepper {
  display: inline-flex;
  align-items: center;
  height: 30px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
}

.stepper button {
  width: 30px;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--ink-2);
}

.stepper button:hover {
  color: var(--ink);
  background: var(--surface-2);
}

.stepper span {
  min-width: 24px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}

.remove {
  font-size: 13px;
  color: var(--ink-3);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.remove:hover {
  color: var(--danger);
}

/* Ringkasan */
.summary {
  border-top: 1px solid var(--line);
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--surface);
}

.promo-form {
  display: flex;
  gap: 8px;
}

.promo-form .input {
  height: 40px;
}

.codes-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
}

.codes-toggle .flip {
  transform: rotate(180deg);
}

.codes {
  margin-top: 8px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  max-height: 168px;
  overflow-y: auto;
}

.codes li + li {
  border-top: 1px solid var(--line);
}

.codes button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 13px;
  text-align: left;
}

.codes button:hover {
  background: var(--surface-2);
}

.codes button span:last-child {
  font-weight: 600;
  color: var(--sale);
}

.promo-applied {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--brand-soft);
  color: var(--brand-ink);
}

.promo-applied div {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px dashed var(--line-strong);
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
  margin-top: 4px;
  font-size: 17px;
  font-weight: 700;
}

.totals .grand dt {
  color: var(--ink);
}

.error {
  font-size: 13px;
  color: var(--danger);
  margin-top: 6px;
}

/* Transisi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 240ms var(--ease);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
