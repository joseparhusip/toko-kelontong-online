<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'

defineOptions({
  name: 'AppNavbar'
})

const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isCheckingOut = ref(false)

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (id) => {
  closeMenu()
  if (id === 'beranda') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 80
  const extraOffset = 24
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - extraOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const openCart = () => {
  isMenuOpen.value = false
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const goToRiwayat = () => {
  closeMenu()
  closeCart()
  router.push('/riwayat-pesanan')
}

const handleIncrement = (productId) => {
  cartStore.increment(productId)
}

const handleDecrement = (productId) => {
  cartStore.decrement(productId)
}

const handleRemove = (productId) => {
  cartStore.removeItem(productId)
}

// ================= FUNGSI CHECKOUT MIDTRANS =================
const handleCheckout = async () => {
  if (cartStore.items.length === 0) return
  if (isCheckingOut.value) return

  isCheckingOut.value = true

  try {
    const orderId = 'ORDER-' + new Date().getTime()
    const grossAmount = cartStore.totalPrice

    const itemDetails = cartStore.items.map(item => ({
      id: item.id.toString(),
      price: item.price,
      quantity: item.qty,
      name: item.title.substring(0, 50)
    }))

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      item_details: itemDetails
    }

    const serverKey = 'SB-Mid-server-3CSG63tAbRvqJ9fp5DoziGRq'
    const base64Key = btoa(serverKey + ':')

    const response = await fetch('/api/midtrans/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${base64Key}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.token) {
      // ✅ SIMPAN ORDER KE STORE DULU SEBELUM POPUP DIBUKA
      // Ini yang bikin order ga ilang walau user nutup popup Midtrans
      orderStore.addOrder({
        id: orderId,
        snapToken: data.token,  // simpan token buat bayar nanti
        items: cartStore.items.map(item => ({ ...item })),
        totalPrice: grossAmount,
        status: 'pending'
      })

      // Kosongkan keranjang setelah order dibuat
      cartStore.clearCart?.()

      closeCart()

      // Buka popup Midtrans
      window.snap.pay(data.token, {
        onSuccess: function(result) {
          console.log('Success!', result)
          orderStore.updateOrderStatus(orderId, 'success')
        },
        onPending: function(result) {
          console.log('Pending', result)
          orderStore.updateOrderStatus(orderId, 'pending')
        },
        onError: function(result) {
          console.log('Error', result)
          orderStore.updateOrderStatus(orderId, 'failed')
        },
        onClose: function() {
          // User nutup popup — order tetap tersimpan sebagai 'pending'
          // User bisa bayar dari halaman Riwayat Pesanan
          console.log('Popup ditutup, order disimpan sebagai pending')
        }
      })
    } else {
      console.error('Gagal dapat token:', data)
      alert('Gagal memproses checkout ke Midtrans.')
    }
  } catch (error) {
    console.error('Error saat checkout:', error)
    alert('Terjadi kesalahan sistem saat checkout.')
  } finally {
    isCheckingOut.value = false
  }
}
// ============================================================

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(isCartOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled, 'menu-open': isMenuOpen }">
    <div class="logo" @click="scrollToSection('beranda')" style="cursor:pointer;">
      <img src="/logo.png" alt="Toko Kelontong" class="logo-img" />
    </div>

    <ul class="nav-links">
      <li><a href="#" @click.prevent="scrollToSection('beranda')">Beranda</a></li>
      <li><a href="#" @click.prevent="scrollToSection('kategori')">Kategori</a></li>
      <li><a href="#" @click.prevent="scrollToSection('katalog-produk')">Produk</a></li>
      <li><a href="#" @click.prevent="scrollToSection('promo')">Promo</a></li>
    </ul>

    <div class="nav-actions">
      <!-- Tombol Riwayat Pesanan -->
      <button class="btn-riwayat" @click="goToRiwayat">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Riwayat
        <span v-if="orderStore.pendingOrders.length > 0" class="badge-pending">
          {{ orderStore.pendingOrders.length }}
        </span>
      </button>

      <button class="btn-cart" @click="openCart">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Keranjang ({{ cartStore.totalCount }})
      </button>
    </div>

    <button
      class="hamburger-btn"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-label="Buka menu navigasi"
    >
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <transition name="mobile-menu">
      <div v-if="isMenuOpen" class="mobile-menu">
        <ul class="mobile-nav-links">
          <li><a href="#" @click.prevent="scrollToSection('beranda')">Beranda</a></li>
          <li><a href="#" @click.prevent="scrollToSection('kategori')">Kategori</a></li>
          <li><a href="#" @click.prevent="scrollToSection('katalog-produk')">Produk</a></li>
          <li><a href="#" @click.prevent="scrollToSection('promo')">Promo</a></li>
        </ul>
        <button class="btn-riwayat mobile-btn-riwayat" @click="goToRiwayat">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          Riwayat Pesanan
          <span v-if="orderStore.pendingOrders.length > 0" class="badge-pending">
            {{ orderStore.pendingOrders.length }}
          </span>
        </button>
        <button class="btn-cart mobile-btn-cart" @click="openCart">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Keranjang ({{ cartStore.totalCount }})
        </button>
      </div>
    </transition>

    <transition name="fade-overlay">
      <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>
    </transition>

  </nav>

  <Teleport to="body">
    <transition name="fade-overlay">
      <div v-if="isCartOpen" class="cart-overlay" @click="closeCart"></div>
    </transition>

    <transition name="cart-modal-anim">
      <div v-if="isCartOpen" class="cart-modal">
        <div class="cart-modal-header">
          <h3>Keranjang Belanja</h3>
          <button class="btn-close-cart" @click="closeCart" aria-label="Tutup keranjang">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Keranjang kamu masih kosong</p>
          <button class="btn-shop-now" @click="closeCart">Mulai Belanja</button>
        </div>

        <div v-else class="cart-body">
          <div class="cart-items-list">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.title" class="cart-item-image" />

              <div class="cart-item-info">
                <h4 class="cart-item-title">{{ item.title }}</h4>
                <p class="cart-item-price">{{ formatRupiah(item.price) }}</p>

                <div class="cart-item-qty-row">
                  <div class="qty-control-cart">
                    <button class="btn-qty-cart" @click="handleDecrement(item.id)" aria-label="Kurangi">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span class="qty-value-cart">{{ item.qty }}</span>
                    <button class="btn-qty-cart" @click="handleIncrement(item.id)" aria-label="Tambah">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>

                  <button class="btn-remove-item" @click="handleRemove(item.id)" aria-label="Hapus produk">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <p class="cart-item-subtotal">{{ formatRupiah(item.price * item.qty) }}</p>
            </div>
          </div>

          <div class="cart-summary">
            <div class="cart-total-row">
              <span>Total Harga</span>
              <strong>{{ formatRupiah(cartStore.totalPrice) }}</strong>
            </div>
            <button class="btn-checkout" @click="handleCheckout" :disabled="isCheckingOut">
              <span v-if="isCheckingOut">Memproses...</span>
              <span v-else>Checkout Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.navbar {
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.4s ease;
  box-sizing: border-box;
}

.navbar.scrolled {
  top: 1rem;
  left: 5%;
  width: 90%;
  padding: 0.85rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 9999px;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04);
}

.logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  transition: color 0.2s;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #eab308;
  border-radius: 9999px;
  transition: width 0.25s ease;
}

.nav-links a:hover {
  color: #eab308;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

/* ===== TOMBOL RIWAYAT ===== */
.btn-riwayat {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  position: relative;
  background-color: #ffffff;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-riwayat:hover {
  background-color: #fef9c3;
  border-color: #eab308;
  color: #ca8a04;
  transform: translateY(-1px);
}

.badge-pending {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  line-height: 1;
}

.btn-cart {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eab308;
  color: #ffffff;
  border: none;
  padding: 0.65rem 1.4rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.9rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.35);
}

.btn-cart:hover {
  background-color: #ca8a04;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(234, 179, 8, 0.45);
}

/* HAMBURGER BUTTON */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 110;
}

.hamburger-btn .bar {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: #111827;
  border-radius: 9999px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.navbar.menu-open .hamburger-btn .bar:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.navbar.menu-open .hamburger-btn .bar:nth-child(2) {
  opacity: 0;
}

.navbar.menu-open .hamburger-btn .bar:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* MOBILE OVERLAY (hamburger) */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.45);
  z-index: 90;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* MOBILE DROPDOWN MENU */
.mobile-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.18);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
}

.mobile-nav-links a {
  display: block;
  text-decoration: none;
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.85rem 0.5rem;
  border-radius: 0.75rem;
  transition: background-color 0.2s, color 0.2s;
}

.mobile-nav-links a:hover {
  background-color: #fef9c3;
  color: #ca8a04;
}

.mobile-btn-riwayat {
  width: 100%;
  justify-content: center;
}

.mobile-btn-cart {
  width: 100%;
  justify-content: center;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== TABLET ===== */
@media (max-width: 992px) {
  .nav-links,
  .nav-actions {
    display: none;
  }

  .hamburger-btn {
    display: flex;
  }

  .navbar {
    padding: 1.1rem 5%;
  }

  .navbar.scrolled {
    top: 0.75rem;
    left: 4%;
    width: 92%;
    padding: 0.75rem 1.5rem;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 576px) {
  .navbar {
    padding: 1rem 5%;
  }

  .navbar.scrolled {
    top: 0.5rem;
    left: 3%;
    width: 94%;
    padding: 0.65rem 1.1rem;
    border-radius: 1.5rem;
  }

  .logo-img {
    height: 40px;
  }

  .mobile-menu {
    border-radius: 1rem;
    padding: 1rem;
  }
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ===================== CART MODAL ===================== */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.55);
  z-index: 200;
}

.cart-modal {
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 1.5rem;
  width: 92%;
  max-width: 480px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  z-index: 201;
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.cart-modal-anim-enter-active,
.cart-modal-anim-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cart-modal-anim-enter-from,
.cart-modal-anim-leave-to {
  opacity: 0;
  transform: translate(-50%, -45%) scale(0.95);
}

.cart-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.cart-modal-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.btn-close-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: none;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

.btn-close-cart:hover {
  background-color: #fee2e2;
  color: #ef4444;
  transform: rotate(90deg);
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.cart-empty p {
  color: #6b7280;
  font-size: 0.92rem;
  margin: 0;
}

.btn-shop-now {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(234,179,8,0.32);
}

.btn-shop-now:hover {
  transform: translateY(-2px);
}

.cart-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.cart-items-list {
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cart-item-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.75rem;
  flex-shrink: 0;
  background-color: #fef9c3;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cart-item-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-price {
  font-size: 0.78rem;
  color: #ca8a04;
  font-weight: 700;
  margin: 0;
}

.cart-item-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
}

.qty-control-cart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fef9c3;
  border-radius: 0.6rem;
  padding: 0.2rem;
}

.btn-qty-cart {
  background-color: #ffffff;
  border: none;
  color: #ca8a04;
  width: 22px;
  height: 22px;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.btn-qty-cart:hover {
  background-color: #eab308;
  color: #ffffff;
}

.qty-value-cart {
  font-size: 0.8rem;
  font-weight: 800;
  color: #92400e;
  min-width: 16px;
  text-align: center;
}

.btn-remove-item {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  transition: color 0.2s ease;
}

.btn-remove-item:hover {
  color: #ef4444;
}

.cart-item-subtotal {
  font-size: 0.82rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  flex-shrink: 0;
  white-space: nowrap;
}

.cart-summary {
  border-top: 1px solid #f1f5f9;
  padding: 1.25rem 1.5rem 1.5rem;
  flex-shrink: 0;
  background-color: #fafafa;
}

.cart-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #374151;
  font-weight: 600;
}

.cart-total-row strong {
  font-size: 1.2rem;
  color: #ca8a04;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.btn-checkout {
  width: 100%;
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #ffffff;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 16px rgba(234,179,8,0.35);
}

.btn-checkout:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(234,179,8,0.45);
}

/* fade-overlay transition (untuk cart-overlay yang di-teleport) */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .cart-modal {
    width: 94%;
    max-height: 80vh;
    border-radius: 1.25rem;
  }

  .cart-modal-header {
    padding: 1rem 1.1rem;
  }

  .cart-items-list {
    padding: 0.85rem 1.1rem;
  }

  .cart-item-image {
    width: 54px;
    height: 54px;
  }

  .cart-item-title {
    font-size: 0.8rem;
  }

  .cart-summary {
    padding: 1rem 1.1rem 1.25rem;
  }
}
</style>
