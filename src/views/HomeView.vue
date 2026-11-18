<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Navbar from '../components/Navbar.vue'
import PromoStrip from '../components/PromoStrip.vue'
import CategoryList from '../components/CategoryList.vue'
import ProductRail from '../components/ProductRail.vue'
import ProductList from '../components/ProductList.vue'
import ProductDetail from '../components/ProductDetail.vue'
import Features from '../components/Features.vue'
import Testimonial from '../components/Testimonial.vue'
import Footer from '../components/Footer.vue'
import { useProductStore } from '../stores/useProductStore'
import { useFilterStore } from '../stores/useFilterStore'

const productStore = useProductStore()
const filterStore = useFilterStore()

const sort = ref('popular')

// Saat mencari, sembunyikan konten promosi supaya hasil langsung terlihat
const searching = computed(() => filterStore.searchQuery.trim().length > 0)

const seeAll = async (sortKey) => {
  filterStore.clearAll()
  sort.value = sortKey
  await nextTick()
  document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => productStore.load())
</script>

<template>
  <Navbar />
  <main>
    <template v-if="!searching">
      <PromoStrip />
      <CategoryList />
      <ProductRail
        title="Lagi diskon"
        :products="productStore.onSale"
        :loading="!productStore.loaded"
        @see-all="seeAll('discount')"
      />
      <ProductRail
        title="Terlaris minggu ini"
        :products="productStore.bestSellers"
        :loading="!productStore.loaded"
        @see-all="seeAll('popular')"
      />
    </template>

    <ProductList v-model:sort="sort" />

    <template v-if="!searching">
      <Features />
      <Testimonial />
    </template>
  </main>
  <Footer />

  <ProductDetail :products="productStore.items" />
</template>
