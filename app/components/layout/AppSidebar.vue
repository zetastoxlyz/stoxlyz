<script setup lang="ts">
import { Home, Star, Newspaper, BarChart3, Settings, LogIn } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { label: t('nav.home'), icon: Home, to: '/' },
  { label: t('nav.watchlist'), icon: Star, to: '/watchlist' },
  { label: t('nav.news'), icon: Newspaper, to: '/news' },
  { label: t('nav.indicators'), icon: BarChart3, to: '/indicators' },
])

const bottomItems = computed(() => [
  { label: t('nav.settings'), icon: Settings, to: '/settings' },
  { label: t('nav.login'), icon: LogIn, to: '/auth/login' },
])

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside class="sticky top-14 flex h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-border/50 px-3 py-4">
    <nav class="flex flex-1 flex-col gap-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <Separator class="my-2" />

    <nav class="flex flex-col gap-1">
      <NuxtLink
        v-for="item in bottomItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>
