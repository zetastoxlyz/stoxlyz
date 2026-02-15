<script setup lang="ts">
import { useNews } from '@/composables/useNews'
import { timeAgo } from '@/lib/utils'

const props = defineProps<{ ticker: string }>()

const { getNewsForStock, getNews } = useNews()
const articles = computed(() => {
  const related = getNewsForStock(props.ticker)
  return related.length > 0 ? related.slice(0, 3) : getNews().slice(0, 3)
})
</script>

<template>
  <Card class="glass-card p-4">
    <h3 class="mb-3 text-sm font-semibold">{{ $t('stock.relatedNews') }}</h3>

    <div class="space-y-3">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/news/${article.id}`"
        class="block rounded-lg p-2 transition-colors hover:bg-accent/30"
      >
        <p class="line-clamp-2 text-sm font-medium leading-snug">{{ article.title }}</p>
        <div class="mt-1 flex items-center gap-2">
          <span class="text-[10px] text-muted-foreground">{{ article.source }}</span>
          <span class="text-[10px] text-muted-foreground">{{ timeAgo(article.date) }}</span>
        </div>
      </NuxtLink>
    </div>
  </Card>
</template>
