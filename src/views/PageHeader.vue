<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <div class="container narrow">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  padding: 40px 0 8px;
}

.narrow {
  max-width: calc(760px + var(--gutter) * 2);
}

h1 {
  font-size: 30px;
  letter-spacing: -0.025em;
}

p {
  margin-top: 10px;
  font-size: 16px;
  color: var(--ink-2);
  max-width: 56ch;
}

@media (min-width: 768px) {
  .page-header {
    padding-top: 64px;
  }
  h1 {
    font-size: 40px;
  }
  p {
    font-size: 17px;
  }
}
</style>
