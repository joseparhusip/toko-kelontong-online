<script setup>
// Komponen banner promosi dengan desain modern
import { usePromoSignal } from '../stores/usePromoSignal'

const promoSignal = usePromoSignal()

// Kode ini HARUS sama persis dengan salah satu kode di array `promoCodes`
// yang ada di Navbar.vue. Banner ini mempromosikan diskon 20%, jadi
// dipasangkan ke kode 'Toko Kelontong 20' (diskon 20%).
const PROMO_CODE = 'Toko Kelontong 20'

const handleClaimVoucher = () => {
  // Scroll ke atas dulu biar navbar/cart modal kelihatan jelas
  // sebelum modal keranjang muncul (terutama kalau user lagi scroll jauh).
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Kirim sinyal ke Navbar: "tolong apply kode ini & buka cart"
  promoSignal.request(PROMO_CODE)
}
</script>

<template>
  <section class="promo-container" id="promo">
    <div class="promo-banner">
      <div class="promo-content">
        <span class="promo-tag">✦ Penawaran Terbatas</span>
        <h2>Dapatkan Diskon 20% Untuk Belanjaan Pertama Anda</h2>
        <p class="promo-sub">Gunakan kode voucher saat checkout. Berlaku untuk semua kategori produk.</p>
        <button class="btn-promo" @click="handleClaimVoucher">Klaim Voucher Sekarang</button>
      </div>
      <div class="promo-image-wrapper">
        <img src="/banners/promo-banner.jpeg" alt="Voucher Promo" class="promo-image" />
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.promo-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 3rem 5%;
  display: flex;
  justify-content: center;
}

.promo-banner {
  background: linear-gradient(130deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%);
  border-radius: 2rem;
  padding: 3.5rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  gap: 4rem;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 24px 48px -8px rgba(234, 179, 8, 0.35), 0 0 0 1px rgba(255,255,255,0.1) inset;
  overflow: hidden;
  position: relative;
}

.promo-banner::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -8%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  filter: blur(50px);
  pointer-events: none;
}

.promo-banner::after {
  content: '';
  position: absolute;
  bottom: -40%;
  right: 25%;
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
}

.promo-content {
  max-width: 520px;
  text-align: left;
  z-index: 1;
  position: relative;
}

.promo-tag {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.22);
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.3);
}

.promo-content h2 {
  font-size: 2.6rem;
  margin-top: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.promo-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.85);
  margin-bottom: 1.75rem;
  line-height: 1.6;
  font-weight: 400;
}

.btn-promo {
  background-color: #111827;
  color: #ffffff;
  border: none;
  padding: 0.95rem 2.25rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.28s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.btn-promo:hover {
  background-color: #1f2937;
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.25);
}

.promo-image-wrapper {
  flex-shrink: 0;
  z-index: 1;
  position: relative;
}

.promo-image {
  width: 400px;
  height: auto;
  max-height: 290px;
  object-fit: cover;
  border-radius: 1.25rem;
  box-shadow: 0 24px 40px -6px rgba(0,0,0,0.22), 0 12px 16px -6px rgba(0,0,0,0.15);
  transform: rotate(3deg);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.promo-banner:hover .promo-image {
  transform: rotate(0deg) scale(1.03);
}

@media (max-width: 992px) {
  .promo-banner {
    gap: 2rem;
    padding: 3rem;
  }
  .promo-image {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .promo-banner {
    flex-direction: column;
    text-align: center;
    padding: 2.5rem 1.75rem;
    gap: 2rem;
    border-radius: 1.5rem;
  }
  .promo-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .promo-content h2 {
    font-size: 2rem;
  }
  .promo-image {
    width: 100%;
    max-width: 360px;
    transform: rotate(0deg);
  }
}
</style>
