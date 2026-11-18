<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'
import HelpBox from './HelpBox.vue'

// Disesuaikan dengan alur aplikasi yang sebenarnya:
// pilih produk -> keranjang -> (promo) -> bayar via Midtrans -> pantau di Pesanan saya
const steps = [
  { title: 'Pilih produk', desc: 'Cari lewat kategori atau kolom pencarian, lalu ketuk Tambah.' },
  { title: 'Cek keranjang', desc: 'Atur jumlah barang. Punya kode promo? Masukkan di bagian bawah keranjang.' },
  { title: 'Bayar', desc: 'Ketuk Bayar sekarang dan pilih metode: QRIS, transfer virtual account, atau e-wallet.' },
  { title: 'Pantau pesanan', desc: 'Status pesanan ada di halaman Pesanan saya. Belum sempat bayar? Lanjutkan dari sana.' },
]
</script>

<template>
  <Navbar />

  <main>
    <PageHeader title="Cara pemesanan" subtitle="Empat langkah dari keranjang sampai depan pintu." />

    <div class="container narrow body">
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.title">
          <span class="n num">{{ i + 1 }}</span>
          <div>
            <h2>{{ s.title }}</h2>
            <p>{{ s.desc }}</p>
          </div>
        </li>
      </ol>

      <HelpBox title="Masih bingung?" />
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.narrow {
  max-width: calc(760px + var(--gutter) * 2);
}

.body {
  padding-top: 24px;
  padding-bottom: 80px;
}

.steps {
  position: relative;
}

.steps li {
  position: relative;
  display: flex;
  gap: 18px;
  padding-bottom: 28px;
}

.steps li:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 34px;
  bottom: 4px;
  width: 1px;
  background: var(--line-strong);
}

.n {
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  font-size: 14px;
  font-weight: 600;
}

.steps h2 {
  font-size: 17px;
  padding-top: 4px;
}

.steps p {
  margin-top: 4px;
  color: var(--ink-2);
}
</style>
