<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { useUiStore } from '../stores/useUiStore'
import { useCartStore } from '../stores/useCartStore'
import { fetchProductDetail } from '../services/productApi'
import { DESCRIPTIONS, STORAGE_DEFAULT } from '../data/descriptions'
import { formatRupiah, originalPrice, formatSold } from '../utils/format'
import AppIcon from './ui/AppIcon.vue'

const props = defineProps({
  products: { type: Array, default: () => [] },
})

const ui = useUiStore()
const cartStore = useCartStore()

const product = computed(() => ui.detailProduct)
const inCart = computed(() => (product.value ? cartStore.getQty(product.value.id) : 0))
const copy = computed(() => (product.value ? DESCRIPTIONS[product.value.id] : null))
const storage = computed(() => copy.value?.storage || STORAGE_DEFAULT[product.value?.category])
const saving = computed(() =>
  product.value?.discount ? originalPrice(product.value.price, product.value.discount) - product.value.price : 0,
)

const similar = computed(() =>
  product.value
    ? props.products.filter((p) => p.category === product.value.category && p.id !== product.value.id).slice(0, 6)
    : [],
)

// Jumlah yang akan ditambahkan (dipakai kalau produk belum di keranjang)
const qty = ref(1)
const info = ref(null)
const infoLoading = ref(false)
const showAllIngredients = ref(false)
const imageError = ref(false)
const justAdded = ref(false)
const dialog = ref(null)
const scroller = ref(null)

const specs = computed(() => {
  const p = product.value
  if (!p) return []
  return [
    p.brand && ['Merek', p.brand],
    ['Kategori', p.category],
    ['Satuan jual', p.unit],
    info.value?.quantity && ['Isi per kemasan', info.value.quantity],
    p.barcode && ['Barcode', p.barcode],
  ].filter(Boolean)
})

const addToCart = () => {
  for (let i = 0; i < qty.value; i++) cartStore.addToCart(product.value)
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1600)
}

const loadInfo = async (p) => {
  info.value = null
  if (!p?.barcode) return
  infoLoading.value = true
  const result = await fetchProductDetail(p.barcode)
  if (ui.detailProduct?.id === p.id) info.value = result
  infoLoading.value = false
}

// ---- buka / tutup ----
const lockScroll = (lock) => {
  const v = lock ? 'hidden' : ''
  document.documentElement.style.overflow = v
  document.body.style.overflow = v
}
const onKeydown = (e) => e.key === 'Escape' && ui.closeDetail()

watch(product, async (p, prev) => {
  if (p) {
    qty.value = 1
    showAllIngredients.value = false
    imageError.value = false
    justAdded.value = false
    loadInfo(p)
    await nextTick()
    dialog.value?.scrollTo({ top: 0 })
    scroller.value?.scrollTo({ top: 0 })
  }
  if (!!p !== !!prev) {
    // Jangan lepas kunci scroll kalau detail ditutup karena keranjang dibuka
    lockScroll(!!p || ui.cartOpen)
    if (p) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  lockScroll(false)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="product" class="scrim" @click="ui.closeDetail()" />
    </transition>

    <transition name="pop">
      <div v-if="product" ref="dialog" class="dialog" role="dialog" aria-modal="true" :aria-label="product.title">
        <div class="close-wrap">
          <button class="close" aria-label="Tutup" @click="ui.closeDetail()">
            <AppIcon name="x" :size="20" />
          </button>
        </div>

        <!-- ============ Foto ============ -->
        <div class="media">
          <img v-if="!imageError" :src="product.image" :alt="product.title" @error="imageError = true" />
          <AppIcon v-else name="image" :size="44" :stroke="1.25" class="ph" />
          <span v-if="product.discount" class="badge badge-sale off num">−{{ product.discount }}%</span>
        </div>

        <!-- ============ Info ============ -->
        <div class="panel">
          <div ref="scroller" class="scroll">
            <p class="crumbs">
              <span>{{ product.category }}</span>
              <template v-if="product.brand">
                <AppIcon name="chevron-right" :size="12" />
                <span class="brand">{{ product.brand }}</span>
              </template>
            </p>

            <h2 class="title">{{ product.title }}</h2>

            <div class="meta num">
              <span class="rating">
                <AppIcon name="star" :size="14" :stroke="0" class="star" />
                <strong>{{ product.rating.toFixed(1) }}</strong>
              </span>
              <span class="sep" />
              <span>{{ formatSold(product.sold) }} terjual</span>
              <template v-if="info?.halal">
                <span class="sep" />
                <span class="halal"><AppIcon name="check-circle" :size="14" /> Halal</span>
              </template>
            </div>

            <!-- Harga -->
            <div class="price-box num">
              <div class="price-row">
                <strong class="price" :class="{ sale: product.discount }">{{ formatRupiah(product.price) }}</strong>
                <span class="per">/ {{ product.unit }}</span>
              </div>
              <div v-if="product.discount" class="was">
                <s>{{ formatRupiah(originalPrice(product.price, product.discount)) }}</s>
                <span class="save">Hemat {{ formatRupiah(saving) }}</span>
              </div>
            </div>

            <!-- Cocok untuk -->
            <div v-if="copy?.uses?.length" class="uses">
              <span class="uses-label">Cocok untuk</span>
              <ul>
                <li v-for="u in copy.uses" :key="u">{{ u }}</li>
              </ul>
            </div>

            <!-- Deskripsi -->
            <section v-if="copy?.desc" class="block">
              <h3>Deskripsi</h3>
              <p class="body">{{ copy.desc }}</p>
            </section>

            <!-- Detail -->
            <section class="block">
              <h3>Detail produk</h3>
              <dl class="specs">
                <div v-for="[k, v] in specs" :key="k">
                  <dt>{{ k }}</dt>
                  <dd :class="{ num: k === 'Barcode' }">{{ v }}</dd>
                </div>
              </dl>
            </section>

            <!-- Komposisi (Open Food Facts) -->
            <section v-if="infoLoading" class="block" aria-busy="true">
              <div class="skeleton" style="height: 14px; width: 30%; margin-bottom: 12px" />
              <div class="skeleton" style="height: 12px; width: 100%; margin-bottom: 6px" />
              <div class="skeleton" style="height: 12px; width: 75%" />
            </section>
            <section v-else-if="info?.ingredients" class="block">
              <h3>Komposisi</h3>
              <p class="body small" :class="{ clamp: !showAllIngredients }">{{ info.ingredients }}</p>
              <button
                v-if="info.ingredients.length > 160"
                class="more"
                @click="showAllIngredients = !showAllIngredients"
              >
                {{ showAllIngredients ? 'Tutup' : 'Baca selengkapnya' }}
              </button>
            </section>

            <!-- Cara simpan -->
            <section v-if="storage" class="block">
              <h3>Cara simpan</h3>
              <p class="body">{{ storage }}</p>
            </section>

            <!-- Pengiriman -->
            <ul class="perks">
              <li><AppIcon name="truck" :size="18" /> <span><strong>Ongkir gratis</strong> untuk semua pesanan</span></li>
              <li><AppIcon name="clock" :size="18" /> <span><strong>Sampai 1–3 jam</strong> untuk dalam kota</span></li>
            </ul>

            <!-- Produk serupa -->
            <section v-if="similar.length" class="block similar">
              <h3>Produk lain di {{ product.category }}</h3>
              <ul>
                <li v-for="s in similar" :key="s.id">
                  <button class="mini" @click="ui.openDetail(s)">
                    <span class="mini-media"><img :src="s.image" :alt="s.title" loading="lazy" /></span>
                    <span class="mini-title">{{ s.title }}</span>
                    <span class="mini-price num" :class="{ sale: s.discount }">{{ formatRupiah(s.price) }}</span>
                  </button>
                </li>
              </ul>
            </section>
          </div>

          <!-- ============ Bar beli ============ -->
          <div class="buybar">
            <div v-if="!inCart" class="buy">
              <div class="qty">
                <button aria-label="Kurangi" :disabled="qty <= 1" @click="qty--">
                  <AppIcon name="minus" :size="16" :stroke="2" />
                </button>
                <span class="num" aria-live="polite">{{ qty }}</span>
                <button aria-label="Tambah" @click="qty++">
                  <AppIcon name="plus" :size="16" :stroke="2" />
                </button>
              </div>
              <button class="btn btn-primary btn-lg grow" @click="addToCart">
                <span>Tambah<span class="long"> ke keranjang</span></span>
                <span class="btn-total num">{{ formatRupiah(product.price * qty) }}</span>
              </button>
            </div>

            <div v-else class="buy">
              <div class="qty in">
                <button aria-label="Kurangi" @click="cartStore.decrement(product.id)">
                  <AppIcon name="minus" :size="16" :stroke="2" />
                </button>
                <span class="num" aria-live="polite">{{ inCart }}</span>
                <button aria-label="Tambah" @click="cartStore.increment(product.id)">
                  <AppIcon name="plus" :size="16" :stroke="2" />
                </button>
              </div>
              <button class="btn btn-secondary btn-lg grow" @click="ui.openCart()">
                <AppIcon :name="justAdded ? 'check' : 'bag'" :size="18" />
                {{ justAdded ? 'Masuk keranjang' : 'Lihat keranjang' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(16, 32, 16, 0.5);
}

/* ======================= HP: bottom sheet ======================= */
.dialog {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 151;
  height: 92vh;
  height: 92dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  box-shadow: var(--shadow-overlay);
}

.close-wrap {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 0;
  display: flex;
  justify-content: flex-end;
}

.close {
  margin: 12px 12px 0 0;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--line);
  color: var(--ink-2);
  box-shadow: 0 2px 8px rgba(16, 32, 16, 0.08);
}

.close:hover {
  color: var(--ink);
}

.media {
  position: relative;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  padding: 28px;
  background: var(--surface-2);
  container-type: inline-size;
}

.media img {
  max-width: 100%;
  max-height: calc(75cqw - 56px);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(16, 32, 16, 0.08), 0 12px 32px rgba(16, 32, 16, 0.12);
}

.ph {
  color: var(--line-strong);
}

.off {
  position: absolute;
  top: 16px;
  left: 16px;
  height: 26px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 700;
}

.panel {
  display: flex;
  flex-direction: column;
}

.scroll {
  padding: 20px 20px 8px;
}

/* Judul */
.crumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--ink-3);
}

.brand {
  font-weight: 600;
  color: var(--brand);
}

.title {
  margin-top: 6px;
  font-size: 22px;
  line-height: 1.2;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
  color: var(--ink-2);
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ink);
}

.star {
  fill: var(--accent-strong);
}

.sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line-strong);
}

.halal {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: var(--ok);
}

/* Harga */
.price-box {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface-2);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.price.sale {
  color: var(--sale);
}

.per {
  font-size: 14px;
  color: var(--ink-3);
}

.was {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
}

.was s {
  color: var(--ink-3);
}

.save {
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--sale-soft);
  color: var(--sale);
  font-weight: 600;
}

/* Cocok untuk */
.uses {
  margin-top: 16px;
}

.uses-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-3);
}

.uses ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.uses li {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand-ink);
  font-size: 13px;
  font-weight: 500;
}

/* Blok konten */
.block {
  margin-top: 24px;
}

.block h3 {
  font-size: 15px;
  margin-bottom: 8px;
}

.body {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-2);
}

.body.small {
  font-size: 13px;
  white-space: pre-line;
}

.body.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
}

.specs {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.specs div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  padding: 10px 14px;
  font-size: 14px;
}

.specs div + div {
  border-top: 1px solid var(--line);
}

.specs dt {
  color: var(--ink-3);
}

.specs dd {
  font-weight: 500;
  overflow-wrap: anywhere;
}

/* Pengiriman */
.perks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px dashed var(--line-strong);
  font-size: 13px;
  color: var(--ink-2);
}

.perks li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.perks svg {
  flex: 0 0 auto;
  color: var(--brand);
}

.perks strong {
  color: var(--ink);
}

/* Produk serupa */
.similar ul {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 128px;
  gap: 10px;
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px 4px;
  scrollbar-width: none;
}

.similar ul::-webkit-scrollbar {
  display: none;
}

.mini {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.mini-media {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 10px;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px solid transparent;
  transition: border-color var(--dur) var(--ease);
  container-type: inline-size;
}

.mini:hover .mini-media {
  border-color: var(--line-strong);
}

.mini-media img {
  max-width: 100%;
  max-height: calc(100cqw - 20px);
  border-radius: 6px;
}

.mini-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-price {
  font-size: 13px;
  font-weight: 600;
}

.mini-price.sale {
  color: var(--sale);
}

/* Bar beli */
.buybar {
  position: sticky;
  bottom: 0;
  z-index: 4;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: var(--surface);
  border-top: 1px solid var(--line);
}

.buy {
  display: flex;
  gap: 10px;
}

.grow {
  flex: 1;
  min-width: 0;
}

.btn-total {
  padding-left: 10px;
  margin-left: 2px;
  border-left: 1px solid rgba(255, 255, 255, 0.35);
}

.qty {
  display: inline-flex;
  align-items: center;
  height: 48px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
}

.qty.in {
  border-color: var(--brand);
  background: var(--brand-soft);
}

.qty button {
  width: 40px;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--ink-2);
  border-radius: var(--r-md);
}

.qty button:hover:not(:disabled) {
  background: var(--surface-2);
  color: var(--ink);
}

.qty button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty span {
  min-width: 26px;
  text-align: center;
  font-weight: 700;
}

@media (max-width: 479px) {
  .long {
    display: none;
  }
}

/* ===================== Desktop: dialog 2 kolom ===================== */
@media (min-width: 880px) {
  .dialog {
    left: 50%;
    top: 50%;
    right: auto;
    bottom: auto;
    width: min(1040px, calc(100vw - 64px));
    height: min(680px, calc(100vh - 64px));
    transform: translate(-50%, -50%);
    border-radius: 20px;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }
  .close-wrap {
    position: absolute;
    top: 0;
    right: 0;
  }
  .close {
    margin: 16px 16px 0 0;
  }
  .media {
    aspect-ratio: auto;
    height: 100%;
    padding: 48px;
    container-type: size;
  }
  .media img {
    max-height: calc(100cqh - 96px);
  }
  .off {
    top: 20px;
    left: 20px;
  }
  .panel {
    min-height: 0;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 32px 32px 16px;
  }
  .title {
    font-size: 26px;
    padding-right: 48px;
  }
  .similar ul {
    margin: 0 -32px;
    padding: 0 32px 4px;
  }
  .buybar {
    position: static;
    padding: 16px 32px 20px;
  }
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
.pop-enter-active,
.pop-leave-active {
  transition: opacity 220ms var(--ease), transform 260ms var(--ease);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

@media (min-width: 880px) {
  .pop-enter-from,
  .pop-leave-to {
    transform: translate(-50%, calc(-50% + 16px));
  }
}
</style>
