<script setup>
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const values = [
  { title: 'Cepat', desc: 'Pesanan diproses dan dikirim secepat mungkin supaya kebutuhanmu tidak tertunda.' },
  { title: 'Hemat', desc: 'Harga bersaing dan promo rutin supaya belanja harian tetap ramah di kantong.' },
  { title: 'Terpercaya', desc: 'Produk berkualitas dan pelayanan yang jujur jadi prioritas utama kami.' },
]

const stats = [
  { number: '50 rb+', label: 'Pelanggan' },
  { number: '1.200+', label: 'Produk' },
  { number: '25+', label: 'Kota' },
]
</script>

<template>
  <Navbar />

  <main>
    <PageHeader
      title="Tentang kami"
      subtitle="Warung kelontong yang pindah ke HP. Kebutuhan pokok, harga wajar, diantar ke rumah."
    />

    <div class="container narrow body">
      <section class="story">
        <p>
          Toko Kelontong lahir dari keinginan sederhana: membuat belanja kebutuhan rumah tangga sehari-hari jadi
          lebih mudah tanpa harus keluar rumah. Sejak awal kami berkomitmen menghadirkan produk berkualitas dengan
          harga bersahabat, langsung diantar ke depan pintu.
        </p>
        <p>
          Kini kami melayani ribuan keluarga di berbagai kota, dengan tujuan yang sama: menjadi warung kelontong
          digital yang paling dipercaya.
        </p>
      </section>

      <dl class="stats">
        <div v-for="s in stats" :key="s.label">
          <dt>{{ s.label }}</dt>
          <dd class="num">{{ s.number }}</dd>
        </div>
      </dl>

      <section>
        <h2>Yang kami pegang</h2>
        <ol class="values">
          <li v-for="(v, i) in values" :key="v.title">
            <span class="idx num">0{{ i + 1 }}</span>
            <div>
              <h3>{{ v.title }}</h3>
              <p>{{ v.desc }}</p>
            </div>
          </li>
        </ol>
      </section>
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

.story p {
  font-size: 17px;
  line-height: 1.65;
  color: var(--ink);
}

.story p + p {
  margin-top: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 40px 0 56px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.stats div {
  padding: 20px 0;
}

.stats div + div {
  padding-left: 20px;
  border-left: 1px solid var(--line);
}

.stats dt {
  font-size: 13px;
  color: var(--ink-3);
}

.stats dd {
  margin-top: 2px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.values li {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.idx {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-3);
  padding-top: 2px;
}

.values h3 {
  font-size: 17px;
}

.values p {
  margin-top: 4px;
  color: var(--ink-2);
}

@media (min-width: 768px) {
  .stats dd {
    font-size: 34px;
  }
}
</style>
