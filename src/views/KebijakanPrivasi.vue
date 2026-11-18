<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'
import LegalDoc from './LegalDoc.vue'

const sections = [
  { title: 'Informasi yang kami kumpulkan', body: 'Nama, alamat, nomor telepon, email, dan riwayat pesanan yang kamu berikan saat bertransaksi di Toko Kelontong.' },
  { title: 'Penggunaan data', body: 'Untuk memproses pesanan, pengiriman, layanan pelanggan, dan mengirim info promo bila kamu berlangganan.' },
  { title: 'Keamanan data', body: 'Kami menerapkan enkripsi dan praktik keamanan standar industri untuk melindungi data pribadimu.' },
  { title: 'Berbagi data dengan pihak ketiga', body: 'Hanya data yang diperlukan dibagikan ke mitra logistik dan pembayaran untuk menyelesaikan transaksimu. Kami tidak menjual data.' },
  { title: 'Hak pengguna', body: 'Kamu berhak meminta akses, koreksi, atau penghapusan data pribadimu kapan saja dengan menghubungi kami.' },
  { title: 'Perubahan kebijakan', body: 'Kebijakan ini dapat diperbarui. Perubahan penting akan diinformasikan lewat email atau notifikasi.' },
]
</script>

<template>
  <Navbar />
  <main>
    <PageHeader title="Kebijakan privasi" subtitle="Terakhir diperbarui 1 Agustus 2026." />
    <LegalDoc :sections="sections" />
  </main>
  <AppFooter />
</template>
