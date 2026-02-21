<script setup lang="ts">
import { ArrowLeft, Clock } from 'lucide-vue-next'
import { useNews } from '~/composables/useNews'
import { newsContent } from '~/data/news-content'
import { timeAgo } from '~/lib/utils'

const localePath = useLocalePath()
const route = useRoute()
const articleId = computed(() => route.params.id as string)

const { getNewsById } = useNews()
const article = computed(() => getNewsById(articleId.value))

const colorMode = useColorMode()
const heroLoaded = ref(false)

watch(articleId, () => { heroLoaded.value = false })

useHead({
  title: computed(() => article.value ? `${article.value.title} - StoxLyz` : 'Article Not Found'),
})

watchEffect(() => {
  if (!article.value) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }
})

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  }
  else {
    navigateTo(localePath('/news'))
  }
}
</script>

<template>
  <div v-if="article">
    <Button variant="ghost" size="sm" class="mb-4 h-8 gap-1 px-2" @click="goBack">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      {{ $t('news.back') }}
    </Button>

    <!-- Hero image -->
    <div class="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
      <div
        v-if="!heroLoaded"
        class="absolute inset-0 animate-pulse bg-muted"
      />
      <img
        :src="article.imageUrl"
        :alt="article.title"
        class="h-full w-full object-cover transition-opacity duration-300"
        :class="heroLoaded ? 'opacity-100' : 'opacity-0'"
        @load="heroLoaded = true"
      >
    </div>

    <!-- Meta -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <Badge>{{ article.category }}</Badge>
      <Badge variant="secondary">{{ article.source }}</Badge>
      <div class="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock class="h-3 w-3" aria-hidden="true" />
        {{ timeAgo(article.date) }}
      </div>
    </div>

    <!-- Title -->
    <h1 class="mb-2 text-2xl font-bold leading-tight">{{ article.title }}</h1>
    <p class="mb-6 text-base text-muted-foreground">{{ article.summary }}</p>

    <Separator class="my-6" />

    <!-- Content -->
    <div :class="['prose prose-sm max-w-none', colorMode.value === 'dark' ? 'prose-invert' : '']">
      <p
        v-for="(paragraph, i) in (newsContent[articleId] ?? '').split('\n\n')"
        :key="i"
        class="mb-4 text-sm leading-relaxed text-foreground/80"
      >
        {{ paragraph }}
      </p>
    </div>

    <!-- Related tickers -->
    <div v-if="article.relatedTickers.length" class="mt-6">
      <h2 class="mb-2 text-sm font-semibold">{{ $t('stock.relatedStocks') }}</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="ticker in article.relatedTickers"
          :key="ticker"
          :to="localePath(`/stocks/${ticker}`)"
        >
          <Badge variant="outline" class="cursor-pointer hover:bg-accent">
            {{ ticker }}
          </Badge>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
