<script setup>
import { ref } from 'vue'
import ProductCard from './ProductCard.vue'
import AppIcon from './ui/AppIcon.vue'

defineProps({
  title: { type: String, required: true },
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['see-all'])

const track = ref(null)
const scroll = (dir) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <section class="rail">
    <div class="container">
      <div class="head">
        <h2>{{ title }}</h2>
        <div class="tools">
          <button class="link" @click="emit('see-all')">Lihat semua</button>
          <button class="nav" aria-label="Geser ke kiri" @click="scroll(-1)">
            <AppIcon name="chevron-left" :size="18" />
          </button>
          <button class="nav" aria-label="Geser ke kanan" @click="scroll(1)">
            <AppIcon name="chevron-right" :size="18" />
          </button>
        </div>
      </div>

      <div ref="track" class="track">
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="item sk">
            <div class="skeleton sk-img" />
            <div class="skeleton" style="height: 12px; width: 70%; margin-top: 12px" />
            <div class="skeleton" style="height: 16px; width: 45%; margin-top: 10px" />
          </div>
        </template>
        <div v-for="p in products" v-else :key="p.id" class="item">
          <ProductCard :product="p" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rail {
  padding-top: 36px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.head h2 {
  font-size: 18px;
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.link {
  font-size: 14px;
  font-weight: 600;
  color: var(--brand);
  padding: 6px 4px;
}

.link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.nav {
  display: none;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--ink-2);
}

.nav:hover {
  color: var(--ink);
  border-color: var(--ink-3);
}

.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 164px;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin: 0 calc(var(--gutter) * -1);
  padding: 2px var(--gutter) 8px;
  scroll-padding: 0 var(--gutter);
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.item {
  scroll-snap-align: start;
  display: flex;
}

.item > :deep(.product) {
  width: 100%;
}

.sk {
  flex-direction: column;
  padding: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.sk-img {
  aspect-ratio: 1;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .rail {
    padding-top: 48px;
  }
  .head h2 {
    font-size: 20px;
  }
  .nav {
    display: grid;
  }
  .track {
    grid-auto-columns: calc((100% - 3 * 14px) / 4);
    gap: 14px;
    margin: 0;
    padding: 2px 0 8px;
    scroll-padding: 0;
  }
}

@media (min-width: 1024px) {
  .track {
    grid-auto-columns: calc((100% - 4 * 16px) / 5);
    gap: 16px;
  }
}
</style>
