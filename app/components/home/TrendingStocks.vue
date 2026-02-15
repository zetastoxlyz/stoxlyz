<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import { useStocks } from '@/composables/useStocks'

const { getTrendingStocks } = useStocks()
const trending = getTrendingStocks()

// Duplicate for seamless marquee
const marqueeItems = [...trending, ...trending]
const isPaused = ref(false)
</script>

<template>
  <section>
    <div class="mb-3 flex items-center gap-2">
      <Flame class="h-4 w-4 text-orange-400" />
      <h2 class="text-lg font-bold">{{ $t('home.trendingNow') }}</h2>
    </div>

    <!-- Marquee scroll -->
    <div
      class="relative overflow-hidden rounded-xl border border-border/30 bg-card/30 py-2.5"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
      @touchstart="isPaused = true"
      @touchend="isPaused = false"
    >
      <!-- Fade edges -->
      <div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />
      <div class="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />

      <div
        class="flex gap-3 px-4"
        :class="isPaused ? 'animate-paused' : 'animate-marquee'"
      >
        <NuxtLink
          v-for="(stock, i) in marqueeItems"
          :key="`${stock.ticker}-${i}`"
          :to="`/stocks/${stock.ticker}`"
          class="flex shrink-0 items-center gap-2.5 rounded-full border border-border/40 bg-card/60 px-3.5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-accent/40 hover:shadow-md active:scale-95"
        >
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[11px] font-bold">
            {{ stock.logo }}
          </div>
          <span class="text-xs font-bold">{{ stock.ticker }}</span>
          <span
            class="rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
            :class="stock.changePercent >= 0
              ? 'bg-gain/10 text-gain'
              : 'bg-loss/10 text-loss'"
          >
            {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
