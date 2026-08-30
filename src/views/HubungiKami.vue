<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import AppFooter from '../components/Footer.vue'
import PageHeader from './PageHeader.vue'

const form = ref({ nama: '', email: '', pesan: '' })
const sent = ref(false)
const sending = ref(false)

const submitForm = () => {
  if (!form.value.nama || !form.value.email || !form.value.pesan) return
  sending.value = true
  setTimeout(() => {
    sending.value = false
    sent.value = true
    form.value = { nama: '', email: '', pesan: '' }
    setTimeout(() => (sent.value = false), 4000)
  }, 900)
}

const contacts = [
  { icon: 'phone', title: 'Telepon / WhatsApp', value: '+62 812-3456-7890' },
  { icon: 'mail', title: 'Email', value: 'hello@tokokelontong.id' },
  { icon: 'pin', title: 'Alamat', value: 'Jl. Merdeka No. 45, Bandung, Jawa Barat' },
  { icon: 'clock', title: 'Jam Operasional', value: 'Setiap hari, 07.00 - 21.00 WIB' }
]
</script>

<template>
  <Navbar />

  <PageHeader
    eyebrow="Pusat Bantuan"
    title="Hubungi Kami"
    subtitle="Ada pertanyaan, keluhan, atau saran? Tulis pesanmu, tim kami akan segera membalas."
  />

  <section class="contact-section">
    <div class="contact-grid">
      <!-- Info -->
      <div class="contact-info-col">
        <div class="info-item" v-for="(c, i) in contacts" :key="i">
          <span class="info-icon">
            <svg v-if="c.icon === 'phone'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <svg v-else-if="c.icon === 'mail'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <svg v-else-if="c.icon === 'pin'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <div>
            <h4>{{ c.title }}</h4>
            <p>{{ c.value }}</p>
          </div>
        </div>

        <div class="map-note">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          Kunjungi toko fisik kami untuk pengalaman belanja langsung.
        </div>
      </div>

      <!-- Form -->
      <form class="contact-form" @submit.prevent="submitForm">
        <h3>Kirim Pesan</h3>

        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.nama" placeholder="Masukkan nama kamu" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="email@kamu.com" required />
        </div>

        <div class="form-group">
          <label>Pesan</label>
          <textarea v-model="form.pesan" rows="5" placeholder="Tulis pertanyaan atau keluhanmu di sini..." required></textarea>
        </div>

        <button type="submit" class="submit-btn" :disabled="sending">
          <span v-if="!sending">Kirim Pesan</span>
          <span v-else>Mengirim...</span>
          <svg v-if="!sending" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>

        <p class="success-msg" v-if="sent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          Pesan berhasil dikirim, kami akan segera membalas!
        </p>
      </form>
    </div>
  </section>

  <AppFooter />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.contact-section {
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 1050px;
  margin: 0 auto;
  padding: 4.5rem 5% 5.5rem;
  background-color: #ffffff;
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.3fr;
  gap: 3rem;
}

/* INFO */
.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.15rem;
  border: 1px solid #f1ede1;
  border-radius: 14px;
  transition: border-color 0.2s, background-color 0.2s;
}

.info-item:hover {
  border-color: #fde68a;
  background-color: #fffdf5;
}

.info-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fef9c3;
  border: 1.5px solid #eab308;
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-item h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #18130f;
  margin: 0 0 0.2rem;
}

.info-item p {
  font-size: 0.83rem;
  color: #78716c;
  margin: 0;
  line-height: 1.5;
}

.map-note {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: #166534;
  padding: 1rem 1.15rem;
  background-color: #f0fdf4;
  border-radius: 14px;
  border: 1px dashed #bbf7d0;
  line-height: 1.5;
}

.map-note svg {
  flex-shrink: 0;
}

/* FORM */
.contact-form {
  background-color: #fffdf5;
  border: 1px solid #f1ede1;
  border-radius: 20px;
  padding: 2.25rem;
}

.contact-form h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #18130f;
  margin: 0 0 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #44403c;
  margin-bottom: 0.45rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e7dfce;
  border-radius: 10px;
  background-color: #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  color: #18130f;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #eab308;
}

.submit-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  background-color: #18130f;
  color: #ffffff;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2c231b;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0 0;
  color: #166534;
  font-size: 0.85rem;
  font-weight: 600;
  justify-content: center;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .contact-section {
    padding: 3.5rem 6% 4rem;
  }
}
</style>
