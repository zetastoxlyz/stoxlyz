import { ref, computed } from 'vue'
import { stocks, type Stock } from '@/data/stocks'

export const useSearch = () => {
  const query = ref('')

  const searchResults = computed<Stock[]>(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return []

    return stocks.filter(
      (s) =>
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    )
  })

  const searchStocks = (searchQuery: string): Stock[] => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []

    return stocks.filter(
      (s) =>
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    )
  }

  return {
    query,
    searchResults,
    searchStocks,
  }
}
