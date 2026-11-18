<script setup>
import { ref, computed, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import AppIcon from './ui/AppIcon.vue'
import { useFilterStore } from '../stores/useFilterStore'
import { useProductStore } from '../stores/useProductStore'
import { CATEGORIES } from '../data/catalog'

const filterStore = useFilterStore()
const productStore = useProductStore()

const PAGE = 15
const visible = ref(PAGE)

// Bisa diatur dari luar (mis. tombol "Lihat semua" di rail)
const sort = defineModel('sort', { default: 'popular' })

const SORTS = {
  popular: { label: 'Terlaris', fn: (a, b) => b.sold - a.sold },
  discount: { label: 'Diskon terbesar', fn: (a, b) => b.discount - a.discount },
  cheap: { label: 'Harga terendah', fn: (a, b) => a.price - b.price },
  pricey: { label: 'Harga tertinggi', fn: (a, b) => b.price - a.price },
}

const query = computed(() => filterStore.searchQuery.trim())

const filtered = computed(() => {
  let list = productStore.items
  if (filterStore.activeCategory) list = list.filter((p) => p.category === filterStore.activeCategory)
  const q = query.value.toLowerCase()
  if (q) list = list.filter((p) => [p.title, p.brand, p.category].some((v) => v?.toLowerCase().includes(q)))
  return [...list].sort(SORTS[sort.value].fn)
})

const shown = computed(() => filtered.value.slice(0, visible.value))
const remaining = computed(() => filtered.value.length - shown.value.length)

const heading = computed(() => {
  if (query.value) return `Hasil untuk “${query.value}”`
  return filterStore.activeCategory || 'Semua produk'
})

watch([() => filterStore.activeCategory, query, sort], () => (visible.value = PAGE))
</script>

<template>
  <section id="katalog-produk" class="catalog">
    <div class="container">
      <div class="head">
        <div>
          <h2>{{ heading }}</h2>
          <p v-if="productStore.loaded" class="count num">{{ filtered.length }} produk</p>
        </div>
        <label class="sort">
          <span class="sr-only">Urutkan</span>
          <select v-model="sort">
            <option v-for="(s, key) in SORTS" :key="key" :value="key">{{ s.label }}</option>
          </select>
          <AppIcon name="chevron-down" :size="16" />
        </label>
      </div>

      <div class="chips" role="group" aria-label="Filter kategori">
        <button :class="{ on: !filterStore.activeCategory }" @click="filterStore.activeCategory = ''">Semua</button>
        <button
          v-for="c in CATEGORIES"
          :key="c.name"
          :class="{ on: filterStore.activeCategory === c.name }"
          @click="filterStore.activeCategory = filterStore.activeCategory === c.name ? '' : c.name"
        >
          {{ c.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="!productStore.loaded" class="grid" aria-busy="true" aria-label="Memuat produk">
        <div v-for="i in 10" :key="i" class="sk">
          <div class="skeleton sk-img" />
          <div class="skeleton" style="height: 12px; width: 70%; margin-top: 12px" />
          <div class="skeleton" style="height: 16px; width: 45%; margin-top: 10px" />
        </div>
      </div>

      <!-- Kosong -->
      <div v-else-if="!filtered.length" class="empty">
        <AppIcon name="search" :size="28" />
        <h3>Produk tidak ditemukan</h3>
        <p>Coba kata lain, atau <RouterLink to="/hubungi-kami">kabari kami</RouterLink> produk yang kamu cari.</p>
        <button class="btn btn-secondary" @click="filterStore.clearAll()">Lihat semua produk</button>
      </div>

      <template v-else>
        <div class="grid">
          <ProductCard v-for="p in shown" :key="p.id" :product="p" />
        </div>
        <div v-if="remaining" class="more">
          <button class="btn btn-secondary" @click="visible += PAGE">
            Tampilkan {{ Math.min(PAGE, remaining) }} produk lagi
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  padding: 40px 0 56px;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.head h2 {
  font-size: 18px;
}

.count {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 2px;
}

.sort {
  position: relative;
  flex: 0 0 auto;
}

.sort select {
  appearance: none;
  height: 38px;
  padding: 0 34px 0 12px;
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  background: var(--surface);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.sort select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}

.sort svg {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--ink-3);
}

.chips {
  display: flex;
  gap: 6px;
  margin: 14px calc(var(--gutter) * -1) 0;
  padding: 0 var(--gutter) 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chips button {
  flex: 0 0 auto;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-2);
  transition: all var(--dur) var(--ease);
}

.chips button:hover {
  border-color: var(--line-strong);
  color: var(--ink);
}

.chips button.on {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.sk {
  padding: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.sk-img {
  aspect-ratio: 1;
  border-radius: 12px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 16px;
  padding: 48px 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--ink-3);
}

.empty h3 {
  margin-top: 12px;
  font-size: 17px;
}

.empty p {
  margin: 6px 0 18px;
  color: var(--ink-2);
}

.empty a {
  color: var(--brand);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.more {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (min-width: 768px) {
  .catalog {
    padding: 56px 0 72px;
  }
  .head h2 {
    font-size: 20px;
  }
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .chips {
    flex-wrap: wrap;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
