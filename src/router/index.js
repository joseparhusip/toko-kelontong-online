import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RiwayatPesanan from '../components/RiwayatPesanan.vue'
import DetailPesanan from '../components/DetailPesanan.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/riwayat-pesanan',
      name: 'RiwayatPesanan',
      component: RiwayatPesanan,
    },
    {
      path: '/riwayat-pesanan/:id',
      name: 'DetailPesanan',
      component: DetailPesanan,
    },
  ],
})

export default router
