<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import { useFilterStore } from '../stores/useFilterStore'

const filterStore = useFilterStore()

const allProducts = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const ITEMS_PER_LOAD = 15
const visibleCount = ref(ITEMS_PER_LOAD)

const sembakoData = [
  { id: 1,  title: 'Beras Premium Pandan Wangi',   category: 'Sembako',        unit: 'per 5 kg',       price: 68000,  discount: 10, rating: '4.9', sold: '2.4rb', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
  { id: 2,  title: 'Minyak Goreng Tropical',        category: 'Sembako',        unit: 'per 2 liter',    price: 32000,  discount: 15, rating: '4.7', sold: '1.8rb', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
  { id: 3,  title: 'Gula Pasir Putih Kristal',      category: 'Sembako',        unit: 'per 1 kg',       price: 14500,  discount: 0,  rating: '4.8', sold: '3.1rb', image: 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?w=400&q=80' },
  { id: 4,  title: 'Tepung Terigu Serbaguna',       category: 'Sembako',        unit: 'per 1 kg',       price: 12000,  discount: 5,  rating: '4.6', sold: '980',   image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
  { id: 5,  title: 'Garam Dapur Halus',             category: 'Bumbu Dapur',    unit: 'per 500 gr',     price: 4500,   discount: 0,  rating: '4.5', sold: '2.0rb', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
  { id: 6,  title: 'Mie Instan Goreng Spesial',     category: 'Makanan Ringan', unit: 'per 5 pcs',      price: 17500,  discount: 12, rating: '4.9', sold: '5.6rb', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80' },
  { id: 7,  title: 'Telur Ayam Kampung Segar',      category: 'Sembako',        unit: 'per 1 kg',       price: 28000,  discount: 0,  rating: '4.8', sold: '4.2rb', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80' },
  { id: 8,  title: 'Kecap Manis Sedap',             category: 'Bumbu Dapur',    unit: 'per 275 ml',     price: 9500,   discount: 8,  rating: '4.7', sold: '1.5rb', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
  { id: 9,  title: 'Susu UHT Full Cream',           category: 'Minuman',        unit: 'per 1 liter',    price: 18500,  discount: 0,  rating: '4.9', sold: '3.3rb', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80' },
  { id: 10, title: 'Sabun Cuci Piring Sunlight',    category: 'Kebersihan',     unit: 'per 400 ml',     price: 11000,  discount: 10, rating: '4.6', sold: '2.7rb', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80' },
  { id: 11, title: 'Bawang Merah Segar',            category: 'Bumbu Dapur',    unit: 'per 500 gr',     price: 15000,  discount: 0,  rating: '4.7', sold: '1.9rb', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80' },
  { id: 12, title: 'Bawang Putih Lokal',            category: 'Bumbu Dapur',    unit: 'per 250 gr',     price: 9000,   discount: 0,  rating: '4.6', sold: '2.1rb', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80' },
  { id: 13, title: 'Cabai Merah Keriting',          category: 'Bumbu Dapur',    unit: 'per 250 gr',     price: 13000,  discount: 0,  rating: '4.5', sold: '1.4rb', image: 'https://images.unsplash.com/photo-1534671557573-a8e6e9a8d54b?w=400&q=80' },
  { id: 14, title: 'Santan Kara Kelapa',            category: 'Bumbu Dapur',    unit: 'per 200 ml',     price: 7500,   discount: 5,  rating: '4.8', sold: '1.6rb', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=400&q=80' },
  { id: 15, title: 'Kopi Kapal Api Bubuk',          category: 'Minuman',        unit: 'per 165 gr',     price: 16000,  discount: 0,  rating: '4.9', sold: '6.2rb', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80' },
  { id: 16, title: 'Teh Celup Sosro',               category: 'Minuman',        unit: 'per 25 pcs',     price: 8500,   discount: 0,  rating: '4.7', sold: '2.8rb', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80' },
  { id: 17, title: 'Sardines Saus Tomat ABC',       category: 'Makanan Ringan', unit: 'per 425 gr',     price: 21000,  discount: 15, rating: '4.6', sold: '1.1rb', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&q=80' },
  { id: 18, title: 'Deterjen Rinso Anti Noda',      category: 'Kebersihan',     unit: 'per 900 gr',     price: 27000,  discount: 10, rating: '4.8', sold: '3.9rb', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: 19, title: 'Kentang Segar Pilihan',         category: 'Sembako',        unit: 'per 1 kg',       price: 16000,  discount: 0,  rating: '4.6', sold: '890',   image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80' },
  { id: 20, title: 'Wortel Segar Premium',          category: 'Sembako',        unit: 'per 500 gr',     price: 8000,   discount: 0,  rating: '4.7', sold: '1.3rb', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80' },
  { id: 21, title: 'Tahu Putih Segar',              category: 'Sembako',        unit: 'per 5 pcs',      price: 7000,   discount: 0,  rating: '4.5', sold: '3.5rb', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80' },
  { id: 22, title: 'Tempe Kedelai Premium',         category: 'Sembako',        unit: 'per papan',      price: 6000,   discount: 0,  rating: '4.8', sold: '4.1rb', image: 'https://images.unsplash.com/photo-1584278860421-8886198d2a82?w=400&q=80' },
  { id: 23, title: 'Susu Kental Manis Frisian',     category: 'Minuman',        unit: 'per 385 gr',     price: 14500,  discount: 8,  rating: '4.7', sold: '2.2rb', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
  { id: 24, title: 'Madu Murni Hutan',              category: 'Minuman',        unit: 'per 300 ml',     price: 55000,  discount: 12, rating: '4.9', sold: '760',   image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80' },
  { id: 25, title: 'Indomie Kuah Ayam Bawang',      category: 'Makanan Ringan', unit: 'per 5 pcs',      price: 15000,  discount: 0,  rating: '4.9', sold: '8.1rb', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80' },
  { id: 26, title: 'Saus Sambal ABC Pedas',         category: 'Bumbu Dapur',    unit: 'per 135 ml',     price: 8500,   discount: 0,  rating: '4.8', sold: '3.7rb', image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80' },
  { id: 27, title: 'Ayam Broiler Segar',            category: 'Sembako',        unit: 'per ekor ~1 kg', price: 33000,  discount: 0,  rating: '4.6', sold: '2.9rb', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80' },
  { id: 28, title: 'Ikan Bandeng Segar',            category: 'Sembako',        unit: 'per 500 gr',     price: 22000,  discount: 0,  rating: '4.5', sold: '1.2rb', image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80' },
  { id: 29, title: 'Pisang Cavendish Manis',        category: 'Sembako',        unit: 'per sisir',      price: 18000,  discount: 0,  rating: '4.7', sold: '2.4rb', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80' },
  { id: 30, title: 'Tomat Segar Merah',             category: 'Sembako',        unit: 'per 500 gr',     price: 9000,   discount: 0,  rating: '4.6', sold: '1.8rb', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80' },
  { id: 31, title: 'Pampers Bayi Newborn',          category: 'Kebutuhan Bayi', unit: 'per 20 pcs',     price: 65000,  discount: 8,  rating: '4.8', sold: '1.3rb', image: 'https://images.unsplash.com/photo-1590003986882-d25a0e74c4e3?w=400&q=80' },
  { id: 32, title: 'Bedak Bayi Johnson',            category: 'Kebutuhan Bayi', unit: 'per 100 gr',     price: 22000,  discount: 0,  rating: '4.7', sold: '980',   image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80' },
  { id: 33, title: 'Sabun Mandi Bayi Cair',         category: 'Kebutuhan Bayi', unit: 'per 200 ml',     price: 28000,  discount: 5,  rating: '4.9', sold: '760',   image: 'https://images.unsplash.com/photo-1627384113710-424c9181ebbb?w=400&q=80' },
  { id: 34, title: 'Keripik Singkong Pedas',        category: 'Makanan Ringan', unit: 'per 200 gr',     price: 12000,  discount: 0,  rating: '4.6', sold: '2.5rb', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80' },
  { id: 35, title: 'Sabun Lifebuoy Batang',         category: 'Kebersihan',     unit: 'per 3 pcs',      price: 13500,  discount: 0,  rating: '4.7', sold: '3.2rb', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80' },
]

const filteredProducts = computed(() => {
  let result = allProducts.value

  if (filterStore.activeCategory) {
    result = result.filter(p => p.category === filterStore.activeCategory)
  }

  if (filterStore.searchQuery.trim()) {
    const q = filterStore.searchQuery.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  return result
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredProducts.value.length)

watch([() => filterStore.activeCategory, () => filterStore.searchQuery], () => {
  visibleCount.value = ITEMS_PER_LOAD
})

const fetchProducts = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  allProducts.value = sembakoData
  loading.value = false
}

const loadMore = async () => {
  loadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 400))
  visibleCount.value += ITEMS_PER_LOAD
  loadingMore.value = false
}

onMounted(() => fetchProducts())
</script>

<template>
  <section class="products-section" id="katalog-produk">
    <div class="section-header">
      <div class="header-label">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>Produk Segar & Terpercaya</span>
      </div>
      <h2>Katalog Sembako</h2>
      <p class="section-sub">Kebutuhan dapur lengkap, harga terjangkau, langsung ke pintu rumahmu</p>
    </div>

    <!-- SEARCH BAR -->
    <div class="search-wrapper">
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          v-model="filterStore.searchQuery"
          placeholder="Cari produk atau kategori... (contoh: beras, minuman)"
          class="search-input"
        />
        <button v-if="filterStore.searchQuery" class="btn-clear-search" @click="filterStore.clearAll()">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="active-filter-info" v-if="filterStore.activeCategory || filterStore.searchQuery">
        <span v-if="filterStore.activeCategory">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          Kategori: <strong>{{ filterStore.activeCategory }}</strong>
        </span>
        <span v-if="filterStore.searchQuery">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Kata kunci: <strong>"{{ filterStore.searchQuery }}"</strong>
        </span>
        <span class="result-count">{{ filteredProducts.length }} produk ditemukan</span>
        <button class="btn-reset-filter" @click="filterStore.clearAll()">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Reset Filter
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="state-container">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <p>Memuat produk...</p>
    </div>

    <div v-else>
      <!-- EMPTY STATE -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3>Maaf, Produk Tidak Tersedia</h3>
        <p>
          Produk
          <strong v-if="filterStore.searchQuery">"{{ filterStore.searchQuery }}"</strong>
          <strong v-if="filterStore.activeCategory"> di kategori {{ filterStore.activeCategory }}</strong>
          tidak ditemukan.
        </p>
        <button class="btn-reset-empty" @click="filterStore.clearAll()">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 .49-4.95"></path>
          </svg>
          Tampilkan Semua Produk
        </button>
      </div>

      <!-- GRID PRODUK -->
      <div v-else class="products-grid">
        <ProductCard
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore && filteredProducts.length > 0" class="load-more-wrapper">
        <button class="btn-load-more" @click="loadMore" :disabled="loadingMore">
          <svg v-if="loadingMore" class="spinner-sm" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          {{ loadingMore ? 'Memuat...' : `Lihat Lebih Banyak (${filteredProducts.length - visibleCount} produk lagi)` }}
        </button>
      </div>

      <p v-else-if="filteredProducts.length > 0" class="all-loaded">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Semua produk sudah ditampilkan
      </p>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.products-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 4.5rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #fef9c3;
  color: #92400e;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.38rem 1rem;
  border-radius: 9999px;
  margin-bottom: 0.85rem;
  letter-spacing: 0.3px;
}

.products-section h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
}

.section-sub {
  font-size: 0.98rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* SEARCH */
.search-wrapper {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 540px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.88rem 3rem 0.88rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #111827;
  outline: none;
  transition: all 0.25s;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #eab308;
  box-shadow: 0 0 0 4px rgba(234,179,8,0.12);
}

.search-input::placeholder {
  color: #9ca3af;
  font-size: 0.87rem;
}

.btn-clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  padding: 0;
}

.btn-clear-search:hover { color: #ef4444; }

.active-filter-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: #6b7280;
  flex-wrap: wrap;
  justify-content: center;
  font-weight: 500;
}

.active-filter-info span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #fef9c3;
  color: #ca8a04;
  padding: 0.22rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid #fde68a;
  font-weight: 600;
}

.result-count {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
  border-color: #e5e7eb !important;
}

.btn-reset-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: 1px solid #fca5a5;
  color: #ef4444;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 0.22rem 0.65rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset-filter:hover {
  background-color: #fef2f2;
}

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  gap: 0.85rem;
}

.empty-icon {
  width: 90px;
  height: 90px;
  background-color: #f9fafb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e5e7eb;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.empty-state p {
  color: #6b7280;
  font-size: 0.92rem;
  margin: 0;
}

.btn-reset-empty {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: white;
  border: none;
  padding: 0.78rem 1.75rem;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(234,179,8,0.35);
}

.btn-reset-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(234,179,8,0.42);
}

/* GRID */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #6b7280;
  gap: 0.75rem;
  font-weight: 500;
}

.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #ca8a04;
  border: 2px solid #eab308;
  padding: 0.82rem 2.5rem;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-load-more:hover:not(:disabled) {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(234,179,8,0.32);
}

.btn-load-more:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.all-loaded {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #9ca3af;
  font-size: 0.83rem;
  margin-top: 2.5rem;
  font-weight: 600;
}

.spinner { animation: spin 1s linear infinite; }
.spinner-sm { animation: spin 0.8s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* ===== TABLET ===== */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-section {
    padding: 3.5rem 5%;
  }

  .products-section h2 {
    font-size: 1.9rem;
  }
}

/* ===== SMALL TABLET ===== */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem;
  }

  .search-input {
    font-size: 0.85rem;
    padding: 0.8rem 2.75rem 0.8rem 2.5rem;
  }

  .active-filter-info {
    font-size: 0.72rem;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 480px) {
  .products-section {
    padding: 2.5rem 5%;
  }

  .products-section h2 {
    font-size: 1.5rem;
  }

  .section-sub {
    font-size: 0.85rem;
  }

  .header-label {
    font-size: 0.7rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }

  .btn-load-more {
    padding: 0.7rem 1.75rem;
    font-size: 0.8rem;
  }

  .empty-icon {
    width: 70px;
    height: 70px;
  }

  .empty-state h3 {
    font-size: 1.05rem;
  }
}
</style>
