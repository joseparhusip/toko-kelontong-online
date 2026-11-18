<script setup>
import { useFilterStore } from '../stores/useFilterStore'
import { CATEGORIES } from '../data/catalog'

const filterStore = useFilterStore()

const select = (name) => {
  filterStore.setCategory(name)
  document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section id="kategori" class="categories">
    <div class="container">
      <h2 class="title">Kategori</h2>
      <ul class="row">
        <li v-for="c in CATEGORIES" :key="c.name">
          <button
            class="cat"
            :class="{ active: filterStore.activeCategory === c.name }"
            :aria-pressed="filterStore.activeCategory === c.name"
            @click="select(c.name)"
          >
            <span class="thumb">
              <img :src="c.icon" alt="" width="56" height="56" loading="lazy" />
            </span>
            <span class="name">{{ c.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding-top: 32px;
}

.title {
  font-size: 18px;
  margin-bottom: 14px;
}

.row {
  display: grid;
  grid-template-columns: repeat(6, minmax(76px, 1fr));
  gap: 8px;
  overflow-x: auto;
  margin: 0 calc(var(--gutter) * -1);
  padding: 0 var(--gutter) 4px;
  scrollbar-width: none;
}

.row::-webkit-scrollbar {
  display: none;
}

.cat {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  text-align: center;
}

.thumb {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease);
}

.thumb img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.cat:hover .thumb {
  border-color: var(--line-strong);
}

.cat.active .thumb {
  background: var(--brand-soft);
  border-color: var(--brand);
}

.name {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ink-2);
}

.cat.active .name {
  color: var(--brand-ink);
}

@media (min-width: 768px) {
  .categories {
    padding-top: 40px;
  }
  .title {
    font-size: 20px;
  }
  .row {
    margin: 0;
    padding: 0;
    gap: 16px;
    overflow: visible;
  }
  .thumb {
    width: 100%;
    height: 96px;
    border-radius: 16px;
  }
  .thumb img {
    width: 64px;
    height: 64px;
  }
  .name {
    font-size: 14px;
  }
}
</style>
