<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const values = [
  { icon: 'bolt', title: 'Cepat', desc: 'Pesanan diproses dan dikirim secepat mungkin agar kebutuhanmu tidak tertunda.' },
  { icon: 'wallet', title: 'Hemat', desc: 'Harga bersaing dan promo rutin supaya belanja harian tetap ramah di kantong.' },
  { icon: 'badge', title: 'Terpercaya', desc: 'Produk berkualitas dan pelayanan yang jujur jadi prioritas utama kami.' }
]

const stats = [
  { number: '50K+', label: 'Pelanggan Puas' },
  { number: '1.200+', label: 'Produk Tersedia' },
  { number: '25+', label: 'Kota Terjangkau' },
  { number: '4.9/5', label: 'Rating Pelanggan' }
]
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Kenalan Yuk"
    title="Tentang Kami"
    subtitle="Toko Kelontong adalah solusi belanja kebutuhan pokok online yang cepat, hemat, dan terpercaya untuk keluarga Indonesia."
  />

  <section class="about-section">
    <div class="about-story">
      <h2>Cerita Kami</h2>
      <p>
        Toko Kelontong lahir dari keinginan sederhana: membuat belanja kebutuhan rumah tangga
        sehari-hari jadi lebih mudah tanpa harus keluar rumah. Sejak awal berdiri, kami berkomitmen
        menghadirkan produk berkualitas dengan harga bersahabat, langsung diantar ke depan pintu.
      </p>
      <p>
        Kini kami telah melayani ribuan keluarga di berbagai kota, dan terus berkembang dengan satu
        tujuan yang sama — menjadi warung kelontong digital yang paling dipercaya masyarakat Indonesia.
      </p>
    </div>

    <div class="stats-strip">
      <div class="stat-item" v-for="(s, i) in stats" :key="i">
        <span class="stat-number">{{ s.number }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <h2 class="values-title">Nilai yang Kami Pegang</h2>
    <div class="values-grid">
      <div class="value-card" v-for="(v, i) in values" :key="i">
        <span class="value-icon">
          <svg v-if="v.icon === 'bolt'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h8l-1 8 10-12h-8z"/></svg>
          <svg v-else-if="v.icon === 'wallet'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H4a2 2 0 0 1 0-4h14v4"/><path d="M4 8v11a2 2 0 0 0 2 2h14v-4"/><path d="M20 12a2 2 0 0 0 0 4h-4a2 2 0 0 1 0-4h4z"/></svg>
          <svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M9 14l-2 8 5-3 5 3-2-8"/></svg>
        </span>
        <h3>{{ v.title }}</h3>
        <p>{{ v.desc }}</p>
      </div>
    </div>
  </section>

  <AppFooter />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.about-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 940px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
}

.about-story h2,
.values-title {
  font-family: 'Fraunces', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 1rem;
}

.about-story p {
  font-size: 0.96rem;
  color: #57534e;
  line-height: 1.8;
  margin: 0 0 1rem;
  max-width: 680px;
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px dashed #e7dfce;
  border-bottom: 1px dashed #e7dfce;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-left: 1px solid #f1ede1;
}

.stat-item:first-child {
  border-left: none;
}

.stat-number {
  font-family: 'Fraunces', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #b45309;
}

.stat-label {
  font-size: 0.78rem;
  color: #78716c;
  margin-top: 0.3rem;
}

.values-title {
  margin-top: 1rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.value-card {
  padding: 1.75rem;
  background-color: #fffdf5;
  border-radius: 16px;
  border: 1px solid #f1ede1;
}

.value-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #fef9c3;
  border: 1.5px solid #eab308;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.value-card h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 0.5rem;
}

.value-card p {
  font-size: 0.875rem;
  color: #78716c;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .stats-strip {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 0;
  }
  .stat-item:nth-child(2n+1) {
    border-left: none;
  }
  .stat-item:nth-child(n+3) {
    border-left: none;
    padding-top: 1.5rem;
    border-top: 1px dashed #e7dfce;
  }
  .values-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .about-section {
    padding: 3.5rem 6% 4rem;
  }
}
</style>
