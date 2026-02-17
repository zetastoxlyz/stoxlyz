<script setup lang="ts">
import { Search, Newspaper } from 'lucide-vue-next'
import { newsArticles } from '@/data/news'

const { t } = useI18n()
const localePath = useLocalePath()

const open = defineModel<boolean>('open', { default: false })

const searchQuery = ref('')
const router = useRouter()

const filteredNews = computed(() => {
  if (!searchQuery.value) return newsArticles.slice(0, 8)
  const q = searchQuery.value.toLowerCase()
  return newsArticles.filter(
    n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
  ).slice(0, 8)
})

function selectArticle(id: string) {
  open.value = false
  searchQuery.value = ''
  router.push(localePath(`/news/${id}`))
}

// Keyboard shortcut
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open.value = !open.value
    }
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput
      v-model="searchQuery"
      :placeholder="t('search.placeholder')"
    />
    <CommandList>
      <CommandEmpty>{{ $t('search.noResults') }}</CommandEmpty>
      <CommandGroup :heading="$t('search.heading')">
        <CommandItem
          v-for="article in filteredNews"
          :key="article.id"
          :value="article.id"
          class="flex cursor-pointer items-start gap-3"
          @select="selectArticle(article.id)"
        >
          <Newspaper class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div class="flex-1 overflow-hidden">
            <p class="truncate text-sm font-medium">{{ article.title }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ article.source }} · {{ article.category }}</p>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
