<script setup>
import { computed, ref, watch } from 'vue'
import { useCartStore } from '../stores/useCartStore'
import { useUiStore } from '../stores/useUiStore'
import { formatRupiah, originalPrice, formatSold } from '../utils/format'
import AppIcon from './ui/AppIcon.vue'

const props = defineProps({
  product: { type: Object, required: true },
})

const cartStore = useCartStore()
const ui = useUiStore()
const qty = computed(() => cartStore.getQty(props.product.id))

// Kalau foto gagal dimuat, tampilkan placeholder netral (bukan ikon rusak bawaan browser)
const imageError = ref(false)
watch(
  () => props.product.image,
  () => (imageError.value = false),
)
</script>

<template>
  <article class="product">
    <!-- Seluruh kartu bisa diklik untuk membuka detail; tombol keranjang di atasnya -->
    <button class="hit" :aria-label="`Lihat detail ${product.title}`" @click="ui.openDetail(product)" />

    <div class="media">
      <img
        v-if="!imageError"
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        decoding="async"
        @error="imageError = true"
      />
      <div v-else class="placeholder">
        <AppIcon name="image" :size="28" :stroke="1.5" />
      </div>
      <span v-if="product.discount" class="badge badge-sale off num">−{{ product.discount }}%</span>
      <span class="unit">{{ product.unit }}</span>
    </div>

    <div class="body">
      <p v-if="product.brand" class="brand">{{ product.brand }}</p>
      <h3 class="title">{{ product.title }}</h3>

      <p class="stats num">
        <AppIcon name="star" :size="12" :stroke="0" class="star" />
        {{ product.rating.toFixed(1) }}
        <span>· {{ formatSold(product.sold) }} terjual</span>
      </p>

      <div class="price num">
        <strong :class="{ sale: product.discount }">{{ formatRupiah(product.price) }}</strong>
        <s v-if="product.discount">{{ formatRupiah(originalPrice(product.price, product.discount)) }}</s>
      </div>

      <button v-if="!qty" class="btn btn-sm add" @click="cartStore.addToCart(product)">
        <AppIcon name="plus" :size="16" :stroke="2" />
        Tambah
      </button>

      <div v-else class="stepper" role="group" :aria-label="`Jumlah ${product.title}`">
        <button aria-label="Kurangi" @click="cartStore.decrement(product.id)">
          <AppIcon name="minus" :size="16" :stroke="2" />
        </button>
        <span class="qty num" aria-live="polite">
          {{ qty }}<span class="sr-only"> di keranjang</span>
        </span>
        <button aria-label="Tambah" @click="cartStore.increment(product.id)">
          <AppIcon name="plus" :size="16" :stroke="2" />
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.product:hover {
  border-color: var(--line-strong);
  box-shadow: 0 8px 24px rgba(16, 32, 16, 0.08);
}

.hit {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.hit:focus-visible {
  outline-offset: 2px;
}

/* Wadah foto: foto ditampilkan utuh (tidak di-crop) di atas latar lembut */
.media {
  position: relative;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  background: var(--surface-2);
  overflow: hidden;
  container-type: inline-size;
}

.media img {
  max-width: 100%;
  max-height: calc(100cqw - 28px);
  width: auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(16, 32, 16, 0.1), 0 4px 12px rgba(16, 32, 16, 0.08);
}

.placeholder {
  display: grid;
  place-items: center;
  color: var(--line-strong);
}

.off {
  position: absolute;
  top: 8px;
  left: 8px;
  height: 22px;
  padding: 0 7px;
  font-size: 12px;
  font-weight: 700;
}

.unit {
  position: absolute;
  left: 8px;
  bottom: 8px;
  height: 22px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
}

.body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px 4px 2px;
}

.brand {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  margin-top: 1px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}

.stats {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
}

.stats span {
  font-weight: 400;
  color: var(--ink-3);
}

.star {
  fill: var(--accent-strong);
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 8px;
  margin-top: 6px;
  margin-bottom: 12px;
}

.price strong {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.price strong.sale {
  color: var(--sale);
}

.price s {
  font-size: 12px;
  color: var(--ink-3);
}

.add,
.stepper {
  position: relative;
  z-index: 2;
  margin-top: auto;
  width: 100%;
  height: 38px;
  border-radius: 10px;
}

.add {
  background: var(--brand-soft);
  color: var(--brand-ink);
}

.add:hover {
  background: var(--brand);
  color: #fff;
}

/* Stepper simetris: [−] angka [+] — dua tombol sama besar, angka tepat di tengah */
.stepper {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  padding: 3px;
  background: var(--brand);
  color: #fff;
}

.stepper button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: #fff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  transition: background-color var(--dur) var(--ease);
}

.stepper button:hover {
  background: rgba(255, 255, 255, 0.26);
}

.stepper .qty {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

@media (max-width: 639px) {
  .media {
    padding: 8px;
  }
  .media img {
    max-height: calc(100cqw - 16px);
  }
}
</style>
