<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const form = ref({ nama: '', email: '', pesan: '' })
const sent = ref(false)
const sending = ref(false)

const submitForm = () => {
  if (!form.value.nama || !form.value.email || !form.value.pesan) return
  sending.value = true
  // TODO: sambungkan ke endpoint sungguhan
  setTimeout(() => {
    sending.value = false
    sent.value = true
    form.value = { nama: '', email: '', pesan: '' }
  }, 700)
}

const contacts = [
  { icon: 'message', title: 'WhatsApp', value: '+62 812-3456-7890', href: 'https://wa.me/6281234567890' },
  { icon: 'mail', title: 'Email', value: 'hello@tokokelontong.id', href: 'mailto:hello@tokokelontong.id' },
  { icon: 'pin', title: 'Alamat', value: 'Jl. Merdeka No. 45, Bandung' },
  { icon: 'clock', title: 'Jam buka', value: 'Setiap hari, 07.00–21.00 WIB' },
]
</script>

<template>
  <Navbar />

  <main>
    <PageHeader title="Hubungi kami" subtitle="Paling cepat lewat WhatsApp." />

    <div class="container body">
      <ul class="contacts">
        <li v-for="c in contacts" :key="c.title">
          <AppIcon :name="c.icon" :size="20" />
          <div>
            <p class="label">{{ c.title }}</p>
            <a v-if="c.href" :href="c.href" target="_blank" rel="noopener">{{ c.value }}</a>
            <p v-else>{{ c.value }}</p>
          </div>
        </li>
      </ul>

      <div class="card form-wrap">
        <div v-if="sent" class="sent">
          <AppIcon name="check-circle" :size="28" />
          <h2>Pesan terkirim</h2>
          <button class="btn btn-secondary" @click="sent = false">Kirim pesan lain</button>
        </div>

        <form v-else @submit.prevent="submitForm">
          <h2>Kirim pesan</h2>
          <div class="field">
            <label for="f-nama">Nama</label>
            <input id="f-nama" v-model="form.nama" class="input" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="f-email">Email</label>
            <input id="f-email" v-model="form.email" type="email" class="input" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="f-pesan">Pesan</label>
            <textarea id="f-pesan" v-model="form.pesan" rows="5" class="input" required />
          </div>
          <button type="submit" class="btn btn-primary btn-lg" :disabled="sending">
            {{ sending ? 'Mengirim…' : 'Kirim' }}
          </button>
        </form>
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.body {
  max-width: calc(1000px + var(--gutter) * 2);
  display: grid;
  gap: 32px;
  padding-top: 24px;
  padding-bottom: 80px;
}

.contacts li {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.contacts li:first-child {
  border-top: 1px solid var(--line);
}

.contacts svg {
  flex: 0 0 auto;
  margin-top: 2px;
  color: var(--brand);
}

.label {
  font-size: 13px;
  color: var(--ink-3);
}

.contacts a {
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 3px;
}

.contacts a:hover {
  text-decoration-color: currentColor;
}

.contacts p:not(.label) {
  font-weight: 600;
}

.form-wrap {
  padding: 24px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

form h2,
.sent h2 {
  font-size: 18px;
}

form .btn {
  align-self: flex-start;
}

.sent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  color: var(--brand);
}

.sent h2 {
  color: var(--ink);
}

@media (min-width: 860px) {
  .body {
    grid-template-columns: 1fr 1.3fr;
    gap: 56px;
    align-items: start;
  }
  .form-wrap {
    padding: 32px;
  }
}
</style>
