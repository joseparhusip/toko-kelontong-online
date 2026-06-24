import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  const searchQuery = ref('')
  const activeCategory = ref('')

  function setCategory(cat) {
    activeCategory.value = activeCategory.value === cat ? '' : cat
    searchQuery.value = ''
  }

  function setSearch(query) {
    searchQuery.value = query
    activeCategory.value = ''
  }

  function clearAll() {
    searchQuery.value = ''
    activeCategory.value = ''
  }

  return { searchQuery, activeCategory, setCategory, setSearch, clearAll }
})
