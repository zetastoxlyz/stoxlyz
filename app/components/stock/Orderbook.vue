<script setup lang="ts">
import { formatCompact } from '@/lib/utils'
import { getStockHistory } from '@/data/stockHistory'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  ticker: string
  price: number
  change: number
  volume: number
  high52w: number
  low52w: number
  pe: number
  pbv: number
  dividendYield: number
  marketCap: number
}>()

// Seeded PRNG for deterministic ladder data
function seededRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const tickerSeed = props.ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

// ── Today's OHLC ──────────────────────────────────────────────────────────────
const todayOHLC = computed(() => {
  const h = getStockHistory(props.ticker)
  return h[h.length - 1] ?? null
})
const open = computed(() => todayOHLC.value?.open ?? props.price)
const prevClose = computed(() => {
  const h = getStockHistory(props.ticker)
  return h.length >= 2 ? (h[h.length - 2]?.close ?? props.price - props.change) : props.price - props.change
})
const high = computed(() => todayOHLC.value?.high ?? props.price)
const low  = computed(() => todayOHLC.value?.low  ?? props.price)

const ara  = computed(() => Math.round(prevClose.value * 1.35))
const arb  = computed(() => Math.round(prevClose.value * 0.70))

const lot  = computed(() => formatCompact(props.volume / 100))
const val  = computed(() => formatCompact(props.volume * props.price))
const avg  = computed(() => Math.round((open.value + props.price) / 2))
const freq = computed(() => formatCompact(Math.round(props.volume / 450)))
const fBuy = computed(() => formatCompact(Math.round(props.volume * props.price * 0.38)))
const fSell= computed(() => formatCompact(Math.round(props.volume * props.price * 0.51)))

const statsRows = computed(() => [
  [
    { label: 'Open',   value: open.value.toLocaleString(),      color: '' },
    { label: 'Prev',   value: prevClose.value.toLocaleString(), color: '' },
    { label: 'Lot',    value: lot.value,                        color: 'text-gain' },
  ],
  [
    { label: 'High',   value: high.value.toLocaleString(),      color: 'text-gain' },
    { label: 'ARA',    value: ara.value.toLocaleString(),       color: '' },
    { label: 'Val',    value: val.value,                        color: 'text-gain' },
  ],
  [
    { label: 'Low',    value: low.value.toLocaleString(),       color: 'text-loss' },
    { label: 'ARB',    value: arb.value.toLocaleString(),       color: '' },
    { label: 'Avg',    value: avg.value.toLocaleString(),       color: 'text-gain' },
  ],
  [
    { label: 'F Buy',  value: fBuy.value,                       color: 'text-gain' },
    { label: 'F Sell', value: fSell.value,                      color: 'text-loss' },
    { label: 'Freq',   value: freq.value,                       color: 'text-gain' },
  ],
])

// ── Bid/Ask Ladder ────────────────────────────────────────────────────────────
// IDX tick size rules (simplified)
function tickSize(p: number): number {
  if (p < 200)    return 1
  if (p < 500)    return 2
  if (p < 2000)   return 5
  if (p < 5000)   return 10
  return 25
}

type LadderRow = {
  bidFreq: number
  bidLot: number
  bid: number
  ask: number
  askLot: number
  askFreq: number
}

const ladder = computed<LadderRow[]>(() => {
  const rand = seededRand(tickerSeed)
  const tick = tickSize(props.price)
  // Best bid just below current price, best ask just above
  const bestBid = props.price - tick
  const bestAsk = props.price + tick

  return Array.from({ length: 10 }, (_, i) => {
    const bid = bestBid - i * tick
    const ask = bestAsk + i * tick
    // More volume near the spread, less further out
    const proximity = 1 / (i + 1)
    const bidLot  = Math.round((rand() * 800 + 50) * proximity)
    const askLot  = Math.round((rand() * 800 + 50) * proximity)
    const bidFreq = Math.round(rand() * 40 * proximity + 1)
    const askFreq = Math.round(rand() * 40 * proximity + 1)
    return { bidFreq, bidLot, bid, ask, askLot, askFreq }
  })
})

// Max lot across all rows — for proportional volume bar widths
const maxLot = computed(() =>
  Math.max(...ladder.value.flatMap(r => [r.bidLot, r.askLot]))
)

const totalBidLot  = computed(() => ladder.value.reduce((s, r) => s + r.bidLot, 0))
const totalAskLot  = computed(() => ladder.value.reduce((s, r) => s + r.askLot, 0))
const totalBidFreq = computed(() => ladder.value.reduce((s, r) => s + r.bidFreq, 0))
const totalAskFreq = computed(() => ladder.value.reduce((s, r) => s + r.askFreq, 0))

function lotWidth(lot: number) {
  return `${Math.min(100, (lot / maxLot.value) * 100)}%`
}

// ── Trade Book ────────────────────────────────────────────────────────────────
type TradeBookTab = 'chart' | 'price' | 'time'
const tradeBookTab = ref<TradeBookTab>('price')
const TRADE_BOOK_TABS: { value: TradeBookTab; label: string }[] = [
  { value: 'chart', label: 'Chart' },
  { value: 'price', label: 'Price' },
  { value: 'time',  label: 'Time'  },
]

type TradeRow = {
  price: number
  tLot: number
  tFreq: number
  bLot: number
  sLot: number
  bFreq: number
  sFreq: number
}

const tradeByPrice = computed<TradeRow[]>(() => {
  const rand = seededRand(tickerSeed + 99)
  const tick = tickSize(props.price)
  // Generate 16 price levels centred around current price
  return Array.from({ length: 16 }, (_, i) => {
    const offset = (8 - i) * tick
    const p = props.price + offset
    const tLot  = Math.round((rand() * 10000 + 100) / (Math.abs(offset / tick) + 1))
    const bLot  = Math.round(tLot * (0.3 + rand() * 0.5))
    const sLot  = tLot - bLot
    const tFreq = Math.round(tLot * (0.005 + rand() * 0.02))
    const bFreq = Math.round(tFreq * (0.3 + rand() * 0.5))
    const sFreq = Math.max(1, tFreq - bFreq)
    return { price: p, tLot, tFreq, bLot, sLot, bFreq, sFreq }
  })
})

type TimeRow = { time: string; price: number; lot: number; type: 'B' | 'S' }

const tradeByTime = computed<TimeRow[]>(() => {
  const rand = seededRand(tickerSeed + 77)
  const tick = tickSize(props.price)
  const base = new Date('2026-02-26T09:00:00')
  return Array.from({ length: 20 }, (_) => {
    base.setMinutes(base.getMinutes() + Math.round(rand() * 15 + 1))
    const offset = Math.round((rand() - 0.5) * 6) * tick
    return {
      time: base.toTimeString().slice(0, 5),
      price: props.price + offset,
      lot: Math.round(rand() * 500 + 1),
      type: (rand() > 0.5 ? 'B' : 'S') as 'B' | 'S',
    }
  }).reverse()
})

// Cumulative buy/sell lot series over time (from tradeByTime, oldest → newest)
const tradeChartData = computed<ChartData<'line'>>(() => {
  const rows = [...tradeByTime.value].reverse() // oldest first
  let cumBuy = 0
  let cumSell = 0
  const buyPoints: number[] = []
  const sellPoints: number[] = []
  for (const row of rows) {
    if (row.type === 'B') cumBuy += row.lot
    else cumSell += row.lot
    buyPoints.push(cumBuy)
    sellPoints.push(cumSell)
  }
  return {
    labels: rows.map(r => r.time),
    datasets: [
      {
        label: 'Buy',
        data: buyPoints,
        borderColor: 'rgb(52,211,153)',
        backgroundColor: 'rgba(52,211,153,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Sell',
        data: sellPoints,
        borderColor: 'rgb(251,113,133)',
        backgroundColor: 'rgba(251,113,133,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
    ],
  }
})

const tradeChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(9,9,11,0.92)',
      titleColor: '#a1a1aa',
      bodyColor: '#fff',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      padding: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#71717a', font: { size: 9 }, maxTicksLimit: 6, maxRotation: 0 },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: '#71717a',
        font: { size: 9 },
        callback: (v) => {
          const n = Number(v)
          return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
        },
      },
      border: { display: false },
    },
  },
}))
</script>

<template>
  <div class="space-y-3">
    <!-- Stats grid: Open/Prev/Lot … F.Buy/F.Sell/Freq -->
    <div class="rounded-2xl border border-border/50 bg-card/80 p-3 backdrop-blur-xl">
      <div class="space-y-1.5">
        <div
          v-for="(row, ri) in statsRows"
          :key="ri"
          class="grid grid-cols-3 gap-1.5"
        >
          <div
            v-for="cell in row"
            :key="cell.label"
            class="flex items-center justify-between rounded-lg bg-muted/20 px-2 py-1.5"
          >
            <span class="text-[10px] text-muted-foreground">{{ cell.label }}</span>
            <span class="text-xs font-semibold" :class="cell.color || 'text-foreground'">
              {{ cell.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- 52-week range bar -->
      <div class="mt-3">
        <div class="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>52W Low: {{ low52w.toLocaleString() }}</span>
          <span>52W High: {{ high52w.toLocaleString() }}</span>
        </div>
        <div class="h-1.5 w-full rounded-full bg-muted/40">
          <div
            class="h-1.5 rounded-full bg-blue-500"
            :style="{ width: `${Math.min(100, Math.max(0, ((price - low52w) / (high52w - low52w)) * 100))}%` }"
          />
        </div>
        <div class="mt-0.5 text-center text-[10px] text-muted-foreground">
          Current: {{ price.toLocaleString() }}
        </div>
      </div>
    </div>

    <!-- Bid / Ask Ladder -->
    <div class="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden">
      <!-- Column headers -->
      <div class="grid grid-cols-[2.5rem_3.5rem_1fr_1fr_3.5rem_2.5rem] border-b border-border/40 px-2 py-2 text-[10px] font-semibold text-muted-foreground">
        <span class="text-center">Freq</span>
        <span class="text-right">Lot</span>
        <span class="text-right pr-2">Bid</span>
        <span class="text-left pl-2">Ask</span>
        <span class="text-left">Lot</span>
        <span class="text-center">Freq</span>
      </div>

      <!-- Ladder rows -->
      <div
        v-for="(row, i) in ladder"
        :key="i"
        class="grid grid-cols-[2.5rem_3.5rem_1fr_1fr_3.5rem_2.5rem] items-center border-b border-border/10 text-[11px]"
        :class="i === 0 ? 'bg-muted/10' : ''"
      >
        <!-- Bid Freq -->
        <span class="py-1.5 text-center text-blue-400">{{ row.bidFreq }}</span>

        <!-- Bid Lot with red bar behind (right-aligned bar) -->
        <div class="relative py-1.5 text-right">
          <div
            class="absolute right-0 top-0 h-full rounded-sm bg-loss/15"
            :style="{ width: lotWidth(row.bidLot) }"
          />
          <span class="relative z-10 pr-1 text-foreground">{{ row.bidLot.toLocaleString() }}</span>
        </div>

        <!-- Bid Price -->
        <div class="py-1.5 text-right pr-2">
          <span class="font-semibold text-loss">{{ row.bid.toLocaleString() }}</span>
        </div>

        <!-- Ask Price -->
        <div class="py-1.5 text-left pl-2">
          <span class="font-semibold text-gain">{{ row.ask.toLocaleString() }}</span>
        </div>

        <!-- Ask Lot with green bar behind (left-aligned bar) -->
        <div class="relative py-1.5">
          <div
            class="absolute left-0 top-0 h-full rounded-sm bg-gain/15"
            :style="{ width: lotWidth(row.askLot) }"
          />
          <span class="relative z-10 pl-1 text-foreground">{{ row.askLot.toLocaleString() }}</span>
        </div>

        <!-- Ask Freq -->
        <span class="py-1.5 text-center text-blue-400">{{ row.askFreq }}</span>
      </div>

      <!-- Totals row -->
      <div class="grid grid-cols-[2.5rem_3.5rem_1fr_1fr_3.5rem_2.5rem] items-center border-t border-border/40 bg-muted/10 px-0 py-2 text-[11px] font-bold">
        <span class="text-center text-blue-400">{{ totalBidFreq }}</span>
        <span class="text-right pr-1 text-foreground">{{ totalBidLot.toLocaleString() }}</span>
        <span class="pr-2 text-right text-muted-foreground text-[9px] font-normal">Total</span>
        <span class="pl-2 text-left text-muted-foreground text-[9px] font-normal">Total</span>
        <span class="pl-1 text-foreground">{{ totalAskLot.toLocaleString() }}</span>
        <span class="text-center text-blue-400">{{ totalAskFreq }}</span>
      </div>
    </div>
    <!-- Trade Book -->
    <div class="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden">
      <!-- Header + sub-tabs -->
      <div class="flex items-center justify-between border-b border-border/40 px-3 py-2.5">
        <span class="text-sm font-semibold">Trade Book</span>
        <div class="flex gap-1">
          <button
            v-for="tab in TRADE_BOOK_TABS"
            :key="tab.value"
            class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            :class="tradeBookTab === tab.value
              ? 'bg-blue-500/15 text-blue-500 ring-1 ring-blue-500/40'
              : 'text-muted-foreground hover:text-foreground'"
            @click="tradeBookTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Price view -->
      <template v-if="tradeBookTab === 'price'">
        <div class="overflow-x-auto">
          <table class="w-full text-[11px]">
            <thead>
              <tr class="border-b border-border/40 text-muted-foreground">
                <th class="px-3 py-2 text-right font-medium">Price</th>
                <th class="px-3 py-2 text-right font-medium">T.Lot</th>
                <th class="px-3 py-2 text-right font-medium">T.Freq</th>
                <th class="px-3 py-2 text-right font-medium text-gain">B.Lot</th>
                <th class="px-3 py-2 text-right font-medium text-loss">S.Lot</th>
                <th class="px-3 py-2 text-right font-medium text-gain">B.Freq</th>
                <th class="px-3 py-2 text-right font-medium text-loss">S.Freq</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in tradeByPrice"
                :key="row.price"
                class="border-b border-border/10 hover:bg-accent/20"
                :class="row.price === price ? 'bg-blue-500/5' : ''"
              >
                <td
                  class="px-3 py-1.5 text-right font-semibold"
                  :class="row.price > price ? 'text-gain' : row.price < price ? 'text-loss' : 'text-yellow-500'"
                >
                  {{ row.price.toLocaleString() }}
                </td>
                <td class="px-3 py-1.5 text-right text-foreground">{{ row.tLot.toLocaleString() }}</td>
                <td class="px-3 py-1.5 text-right text-foreground">{{ row.tFreq.toLocaleString() }}</td>
                <td class="px-3 py-1.5 text-right text-gain">{{ row.bLot.toLocaleString() }}</td>
                <td class="px-3 py-1.5 text-right text-loss">{{ row.sLot > 0 ? row.sLot.toLocaleString() : '-' }}</td>
                <td class="px-3 py-1.5 text-right text-gain">{{ row.bFreq.toLocaleString() }}</td>
                <td class="px-3 py-1.5 text-right text-loss">{{ row.sFreq > 0 ? row.sFreq.toLocaleString() : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Time view -->
      <template v-else-if="tradeBookTab === 'time'">
        <div class="overflow-x-auto">
          <table class="w-full text-[11px]">
            <thead>
              <tr class="border-b border-border/40 text-muted-foreground">
                <th class="px-3 py-2 text-left font-medium">Time</th>
                <th class="px-3 py-2 text-right font-medium">Price</th>
                <th class="px-3 py-2 text-right font-medium">Lot</th>
                <th class="px-3 py-2 text-center font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in tradeByTime"
                :key="i"
                class="border-b border-border/10 hover:bg-accent/20"
              >
                <td class="px-3 py-1.5 text-left text-muted-foreground">{{ row.time }}</td>
                <td class="px-3 py-1.5 text-right font-semibold" :class="row.type === 'B' ? 'text-gain' : 'text-loss'">
                  {{ row.price.toLocaleString() }}
                </td>
                <td class="px-3 py-1.5 text-right text-foreground">{{ row.lot.toLocaleString() }}</td>
                <td class="px-3 py-1.5 text-center">
                  <span
                    class="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    :class="row.type === 'B' ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'"
                  >{{ row.type }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Chart view -->
      <template v-else>
        <div class="p-3">
          <div class="h-64">
            <Line :data="tradeChartData" :options="tradeChartOptions" />
          </div>
          <div class="mt-2 flex justify-center gap-4 text-[10px] text-muted-foreground">
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-0.5 w-4 rounded-full bg-emerald-400" />Buy
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-0.5 w-4 rounded-full bg-rose-400" />Sell
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
