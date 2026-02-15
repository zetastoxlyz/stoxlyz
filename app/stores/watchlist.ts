import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref<string[]>([])

  const loadFromStorage = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('StoxLyz-watchlist')
      if (stored) {
        try {
          items.value = JSON.parse(stored)
        } catch {
          items.value = []
        }
      }
    }
  }

  loadFromStorage()

  if (import.meta.client) {
    watch(
      items,
      (newItems) => {
        localStorage.setItem('StoxLyz-watchlist', JSON.stringify(newItems))
      },
      { deep: true }
    )
  }

  const addToWatchlist = (ticker: string) => {
    if (!items.value.includes(ticker)) {
      items.value.push(ticker)
    }
  }

  const removeFromWatchlist = (ticker: string) => {
    items.value = items.value.filter((t) => t !== ticker)
  }

  const isInWatchlist = (ticker: string): boolean => {
    return items.value.includes(ticker)
  }

  const toggleWatchlist = (ticker: string) => {
    if (isInWatchlist(ticker)) {
      removeFromWatchlist(ticker)
    } else {
      addToWatchlist(ticker)
    }
  }

  return {
    items,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  }
})
