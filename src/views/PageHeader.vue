<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <section class="page-header">
    <div class="page-header-inner">
      <RouterLink to="/" class="back-link">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Beranda
      </RouterLink>

      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>

    <!-- tepi sobekan nota -->
    <svg class="tear-edge" viewBox="0 0 1200 24" preserveAspectRatio="none">
      <path d="M0,0 L1200,0 L1200,14 L1185,22 L1170,14 L1155,22 L1140,14 L1125,22 L1110,14 L1095,22 L1080,14 L1065,22 L1050,14 L1035,22 L1020,14 L1005,22 L990,14 L975,22 L960,14 L945,22 L930,14 L915,22 L900,14 L885,22 L870,14 L855,22 L840,14 L825,22 L810,14 L795,22 L780,14 L765,22 L750,14 L735,22 L720,14 L705,22 L690,14 L675,22 L660,14 L645,22 L630,14 L615,22 L600,14 L585,22 L570,14 L555,22 L540,14 L525,22 L510,14 L495,22 L480,14 L465,22 L450,14 L435,22 L420,14 L405,22 L390,14 L375,22 L360,14 L345,22 L330,14 L315,22 L300,14 L285,22 L270,14 L255,22 L240,14 L225,22 L210,14 L195,22 L180,14 L165,22 L150,14 L135,22 L120,14 L105,22 L90,14 L75,22 L60,14 L45,22 L30,14 L15,22 L0,14 Z" fill="var(--tear-fill, #ffffff)"/>
    </svg>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,800;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.page-header {
  position: relative;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #fef3c7;
  background-image:
    radial-gradient(circle at 8% 15%, rgba(255,255,255,0.5) 0, transparent 45%),
    repeating-linear-gradient(135deg, rgba(180,83,9,0.04) 0px, rgba(180,83,9,0.04) 1px, transparent 1px, transparent 14px);
  padding: 7rem 5% 4.25rem;
}

.page-header-inner {
  max-width: 900px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #78350f;
  text-decoration: none;
  padding: 0.4rem 0.8rem 0.4rem 0.6rem;
  border: 1px solid rgba(180,83,9,0.25);
  border-radius: 100px;
  background-color: rgba(255,255,255,0.4);
  margin-bottom: 1.75rem;
  transition: background-color 0.2s, border-color 0.2s;
}

.back-link:hover {
  background-color: #ffffff;
  border-color: #b45309;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b45309;
  margin-bottom: 0.85rem;
}

.page-title {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-size: 3rem;
  line-height: 1.05;
  color: #18130f;
  margin: 0 0 0.85rem;
  letter-spacing: -0.01em;
}

.page-title::after {
  content: '';
  display: block;
  width: 46px;
  height: 3px;
  background-color: #166534;
  margin-top: 1rem;
  border-radius: 2px;
}

.page-subtitle {
  font-size: 1.02rem;
  color: #57534e;
  max-width: 560px;
  line-height: 1.65;
  margin: 0;
}

.tear-edge {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 22px;
  display: block;
}

@media (max-width: 576px) {
  .page-header {
    padding: 6.25rem 6% 3.25rem;
  }
  .page-title {
    font-size: 2.1rem;
  }
}
</style>
