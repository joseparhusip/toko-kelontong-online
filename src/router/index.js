import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RiwayatPesanan from '../components/RiwayatPesanan.vue'
import DetailPesanan from '../components/DetailPesanan.vue'

import CaraPemesanan from '../views/CaraPemesanan.vue'
import KebijakanPrivasi from '../views/KebijakanPrivasi.vue'
import SyaratKetentuan from '../views/SyaratKetentuan.vue'
import FAQ from '../views/FAQ.vue'
import HubungiKami from '../views/HubungiKami.vue'

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
    {
      path: '/cara-pemesanan',
      name: 'cara-pemesanan',
      component: CaraPemesanan,
    },
    {
      path: '/kebijakan-privasi',
      name: 'kebijakan-privasi',
      component: KebijakanPrivasi,
    },
    {
      path: '/syarat-ketentuan',
      name: 'syarat-ketentuan',
      component: SyaratKetentuan,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
    },
    {
      path: '/hubungi-kami',
      name: 'hubungi-kami',
      component: HubungiKami,
    },
    {
      path: '/tentang-kami',
      name: 'tentang-kami',
      component: AboutView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
