<script setup lang="ts">
import type { Stock } from '@/data/stocks'

const props = defineProps<{
  stock: Stock
  showPrice?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="`/stocks/${stock.ticker}`"
    class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
  >
    <!-- Logo -->
    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold">
      {{ stock.logo }}
    </div>

    <!-- Info -->
    <div class="flex-1 overflow-hidden">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold">{{ stock.ticker }}</span>
        <Badge v-if="stock.sector" variant="secondary" class="text-[10px] px-1.5 py-0">
          {{ stock.sector }}
        </Badge>
      </div>
      <p class="truncate text-xs text-muted-foreground">{{ stock.name }}</p>
    </div>

    <!-- Price -->
    <div v-if="showPrice" class="text-right">
      <p class="text-sm font-bold">{{ stock.price.toLocaleString('id-ID') }}</p>
      <SharedPriceChange
        :change="stock.change"
        :change-percent="stock.changePercent"
        size="sm"
      />
    </div>
  </NuxtLink>
</template>
