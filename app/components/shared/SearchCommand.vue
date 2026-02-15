<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { stocks } from '@/data/stocks'

const { t } = useI18n()

const open = defineModel<boolean>('open', { default: false })

const searchQuery = ref('')
const router = useRouter()

const filteredStocks = computed(() => {
  if (!searchQuery.value) return stocks.slice(0, 10)
  const q = searchQuery.value.toLowerCase()
  return stocks.filter(
    s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  ).slice(0, 10)
})

function selectStock(ticker: string) {
  open.value = false
  searchQuery.value = ''
  router.push(`/stocks/${ticker}`)
}

// Keyboard shortcut
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open.value = !open.value
    }
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput
      v-model="searchQuery"
      :placeholder="t('search.placeholder')"
    />
    <CommandList>
      <CommandEmpty>{{ $t('search.noResults') }}</CommandEmpty>
      <CommandGroup :heading="$t('search.heading')">
        <CommandItem
          v-for="stock in filteredStocks"
          :key="stock.ticker"
          :value="stock.ticker"
          class="flex items-center gap-3 cursor-pointer"
          @select="selectStock(stock.ticker)"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">
            {{ stock.logo }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold">{{ stock.ticker }}</p>
            <p class="text-xs text-muted-foreground">{{ stock.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium">{{ stock.price.toLocaleString('id-ID') }}</p>
            <p
              class="text-xs"
              :class="stock.changePercent >= 0 ? 'text-gain' : 'text-loss'"
            >
              {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
            </p>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
