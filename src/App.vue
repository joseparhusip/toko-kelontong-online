<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  // Durasi loading screen tampil (ms). Ubah sesuai kebutuhan.
  setTimeout(() => {
    isLoading.value = false
    document.body.style.overflow = ''
  }, 2200)

  document.body.style.overflow = 'hidden'
})
</script>

<template>
  <!-- LOADING SCREEN -->
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-logo-wrapper">
        <img src="/logo.png" alt="Toko Kelontong" class="loading-logo" />
      </div>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </transition>

  <RouterView />
</template>

<style>
/* Styling global kita pindahkan sepenuhnya ke file css */

/* ===================== LOADING SCREEN ===================== */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #fffbeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  gap: 1.75rem;
}

.loading-logo-wrapper {
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.loading-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: flipLogo 1.4s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes flipLogo {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.loading-dots {
  display: flex;
  gap: 0.5rem;
}

.loading-dots span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #eab308;
  animation: dotBounce 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* Transisi fade saat loading screen hilang */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-enter-from {
  opacity: 0;
}

.loading-fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .loading-logo-wrapper {
    width: 100px;
    height: 100px;
  }

  .loading-dots span {
    width: 7px;
    height: 7px;
  }
}
</style>
