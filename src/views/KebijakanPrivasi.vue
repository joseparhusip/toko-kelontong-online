<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const sections = [
  { icon: 'user', title: 'Informasi yang Kami Kumpulkan', body: 'Kami mengumpulkan data seperti nama, alamat, nomor telepon, email, dan riwayat pesanan yang kamu berikan saat mendaftar atau bertransaksi di Toko Kelontong.' },
  { icon: 'target', title: 'Penggunaan Data', body: 'Data digunakan untuk memproses pesanan, pengiriman, layanan pelanggan, serta mengirimkan info promo apabila kamu berlangganan newsletter kami.' },
  { icon: 'shield', title: 'Keamanan Data', body: 'Kami menerapkan enkripsi dan praktik keamanan standar industri untuk melindungi data pribadimu dari akses yang tidak sah.' },
  { icon: 'share', title: 'Berbagi Data dengan Pihak Ketiga', body: 'Kami hanya membagikan data yang diperlukan kepada mitra logistik/pembayaran untuk menyelesaikan transaksimu, dan tidak menjual data ke pihak lain.' },
  { icon: 'key', title: 'Hak Pengguna', body: 'Kamu berhak meminta akses, koreksi, atau penghapusan data pribadimu kapan saja dengan menghubungi tim kami.' },
  { icon: 'refresh', title: 'Perubahan Kebijakan', body: 'Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui email atau notifikasi di aplikasi.' }
]
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Dokumen Legal"
    title="Kebijakan Privasi"
    subtitle="Terakhir diperbarui 1 Agustus 2026. Privasi kamu penting bagi kami — begini cara kami mengelola datamu."
  />

  <section class="policy-section">
    <div class="policy-card" v-for="(s, i) in sections" :key="i">
      <span class="policy-icon">
        <svg v-if="s.icon === 'user'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <svg v-else-if="s.icon === 'target'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
        <svg v-else-if="s.icon === 'shield'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/></svg>
        <svg v-else-if="s.icon === 'share'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
        <svg v-else-if="s.icon === 'key'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3M18.5 4.5l3 3"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </span>
      <div>
        <h3>{{ s.title }}</h3>
        <p>{{ s.body }}</p>
      </div>
    </div>

    <p class="footnote">
      Ada pertanyaan tentang privasimu? Hubungi
      <RouterLink to="/hubungi-kami">hello@tokokelontong.id</RouterLink>
    </p>
  </section>

  <AppFooter />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.policy-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 760px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
}

.policy-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid #f1ede1;
}

.policy-card:last-of-type {
  border-bottom: none;
}

.policy-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #fef9c3;
  border: 1.5px solid #eab308;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.policy-card h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 0.5rem;
}

.policy-card p {
  font-size: 0.9rem;
  color: #57534e;
  line-height: 1.75;
  margin: 0;
}

.footnote {
  margin-top: 2.25rem;
  font-size: 0.9rem;
  color: #78716c;
  text-align: center;
}

.footnote a {
  color: #b45309;
  font-weight: 700;
  text-decoration: none;
}

.footnote a:hover {
  text-decoration: underline;
}
</style>
