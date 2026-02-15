<script setup lang="ts">
import { TrendingUp, TrendingDown, Zap } from 'lucide-vue-next'
import { useStocks } from '@/composables/useStocks'
import { formatCompact } from '@/lib/utils'

const { t } = useI18n()
const { getTopGainers, getTopLosers, getMostActive } = useStocks()
const activeTab = ref('gainers')

const tabs = computed(() => [
  { value: 'gainers', label: t('home.gainers'), icon: TrendingUp, color: 'text-gain' },
  { value: 'losers', label: t('home.losers'), icon: TrendingDown, color: 'text-loss' },
  { value: 'active', label: t('home.active'), icon: Zap, color: 'text-yellow-400' },
])

const currentStocks = computed(() => {
  switch (activeTab.value) {
    case 'gainers': return getTopGainers(5)
    case 'losers': return getTopLosers(5)
    case 'active': return getMostActive(5)
    default: return []
  }
})

// Track which row is being hovered for highlight
const hoveredIdx = ref<number | null>(null)
</script>

<template>
  <section>
    <h2 class="mb-3 text-lg font-bold">{{ $t('home.topMovers') }}</h2>

    <!-- Custom pill tabs -->
    <div class="mb-3 flex gap-1.5 rounded-xl border border-border/30 bg-card/30 p-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-accent text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab.value"
      >
        <component :is="tab.icon" class="h-3.5 w-3.5" :class="activeTab === tab.value && tab.color" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Stock list with hover interactions -->
    <div class="overflow-hidden rounded-xl border border-border/30">
      <NuxtLink
        v-for="(stock, i) in currentStocks"
        :key="stock.ticker"
        :to="`/stocks/${stock.ticker}`"
        class="flex items-center gap-3 border-b border-border/20 p-3 transition-all duration-200 last:border-0"
        :class="[
          hoveredIdx === i ? 'bg-accent/40' : 'bg-transparent',
        ]"
        :style="{ animationDelay: `${i * 60}ms` }"
        @mouseenter="hoveredIdx = i"
        @mouseleave="hoveredIdx = null"
      >
        <!-- Rank -->
        <span class="w-5 text-center text-xs font-bold text-muted-foreground">{{ i + 1 }}</span>

        <!-- Logo -->
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold transition-transform duration-200"
          :class="hoveredIdx === i && 'scale-110'"
        >
          {{ stock.logo }}
        </div>

        <!-- Info -->
        <div class="flex-1 overflow-hidden">
          <span class="text-sm font-bold">{{ stock.ticker }}</span>
          <p class="truncate text-[11px] text-muted-foreground">{{ stock.name }}</p>
        </div>

        <!-- Volume (for active tab) -->
        <div v-if="activeTab === 'active'" class="text-right">
          <p class="text-xs text-muted-foreground">{{ $t('home.vol') }}</p>
          <p class="text-sm font-bold tabular-nums">{{ formatCompact(stock.volume) }}</p>
        </div>

        <!-- Price & Change -->
        <div class="text-right">
          <p class="text-sm font-bold tabular-nums">{{ stock.price.toLocaleString('id-ID') }}</p>
          <p
            class="text-xs font-semibold tabular-nums"
            :class="stock.changePercent >= 0 ? 'text-gain' : 'text-loss'"
          >
            {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
          </p>
        </div>

        <!-- Micro bar indicator -->
        <div class="h-8 w-1 rounded-full" :class="stock.changePercent >= 0 ? 'bg-gain/40' : 'bg-loss/40'">
          <div
            class="w-full rounded-full transition-all duration-500"
            :class="stock.changePercent >= 0 ? 'bg-gain' : 'bg-loss'"
            :style="{ height: `${Math.min(Math.abs(stock.changePercent) * 15, 100)}%` }"
          />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
