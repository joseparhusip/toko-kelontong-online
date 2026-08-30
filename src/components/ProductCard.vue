<script setup>
import { computed, ref, watch } from 'vue'
import { useFilterStore } from '../stores/useFilterStore'
import { useCartStore } from '../stores/useCartStore'

const filterStore = useFilterStore()
const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// Qty produk ini di keranjang. Kalau 0 -> tampilkan tombol "Keranjang".
// Kalau > 0 -> tampilkan kontrol - qty +.
const qty = computed(() => cartStore.getQty(props.product.id))

// Kalau gambar produk gagal dimuat (404/rusak), tampilkan placeholder
// abu-abu polos tanpa ikon/teks broken-image bawaan browser.
const imageError = ref(false)

// Reset status error kalau url gambar produk berubah (misal card di-reuse
// buat produk lain lewat v-for + key yang sama)
watch(
  () => props.product.image,
  () => {
    imageError.value = false
  }
)

const handleImageError = () => {
  imageError.value = true
}

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const handleCategoryClick = (cat) => {
  filterStore.setCategory(cat)
  setTimeout(() => {
    document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}

const handleAddToCart = () => {
  cartStore.addToCart(props.product)
}

const handleIncrement = () => {
  cartStore.increment(props.product.id)
}

const handleDecrement = () => {
  cartStore.decrement(props.product.id)
}
</script>

<template>
  <div class="product-card">
    <div class="product-image-container">
      <img
        v-if="!imageError"
        :src="product.image"
        :alt="product.title"
        class="product-image"
        @error="handleImageError"
      />
      <div v-else class="product-image-placeholder"></div>

      <div class="badge-discount" v-if="product.discount">-{{ product.discount }}%</div>

      <button class="btn-wishlist">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          ></path>
        </svg>
      </button>
    </div>

    <div class="product-info">
      <span
        class="product-category-tag"
        @click.stop="handleCategoryClick(product.category)"
        :title="`Lihat semua ${product.category}`"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
          ></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        {{ product.category }}
      </span>

      <p class="product-unit">{{ product.unit }}</p>
      <h3 class="product-name">{{ product.title }}</h3>

      <div class="product-rating">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="#eab308"
          stroke="#eab308"
          stroke-width="1"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          ></polygon>
        </svg>
        <span class="rating-value">{{ product.rating }}</span>
        <span class="rating-count">({{ product.sold }})</span>
      </div>

      <div class="product-price-row">
        <p class="product-price">{{ formatRupiah(product.price) }}</p>
        <p class="product-price-original" v-if="product.discount">
          {{ formatRupiah(Math.round(product.price / (1 - product.discount / 100))) }}
        </p>
      </div>

      <button class="btn-add" v-if="qty === 0" @click="handleAddToCart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Keranjang
      </button>

      <div class="qty-control" v-else>
        <button class="btn-qty btn-qty-minus" @click="handleDecrement" aria-label="Kurangi jumlah">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span class="qty-value">{{ qty }}</span>
        <button class="btn-qty btn-qty-plus" @click="handleIncrement" aria-label="Tambah jumlah">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.product-card {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #ffffff;
  border-radius: 1.1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  border: 1.5px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 40px -8px rgba(234, 179, 8, 0.18),
    0 8px 16px rgba(0, 0, 0, 0.07);
  border-color: #fde68a;
}

.product-image-container {
  width: 100%;
  height: 145px;
  background: linear-gradient(145deg, #fffbeb, #fef9c3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.6rem;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.07);
}

/* Placeholder abu-abu polos, dipakai kalau gambar produk gagal dimuat */
.product-image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 0.6rem;
  background-color: #e5e7eb;
}

.badge-discount {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.btn-wishlist {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #9ca3af;
  transition:
    color 0.2s,
    transform 0.2s;
  backdrop-filter: blur(4px);
}

.btn-wishlist:hover {
  color: #ef4444;
  transform: scale(1.15);
}

.product-info {
  padding: 0.85rem 0.9rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex-grow: 1;
}

.product-category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #fef9c3;
  color: #ca8a04;
  font-size: 0.63rem;
  font-weight: 700;
  padding: 0.22rem 0.55rem;
  border-radius: 9999px;
  cursor: pointer;
  align-self: flex-start;
  border: 1px solid #fde68a;
  transition: all 0.2s;
  letter-spacing: 0.2px;
}

.product-category-tag:hover {
  background-color: #eab308;
  color: #ffffff;
  border-color: #eab308;
}

.product-unit {
  font-size: 0.65rem;
  color: #9ca3af;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 600;
}

.product-name {
  font-size: 0.83rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.38;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.3em;
  letter-spacing: -0.01em;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-value {
  font-size: 0.7rem;
  font-weight: 700;
  color: #374151;
}

.rating-count {
  font-size: 0.66rem;
  color: #9ca3af;
  font-weight: 400;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.product-price {
  font-size: 0.92rem;
  font-weight: 800;
  color: #ca8a04;
  margin: 0;
  letter-spacing: -0.02em;
}

.product-price-original {
  font-size: 0.68rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin: 0;
  font-weight: 400;
}

.btn-add {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.58rem 0.5rem;
  border-radius: 0.7rem;
  font-size: 0.76rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

.btn-add:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.45);
}

.btn-add:active {
  transform: scale(0.97);
}

/* QTY CONTROL (- qty +) */
.qty-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #eab308, #ca8a04);
  border-radius: 0.7rem;
  margin-top: 0.5rem;
  padding: 0.3rem;
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
}

.btn-qty {
  background-color: rgba(255, 255, 255, 0.25);
  border: none;
  color: #ffffff;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}

.btn-qty:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.btn-qty:active {
  transform: scale(0.9);
}

.qty-value {
  flex: 1;
  text-align: center;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.88rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
}

@media (max-width: 480px) {
  .btn-qty {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }

  .qty-value {
    font-size: 0.8rem;
  }
}
</style>
