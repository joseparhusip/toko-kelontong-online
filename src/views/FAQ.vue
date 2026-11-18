<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'
import HelpBox from './HelpBox.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const groups = [
  {
    label: 'Pemesanan',
    items: [
      { q: 'Apakah ada minimum pembelian?', a: 'Tidak ada. Untuk promo tertentu bisa berlaku minimum transaksi, tertulis di detail promonya.' },
      { q: 'Bagaimana cara membatalkan pesanan?', a: 'Pesanan yang belum dibayar bisa dibiarkan saja, nanti batal otomatis. Pesanan yang sudah dikirim tidak bisa dibatalkan.' },
    ],
  },
  {
    label: 'Pembayaran',
    items: [
      { q: 'Metode pembayaran apa saja yang tersedia?', a: 'QRIS, transfer virtual account bank, e-wallet (GoPay, ShopeePay, dll), dan kartu debit/kredit.' },
      { q: 'Apakah data pembayaran saya aman?', a: 'Aman. Pembayaran diproses oleh Midtrans, kami tidak menyimpan data kartu.' },
    ],
  },
  {
    label: 'Pengiriman',
    items: [
      { q: 'Berapa lama pengirimannya?', a: 'Rata-rata 1–3 jam untuk dalam kota, dan 1–2 hari untuk luar kota.' },
      { q: 'Bagaimana cara melacak pesanan?', a: 'Buka halaman Pesanan saya. Status setiap pesanan ada di sana.' },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { q: 'Barang yang diterima rusak, harus bagaimana?', a: 'Laporkan lewat halaman Hubungi kami maksimal 1×24 jam setelah barang diterima, sertakan foto.' },
      { q: 'Bagaimana cara dapat info promo?', a: 'Daftarkan email di kolom Info promo di bagian bawah halaman.' },
    ],
  },
]
</script>

<template>
  <Navbar />

  <main>
    <PageHeader title="Pertanyaan umum" />

    <div class="container narrow body">
      <section v-for="g in groups" :key="g.label" class="group">
        <h2>{{ g.label }}</h2>
        <details v-for="item in g.items" :key="item.q">
          <summary>
            {{ item.q }}
            <AppIcon name="chevron-down" :size="18" />
          </summary>
          <p>{{ item.a }}</p>
        </details>
      </section>

      <HelpBox title="Tidak menemukan jawabannya?" />
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.narrow {
  max-width: calc(760px + var(--gutter) * 2);
}

.body {
  padding-top: 16px;
  padding-bottom: 80px;
}

.group + .group {
  margin-top: 36px;
}

.group h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-3);
  letter-spacing: 0;
  margin-bottom: 4px;
}

details {
  border-bottom: 1px solid var(--line);
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

summary svg {
  flex: 0 0 auto;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease);
}

details[open] summary svg {
  transform: rotate(180deg);
}

details p {
  padding: 0 32px 18px 0;
  color: var(--ink-2);
}
</style>
