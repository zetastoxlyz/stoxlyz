<script setup lang="ts">
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesOptions,
  type HistogramSeriesOptions,
  type CandlestickData,
  type HistogramData,
  type Time,
  ColorType,
} from 'lightweight-charts'
import { formatCompact } from '@/lib/utils'

type TimeRange = '5H' | '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '3Y' | '5Y'

const INTRADAY_RANGES: TimeRange[] = ['5H', '1D']

type OHLCBar = {
  time: string | number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const props = defineProps<{
  ticker: string
  changePercent: number
}>()

const RANGES: TimeRange[] = ['5H', '1D', '1W', '1M', '3M', 'YTD', '1Y', '3Y', '5Y']
const range = ref<TimeRange>('1M')

const isIntraday = computed(() => INTRADAY_RANGES.includes(range.value))

const chartEl = ref<HTMLDivElement | null>(null)

let chart: IChartApi | null = null
let candleSeries: ISeriesApi<'Candlestick'> | null = null
let volumeSeries: ISeriesApi<'Histogram'> | null = null

const { data: rawData, status } = useApiFetch<OHLCBar[]>(
  () => `/api/stocks/${props.ticker}/history`,
  { query: computed(() => ({ range: range.value })), watch: [() => props.ticker, range] },
)

const bars = computed<OHLCBar[]>(() => rawData.value ?? [])

const isLoading = computed(() => status.value === 'pending')

const periodStats = computed(() => {
  const pts = bars.value
  if (!pts.length) return null
  const first = pts[0]!.open
  const last = pts[pts.length - 1]!.close
  const high = Math.max(...pts.map((p) => p.high))
  const low = Math.min(...pts.map((p) => p.low))
  const pct = ((last - first) / first) * 100
  const vol = pts.reduce((s, p) => s + p.volume, 0)
  return { first, last, high, low, pct, vol }
})

const UP_COLOR = '#22c55e'
const DOWN_COLOR = '#ef4444'
const UP_WICK = '#16a34a'
const DOWN_WICK = '#dc2626'

function initChart() {
  if (!chartEl.value) return

  chart = createChart(chartEl.value, {
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: '#71717a',
      fontSize: 10,
    },
    grid: {
      vertLines: { color: 'rgba(255,255,255,0.04)' },
      horzLines: { color: 'rgba(255,255,255,0.04)' },
    },
    crosshair: {
      vertLine: { color: 'rgba(255,255,255,0.2)', width: 1 as const, style: 2 as const },
      horzLine: { color: 'rgba(255,255,255,0.2)', width: 1 as const, style: 2 as const },
    },
    rightPriceScale: {
      borderVisible: false,
      textColor: '#71717a',
      // Leave room at bottom for volume bars
      scaleMargins: { top: 0.05, bottom: 0.25 },
    },
    timeScale: { borderVisible: false, timeVisible: isIntraday.value },
    handleScroll: true,
    handleScale: true,
  })

  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: UP_COLOR,
    downColor: DOWN_COLOR,
    borderUpColor: UP_COLOR,
    borderDownColor: DOWN_COLOR,
    wickUpColor: UP_WICK,
    wickDownColor: DOWN_WICK,
  } as Partial<CandlestickSeriesOptions>)

  // Volume overlaid in the bottom 25% of the same pane
  volumeSeries = chart.addSeries(HistogramSeries, {
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
  } as Partial<HistogramSeriesOptions>)

  chart.priceScale('volume').applyOptions({
    scaleMargins: { top: 0.75, bottom: 0 },
    borderVisible: false,
  })

  updateSeries()
}

watch(isIntraday, (intraday) => {
  chart?.applyOptions({ timeScale: { borderVisible: false, timeVisible: intraday } })
})

function updateSeries() {
  if (!candleSeries || !volumeSeries || !bars.value.length) return

  const candles: CandlestickData<Time>[] = bars.value.map((b) => ({
    time: b.time as Time,
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
  }))

  const vols: HistogramData<Time>[] = bars.value.map((b) => ({
    time: b.time as Time,
    value: b.volume,
    color: b.close >= b.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)',
  }))

  candleSeries.setData(candles)
  volumeSeries.setData(vols)
  chart?.timeScale().fitContent()
}

watch(bars, async () => {
  if (!bars.value.length) return
  if (!chart) {
    await nextTick()
    initChart()
  } else {
    updateSeries()
  }
})

onMounted(() => {
  if (bars.value.length) initChart()
})

onUnmounted(() => {
  chart?.remove()
  chart = null
})
</script>

<template>
  <div class="rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-xl">
    <!-- Period stats bar -->
    <div v-if="periodStats" class="mb-3 flex items-center gap-3 text-xs">
      <span class="text-muted-foreground">H: <span class="font-semibold text-foreground">{{ periodStats.high.toLocaleString() }}</span></span>
      <span class="text-muted-foreground">L: <span class="font-semibold text-foreground">{{ periodStats.low.toLocaleString() }}</span></span>
      <span class="text-muted-foreground">Vol: <span class="font-semibold text-foreground">{{ formatCompact(periodStats.vol) }}</span></span>
      <span
        class="ml-auto font-semibold"
        :class="periodStats.pct >= 0 ? 'text-emerald-500' : 'text-red-500'"
      >
        {{ periodStats.pct >= 0 ? '+' : '' }}{{ periodStats.pct.toFixed(2) }}%
      </span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="h-[600px] animate-pulse rounded-lg bg-muted/40" />

    <!-- Candlestick chart + volume overlaid -->
    <div v-show="!isLoading" ref="chartEl" class="h-[600px]" />

    <!-- Range tabs -->
    <div class="mt-3 flex items-center justify-between">
      <button
        v-for="r in RANGES"
        :key="r"
        class="flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors"
        :class="range === r
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:text-foreground'"
        @click="range = r"
      >
        {{ r }}
      </button>
    </div>
  </div>
</template>
