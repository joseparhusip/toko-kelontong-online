<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'StoreFeatures'
})

const features = ref([
  {
    title: 'Pengiriman Cepat',
    description: 'Pesanan bahan pokok Anda langsung diantar segera setelah proses konfirmasi selesai.',
    icon: '/icons-features/pengiriman-cepat.png'
  },
  {
    title: 'Kualitas Terjamin',
    description: 'Produk kelontong pilihan dengan masa kadaluwarsa yang dipastikan selalu aman.',
    icon: '/icons-features/kualitas-terjamin.png'
  },
  {
    title: 'Harga Grosir',
    description: 'Belanja semua kebutuhan rumah tangga harian jauh lebih murah dan hemat.',
    icon: '/icons-features/harga-grosir.png'
  },
  {
    title: 'Produk Segar',
    description: 'Sayur, buah, dan bahan makanan lainnya dijamin segar karena disuplai setiap hari.',
    icon: '/icons-features/produk-segar.png'
  },
  {
    title: 'Stok Lengkap',
    description: 'Tersedia berbagai macam merek dan varian kebutuhan pokok dalam satu tempat.',
    icon: '/icons-features/stok-lengkap.png'
  },
  {
    title: 'Kemasan Aman',
    description: 'Dipacking dengan rapi, higienis, dan aman untuk memastikan produk utuh sampai ke tangan Anda.',
    icon: '/icons-features/kemasan-aman.png'
  }
])
</script>

<template>
  <section class="features-section">
    <div class="section-header">
      <span class="section-label">Keunggulan Kami</span>
      <h2>Mengapa Memilih Kami</h2>
      <p>Keunggulan belanja kebutuhan harian di toko kelontong kami</p>
    </div>

    <div class="features-grid">
      <div v-for="(feature, index) in features" :key="index" class="feature-card">
        <div class="icon-wrapper">
          <img :src="feature.icon" :alt="feature.title" class="feature-icon-img" />
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.features-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 5.5rem 5%;
  background-color: #ffffff;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  display: inline-block;
  background-color: #fef9c3;
  color: #92400e;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 2.5rem;
  color: #111827;
  font-weight: 800;
  margin-bottom: 0.6rem;
  letter-spacing: -0.03em;
}

.section-header p {
  color: #6b7280;
  font-size: 1.05rem;
  font-weight: 400;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  background-color: #ffffff;
  border: 1.5px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -8px rgba(234,179,8,0.18), 0 8px 16px -4px rgba(0,0,0,0.06);
  border-color: #fef08a;
}

.icon-wrapper {
  width: 128px;
  height: 128px;
  background-color: #fef9c3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.feature-card:hover .icon-wrapper {
  transform: scale(1.08);
  background-color: #fef08a;
}

.feature-icon-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.feature-card h3 {
  font-size: 1.2rem;
  color: #1f2937;
  font-weight: 800;
  margin-bottom: 0.85rem;
  letter-spacing: -0.02em;
}

.feature-card p {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.7;
  font-weight: 400;
}

@media (max-width: 768px) {
  .features-section {
    padding: 3.5rem 5%;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
  }

  .feature-icon-img {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 480px) {
  .features-section {
    padding: 2.5rem 5%;
  }

  .section-header h2 {
    font-size: 1.6rem;
  }

  .section-header p {
    font-size: 0.88rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    padding: 1.75rem 1.25rem;
  }
}
</style>
