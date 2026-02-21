<script setup lang="ts">
import { ArrowLeft, Star, StarOff } from 'lucide-vue-next'
import { useStocks } from '~/composables/useStocks'
import { useWatchlistStore } from '~/stores/watchlist'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const ticker = computed(() => (route.params.ticker as string).toUpperCase())

const { getStock } = useStocks()
const stock = computed(() => getStock(ticker.value))

const watchlistStore = useWatchlistStore()
const isWatched = computed(() => watchlistStore.isInWatchlist(ticker.value))

useHead({
  title: computed(() => stock.value ? `${stock.value.ticker} - ${stock.value.name}` : 'Stock Not Found'),
})

watchEffect(() => {
  if (!stock.value) {
    throw createError({ statusCode: 404, statusMessage: 'Stock not found' })
  }
})

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  }
  else {
    navigateTo(localePath('/'))
  }
}
</script>

<template>
  <div v-if="stock" class="space-y-4">
    <!-- Back button -->
    <Button variant="ghost" size="sm" class="h-8 gap-1 px-2" @click="goBack">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      {{ $t('stock.back') }}
    </Button>

    <StockHeader :stock="stock" />

    <div class="space-y-4">
      <StockStats :stock="stock" />
      <StockAbout :stock="stock" />
      <StockFinancials :stock="stock" />
      <StockNews :ticker="stock.ticker" />
    </div>

    <!-- FAB: Add to watchlist -->
    <button
      class="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 lg:bottom-8"
      :class="isWatched ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'"
      :aria-label="isWatched ? $t('stock.removeFromWatchlist') : $t('stock.addToWatchlist')"
      :aria-pressed="isWatched"
      @click="watchlistStore.toggleWatchlist(ticker)"
    >
      <StarOff v-if="isWatched" class="h-5 w-5" aria-hidden="true" />
      <Star v-else class="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</template>
