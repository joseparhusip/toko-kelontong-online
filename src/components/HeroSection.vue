<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'HeroSection',
})

const currentIndex = ref(0)
let autoSlideInterval = null

const banners = ref([
  {
    id: 1,
    title: 'Belanja Kebutuhan Harian Lebih Mudah dan Hemat',
    desc: 'Dapatkan sembako dan kebutuhan rumah tangga lengkap langsung diantar ke depan pintu rumah Anda dengan harga grosir terbaik.',
    image: '/banners/banners-1.png',
    hasCircle: false,
    badge: 'PROMO TERLARIS',
    imageClass: 'normal-img',
    hasCover: true,
  },
  {
    id: 2,
    title: 'Promo Spesial Sembako Minggu Ini',
    desc: 'Dapatkan potongan harga khusus untuk pembelian paket beras dan minyak goreng. Stok terbatas!',
    image: '/banners/banners-2.png',
    hasCircle: true,
    badge: 'PENAWARAN SPESIAL',
    imageClass: 'tilted-large-img',
    hasCover: false,
  },
  {
    id: 3,
    title: 'Gratis Ongkos Kirim Ke Seluruh Area',
    desc: 'Belanja lebih hemat tanpa mikirin biaya antar. Kami kirim pesanan Anda dengan aman dan cepat.',
    image: '/banners/banners-3.png',
    hasCircle: false,
    badge: 'BEBAS ONGKIR',
    imageClass: 'normal-img',
    hasCover: true,
  },
  {
    id: 4,
    title: 'Bahan Dapur Segar Setiap Hari',
    desc: 'Jaminan kualitas terbaik untuk semua produk segar dan kebutuhan memasak keluarga Anda.',
    image: '/banners/banners-4.png',
    hasCircle: true,
    badge: 'PRODUK SEGAR',
    imageClass: 'tilted-medium-img',
    hasCover: false,
  },
])

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  autoSlideInterval = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  clearInterval(autoSlideInterval)
})
</script>

<template>
  <section class="hero-carousel" id="beranda">
    <div class="carousel-track-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="banner in banners" :key="banner.id" class="carousel-slide">
          <div class="layout-right">

            <div class="content-left">
              <span class="badge" v-if="banner.badge">{{ banner.badge }}</span>
              <h1>{{ banner.title }}</h1>
              <p>{{ banner.desc }}</p>
              <div class="buttons-left">
                <button class="btn-primary" @click="scrollToSection('katalog-produk')">Pesan Sekarang</button>
                <button class="btn-secondary" @click="scrollToSection('katalog-produk')">Lihat Produk</button>
              </div>
            </div>

            <div class="image-right-wrapper">
              <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
              </div>

              <div v-if="banner.hasCircle" class="circle-decoration"></div>

              <img
                :src="banner.image"
                alt="Banner Toko Kelontong"
                class="image-right"
                :class="banner.imageClass"
              />

              <div v-if="banner.hasCover" class="foreground-cover"></div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="pagination-dots">
      <button
        v-for="(banner, index) in banners"
        :key="index"
        class="dot"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.hero-carousel {
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #fffbeb;
  padding-bottom: 3rem;
}

.carousel-track-container {
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
  width: 100%;
}

.carousel-slide {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 5% 3rem 5%;
}

.layout-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;
}

.content-left {
  flex: 1;
  max-width: 580px;
  z-index: 5;
}

.badge {
  display: inline-block;
  background-color: #fef08a;
  color: #92400e;
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 0.78rem;
  margin-bottom: 1.25rem;
  letter-spacing: 1.5px;
  box-shadow: 0 4px 6px rgba(202, 138, 4, 0.12);
}

.content-left h1 {
  font-size: 3.25rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.03em;
}

.content-left p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 2.25rem;
  line-height: 1.75;
  font-weight: 400;
}

.buttons-left {
  display: flex;
  gap: 0.85rem;
}

.image-right-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 550px;
}

.foreground-cover {
  position: absolute;
  bottom: -65px;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 120px;
  background-color: #fffbeb;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  z-index: 3;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  animation: float 5s ease-in-out infinite;
}

.shape-1 {
  width: 28px;
  height: 28px;
  background-color: #eab308;
  opacity: 0.3;
  top: 10%;
  left: 10%;
}

.shape-2 {
  width: 46px;
  height: 46px;
  background-color: #fde047;
  opacity: 0.4;
  bottom: 25%;
  right: 5%;
  animation-delay: 1.5s;
}

.shape-3 {
  width: 18px;
  height: 18px;
  background-color: #ef4444;
  opacity: 0.2;
  top: 25%;
  right: 15%;
  animation-delay: 2.5s;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(10deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.circle-decoration {
  position: absolute;
  width: 500px;
  height: 500px;
  background-color: #fef9c3;
  border-radius: 50%;
  z-index: 0;
  bottom: 10%;
}

.image-right {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 650px;
  object-fit: contain;
  transform-origin: bottom center;
  margin-top: 80px;
}

.tilted-large-img {
  transform: scale(1.35) rotate(4deg) translateY(60px);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.tilted-medium-img {
  transform: scale(1.2) rotate(4deg) translateY(60px);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.normal-img {
  transform: scale(1.15) translateY(60px);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.image-right-wrapper:hover .tilted-large-img { transform: scale(1.4) rotate(6deg) translateY(60px); }
.image-right-wrapper:hover .tilted-medium-img { transform: scale(1.25) rotate(6deg) translateY(60px); }
.image-right-wrapper:hover .normal-img { transform: scale(1.2) translateY(50px); }

.btn-primary {
  background-color: #eab308;
  color: #ffffff;
  border: none;
  padding: 0.9rem 2.25rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.22s;
  box-shadow: 0 8px 20px -3px rgba(234, 179, 8, 0.4);
}

.btn-primary:hover {
  background-color: #ca8a04;
  transform: translateY(-2px);
  box-shadow: 0 14px 24px -3px rgba(234, 179, 8, 0.5);
}

.btn-secondary {
  background-color: #ffffff;
  color: #111827;
  border: 2px solid #e5e7eb;
  padding: 0.9rem 2.25rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.22s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.pagination-dots {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.6rem;
  z-index: 10;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: #d1d5db;
  cursor: pointer;
  transition: all 0.35s ease;
}

.dot.active {
  background-color: #eab308;
  width: 30px;
  border-radius: 8px;
}

/* ===== TABLET ===== */
@media (max-width: 992px) {
  .carousel-slide {
    padding: 4rem 5% 2.5rem;
  }

  .layout-right {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .content-left {
    max-width: 100%;
    order: 1;
  }

  .image-right-wrapper {
    order: 2;
    min-height: 380px;
    width: 100%;
  }

  .content-left h1 {
    font-size: 2.4rem;
  }

  .buttons-left {
    justify-content: center;
  }

  .circle-decoration {
    width: 380px;
    height: 380px;
  }

  .image-right {
    max-width: 420px;
    margin-top: 40px;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 576px) {
  .hero-carousel {
    padding-bottom: 2rem;
  }

  .carousel-slide {
    padding: 3.5rem 6% 1.5rem;
  }

  .badge {
    font-size: 0.68rem;
    padding: 0.4rem 0.9rem;
  }

  .content-left h1 {
    font-size: 1.7rem;
    margin-bottom: 0.9rem;
  }

  .content-left p {
    font-size: 0.92rem;
    margin-bottom: 1.5rem;
  }

  .buttons-left {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 0.8rem 1.5rem;
    font-size: 0.92rem;
  }

  .image-right-wrapper {
    min-height: 260px;
  }

  .circle-decoration {
    width: 260px;
    height: 260px;
  }

  .image-right {
    max-width: 280px;
    margin-top: 20px;
  }

  .tilted-large-img {
    transform: scale(1.1) rotate(4deg) translateY(30px);
  }

  .tilted-medium-img {
    transform: scale(1.05) rotate(4deg) translateY(30px);
  }

  .normal-img {
    transform: scale(1.05) translateY(30px);
  }

  .pagination-dots {
    bottom: 1rem;
  }

  .dot {
    width: 8px;
    height: 8px;
  }

  .dot.active {
    width: 22px;
  }
}
</style>
