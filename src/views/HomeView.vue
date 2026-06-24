<script setup>
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import CategoryList from '../components/CategoryList.vue'
import ProductList from '../components/ProductList.vue'
import PromoBanner from '../components/PromoBanner.vue'
import Features from '../components/Features.vue'
import Testimonial from '../components/Testimonial.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="home-layout">
    <Navbar />
    <HeroSection />
    <CategoryList />
    <ProductList />
    <PromoBanner />
    <Features />
    <Testimonial />
    <Footer />
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
