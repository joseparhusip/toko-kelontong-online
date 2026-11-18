<script setup>
defineProps({
  sections: { type: Array, required: true },
  numbered: { type: Boolean, default: false },
})
</script>

<template>
  <div class="container narrow doc">
    <section v-for="(s, i) in sections" :key="s.title">
      <h2>
        <span v-if="numbered" class="num">{{ i + 1 }}.</span>
        {{ s.title }}
      </h2>
      <p>{{ s.body }}</p>
    </section>
  </div>
</template>

<style scoped>
.narrow {
  max-width: calc(760px + var(--gutter) * 2);
}

.doc {
  padding-top: 24px;
  padding-bottom: 80px;
}

section {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

h2 {
  font-size: 17px;
}

h2 span {
  color: var(--ink-3);
  margin-right: 4px;
}

p {
  margin-top: 6px;
  color: var(--ink-2);
  line-height: 1.65;
}
</style>
