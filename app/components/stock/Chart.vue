<script setup lang="ts">
const props = defineProps<{
  ticker: string
  changePercent: number
}>()

// Convert "BBCA.JK" → "IDX:BBCA"
const tvSymbol = computed(() => {
  const base = props.ticker.replace(/\.JK$/i, '')
  return `IDX:${base}`
})

const containerId = computed(() => `tv_chart_${props.ticker.replace(/\W/g, '_')}`)

const { locale } = useI18n()

// Map nuxt-i18n locale to TradingView locale
const tvLocale = computed(() => (locale.value === 'id' ? 'id_ID' : 'en'))

function loadWidget() {
  const el = document.getElementById(containerId.value)
  if (!el) return

  // Clear previous widget instance
  el.innerHTML = ''

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  script.async = true
  script.innerHTML = JSON.stringify({
    autosize: true,
    symbol: tvSymbol.value,
    interval: 'D',
    timezone: 'Asia/Jakarta',
    theme: 'dark',
    style: '1',
    locale: tvLocale.value,
    allow_symbol_change: false,
    calendar: false,
    support_host: 'https://www.tradingview.com',
  })

  el.appendChild(script)
}

onMounted(() => {
  loadWidget()
})

watch(tvSymbol, async () => {
  await nextTick()
  loadWidget()
})
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border/50 bg-[#131722]">
    <div class="tradingview-widget-container h-[520px]">
      <div :id="containerId" class="tradingview-widget-container__widget h-full" />
    </div>
  </div>
</template>
