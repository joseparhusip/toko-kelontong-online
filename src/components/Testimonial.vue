<script setup>
import { ref } from 'vue'
import AppIcon from './ui/AppIcon.vue'

defineOptions({ name: 'CustomerTestimonial' })

const avatar = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=96&h=96&q=70`

const reviews = [
  { name: 'Siti Rahma', role: 'Ibu rumah tangga', text: 'Sangat terbantu belanja sembako bulanan di sini. Pengirimannya cepat sekali dan rapi.', image: avatar('photo-1544005313-94ddf0286df2') },
  { name: 'Budi Santoso', role: 'Pemilik warung makan', text: 'Harga beras dan minyak gorengnya beneran murah dibanding tempat lain. Mantap untuk usaha.', image: avatar('photo-1506794778202-cad84cf45f1d') },
  { name: 'Maya Indah', role: 'Karyawan swasta', text: 'Gak perlu repot ke pasar lagi sepulang kerja. Tinggal klik, besok pagi bahan segar sudah sampai.', image: avatar('photo-1534528741775-53994a69daeb') },
  { name: 'Joko Susanto', role: 'Pelanggan setia', text: 'Kurirnya sopan, dan barang pecah belah selalu dipacking pakai bubble wrap tebal.', image: avatar('photo-1507003211169-0a1dd7228f2d') },
  { name: 'Rina Wijaya', role: 'Reseller', text: 'Stok barang selalu update dan jarang kosong. Bisa diandalkan untuk jualan lagi.', image: avatar('photo-1494790108377-be9c29b29330') },
  { name: 'Faisal Rahman', role: 'Usaha katering', text: 'Beli dalam jumlah grosir tidak pernah ribet. Sayur dan dagingnya juga selalu segar.', image: avatar('photo-1500648767791-00dcc994a43e') },
  { name: 'Ayu Ningsih', role: 'Mahasiswa', text: 'Menolong banget buat anak kos yang mager keluar beli galon dan gas.', image: avatar('photo-1567532939604-b6b5b0db2604') },
  { name: 'Andi Pratama', role: 'Bapak rumah tangga', text: 'Promo mingguannya lumayan buat motong pengeluaran dapur.', image: avatar('photo-1472099645785-5658abf4ff4e') },
]

const track = ref(null)
const scroll = (dir) => {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <section class="section testimonials">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Kata pelanggan</h2>
        </div>
        <div class="nav">
          <button class="icon-btn" aria-label="Sebelumnya" @click="scroll(-1)">
            <AppIcon name="chevron-left" :size="20" />
          </button>
          <button class="icon-btn" aria-label="Berikutnya" @click="scroll(1)">
            <AppIcon name="chevron-right" :size="20" />
          </button>
        </div>
      </div>

      <ul ref="track" class="track" tabindex="0" aria-label="Ulasan pelanggan">
        <li v-for="r in reviews" :key="r.name" class="review">
          <blockquote>{{ r.text }}</blockquote>
          <div class="who">
            <img :src="r.image" alt="" width="40" height="40" loading="lazy" />
            <div>
              <p class="name">{{ r.name }}</p>
              <p class="role">{{ r.role }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  background: var(--surface-2);
}

.nav {
  display: none;
  gap: 4px;
}

.nav .icon-btn {
  border: 1px solid var(--line-strong);
  background: var(--surface);
}

.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 82%;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin: 0 calc(var(--gutter) * -1);
  padding: 0 var(--gutter) 4px;
  scroll-padding: 0 var(--gutter);
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.review {
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding: 22px;
  background: var(--surface);
  border-radius: var(--r-lg);
}

blockquote {
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink);
}

.who {
  display: flex;
  align-items: center;
  gap: 12px;
}

.who img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface-3);
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.role {
  font-size: 13px;
  color: var(--ink-3);
}

@media (min-width: 640px) {
  .track {
    grid-auto-columns: calc((100% - 12px) / 2);
  }
}

@media (min-width: 1024px) {
  .nav {
    display: flex;
  }
  .track {
    grid-auto-columns: calc((100% - 32px) / 3);
    gap: 16px;
    margin: 0;
    padding: 0;
    scroll-padding: 0;
  }
}
</style>
