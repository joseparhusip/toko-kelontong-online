<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'
import { useUiStore } from '../stores/useUiStore'
import { useSectionNav } from '../composables/useSectionNav'
import CartDrawer from './CartDrawer.vue'
import SearchBar from './SearchBar.vue'
import AppIcon from './ui/AppIcon.vue'

defineOptions({ name: 'AppNavbar' })

const cartStore = useCartStore()
const orderStore = useOrderStore()
const ui = useUiStore()
const route = useRoute()
const { goToSection } = useSectionNav()

const isMenuOpen = ref(false)

const sectionLinks = [
  { id: 'kategori', label: 'Kategori' },
  { id: 'promo', label: 'Promo' },
  { id: 'katalog-produk', label: 'Semua produk' },
]

const pageLinks = [
  { to: '/cara-pemesanan', label: 'Cara pemesanan' },
  { to: '/faq', label: 'FAQ' },
  { to: '/hubungi-kami', label: 'Hubungi kami' },
]

const navigate = (id) => {
  isMenuOpen.value = false
  goToSection(id)
}

watch(() => route.fullPath, () => (isMenuOpen.value = false))
</script>

<template>
  <header class="header">
    <div class="container bar">
      <RouterLink to="/" class="logo" aria-label="Toko Kelontong — beranda">
        <img src="/logo.png" alt="Toko Kelontong" />
      </RouterLink>

      <div class="search-slot">
        <SearchBar />
      </div>

      <div class="actions">
        <RouterLink to="/riwayat-pesanan" class="action orders" aria-label="Pesanan saya">
          <AppIcon name="receipt" :size="20" />
          <span class="label">Pesanan</span>
          <span v-if="orderStore.pendingOrders.length" class="dot" aria-hidden="true" />
        </RouterLink>

        <button class="action cart" aria-label="Buka keranjang" @click="ui.openCart()">
          <AppIcon name="bag" :size="20" />
          <span class="label">Keranjang</span>
          <span v-if="cartStore.totalCount" class="count num">{{ cartStore.totalCount }}</span>
        </button>

        <button
          class="action menu-btn"
          :aria-expanded="isMenuOpen"
          aria-controls="site-menu"
          :aria-label="isMenuOpen ? 'Tutup menu' : 'Buka menu'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <AppIcon :name="isMenuOpen ? 'x' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <transition name="drop">
      <nav v-if="isMenuOpen" id="site-menu" class="menu" aria-label="Menu">
        <div class="container menu-grid">
          <div>
            <p class="menu-title">Belanja</p>
            <a v-for="l in sectionLinks" :key="l.id" :href="`/#${l.id}`" @click.prevent="navigate(l.id)">{{ l.label }}</a>
            <RouterLink to="/riwayat-pesanan">
              Pesanan saya
              <span v-if="orderStore.pendingOrders.length" class="pending num">
                {{ orderStore.pendingOrders.length }} belum dibayar
              </span>
            </RouterLink>
          </div>
          <div>
            <p class="menu-title">Bantuan</p>
            <RouterLink v-for="l in pageLinks" :key="l.to" :to="l.to">{{ l.label }}</RouterLink>
          </div>
        </div>
      </nav>
    </transition>
  </header>

  <CartDrawer />
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'logo . actions'
    'search search search';
  align-items: center;
  column-gap: 16px;
  padding-top: 8px;
  padding-bottom: 10px;
}

.logo {
  grid-area: logo;
}

.logo img {
  height: 38px;
  width: auto;
}

.search-slot {
  grid-area: search;
  margin-top: 8px;
}

.actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: 2px;
}

.action {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  transition: background-color var(--dur) var(--ease);
}

.action:hover {
  background: var(--surface-2);
}

.label {
  display: none;
}

.dot {
  position: absolute;
  top: 8px;
  left: 22px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sale);
  border: 2px solid var(--surface);
}

.count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  background: var(--brand);
  color: #fff;
}

/* Menu */
.menu {
  border-top: 1px solid var(--line);
  background: var(--surface);
  padding: 16px 0 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.menu-grid div {
  display: flex;
  flex-direction: column;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-3);
  margin-bottom: 6px;
}

.menu a {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  font-size: 15px;
  font-weight: 500;
}

.menu a:hover {
  color: var(--brand);
}

.pending {
  font-size: 12px;
  color: var(--sale);
  font-weight: 500;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 160ms var(--ease);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .bar {
    grid-template-columns: auto minmax(0, 640px) 1fr;
    grid-template-areas: 'logo search actions';
    column-gap: 32px;
    height: var(--header-h);
    padding-top: 0;
    padding-bottom: 0;
  }
  .search-slot {
    margin-top: 0;
  }
  .actions {
    justify-self: end;
    gap: 4px;
  }
  .logo img {
    height: 42px;
  }
  .label {
    display: inline;
  }
  .dot {
    left: 24px;
  }
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
