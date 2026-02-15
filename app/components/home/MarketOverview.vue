<script setup lang="ts">
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-vue-next'

const marketData = [
  { name: 'IHSG', value: 7285.45, change: 1.21, icon: Activity, color: 'from-blue-500/20 to-cyan-500/20' },
  { name: 'LQ45', value: 985.32, change: 0.89, icon: TrendingUp, color: 'from-emerald-500/20 to-green-500/20' },
  { name: 'IDX30', value: 512.18, change: 1.05, icon: TrendingUp, color: 'from-violet-500/20 to-purple-500/20' },
  { name: 'IDR/USD', value: 15830, change: -0.22, icon: TrendingDown, color: 'from-orange-500/20 to-amber-500/20' },
]

// Animated counter
const counters = ref<number[]>(marketData.map(() => 0))
const visible = ref(false)

onMounted(() => {
  visible.value = true
  marketData.forEach((item, i) => {
    const target = item.value
    const duration = 1200
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      counters.value[i] = target * eased
      if (progress < 1) requestAnimationFrame(tick)
    }
    // Stagger start
    setTimeout(() => requestAnimationFrame(tick), i * 100)
  })
})

function formatValue(val: number, name: string) {
  if (name === 'IDR/USD') return Math.round(val).toLocaleString('id-ID')
  return val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <section>
    <!-- Hero header with animated gradient -->
    <div class="relative mb-4 overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-blue-500/10 via-card to-purple-500/10 p-5">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.06),transparent_60%)]" />

      <div class="relative">
        <div class="mb-1 flex items-center gap-2">
          <div class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
            <div class="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          </div>
          <span class="text-xs font-medium text-green-500">{{ $t('home.marketOpen') }}</span>
        </div>

        <div class="flex items-end gap-3">
          <div>
            <p class="text-xs text-muted-foreground">{{ $t('home.ihsgComposite') }}</p>
            <p class="text-4xl font-extrabold tracking-tight tabular-nums">
              {{ formatValue(counters[0], 'IHSG') }}
            </p>
          </div>
          <div class="mb-1 flex items-center gap-1 rounded-full bg-gain/10 px-2.5 py-1">
            <TrendingUp class="h-3.5 w-3.5 text-gain" />
            <span class="text-sm font-bold text-gain">+1.21%</span>
          </div>
        </div>

        <!-- Mini sparkline decoration -->
        <svg class="mt-3 h-8 w-full opacity-40" viewBox="0 0 200 30" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="hsl(var(--gain))"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            points="0,25 15,22 30,18 45,20 60,15 75,17 90,12 105,14 120,8 135,10 150,6 165,9 180,4 200,7"
          />
        </svg>
      </div>
    </div>

    <!-- Index cards -->
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="(item, i) in marketData.slice(1)"
        :key="item.name"
        class="group cursor-default rounded-xl border border-border/30 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/60 hover:shadow-lg hover:shadow-black/5"
        :class="[
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ]"
        :style="{ transitionDelay: `${(i + 1) * 80}ms` }"
      >
        <div class="mb-1.5 flex items-center gap-1.5">
          <div class="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br" :class="item.color">
            <component :is="item.icon" class="h-3 w-3 text-foreground/70" />
          </div>
          <span class="text-[10px] font-medium text-muted-foreground">{{ item.name }}</span>
        </div>
        <p class="text-lg font-bold tabular-nums leading-none">
          {{ formatValue(counters[i + 1], item.name) }}
        </p>
        <p
          class="mt-1 text-xs font-semibold"
          :class="item.change >= 0 ? 'text-gain' : 'text-loss'"
        >
          {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
        </p>
      </div>
    </div>
  </section>
</template>
