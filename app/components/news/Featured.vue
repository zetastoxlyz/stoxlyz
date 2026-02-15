<script setup lang="ts">
import type { NewsArticle } from '@/data/news'
import { timeAgo } from '@/lib/utils'

defineProps<{ article: NewsArticle }>()
</script>

<template>
  <NuxtLink
    :to="`/news/${article.id}`"
    class="block overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-transform hover:scale-[1.01]"
  >
    <div class="aspect-video w-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
    <div class="p-4">
      <div class="mb-2 flex items-center gap-2">
        <Badge variant="secondary" class="text-[10px]">{{ article.category }}</Badge>
        <span class="text-[10px] text-muted-foreground">{{ article.source }}</span>
        <span class="text-[10px] text-muted-foreground">{{ timeAgo(article.date) }}</span>
      </div>
      <h2 class="mb-1 text-lg font-bold leading-tight">{{ article.title }}</h2>
      <p class="line-clamp-2 text-sm text-muted-foreground">{{ article.summary }}</p>
      <div v-if="article.relatedTickers.length" class="mt-3 flex flex-wrap gap-1">
        <Badge
          v-for="ticker in article.relatedTickers"
          :key="ticker"
          variant="outline"
          class="text-[10px]"
        >
          {{ ticker }}
        </Badge>
      </div>
    </div>
  </NuxtLink>
</template>
