<script setup lang="ts">
import {
	AreaSeries,
	createChart,
	type IChartApi,
	type ISeriesApi,
	type LineData,
	type UTCTimestamp,
} from "lightweight-charts";

const props = defineProps<{
	ticker: string;
	changePercent: number;
	dayHigh?: number;
	dayLow?: number;
	height?: string;
}>();

type Range = "1D" | "1W" | "1M" | "3M" | "YTD" | "1Y" | "3Y" | "5Y";
const RANGES: Range[] = ["1D", "1W", "1M", "3M", "YTD", "1Y", "3Y", "5Y"];
const activeRange = ref<Range>("1D");

const chartEl = ref<HTMLElement | null>(null);
let chart: IChartApi | null = null;
let series: ISeriesApi<"Area"> | null = null;

const lineColor = computed(() =>
	props.changePercent >= 0 ? "#30d158" : "#ff453a",
);

const { data: historyData, pending } = useApiFetch<
	{ time: string | number; close: number }[]
>(() => `/api/stocks/${props.ticker}/history?range=${activeRange.value}`, {
	watch: [activeRange],
});

// Compute range % change from first→last point
const rangeChangePercent = computed(() => {
	const d = historyData.value;
	if (!d?.length || d.length < 2) return null;
	const first = d[0]!.close;
	const last = d[d.length - 1]!.close;
	return ((last - first) / first) * 100;
});

function buildChart() {
	if (!chartEl.value) return;
	const heightPx = chartEl.value.clientHeight || 200;

	chart = createChart(chartEl.value, {
		width: chartEl.value.clientWidth,
		height: heightPx,
		layout: {
			background: { color: "transparent" },
			textColor: "#8e8e93",
			fontSize: 11,
		},
		grid: {
			vertLines: { visible: false },
			horzLines: { color: "#2c2c2e", style: 0 },
		},
		crosshair: {
			mode: 1,
			vertLine: { color: "#636366", width: 1, style: 0, labelVisible: false },
			horzLine: { color: "#636366", width: 1, style: 0, labelVisible: false },
		},
		rightPriceScale: {
			borderVisible: false,
			scaleMargins: { top: 0.15, bottom: 0.1 },
		},
		timeScale: {
			borderVisible: false,
			timeVisible: activeRange.value === "1D" || activeRange.value === "1W",
			fixLeftEdge: true,
			fixRightEdge: true,
		},
		handleScroll: false,
		handleScale: false,
	});

	series = chart.addSeries(AreaSeries, {
		lineColor: lineColor.value,
		topColor: lineColor.value + "28",
		bottomColor: lineColor.value + "00",
		lineWidth: 2,
		priceLineVisible: false,
		lastValueVisible: false,
		crosshairMarkerRadius: 4,
	});
}

function updateData() {
	if (!series || !historyData.value?.length) return;
	const points: LineData[] = historyData.value.map((d) => ({
		time: (typeof d.time === "string" ? d.time : d.time) as UTCTimestamp,
		value: d.close,
	}));
	series.setData(points);
	chart?.timeScale().fitContent();
	chart?.applyOptions({
		timeScale: {
			timeVisible: activeRange.value === "1D" || activeRange.value === "1W",
		},
	});
}

onMounted(() => {
	buildChart();
	updateData();

	const ro = new ResizeObserver(() => {
		if (chart && chartEl.value) {
			chart.applyOptions({
				width: chartEl.value.clientWidth,
				height: chartEl.value.clientHeight,
			});
		}
	});
	if (chartEl.value) ro.observe(chartEl.value);
});

watch(historyData, updateData);

watch(lineColor, (color) => {
	series?.applyOptions({
		lineColor: color,
		topColor: color + "28",
		bottomColor: color + "00",
	});
});

watch(
	() => props.ticker,
	async () => {
		await nextTick();
		series?.setData([]);
	},
);

onUnmounted(() => {
	chart?.remove();
});
</script>

<template>
  <div class="overflow-hidden rounded-2xl bg-[#1c1c1e]">
    <!-- H/L row + range % -->
    <div class="flex items-center justify-between px-4 pt-3 pb-1">
      <span class="text-sm text-[#8e8e93]">
        <span class="font-medium text-white/80">H: {{ dayHigh?.toLocaleString() ?? '—' }}</span>
        <span class="mx-2 text-[#48484a]">|</span>
        <span class="font-medium text-white/80">L: {{ dayLow?.toLocaleString() ?? '—' }}</span>
      </span>
      <span
        v-if="rangeChangePercent !== null"
        class="text-sm font-semibold"
        :class="rangeChangePercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'"
      >
        {{ rangeChangePercent >= 0 ? '+' : '' }}{{ rangeChangePercent.toFixed(2) }}%
      </span>
    </div>

    <!-- Chart area -->
    <div
      class="relative"
      :style="{ height: props.height ? `calc(${props.height} - 80px)` : '200px' }"
    >
      <div ref="chartEl" class="h-full w-full" />
      <div
        v-if="pending"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
      </div>
    </div>

    <!-- Range tabs -->
    <div class="flex items-center justify-between px-3 pb-3 pt-1">
      <button
        v-for="r in RANGES"
        :key="r"
        class="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors"
        :class="activeRange === r
          ? 'bg-[#3a3a3c] text-white'
          : 'text-[#8e8e93] hover:text-white'"
        @click="activeRange = r"
      >
        {{ r }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide lightweight-charts branding */
div :deep(a[href*="tradingview"]),
div :deep(a[href*="lightweight"]) {
  display: none !important;
}
</style>
