<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const groups = ref([
  {
    label: 'Pemesanan',
    items: [
      { q: 'Apakah ada minimum pembelian?', a: 'Tidak ada minimum pembelian. Namun untuk pengiriman gratis biasanya berlaku minimum transaksi tertentu sesuai promo yang sedang berjalan.', open: true },
      { q: 'Bagaimana cara membatalkan pesanan?', a: 'Pesanan bisa dibatalkan selama masih berstatus "Menunggu Pembayaran" atau "Diproses" lewat halaman Riwayat Pesanan. Setelah dikirim, pembatalan tidak dapat dilakukan.', open: false }
    ]
  },
  {
    label: 'Pembayaran',
    items: [
      { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Transfer bank, e-wallet (GoPay, OVO, Dana, ShopeePay), kartu debit/kredit, dan bayar di tempat (COD) untuk area tertentu.', open: false },
      { q: 'Apakah data pembayaran saya aman?', a: 'Aman. Seluruh transaksi diproses melalui payment gateway berenkripsi, kami tidak menyimpan data kartu secara langsung.', open: false }
    ]
  },
  {
    label: 'Pengiriman',
    items: [
      { q: 'Berapa lama waktu pengiriman?', a: 'Rata-rata 1-3 jam untuk area dalam kota, dan 1-2 hari untuk luar kota, tergantung ketersediaan stok dan lokasi tujuan.', open: false },
      { q: 'Bagaimana cara melacak pesanan?', a: 'Pantau status pesanan secara real-time melalui halaman "Riwayat Pesanan" setelah kamu login ke akun.', open: false }
    ]
  },
  {
    label: 'Lainnya',
    items: [
      { q: 'Barang yang diterima rusak, harus bagaimana?', a: 'Laporkan lewat halaman Hubungi Kami maksimal 1x24 jam setelah barang diterima, sertakan foto bukti untuk mempercepat proses klaim.', open: false },
      { q: 'Bagaimana cara dapat info promo terbaru?', a: 'Daftarkan emailmu di kolom "Dapatkan Info Promo" pada bagian bawah halaman, promo terbaru akan langsung masuk ke inbox kamu.', open: false }
    ]
  }
])

const toggle = (g, i) => {
  groups.value[g].items[i].open = !groups.value[g].items[i].open
}
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Pusat Bantuan"
    title="Pertanyaan Umum"
    subtitle="Jawaban singkat untuk hal-hal yang paling sering ditanyakan pelanggan kami."
  />

  <section class="faq-section">
    <div class="faq-group" v-for="(group, g) in groups" :key="g">
      <h2 class="group-label">{{ group.label }}</h2>

      <div class="faq-item" v-for="(item, i) in group.items" :key="i" :class="{ open: item.open }">
        <button class="faq-question" @click="toggle(g, i)" :aria-expanded="item.open">
          <span>{{ item.q }}</span>
          <span class="toggle-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path v-if="!item.open" d="M12 5v14"/></svg>
          </span>
        </button>
        <transition name="expand">
          <div class="faq-answer" v-show="item.open">
            <p>{{ item.a }}</p>
          </div>
        </transition>
      </div>
    </div>

    <div class="help-box">
      <div class="help-text">
        <h4>Tidak menemukan jawabanmu?</h4>
        <p>Tim kami siap membantu menjawab pertanyaan lain seputar belanja.</p>
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

.faq-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 760px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
}

.faq-group {
  margin-bottom: 2.75rem;
}

.faq-group:last-of-type {
  margin-bottom: 0;
}

.group-label {
  font-family: 'Fraunces', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #166534;
  margin: 0 0 1.1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #e7dfce;
}

.faq-item {
  border-bottom: 1px solid #f1ede1;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #18130f;
}

.faq-item.open .faq-question {
  color: #92400e;
}

.toggle-icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid #e7dfce;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background-color 0.2s;
}

.faq-item.open .toggle-icon {
  background-color: #eab308;
  border-color: #eab308;
  color: #18130f;
}

.faq-answer {
  padding: 0 1.5rem 1.25rem 0;
}

.faq-answer p {
  font-size: 0.9rem;
  color: #57534e;
  line-height: 1.75;
  margin: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

.help-box {
  margin-top: 1rem;
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
  .faq-section {
    padding: 3.5rem 6% 4rem;
  }
  .help-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
