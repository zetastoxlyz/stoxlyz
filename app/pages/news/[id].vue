<script setup lang="ts">
import { ArrowLeft, Clock, ExternalLink } from 'lucide-vue-next'
import { useNews } from '@/composables/useNews'
import { newsContent } from '@/data/news-content'
import { timeAgo } from '@/lib/utils'

const route = useRoute()
const router = useRouter()
const articleId = computed(() => route.params.id as string)

const { getNewsById } = useNews()
const article = computed(() => getNewsById(articleId.value))

useHead({
  title: computed(() => article.value ? `${article.value.title} - StoxLyz` : 'Article Not Found'),
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}
</script>

<template>
  <div v-if="article">
    <Button variant="ghost" size="sm" class="mb-4 h-8 gap-1 px-2" @click="router.back()">
      <ArrowLeft class="h-4 w-4" />
      {{ $t('news.back') }}
    </Button>

    <!-- Hero image -->
    <div class="mb-4 aspect-video w-full rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

    <!-- Meta -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <Badge>{{ article.category }}</Badge>
      <Badge variant="secondary">{{ article.source }}</Badge>
      <div class="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock class="h-3 w-3" />
        {{ timeAgo(article.date) }}
      </div>
    </div>

    <!-- Title -->
    <h1 class="mb-2 text-2xl font-bold leading-tight">{{ article.title }}</h1>
    <p class="mb-6 text-base text-muted-foreground">{{ article.summary }}</p>

    <Separator class="my-6" />

    <!-- Content -->
    <div class="prose prose-sm prose-invert max-w-none">
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
      <h3 class="mb-2 text-sm font-semibold">{{ $t('stock.relatedStocks') }}</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="ticker in article.relatedTickers"
          :key="ticker"
          :to="`/stocks/${ticker}`"
        >
          <Badge variant="outline" class="cursor-pointer hover:bg-accent">
            {{ ticker }}
          </Badge>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
