<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'AppFooter'
})

const newsletterEmail = ref('')
const subscribed = ref(false)

// accordion untuk kolom Menu & Informasi di tampilan mobile
const openCol = ref(null)
const toggleCol = (name) => {
  if (window.innerWidth > 576) return // di desktop selalu terbuka, gak perlu accordion
  openCol.value = openCol.value === name ? null : name
}

const subscribe = () => {
  if (!newsletterEmail.value) return
  // TODO: sambungkan ke endpoint/store subscribe sungguhan
  subscribed.value = true
  newsletterEmail.value = ''
  setTimeout(() => (subscribed.value = false), 3500)
}
</script>

<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Top Section -->
      <div class="footer-top">

        <!-- Brand -->
        <div class="footer-brand">
          <img src="/logo.png" alt="Toko Kelontong" class="footer-logo" />
          <p class="footer-tagline">
            Solusi belanja kebutuhan pokok online yang cepat, hemat, dan terpercaya untuk keluarga Anda.
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="footer-col" :class="{ open: openCol === 'menu' }">
          <h4 class="footer-col-title" @click="toggleCol('menu')">Menu</h4>
          <ul class="footer-links">
            <li><RouterLink to="/">Beranda</RouterLink></li>
            <li><a href="#kategori" @click.prevent="$router.push('/').then(() => document.getElementById('kategori')?.scrollIntoView({behavior:'smooth'}))">Kategori</a></li>
            <li><a href="#katalog-produk" @click.prevent="$router.push('/').then(() => document.getElementById('katalog-produk')?.scrollIntoView({behavior:'smooth'}))">Produk</a></li>
            <li><a href="#promo" @click.prevent="$router.push('/').then(() => document.getElementById('promo')?.scrollIntoView({behavior:'smooth'}))">Promo</a></li>
            <li><RouterLink to="/tentang-kami">Tentang Kami</RouterLink></li>
          </ul>
        </div>

        <!-- Info -->
        <div class="footer-col" :class="{ open: openCol === 'informasi' }">
          <h4 class="footer-col-title" @click="toggleCol('informasi')">Informasi</h4>
          <ul class="footer-links">
            <li><RouterLink to="/cara-pemesanan">Cara Pemesanan</RouterLink></li>
            <li><RouterLink to="/kebijakan-privasi">Kebijakan Privasi</RouterLink></li>
            <li><RouterLink to="/syarat-ketentuan">Syarat & Ketentuan</RouterLink></li>
            <li><RouterLink to="/faq">FAQ</RouterLink></li>
            <li><RouterLink to="/hubungi-kami">Hubungi Kami</RouterLink></li>
          </ul>
        </div>

        <!-- Subscribe -->
        <div class="footer-col footer-col-wide">
          <h4 class="footer-col-title">Dapatkan Info Promo</h4>
          <p class="footer-col-desc">Daftar sekarang dan dapatkan notifikasi promo terbaru langsung di inbox kamu.</p>
          <form class="subscribe-form" @submit.prevent="subscribe">
            <input type="email" v-model="newsletterEmail" placeholder="email@kamu.com" required />
            <button type="submit">Daftar</button>
          </form>
          <p v-if="subscribed" class="subscribe-success">✓ Berhasil berlangganan!</p>
          <div class="contact-info">
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+62 812-3456-7890</span>
            </div>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>hello@tokokelontong.id</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p>&copy; 2026 Toko Kelontong Online. All rights reserved.</p>
        <div class="footer-bottom-links">
          <RouterLink to="/kebijakan-privasi">Privasi</RouterLink>
          <span class="sep">·</span>
          <RouterLink to="/syarat-ketentuan">Ketentuan</RouterLink>
          <span class="sep">·</span>
          <a href="#">Cookie</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.footer {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #0f172a;
  color: #94a3b8;
  padding: 5rem 5% 0;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* TOP */
.footer-top {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.8fr;
  gap: 3rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid #1e293b;
}

/* BRAND */
.footer-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1.1rem;
}

.footer-tagline {
  font-size: 0.875rem;
  line-height: 1.75;
  color: #64748b;
  max-width: 280px;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #1e293b;
  color: #64748b;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

.social-btn:hover {
  background-color: #eab308;
  color: #ffffff;
  transform: translateY(-2px);
}

/* COLUMNS */
.footer-col-title {
  color: #f1f5f9;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.4rem;
  user-select: none;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer-links a {
  text-decoration: none;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s, padding-left 0.2s;
  display: inline-block;
}

.footer-links a:hover {
  color: #eab308;
  padding-left: 4px;
}

/* SUBSCRIBE */
.footer-col-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.65;
  margin-bottom: 1.1rem;
  font-weight: 400;
}

.subscribe-form {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #1e293b;
  margin-bottom: 1.4rem;
}

.subscribe-form input {
  flex: 1;
  padding: 0.72rem 1rem;
  background-color: #1e293b;
  color: #f1f5f9;
  border: none;
  outline: none;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.subscribe-form input::placeholder {
  color: #475569;
}

.subscribe-form button {
  background-color: #eab308;
  color: #ffffff;
  border: none;
  padding: 0.72rem 1.2rem;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.subscribe-form button:hover {
  background-color: #ca8a04;
}

.subscribe-success {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4ade80;
  margin: -0.9rem 0 1.4rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.contact-item svg {
  color: #eab308;
  flex-shrink: 0;
}

/* BOTTOM */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 0;
  font-size: 0.8rem;
  color: #475569;
  font-weight: 500;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-bottom-links a {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-bottom-links a:hover {
  color: #eab308;
}

.sep {
  color: #334155;
}

/* ===== TABLET ===== */
@media (max-width: 992px) {
  .footer {
    padding: 4rem 5% 0;
  }

  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .footer-col-wide {
    grid-column: 1 / -1;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 576px) {
  .footer {
    padding: 3rem 6% 0;
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: 0;
    padding-bottom: 1.5rem;
  }

  .footer-brand {
    text-align: left;
    margin-bottom: 2rem;
  }

  .footer-tagline {
    margin-left: 0;
    margin-right: 0;
    max-width: 100%;
  }

  .social-links {
    justify-content: flex-start;
  }

  /* kolom menu/informasi jadi accordion collapsible */
  .footer-col {
    text-align: left;
    border-top: 1px solid #1e293b;
    padding: 1.15rem 0;
  }

  .footer-col-wide {
    border-bottom: 1px solid #1e293b;
    padding-bottom: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .footer-col-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
    cursor: pointer;
  }

  .footer-col-title::after {
    content: '+';
    font-size: 1.1rem;
    font-weight: 400;
    color: #64748b;
  }

  .footer-col.open .footer-col-title::after {
    content: '−';
  }

  .footer-links {
    align-items: flex-start;
    max-height: 0;
    overflow: hidden;
    gap: 0;
    margin-top: 0;
    transition: max-height 0.3s ease;
  }

  .footer-col.open .footer-links {
    max-height: 400px;
    margin-top: 1.1rem;
  }

  .footer-links li {
    padding: 0.35rem 0;
  }

  .footer-col-wide .footer-col-title::after {
    content: '';
  }

  .subscribe-form {
    flex-direction: column;
    border-radius: 0.85rem;
  }

  .subscribe-form input,
  .subscribe-form button {
    width: 100%;
  }

  .contact-info {
    align-items: flex-start;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
    align-items: flex-start;
    padding: 1.5rem 0;
  }
}
</style>
