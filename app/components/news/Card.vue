<script setup lang="ts">
import type { NewsArticle } from '@/data/news'
import { timeAgo } from '@/lib/utils'

defineProps<{ article: NewsArticle }>()
</script>

<template>
  <NuxtLink
    :to="`/news/${article.id}`"
    class="flex gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-accent/20"
  >
    <div class="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
    <div class="flex-1 overflow-hidden">
      <p class="line-clamp-2 text-sm font-medium leading-snug">{{ article.title }}</p>
      <p class="mt-1 line-clamp-1 text-xs text-muted-foreground">{{ article.summary }}</p>
      <div class="mt-2 flex items-center gap-2">
        <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{{ article.source }}</Badge>
        <span class="text-[10px] text-muted-foreground">{{ timeAgo(article.date) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
