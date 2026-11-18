<script setup>
defineOptions({ name: 'StoreFeatures' })

const features = [
  {
    title: 'Sampai dalam 1–3 jam',
    description: 'Untuk area dalam kota. Luar kota biasanya 1–2 hari, tergantung lokasi.',
    icon: '/icons-features/pengiriman-cepat.png',
  },
  {
    title: 'Kedaluwarsa dicek',
    description: 'Setiap barang dicek tanggalnya sebelum dikemas. Tidak ada stok lama.',
    icon: '/icons-features/kualitas-terjamin.png',
  },
  {
    title: 'Harga grosir',
    description: 'Beli lebih banyak, harga per satuan lebih murah. Cocok untuk warung.',
    icon: '/icons-features/harga-grosir.png',
  },
  {
    title: 'Bahan segar tiap pagi',
    description: 'Sayur, telur, dan protein dipasok ulang setiap hari, bukan stok mingguan.',
    icon: '/icons-features/produk-segar.png',
  },
  {
    title: 'Satu tempat, semua merek',
    description: 'Dari Indomie sampai deterjen, tidak perlu mampir ke banyak toko.',
    icon: '/icons-features/stok-lengkap.png',
  },
  {
    title: 'Dikemas aman',
    description: 'Barang pecah belah dibungkus bubble wrap tebal supaya sampai utuh.',
    icon: '/icons-features/kemasan-aman.png',
  },
]
</script>

<template>
  <section class="section features">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Kenapa belanja di sini</h2>
        </div>
      </div>

      <ul class="list">
        <li v-for="f in features" :key="f.title" class="item">
          <img :src="f.icon" alt="" width="48" height="48" loading="lazy" />
          <div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.list {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 40px;
}

.item {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
}

.item img {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.item h3 {
  font-size: 16px;
  letter-spacing: -0.005em;
}

.item p {
  margin-top: 4px;
  font-size: 14px;
  color: var(--ink-2);
}

@media (min-width: 640px) {
  .list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .list {
    grid-template-columns: repeat(3, 1fr);
  }
  .item {
    padding: 28px 0;
  }
}
</style>
