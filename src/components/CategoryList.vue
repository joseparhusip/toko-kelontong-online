<script setup>
import { ref } from 'vue'
import { useFilterStore } from '../stores/useFilterStore'

const filterStore = useFilterStore()

const categories = ref([
  { id: 1, name: 'Sembako',        icon: '/icons-category/Sembako.png' },
  { id: 2, name: 'Minuman',        icon: '/icons-category/Minuman.png' },
  { id: 3, name: 'Makanan Ringan', icon: '/icons-category/Makanan-Ringan.png' },
  { id: 4, name: 'Kebersihan',     icon: '/icons-category/Kebersihan.png' },
  { id: 5, name: 'Bumbu Dapur',    icon: '/icons-category/Bumbu-Dapur.png' },
  { id: 6, name: 'Kebutuhan Bayi', icon: '/icons-category/Kebutuhan-Bayi.png' },
])

const handleClick = (name) => {
  filterStore.setCategory(name)
  setTimeout(() => {
    document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}
</script>

<template>
  <section class="categories-section" id="kategori">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Belanja Sesuai Kebutuhan</span>
        <h2>Kategori Pilihan</h2>
        <p>Temukan berbagai kebutuhan sehari-hari dengan mudah</p>
      </div>

      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :class="{ active: filterStore.activeCategory === category.name }"
          @click="handleClick(category.name)"
        >
          <div class="active-badge" v-if="filterStore.activeCategory === category.name">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Aktif
          </div>

          <div class="category-icon">
            <img :src="category.icon" :alt="category.name" />
          </div>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.categories-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 5rem 5%;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
}

.container {
  max-width: 1200px;
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-label {
  display: inline-block;
  background-color: #fef9c3;
  color: #92400e;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.section-header p {
  color: #64748b;
  font-size: 1rem;
  font-weight: 400;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem;
}

.category-card {
  background-color: #ffffff;
  padding: 1.75rem 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  border: 2px solid transparent;
  position: relative;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px -5px rgba(234,179,8,0.18);
  border-color: #fde68a;
}

.category-card.active {
  border-color: #eab308;
  background-color: #fffbeb;
  box-shadow: 0 8px 24px rgba(234,179,8,0.22);
  transform: translateY(-4px);
}

.active-badge {
  position: absolute;
  top: -9px;
  right: -9px;
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: white;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  letter-spacing: 0.4px;
  box-shadow: 0 2px 8px rgba(234,179,8,0.4);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fef9c3;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.category-card:hover .category-icon,
.category-card.active .category-icon {
  transform: scale(1.1);
  background-color: #fef08a;
}

.category-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
  text-align: center;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
}

.category-card:hover .category-name,
.category-card.active .category-name {
  color: #ca8a04;
}

/* ===== TABLET ===== */
@media (max-width: 992px) {
  .categories-section {
    padding: 4rem 5%;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.9rem;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 576px) {
  .categories-section {
    padding: 3rem 5%;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .section-header p {
    font-size: 0.88rem;
  }

  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .category-card {
    padding: 1rem 0.5rem;
    border-radius: 1.1rem;
    gap: 0.5rem;
  }

  .category-icon {
    width: 56px;
    height: 56px;
    padding: 10px;
  }

  .category-name {
    font-size: 0.75rem;
  }

  .active-badge {
    font-size: 0.52rem;
    padding: 0.15rem 0.4rem;
    top: -6px;
    right: -6px;
  }
}
</style>
