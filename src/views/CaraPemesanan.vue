<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const steps = [
  {
    title: 'Pilih Produk',
    desc: 'Jelajahi kategori atau gunakan pencarian untuk menemukan produk kebutuhan harianmu, lalu masukkan ke keranjang.',
    icon: 'search'
  },
  {
    title: 'Cek Keranjang',
    desc: 'Periksa kembali daftar belanja, atur jumlah item, dan pastikan semua produk yang kamu butuhkan sudah masuk.',
    icon: 'cart'
  },
  {
    title: 'Isi Data Pengiriman',
    desc: 'Masukkan alamat lengkap, nomor telepon aktif, dan pilih waktu pengiriman yang sesuai dengan jadwalmu.',
    icon: 'pin'
  },
  {
    title: 'Pilih Metode Pembayaran',
    desc: 'Bayar dengan transfer bank, e-wallet, atau bayar di tempat (COD) — pilih yang paling nyaman untukmu.',
    icon: 'card'
  },
  {
    title: 'Konfirmasi Pesanan',
    desc: 'Periksa ringkasan pesanan sekali lagi, lalu ketuk "Buat Pesanan". Notifikasi konfirmasi akan langsung masuk.',
    icon: 'check'
  },
  {
    title: 'Pesanan Dikirim',
    desc: 'Tim kami menyiapkan dan mengirim pesananmu. Pantau statusnya kapan saja di halaman Riwayat Pesanan.',
    icon: 'truck'
  }
]
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Panduan Belanja"
    title="Cara Pemesanan"
    subtitle="Enam langkah singkat dari keranjang sampai ke depan pintu rumahmu."
  />

  <section class="steps-section">
    <ol class="route">
      <li class="route-stop" v-for="(step, i) in steps" :key="i">
        <div class="stop-marker">
          <svg v-if="step.icon === 'search'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <svg v-else-if="step.icon === 'cart'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 6H6"/></svg>
          <svg v-else-if="step.icon === 'pin'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <svg v-else-if="step.icon === 'card'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          <svg v-else-if="step.icon === 'check'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          <svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="15" height="12" rx="1"/><path d="M16 10h4l3 3v5h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>
        </div>
        <div class="stop-body">
          <span class="stop-index">Langkah {{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
      </li>
    </ol>

    <div class="help-box">
      <div class="help-text">
        <h4>Masih ada yang belum jelas?</h4>
        <p>Tim customer service kami siap membantu kamu, setiap hari.</p>
      </div>
      <RouterLink to="/hubungi-kami" class="help-btn">
        Hubungi Kami
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </RouterLink>
    </div>
  </section>

  <AppFooter />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.steps-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 780px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
}

.route {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.route-stop {
  display: flex;
  gap: 1.5rem;
  position: relative;
  padding-bottom: 2.75rem;
}

.route-stop:last-child {
  padding-bottom: 0;
}

.route-stop::before {
  content: '';
  position: absolute;
  left: 23px;
  top: 50px;
  bottom: 0;
  width: 0;
  border-left: 2px dashed #e7dfce;
}

.route-stop:last-child::before {
  display: none;
}

.stop-marker {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fef9c3;
  border: 1.5px solid #eab308;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.stop-body {
  padding-top: 0.15rem;
}

.stop-index {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #166534;
  margin-bottom: 0.35rem;
}

.stop-body h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 0.5rem;
}

.stop-body p {
  font-size: 0.92rem;
  color: #57534e;
  line-height: 1.7;
  margin: 0;
  max-width: 480px;
}

.help-box {
  margin-top: 3.5rem;
  background-color: #18130f;
  background-image: radial-gradient(circle at 90% 10%, rgba(234,179,8,0.15), transparent 55%);
  border-radius: 18px;
  padding: 2.1rem 2.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.help-text h4 {
  font-family: 'Fraunces', serif;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.3rem;
}

.help-text p {
  color: #a8a29e;
  font-size: 0.88rem;
  margin: 0;
}

.help-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eab308;
  color: #18130f;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  white-space: nowrap;
  transition: background-color 0.2s, transform 0.2s;
}

.help-btn:hover {
  background-color: #fde047;
  transform: translateX(2px);
}

@media (max-width: 576px) {
  .steps-section {
    padding: 3.5rem 6% 4rem;
  }
  .help-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
