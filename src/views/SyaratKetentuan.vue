<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'
import LegalDoc from './LegalDoc.vue'

const sections = [
  { title: 'Penerimaan ketentuan', body: 'Dengan menggunakan Toko Kelontong, kamu dianggap telah membaca dan menyetujui seluruh syarat & ketentuan ini.' },
  { title: 'Akun pengguna', body: 'Kamu bertanggung jawab menjaga kerahasiaan akun. Aktivitas melalui akunmu menjadi tanggung jawabmu.' },
  { title: 'Pemesanan & harga', body: 'Harga dapat berubah sewaktu-waktu. Pesanan dianggap sah setelah pembayaran dikonfirmasi.' },
  { title: 'Pembayaran', body: 'Pembayaran melalui metode yang tersedia di aplikasi. Pesanan yang tidak dibayar dalam batas waktu akan batal otomatis.' },
  { title: 'Pengiriman', body: 'Estimasi waktu pengiriman bersifat perkiraan dan dapat berubah karena cuaca atau kondisi lalu lintas.' },
  { title: 'Pengembalian & refund', body: 'Berlaku untuk produk rusak atau tidak sesuai, dilaporkan maksimal 1×24 jam setelah barang diterima.' },
  { title: 'Pembatasan tanggung jawab', body: 'Kami tidak bertanggung jawab atas kerugian tidak langsung di luar kendali wajar kami.' },
  { title: 'Perubahan ketentuan', body: 'Kami dapat mengubah ketentuan ini. Perubahan berlaku sejak dipublikasikan di halaman ini.' },
]
</script>

<template>
  <Navbar />
  <main>
    <PageHeader title="Syarat & ketentuan" />
    <LegalDoc :sections="sections" numbered />
  </main>
  <AppFooter />
</template>
