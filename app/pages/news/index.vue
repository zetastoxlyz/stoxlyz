<script setup lang="ts">
import { useNews } from '@/composables/useNews'

const { t } = useI18n()

useHead({ title: computed(() => `${t('news.title')} - StoxLyz`) })

const { getNews, getFeaturedNews, getNewsByCategory } = useNews()
const selectedCategory = ref('all')

const featured = computed(() => getFeaturedNews())
const articles = computed(() => {
  const all = selectedCategory.value === 'all'
    ? getNews()
    : getNewsByCategory(selectedCategory.value)
  // Skip the featured article from the list
  return all.filter(a => a.id !== featured.value?.id)
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-2xl font-bold">{{ $t('news.title') }}</h1>
    <p class="mb-4 text-sm text-muted-foreground">{{ $t('news.subtitle') }}</p>

    <NewsFilter v-model="selectedCategory" class="mb-4" />

    <div class="space-y-4">
      <NewsFeatured v-if="featured && selectedCategory === 'all'" :article="featured" />

      <div class="space-y-2">
        <NewsCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          class="stagger-item"
        />
      </div>

      <div v-if="articles.length === 0" class="py-12 text-center text-sm text-muted-foreground">
        {{ $t('news.noArticles') }}
      </div>
    </div>
  </div>
</template>
