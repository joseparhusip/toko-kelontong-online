<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useFilterStore } from '../stores/useFilterStore'
import AppIcon from './ui/AppIcon.vue'

const filterStore = useFilterStore()
const route = useRoute()
const router = useRouter()

// Di halaman lain: Enter membawa user ke beranda, hasil langsung tampil di sana
const submit = (e) => {
  e.target.querySelector('input')?.blur()
  if (route.name !== 'home') router.push({ name: 'home' })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clear = () => {
  filterStore.searchQuery = ''
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="submit">
    <AppIcon name="search" :size="18" class="icon" />
    <label for="site-search" class="sr-only">Cari produk</label>
    <input
      id="site-search"
      v-model="filterStore.searchQuery"
      type="search"
      placeholder="Cari beras, minyak, Indomie…"
      autocomplete="off"
      enterkeyhint="search"
    />
    <button v-if="filterStore.searchQuery" type="button" class="clear" aria-label="Hapus pencarian" @click="clear">
      <AppIcon name="x" :size="16" />
    </button>
  </form>
</template>

<style scoped>
.search {
  position: relative;
  width: 100%;
}

.icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}

input {
  width: 100%;
  height: 44px;
  padding: 0 40px 0 42px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--surface-2);
  font-size: 15px;
  transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

input::placeholder {
  color: var(--ink-3);
}

input::-webkit-search-cancel-button {
  display: none;
}

input:hover {
  background: var(--surface-3);
}

input:focus {
  outline: none;
  background: var(--surface);
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}

.clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--ink-3);
}

.clear:hover {
  background: var(--surface-3);
  color: var(--ink);
}
</style>
