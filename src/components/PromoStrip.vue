<script setup>
import { ref } from 'vue'
import { usePromoSignal } from '../stores/usePromoSignal'
import AppIcon from './ui/AppIcon.vue'

const promoSignal = usePromoSignal()

// Harus sama persis dengan salah satu kode di CartDrawer.vue
const PROMO_CODE = 'Toko Kelontong 20'
const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(PROMO_CODE)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard diblokir: kode tetap terlihat di layar */
  }
}

const perks = [
  { icon: 'truck', title: 'Ongkir gratis', desc: 'Semua pesanan' },
  { icon: 'clock', title: 'Sampai 1–3 jam', desc: 'Untuk dalam kota' },
  { icon: 'card', title: 'Bayar online', desc: 'QRIS, VA, e-wallet' },
]
</script>

<template>
  <section id="promo" class="promo">
    <div class="container">
      <div class="strip">
        <div class="copy">
          <p class="kicker">Pesanan pertama</p>
          <h1>Diskon 20% untuk semua kategori</h1>
          <div class="actions">
            <button class="code" :aria-label="`Salin kode ${PROMO_CODE}`" @click="copyCode">
              <span class="code-text">{{ PROMO_CODE }}</span>
              <span class="code-copy">
                <AppIcon :name="copied ? 'check' : 'receipt'" :size="14" />
                {{ copied ? 'Tersalin' : 'Salin' }}
              </span>
            </button>
            <button class="btn btn-dark" @click="promoSignal.request(PROMO_CODE)">Pakai sekarang</button>
          </div>
        </div>
        <img src="/banners/promo-banner.jpeg" alt="" class="art" width="1376" height="768" fetchpriority="high" />
      </div>

      <ul class="perks">
        <li v-for="p in perks" :key="p.title">
          <span class="perk-icon"><AppIcon :name="p.icon" :size="18" /></span>
          <span>
            <strong>{{ p.title }}</strong>
            <small>{{ p.desc }}</small>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.promo {
  padding-top: 16px;
}

.strip {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: 16px;
  overflow: hidden;
}

.copy {
  position: relative;
  z-index: 1;
  padding: 18px 18px 20px;
}

.kicker {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.75;
}

h1 {
  margin-top: 2px;
  font-size: 22px;
  line-height: 1.2;
  color: inherit;
  letter-spacing: -0.01em;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.code {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  height: 40px;
  border: 1.5px dashed rgba(43, 33, 0, 0.4);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  font-size: 14px;
}

.code-text {
  padding: 0 12px;
  white-space: nowrap;
  font-weight: 700;
}

.code-copy {
  flex: 0 0 auto;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 100%;
  padding: 0 10px;
  border-left: 1.5px dashed rgba(43, 33, 0, 0.25);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
}

.code:hover .code-copy {
  background: var(--accent-soft);
}

.art {
  width: 100%;
  height: 120px;
  object-fit: cover;
  object-position: 60% 50%;
}

/* Keunggulan */
.perks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.perks li {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.perk-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--brand-soft);
  color: var(--brand);
}

.perks strong {
  display: block;
  font-size: 13px;
  line-height: 1.3;
}

.perks small {
  display: block;
  font-size: 12px;
  color: var(--ink-3);
}

@media (min-width: 768px) {
  .promo {
    padding-top: 24px;
  }
  .strip {
    flex-direction: row;
    align-items: stretch;
    height: 220px;
  }
  .copy {
    flex: 1 1 55%;
    padding: 32px 0 32px 36px;
    align-self: center;
  }
  h1 {
    font-size: 30px;
    max-width: 18ch;
  }
  .actions {
    margin-top: 20px;
  }
  .art {
    flex: 0 0 48%;
    width: 48%;
    height: 100%;
    min-width: 0;
    /* Pudar ke kuning di sisi kiri supaya menyatu dengan panel */
    mask-image: linear-gradient(to right, transparent 0, #000 22%);
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 22%);
  }
  .perks {
    gap: 12px;
  }
  .perks li {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
  }
  .perk-icon {
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
  }
  .perks strong {
    font-size: 14px;
  }
  .perks small {
    font-size: 13px;
  }
}
</style>
