<script setup lang="ts">
import { Home, Star, Newspaper, BarChart3 } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { label: t('nav.home'), icon: Home, to: '/' },
  { label: t('nav.watchlist'), icon: Star, to: '/watchlist' },
  { label: t('nav.news'), icon: Newspaper, to: '/news' },
  { label: t('nav.indicators'), icon: BarChart3, to: '/indicators' },
])

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 glass-card pb-safe">
    <div class="flex items-center justify-around px-2 pt-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex min-w-[64px] flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors"
        :class="isActive(item.to) ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'"
      >
        <component
          :is="item.icon"
          class="h-5 w-5 transition-transform"
          :class="isActive(item.to) && 'scale-110'"
        />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
        <div
          v-if="isActive(item.to)"
          class="mt-0.5 h-0.5 w-4 rounded-full bg-blue-500"
        />
      </NuxtLink>
    </div>
  </nav>
</template>
