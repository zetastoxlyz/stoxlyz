<script setup lang="ts">
import { ChevronRight, Clock, Newspaper } from 'lucide-vue-next'
import { useNews } from '@/composables/useNews'
import { timeAgo } from '@/lib/utils'

const { getNews } = useNews()
const latestNews = computed(() => getNews().slice(0, 4))
</script>

<template>
  <section>
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Newspaper class="h-4 w-4 text-blue-400" />
        <h2 class="text-lg font-bold">{{ $t('home.latestNews') }}</h2>
      </div>
      <NuxtLink
        to="/news"
        class="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
      >
        {{ $t('home.seeAll') }} <ChevronRight class="h-3 w-3" />
      </NuxtLink>
    </div>

    <div class="space-y-2">
      <NuxtLink
        v-for="(article, i) in latestNews"
        :key="article.id"
        :to="`/news/${article.id}`"
        class="group flex gap-3 rounded-xl border border-border/30 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/60 hover:bg-accent/20 hover:shadow-md active:scale-[0.99]"
      >
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-xs font-bold text-muted-foreground transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-400">
          {{ String(i + 1).padStart(2, '0') }}
        </div>

        <div class="flex-1 overflow-hidden">
          <p class="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-foreground">
            {{ article.title }}
          </p>
          <div class="mt-1.5 flex items-center gap-2">
            <Badge variant="secondary" class="text-[10px] px-1.5 py-0">
              {{ article.source }}
            </Badge>
            <div class="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock class="h-2.5 w-2.5" />
              {{ timeAgo(article.date) }}
            </div>
          </div>
        </div>

        <ChevronRight class="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground/60" />
      </NuxtLink>
    </div>
  </section>
</template>
