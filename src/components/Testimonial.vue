<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'CustomerTestimonial'
})

const reviews = ref([
  {
    id: 1, name: 'Siti Rahma', role: 'Ibu Rumah Tangga',
    text: 'Sangat terbantu belanja sembako bulanan di sini. Pengirimannya cepat sekali dan rapi.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2, name: 'Budi Santoso', role: 'Pemilik Warung Makan',
    text: 'Harga beras dan minyak gorengnya beneran murah dibanding tempat lain. Mantap untuk usaha.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3, name: 'Dewi Lestari', role: 'Pengguna Aktif',
    text: 'Pelayanan ramah, produk lengkap, dan aplikasinya sangat mudah digunakan.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4, name: 'Andi Pratama', role: 'Bapak Rumah Tangga',
    text: 'Promo mingguannya sangat lumayan buat motong pengeluaran dapur. Recommended banget!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 5, name: 'Rina Wijaya', role: 'Reseller',
    text: 'Stok barang selalu update dan jarang kosong. Sangat bisa diandalkan untuk jualan lagi.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6, name: 'Joko Susanto', role: 'Pelanggan Setia',
    text: 'Kurirnya sopan-sopan, dan barang pecah belah selalu dipacking pakai bubble wrap tebal.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 7, name: 'Maya Indah', role: 'Karyawan Swasta',
    text: 'Gak perlu repot ke pasar lagi sepulang kerja. Tinggal klik, besok pagi bahan segar sudah sampai.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 8, name: 'Faisal Rahman', role: 'Pengusaha Katering',
    text: 'Beli dalam jumlah grosir tidak pernah ribet. Kualitas sayur dan dagingnya juga selalu fresh.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 9, name: 'Ayu Ningsih', role: 'Mahasiswa',
    text: 'Sangat menolong buat anak kosan yang mager keluar beli galon dan gas. Ongkirnya juga murah.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 10, name: 'Hendra Gunawan', role: 'Pelanggan Baru',
    text: 'Baru pertama kali coba pesen di sini dan langsung puas dengan pelayanannya. Keren!',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
])
</script>

<template>
  <section class="testimonial-section">
    <div class="section-header">
      <span class="section-label">Ulasan Pelanggan</span>
      <h2 class="title">Apa Kata Pelanggan Kami</h2>
      <p class="subtitle">Ribuan pelanggan sudah merasakan kemudahan belanja bersama kami</p>
    </div>

    <div class="marquee-wrapper">
      <div class="marquee-track">

        <div v-for="review in reviews" :key="'first-' + review.id" class="testimonial-card">
          <div class="stars">
            <span v-for="i in 5" :key="i">★</span>
          </div>
          <p class="review-text">{{ review.text }}</p>
          <div class="reviewer-profile">
            <img :src="review.image" :alt="`Foto ${review.name}`" class="avatar" loading="lazy" />
            <div class="reviewer-info">
              <h4>{{ review.name }}</h4>
              <p class="role">{{ review.role }}</p>
            </div>
          </div>
        </div>

        <div v-for="review in reviews" :key="'second-' + review.id" class="testimonial-card">
          <div class="stars">
            <span v-for="i in 5" :key="i">★</span>
          </div>
          <p class="review-text">{{ review.text }}</p>
          <div class="reviewer-profile">
            <img :src="review.image" :alt="`Foto ${review.name}`" class="avatar" loading="lazy" />
            <div class="reviewer-info">
              <h4>{{ review.name }}</h4>
              <p class="role">{{ review.role }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

.testimonial-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 5rem 0 4rem;
  background-color: #f8fafc;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  text-align: center;
  overflow: hidden;
}

.section-header {
  padding: 0 5%;
  margin-bottom: 3.5rem;
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
  margin-bottom: 0.85rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 0.6rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 400;
}

/* Marquee */
.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 1.5rem;
  animation: scrollLeft 40s linear infinite;
  padding: 1rem 1rem 2rem 1rem;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.75rem)); }
}

/* Card */
.testimonial-card {
  width: 340px;
  flex-shrink: 0;
  background-color: #ffffff;
  padding: 2rem 2rem 1.75rem;
  border-radius: 1.5rem;
  border: 1.5px solid #f1f5f9;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px -4px rgba(0,0,0,0.1);
}

.stars {
  color: #eab308;
  font-size: 0.85rem;
  letter-spacing: 1px;
  margin-bottom: 0.85rem;
}

.review-text {
  color: #334155;
  font-size: 0.97rem;
  font-style: italic;
  line-height: 1.7;
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  font-weight: 400;
}

.reviewer-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1.25rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid #fef08a;
  flex-shrink: 0;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
}

.reviewer-info h4 {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 800;
  margin: 0 0 0.15rem 0;
  letter-spacing: -0.01em;
}

.role {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .testimonial-card {
    width: 290px;
    padding: 1.75rem 1.5rem;
  }
}
</style>
