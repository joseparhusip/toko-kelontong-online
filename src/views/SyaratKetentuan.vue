<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const terms = [
  { title: 'Penerimaan Ketentuan', body: 'Dengan mengakses dan menggunakan Toko Kelontong, kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat & ketentuan ini.' },
  { title: 'Akun Pengguna', body: 'Kamu bertanggung jawab menjaga kerahasiaan akun dan kata sandi. Segala aktivitas yang terjadi melalui akunmu menjadi tanggung jawabmu.' },
  { title: 'Pemesanan & Harga', body: 'Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Pesanan dianggap sah setelah pembayaran dikonfirmasi.' },
  { title: 'Pembayaran', body: 'Pembayaran dapat dilakukan melalui metode yang tersedia di aplikasi. Pesanan yang belum dibayar dalam batas waktu tertentu akan dibatalkan otomatis.' },
  { title: 'Pengiriman', body: 'Estimasi waktu pengiriman bersifat perkiraan dan dapat berubah karena faktor di luar kendali kami seperti cuaca atau kondisi lalu lintas.' },
  { title: 'Pengembalian & Refund', body: 'Pengembalian barang hanya berlaku untuk produk yang rusak/tidak sesuai, dengan melapor maksimal 1x24 jam setelah barang diterima.' },
  { title: 'Pembatasan Tanggung Jawab', body: 'Toko Kelontong tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan di luar kendali wajar kami.' },
  { title: 'Perubahan Ketentuan', body: 'Kami berhak mengubah syarat & ketentuan ini kapan saja. Perubahan akan berlaku efektif sejak dipublikasikan di halaman ini.' }
]
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Dokumen Legal"
    title="Syarat & Ketentuan"
    subtitle="Mohon baca dengan saksama sebelum menggunakan layanan Toko Kelontong."
  />

  <section class="terms-section">
    <article class="term-clause" v-for="(t, i) in terms" :key="i">
      <span class="clause-mark">Pasal {{ i + 1 }}</span>
      <h3>{{ t.title }}</h3>
      <p>{{ t.body }}</p>
    </article>
  </section>

  <AppFooter />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.terms-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 760px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
  counter-reset: none;
}

.term-clause {
  position: relative;
  padding: 1.75rem 0 1.75rem 1.6rem;
  border-left: 2px solid #e7dfce;
  margin-bottom: 0.25rem;
}

.term-clause::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 2.1rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #eab308;
}

.clause-mark {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #166534;
  background-color: #f0fdf4;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  margin-bottom: 0.75rem;
}

.term-clause h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 0.55rem;
}

.term-clause p {
  font-size: 0.9rem;
  color: #57534e;
  line-height: 1.75;
  margin: 0;
  max-width: 600px;
}

@media (max-width: 576px) {
  .terms-section {
    padding: 3.5rem 6% 4rem;
  }
}
</style>
