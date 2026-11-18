<script setup>
import AppIcon from '../components/ui/AppIcon.vue'

defineProps({
  title: { type: String, default: 'Ada pertanyaan lain?' },
})
</script>

<template>
  <aside class="help">
    <p>{{ title }}</p>
    <RouterLink to="/hubungi-kami" class="btn btn-secondary">
      Hubungi kami
      <AppIcon name="arrow-right" :size="16" />
    </RouterLink>
  </aside>
</template>

<style scoped>
.help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-top: 40px;
  padding: 20px;
  border-radius: var(--r-lg);
  background: var(--surface-2);
}

.help p {
  font-weight: 600;
}
</style>
