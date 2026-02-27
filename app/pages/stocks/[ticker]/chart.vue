<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import type { StockDetail } from '@/data/stocksData'

definePageMeta({ layout: 'blank' })

const route = useRoute()
const localePath = useLocalePath()

const ticker = computed(() => {
  const raw = (route.params.ticker as string).toUpperCase()
  return raw.endsWith('.JK') ? raw : `${raw}.JK`
})

const { data: stock } = useApiFetch<StockDetail>(
  () => `/api/stocks/${ticker.value}/summary`,
  { watch: [ticker] },
)

useHead({
  title: computed(() => stock.value ? `${ticker.value.replace('.JK', '')} Chart - StoxLyz` : 'Chart'),
})
</script>

<template>
  <div class="relative h-dvh w-full bg-[#131722]">
    <!-- TradingView chart fills the entire viewport -->
    <StockChart
      v-if="stock"
      :ticker="ticker"
      :change-percent="stock.changePercent"
      height="100dvh"
    />

    <!-- Top overlay bar -->
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2">
      <!-- Ticker + name -->
      <div class="pointer-events-auto rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
        <span class="text-sm font-bold text-white">{{ ticker.replace('.JK', '') }}</span>
        <span v-if="stock" class="ml-2 text-xs text-white/60">{{ stock.name }}</span>
      </div>

      <!-- Back button -->
      <NuxtLink
        :to="localePath(`/stocks/${ticker.replace('.JK', '')}`)"
        class="pointer-events-auto flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm hover:text-white"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        Back
      </NuxtLink>
    </div>
  </div>
</template>
