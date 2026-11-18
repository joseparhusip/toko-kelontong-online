<script setup>
import { ref } from 'vue'
import { useSectionNav } from '../composables/useSectionNav'
import AppIcon from './ui/AppIcon.vue'

defineOptions({ name: 'AppFooter' })

const { goToSection } = useSectionNav()

const email = ref('')
const subscribed = ref(false)

const subscribe = () => {
  if (!email.value) return
  // TODO: sambungkan ke endpoint newsletter sungguhan
  subscribed.value = true
  email.value = ''
}

const shopLinks = [
  { id: 'kategori', label: 'Kategori' },
  { id: 'katalog-produk', label: 'Semua produk' },
  { id: 'promo', label: 'Promo' },
]

const helpLinks = [
  { to: '/cara-pemesanan', label: 'Cara pemesanan' },
  { to: '/faq', label: 'FAQ' },
  { to: '/hubungi-kami', label: 'Hubungi kami' },
  { to: '/tentang-kami', label: 'Tentang kami' },
]

const socials = [
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'message', label: 'WhatsApp' },
  { icon: 'music', label: 'TikTok' },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="top">
        <div class="brand">
          <img src="/logo.png" alt="Toko Kelontong" width="160" height="70" />
          <p>Warung kelontong online untuk kebutuhan dapur dan rumah, diantar ke depan pintu.</p>
          <ul class="contact">
            <li><AppIcon name="phone" :size="16" /> +62 812-3456-7890</li>
            <li><AppIcon name="mail" :size="16" /> hello@tokokelontong.id</li>
            <li><AppIcon name="clock" :size="16" /> Setiap hari, 07.00–21.00</li>
          </ul>
        </div>

        <nav class="col" aria-label="Belanja">
          <h4>Belanja</h4>
          <a v-for="l in shopLinks" :key="l.id" :href="`/#${l.id}`" @click.prevent="goToSection(l.id)">{{ l.label }}</a>
          <RouterLink to="/riwayat-pesanan">Riwayat pesanan</RouterLink>
        </nav>

        <nav class="col" aria-label="Bantuan">
          <h4>Bantuan</h4>
          <RouterLink v-for="l in helpLinks" :key="l.to" :to="l.to">{{ l.label }}</RouterLink>
        </nav>

        <div class="col news">
          <h4>Info promo</h4>
          <p>Kabar promo terbaru langsung ke inbox kamu.</p>
          <form v-if="!subscribed" @submit.prevent="subscribe">
            <label for="news-email" class="sr-only">Email</label>
            <input id="news-email" v-model="email" type="email" class="input" placeholder="email@kamu.com" required />
            <button type="submit" class="btn btn-primary">Daftar</button>
          </form>
          <p v-else class="ok"><AppIcon name="check" :size="16" /> Terima kasih, kamu sudah terdaftar.</p>
        </div>
      </div>

      <div class="bottom">
        <p>© {{ new Date().getFullYear() }} Toko Kelontong</p>
        <div class="legal">
          <RouterLink to="/kebijakan-privasi">Privasi</RouterLink>
          <RouterLink to="/syarat-ketentuan">Syarat &amp; ketentuan</RouterLink>
        </div>
        <div class="socials">
          <a v-for="s in socials" :key="s.label" href="#" class="icon-btn" :aria-label="s.label">
            <AppIcon :name="s.icon" :size="18" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--line);
  background: var(--bg);
  padding-top: 48px;
}

.top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px 24px;
  padding-bottom: 40px;
}

.brand {
  grid-column: 1 / -1;
}

.brand img {
  height: 44px;
  width: auto;
}

.brand > p {
  margin-top: 14px;
  color: var(--ink-2);
  font-size: 14px;
  max-width: 36ch;
}

.contact {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-2);
}

.contact li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact svg {
  color: var(--ink-3);
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-3);
  letter-spacing: 0;
  margin-bottom: 2px;
}

.col a {
  font-size: 14px;
  color: var(--ink-2);
  width: fit-content;
}

.col a:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.news {
  grid-column: 1 / -1;
}

.news p {
  font-size: 14px;
  color: var(--ink-2);
  max-width: 40ch;
}

.news form {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  max-width: 400px;
}

.news .input {
  height: 40px;
}

.news .ok {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--brand);
  font-weight: 500;
}

.bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  padding: 20px 0 28px;
  border-top: 1px solid var(--line);
  font-size: 13px;
  color: var(--ink-3);
}

.legal {
  display: flex;
  gap: 20px;
}

.legal a:hover {
  color: var(--ink);
}

.socials {
  display: flex;
  gap: 2px;
  margin-left: auto;
}

@media (min-width: 900px) {
  .top {
    grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
    gap: 48px;
  }
  .brand,
  .news {
    grid-column: auto;
  }
}
</style>
