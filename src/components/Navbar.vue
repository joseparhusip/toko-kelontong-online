<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'
import { usePromoSignal } from '../stores/usePromoSignal'

defineOptions({
  name: 'AppNavbar'
})

const cartStore = useCartStore()
const orderStore = useOrderStore()
const promoSignal = usePromoSignal()
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
  showPromoList.value = false
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

// ================= FUNGSI KODE PROMO =================
const promoCodes = [
  { code: 'Toko Kelontong 15', discount: 15 },
  { code: 'Toko Kelontong 20', discount: 20 },
  { code: 'Toko Kelontong 5', discount: 5 },
  { code: 'Toko Kelontong 10', discount: 10 },
  { code: 'Toko Kelontong 75', discount: 75 },
  { code: 'Toko Kelontong 25', discount: 25 }
]

const promoSearch = ref('')
const showPromoList = ref(false)
const appliedPromo = ref(null) // { code, discount }
let promoBlurTimeout = null

// ---------------------------------------------------------------
// POSISI DROPDOWN PROMO (FIX: biar ga kepotong overflow:hidden modal)
// ---------------------------------------------------------------
// Sebelumnya dropdown ini `position: absolute` relatif ke input, dan
// hidup di dalam `.cart-modal` yang punya `overflow: hidden`. Begitu
// tinggi dropdown melebihi sisa ruang modal, bagian bawahnya ke-clip.
//
// Fix-nya: dropdown di-Teleport ke <body> (lihat bagian <template>),
// jadi dia lepas dari batas overflow modal, lalu posisinya dihitung
// manual pakai getBoundingClientRect() supaya tetap nempel pas di
// bawah input. Kalau ruang di bawah kurang, otomatis dibuka ke ATAS
// (flip), mirip perilaku native <select> di browser.
const promoInputWrapperRef = ref(null)
const dropdownStyle = ref({})

const updateDropdownPosition = () => {
  const el = promoInputWrapperRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const gap = 8
  const minSpace = 160

  const spaceBelow = viewportHeight - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const openUpward = spaceBelow < minSpace && spaceAbove > spaceBelow

  if (openUpward) {
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      top: 'auto',
      bottom: `${viewportHeight - rect.top + gap}px`,
      maxHeight: `${Math.max(Math.min(240, spaceAbove), 120)}px`
    }
  } else {
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      top: `${rect.bottom + gap}px`,
      bottom: 'auto',
      maxHeight: `${Math.max(Math.min(240, spaceBelow), 120)}px`
    }
  }
}

// Dipanggil ulang tiap resize/scroll SELAMA dropdown terbuka
const handleReposition = () => {
  if (showPromoList.value) updateDropdownPosition()
}

// Filter kode promo berdasarkan yang diketik user (search-as-you-type)
const filteredPromoCodes = computed(() => {
  const q = promoSearch.value.trim().toLowerCase()
  if (!q) return promoCodes
  return promoCodes.filter((p) => p.code.toLowerCase().includes(q))
})

// Nominal potongan berdasarkan promo yang aktif
const discountAmount = computed(() => {
  if (!appliedPromo.value) return 0
  return Math.round((cartStore.totalPrice * appliedPromo.value.discount) / 100)
})

// Total akhir setelah dipotong promo (ini yang dipakai buat checkout)
const finalTotal = computed(() => {
  return Math.max(cartStore.totalPrice - discountAmount.value, 0)
})

const openPromoList = () => {
  if (appliedPromo.value) return
  showPromoList.value = true
  // nextTick: pastikan elemen sudah ke-render sebelum diukur posisinya
  nextTick(updateDropdownPosition)
}

// Delay dikit sebelum nutup dropdown, biar sempat kena klik dulu
const onPromoBlur = () => {
  promoBlurTimeout = setTimeout(() => {
    showPromoList.value = false
  }, 150)
}

const selectPromo = (promo) => {
  if (promoBlurTimeout) clearTimeout(promoBlurTimeout)
  appliedPromo.value = promo
  promoSearch.value = promo.code
  showPromoList.value = false
}

const applyPromoManual = () => {
  const q = promoSearch.value.trim().toLowerCase()
  if (!q) return
  const found = promoCodes.find((p) => p.code.toLowerCase() === q)
  if (found) {
    appliedPromo.value = found
    showPromoList.value = false
  } else {
    alert('Kode promo tidak ditemukan. Coba cek daftar kode di bawah kolom.')
  }
}

const removePromo = () => {
  appliedPromo.value = null
  promoSearch.value = ''
}

// Reset promo tiap keranjang kosong (misal setelah checkout / dikosongkan manual)
watch(
  () => cartStore.items.length,
  (len) => {
    if (len === 0) removePromo()
  }
)

// ========= DENGERIN SINYAL DARI PROMO BANNER (di luar Navbar) =========
// PromoBanner.vue gak punya akses ke state promo di sini, jadi dia cuma
// "teriak" lewat usePromoSignal store: "tolong apply kode X". Navbar yang
// pegang kendali penuh atas promo & cart yang jalanin prosesnya di sini,
// pakai fungsi-fungsi yang sudah ada (openCart, selectPromo).
watch(
  () => promoSignal.requestedCode,
  (code) => {
    if (!code) return

    const found = promoCodes.find((p) => p.code === code)

    openCart()

    if (found) {
      selectPromo(found)
    } else {
      // Kode dari banner gak ketemu di daftar -> tetap buka cart,
      // biar user bisa cek/isi manual sendiri.
      console.warn(`Kode promo "${code}" dari PromoBanner tidak ditemukan di daftar promoCodes.`)
    }

    promoSignal.clear()
  }
)
// =======================================================

// ================= FUNGSI CHECKOUT MIDTRANS =================
const handleCheckout = async () => {
  if (cartStore.items.length === 0) return
  if (isCheckingOut.value) return

  isCheckingOut.value = true

  try {
    const orderId = 'ORDER-' + new Date().getTime()
    const grossAmount = finalTotal.value

    const itemDetails = cartStore.items.map((item) => ({
      id: item.id.toString(),
      price: item.price,
      quantity: item.qty,
      name: item.title.substring(0, 50)
    }))

    // Kalau ada promo aktif, tambahin sebagai baris diskon (nominal negatif)
    // supaya total item_details tetap sama dengan gross_amount di Midtrans
    if (appliedPromo.value && discountAmount.value > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        price: -discountAmount.value,
        quantity: 1,
        name: `Diskon ${appliedPromo.value.code} (${appliedPromo.value.discount}%)`.substring(0, 50)
      })
    }

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      item_details: itemDetails
    }

    // Memanggil serverless function lokal kita di /api/checkout
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.token) {
      // ✅ SIMPAN ORDER KE STORE DULU SEBELUM POPUP DIBUKA
      orderStore.addOrder({
        id: orderId,
        snapToken: data.token, // simpan token buat bayar nanti
        items: cartStore.items.map((item) => ({ ...item })),
        promoCode: appliedPromo.value?.code ?? null,
        discountPercent: appliedPromo.value?.discount ?? 0,
        discountAmount: discountAmount.value,
        totalPrice: grossAmount,
        status: 'pending'
      })

      // Kosongkan keranjang & promo setelah order dibuat
      cartStore.clearCart?.()
      removePromo()

      closeCart()

      // Buka popup Midtrans
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          console.log('Success!', result)
          orderStore.updateOrderStatus(orderId, 'success')
        },
        onPending: function (result) {
          console.log('Pending', result)
          orderStore.updateOrderStatus(orderId, 'pending')
        },
        onError: function (result) {
          console.log('Error', result)
          orderStore.updateOrderStatus(orderId, 'failed')
        },
        onClose: function () {
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

// Penting: base.css kasih `overflow-x: hidden` eksplisit di elemen <html>.
// Begitu <html> punya overflow yang di-set eksplisit, DIA yang jadi
// "scrolling element" halaman (bukan <body> lagi) — sesuai aturan CSSOM.
// Makanya kalau cuma document.body.style.overflow yang dikunci, halaman
// di belakang popup tetap bisa discroll karena <html>-nya nggak ikut dikunci.
// Fix: kunci overflow di document.documentElement (html) DAN body.
const lockBodyScroll = (lock) => {
  const value = lock ? 'hidden' : ''
  document.documentElement.style.overflow = value
  document.body.style.overflow = value
}

watch(isMenuOpen, (open) => {
  lockBodyScroll(open || isCartOpen.value)
})

watch(isCartOpen, (open) => {
  lockBodyScroll(open || isMenuOpen.value)
  if (!open) showPromoList.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Reposisi dropdown promo kalau window di-resize atau ada elemen
  // yang discroll (capture:true supaya kebaca scroll dari container
  // manapun, termasuk .cart-items-list)
  window.addEventListener('resize', handleReposition)
  window.addEventListener('scroll', handleReposition, true)
  // Reposisi juga saat keyboard hp muncul/hilang (mengubah visualViewport)
  window.visualViewport?.addEventListener('resize', handleReposition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleReposition)
  window.removeEventListener('scroll', handleReposition, true)
  window.visualViewport?.removeEventListener('resize', handleReposition)
  lockBodyScroll(false)
  if (promoBlurTimeout) clearTimeout(promoBlurTimeout)
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
        <span class="mobile-menu-brand">Toko Kelontong</span>

        <ul class="mobile-nav-links">
          <li><a href="#" @click.prevent="scrollToSection('beranda')">Beranda</a></li>
          <li><a href="#" @click.prevent="scrollToSection('kategori')">Kategori</a></li>
          <li><a href="#" @click.prevent="scrollToSection('katalog-produk')">Produk</a></li>
          <li><a href="#" @click.prevent="scrollToSection('promo')">Promo</a></li>
        </ul>

        <button class="mobile-menu-cta" @click="scrollToSection('katalog-produk')">
          Belanja Sekarang
        </button>

        <div class="mobile-menu-divider"></div>

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

        <div class="receipt-tear receipt-tear--flip" aria-hidden="true"></div>

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

          <div class="receipt-tear" aria-hidden="true"></div>

          <div class="cart-summary">
            <!-- ===== KODE PROMO ===== -->
            <div class="promo-section">
              <div class="promo-label-row">
                <span class="promo-label-line" aria-hidden="true"></span>
                <label class="promo-label" for="promo-input">Kode Promo</label>
                <span class="promo-label-line" aria-hidden="true"></span>
              </div>
              <div class="promo-input-wrapper" ref="promoInputWrapperRef">
                <input
                  id="promo-input"
                  type="text"
                  v-model="promoSearch"
                  @focus="openPromoList"
                  @input="openPromoList"
                  @blur="onPromoBlur"
                  @keyup.enter="applyPromoManual"
                  placeholder="Cari / masukkan kode promo..."
                  class="promo-input"
                  :disabled="!!appliedPromo"
                  autocomplete="off"
                />
                <button
                  v-if="!appliedPromo"
                  type="button"
                  class="btn-apply-promo"
                  @click="applyPromoManual"
                >
                  Pakai
                </button>
                <button
                  v-else
                  type="button"
                  class="btn-remove-promo"
                  @click="removePromo"
                >
                  Hapus
                </button>
              </div>

              <div v-if="appliedPromo" class="promo-stamp">
                <span class="promo-stamp-title">Promo Terpakai</span>
                <span class="promo-stamp-code">{{ appliedPromo.code }} · −{{ appliedPromo.discount }}%</span>
              </div>
            </div>
            <!-- ===== END KODE PROMO ===== -->

            <div v-if="appliedPromo" class="cart-discount-row">
              <span>Diskon ({{ appliedPromo.discount }}%)</span>
              <span class="discount-value">-{{ formatRupiah(discountAmount) }}</span>
            </div>

            <div class="cart-total-row">
              <span>Total Harga</span>
              <div class="total-price-wrapper">
                <span v-if="appliedPromo" class="original-price">{{ formatRupiah(cartStore.totalPrice) }}</span>
                <strong>{{ formatRupiah(finalTotal) }}</strong>
              </div>
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

  <!-- ===================================================================
       Dropdown kode promo di-Teleport terpisah ke <body>.
       FIX: sebelumnya dropdown ini nempel di dalam .cart-modal yang
       overflow:hidden, jadi kepotong. Sekarang dia lepas dari situ dan
       posisinya dihitung manual via dropdownStyle (lihat script), jadi
       selalu full terlihat + auto flip ke atas kalau ruang bawah sempit.
  =================================================================== -->
  <Teleport to="body">
    <ul
      v-if="showPromoList && !appliedPromo && filteredPromoCodes.length"
      class="promo-dropdown"
      :style="dropdownStyle"
    >
      <li
        v-for="promo in filteredPromoCodes"
        :key="promo.code"
        class="promo-dropdown-item"
        @mousedown.prevent="selectPromo(promo)"
      >
        <span class="promo-code-text">{{ promo.code }}</span>
        <span class="promo-discount-badge">-{{ promo.discount }}%</span>
      </li>
    </ul>

    <div
      v-else-if="showPromoList && !appliedPromo && promoSearch && !filteredPromoCodes.length"
      class="promo-dropdown"
      :style="dropdownStyle"
    >
      <div class="promo-empty">Kode tidak ditemukan</div>
    </div>
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

/* FIX: navbar defaultnya transparent, jadi tanpa ini overlay gelap di
   belakang bakal "keliatan tembus" persis di area logo & tombol hamburger
   (bikin keduanya kelihatan pudar/abu-abu). Begitu menu dibuka, kasih
   navbar latar solid biar logo & ikon X tetap kebaca jelas. */
.navbar.menu-open:not(.scrolled) {
  background-color: var(--kk-paper);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.12);
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
  background-color: rgba(37, 30, 21, 0.45);
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

/* MOBILE DROPDOWN MENU — satu kartu utuh, senada sama warna navbar */
.mobile-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--kk-ink);
  color: var(--kk-paper);
  border-radius: 1.25rem;
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.28);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-menu-brand {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--kk-paper);
  margin-bottom: 0.15rem;
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0;
  padding: 0;
}

.mobile-nav-links a {
  display: block;
  text-decoration: none;
  color: var(--kk-paper);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.8rem 0.6rem;
  border-radius: 0.75rem;
  transition: background-color 0.2s, color 0.2s;
}

.mobile-nav-links a:hover {
  background-color: rgba(251, 243, 226, 0.12);
  color: var(--kk-mustard-soft);
}

.mobile-menu-cta {
  width: 100%;
  border: none;
  border-radius: 999px;
  background-color: var(--kk-mustard);
  color: #fffaf0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.18);
}

.mobile-menu-cta:hover {
  background-color: var(--kk-mustard-dark);
}

.mobile-menu-cta:active {
  transform: translateY(1px);
}

.mobile-menu-divider {
  height: 1px;
  background-color: rgba(251, 243, 226, 0.16);
  margin: 0.15rem 0 0.1rem;
}

/* Tombol riwayat & keranjang menyatu dengan tema gelap kartu */
.mobile-btn-riwayat {
  width: 100%;
  justify-content: center;
  border-radius: 999px;
  background-color: transparent;
  border: 1.5px solid rgba(251, 243, 226, 0.35);
  color: var(--kk-paper);
}

.mobile-btn-riwayat:hover {
  background-color: rgba(251, 243, 226, 0.1);
  border-color: var(--kk-mustard-soft);
  color: var(--kk-mustard-soft);
  transform: none;
}

.mobile-btn-cart {
  width: 100%;
  justify-content: center;
  border-radius: 999px;
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

/*
  KONSEP: "Struk Belanja Kelontong"
  Modal keranjang dibuat kayak nota/struk kasir toko kelontong beneran:
  ada bagian kepala & "sobekan" kertas, angka-angka pakai font monospace
  (kayak kertas struk), dan kode promo yang dipakai muncul sebagai
  stempel tinta yang dimiringkan — bukan badge ceklis hijau generik.
*/

/* FIX: variabel warna dipindah ke :root (bukan cuma di .cart-modal) supaya
   tetap kebaca sama .promo-dropdown yang sekarang di-Teleport ke <body>
   (di luar subtree .cart-modal — custom property CSS ikut hierarki DOM). */
:root {
  --kk-paper: #fbf3e2;
  --kk-stub: #f1e3bf;
  --kk-ink: #2b2418;
  --kk-ink-soft: #8a7d64;
  --kk-line: #e2d2a9;
  --kk-mustard: #b9801e;
  --kk-mustard-dark: #8f6116;
  --kk-mustard-soft: #f1dfae;
  --kk-stamp: #a8442f;
  --kk-stamp-soft: #f3ddd3;
}

/* ===================== CART MODAL ===================== */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(37, 30, 21, 0.55);
  z-index: 200;
}

.cart-modal {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--kk-ink);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--kk-paper);
  border-radius: 0.85rem;
  width: 92%;
  max-width: 460px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  z-index: 201;
  box-shadow: 0 24px 60px -12px rgba(43, 36, 24, 0.45);
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
  padding: 1.15rem 1.5rem;
  background-color: var(--kk-stub);
  flex-shrink: 0;
}

.cart-modal-header h3 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--kk-ink);
  margin: 0;
  letter-spacing: 0.01em;
}

.cart-modal-header h3::before {
  content: 'NOTA · ';
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 0.7rem;
  color: var(--kk-mustard-dark);
  letter-spacing: 0.08em;
}

/* "Sobekan" kertas struk — pemisah antar bagian, bukan garis polos */
.receipt-tear {
  height: 12px;
  flex-shrink: 0;
  background-color: var(--kk-stub);
  background-image:
    linear-gradient(-45deg, var(--kk-paper) 6px, transparent 0),
    linear-gradient(45deg, var(--kk-paper) 6px, transparent 0);
  background-position: left top;
  background-size: 12px 12px;
  background-repeat: repeat-x;
}

.receipt-tear--flip {
  transform: scaleY(-1);
}

.btn-close-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: transparent;
  border: 1.5px solid var(--kk-ink-soft);
  color: var(--kk-ink-soft);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}

.btn-close-cart:hover {
  border-color: var(--kk-stamp);
  color: var(--kk-stamp);
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
  color: var(--kk-ink-soft);
  font-size: 0.92rem;
  margin: 0;
}

.btn-shop-now {
  background-color: var(--kk-mustard);
  color: #fffaf0;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15);
}

.btn-shop-now:hover {
  background-color: var(--kk-mustard-dark);
  transform: translateY(-1px);
}

.cart-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.cart-items-list {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  background-color: var(--kk-paper);
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--kk-line);
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background-color: var(--kk-mustard-soft);
  border: 1px solid var(--kk-line);
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
  color: var(--kk-ink);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-price {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.74rem;
  color: var(--kk-mustard-dark);
  font-weight: 600;
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
  gap: 0.4rem;
  background-color: var(--kk-mustard-soft);
  border-radius: 6px;
  padding: 0.2rem;
}

.btn-qty-cart {
  background-color: var(--kk-paper);
  border: 1px solid var(--kk-line);
  color: var(--kk-mustard-dark);
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-qty-cart:hover {
  background-color: var(--kk-mustard);
  border-color: var(--kk-mustard);
  color: #fffaf0;
}

.qty-value-cart {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--kk-ink);
  min-width: 14px;
  text-align: center;
}

.btn-remove-item {
  background: none;
  border: none;
  color: var(--kk-line);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  transition: color 0.2s ease;
}

.btn-remove-item:hover {
  color: var(--kk-stamp);
}

.cart-item-subtotal {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--kk-ink);
  margin: 0;
  flex-shrink: 0;
  white-space: nowrap;
}

.cart-summary {
  position: relative;
  padding: 1.1rem 1.5rem 1.4rem;
  flex-shrink: 0;
  background-color: var(--kk-stub);
}

/* ===================== KODE PROMO ===================== */
.promo-section {
  margin-bottom: 0.9rem;
  position: relative;
}

.promo-label-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.55rem;
}

.promo-label-line {
  flex: 1;
  height: 1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--kk-ink-soft) 0,
    var(--kk-ink-soft) 4px,
    transparent 4px,
    transparent 8px
  );
  opacity: 0.55;
}

.promo-label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--kk-ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.promo-input-wrapper {
  position: relative;
  display: flex;
  gap: 0.5rem;
  padding: 0.35rem;
  border: 1.5px dashed var(--kk-mustard);
  border-radius: 10px;
}

.promo-input-wrapper::before,
.promo-input-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 13px;
  height: 13px;
  background-color: var(--kk-stub);
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: inset 0 0 0 1.5px var(--kk-mustard);
}
.promo-input-wrapper::before { left: -7px; }
.promo-input-wrapper::after { right: -7px; }

.promo-input {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--kk-line);
  border-radius: 6px;
  background-color: var(--kk-paper);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.83rem;
  color: var(--kk-ink);
  outline: none;
  transition: border-color 0.2s ease;
}

.promo-input::placeholder {
  color: var(--kk-ink-soft);
}

.promo-input:focus {
  border-color: var(--kk-mustard);
}

.promo-input:disabled {
  background-color: var(--kk-mustard-soft);
  color: var(--kk-mustard-dark);
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  border-color: var(--kk-mustard);
}

.btn-apply-promo,
.btn-remove-promo {
  flex-shrink: 0;
  border: none;
  border-radius: 6px;
  padding: 0 1rem;
  font-weight: 700;
  font-size: 0.8rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-apply-promo {
  background-color: var(--kk-ink);
  color: var(--kk-paper);
}

.btn-apply-promo:hover {
  background-color: var(--kk-mustard);
  color: var(--kk-ink);
}

.btn-remove-promo {
  background-color: var(--kk-stamp-soft);
  color: var(--kk-stamp);
}

.btn-remove-promo:hover {
  background-color: var(--kk-stamp);
  color: #fffaf0;
}

/* FIX: dropdown sekarang di-Teleport ke <body> dan diposisikan via
   `position: fixed` yang nilai top/left/width/bottom/max-height-nya
   dihitung dinamis lewat JS (lihat dropdownStyle). Class ini cuma
   nyediain tampilannya, posisinya sepenuhnya datang dari :style. */
.promo-dropdown {
  position: fixed;
  background-color: var(--kk-paper);
  border: 1px solid var(--kk-line);
  border-radius: 8px;
  box-shadow: 0 16px 36px -8px rgba(43, 36, 24, 0.35);
  z-index: 500;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.promo-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 0.83rem;
}

.promo-dropdown-item:hover {
  background-color: var(--kk-mustard-soft);
}

.promo-dropdown-item + .promo-dropdown-item {
  border-top: 1px dashed var(--kk-line);
}

.promo-code-text {
  font-weight: 600;
  color: var(--kk-ink);
}

.promo-discount-badge {
  background-color: transparent;
  color: var(--kk-stamp);
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border: 1px dashed var(--kk-stamp);
  border-radius: 4px;
}

.promo-empty {
  padding: 0.75rem 0.9rem;
  font-size: 0.82rem;
  color: var(--kk-ink-soft);
  text-align: center;
}

/* Stempel tinta untuk promo yang lagi aktif */
.promo-stamp {
  margin-top: 0.75rem;
  display: inline-flex;
  flex-direction: column;
  gap: 0.05rem;
  padding: 0.4rem 0.85rem;
  border: 2px solid var(--kk-stamp);
  border-radius: 6px;
  color: var(--kk-stamp);
  transform: rotate(-3deg);
  position: relative;
}

.promo-stamp::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--kk-stamp);
  border-radius: 3px;
  opacity: 0.55;
  pointer-events: none;
}

.promo-stamp-title {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.promo-stamp-code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  opacity: 0.85;
}

.cart-discount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--kk-stamp);
  font-weight: 600;
}

.discount-value {
  font-weight: 700;
}
/* =================== END KODE PROMO =================== */

.cart-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  padding-top: 0.75rem;
  border-top: 1.5px dashed var(--kk-ink-soft);
  font-size: 0.7rem;
  color: var(--kk-ink-soft);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.total-price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.original-price {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--kk-ink-soft);
  text-decoration: line-through;
  font-weight: 600;
}

.cart-total-row strong {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.25rem;
  color: var(--kk-ink);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.btn-checkout {
  width: 100%;
  background-color: var(--kk-mustard);
  color: #fffaf0;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.16);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-checkout:hover:not(:disabled) {
  background-color: var(--kk-mustard-dark);
}

.btn-checkout:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.16);
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
    border-radius: 0.75rem;
  }

  .cart-modal-header {
    padding: 1rem 1.1rem;
  }

  .cart-items-list {
    padding: 0.9rem 1.1rem;
  }

  .cart-summary {
    padding: 1rem 1.1rem 1.25rem;
  }

  .cart-item-image {
    width: 52px;
    height: 52px;
  }

  .cart-item-title {
    font-size: 0.8rem;
  }

  .promo-input-wrapper {
    flex-wrap: wrap;
  }
}
</style>
