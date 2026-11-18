import { useRoute, useRouter } from 'vue-router'

// Navigasi ke section di beranda dari halaman mana pun.
// - Sudah di beranda: langsung scroll.
// - Di halaman lain: pindah ke "/#id", lalu router.scrollBehavior yang
//   menggulir ke elemennya (lihat src/router/index.js).
// Offset header ditangani `scroll-padding-top` di base.css.
export function useSectionNav() {
  const route = useRoute()
  const router = useRouter()

  const goToSection = (id) => {
    if (route.name !== 'home') {
      router.push({ name: 'home', hash: id === 'beranda' ? '' : `#${id}` })
      return
    }
    if (id === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { goToSection }
}
