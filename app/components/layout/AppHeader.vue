<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const { locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const showSearch = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border/50 glass-card">
    <div class="flex h-14 items-center gap-4 px-4">
      <!-- Logo: on desktop, match sidebar width (w-56) -->
      <NuxtLink :to="localePath('/')" :title="$t('nav.home')" class="flex shrink-0 items-center gap-2 lg:w-56 lg:px-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span class="text-sm font-bold text-primary-foreground">SL</span>
        </div>
        <span class="text-lg font-bold tracking-tight">
          Stox<span class="text-blue-500">Lyz</span>
        </span>
      </NuxtLink>

      <!-- Search Bar (center, desktop only) -->
      <div class="hidden flex-1 lg:block">
        <button
          class="flex w-full max-w-md items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
          :title="$t('search.placeholder')"
          @click="showSearch = true"
        >
          <Search class="h-4 w-4 shrink-0" />
          <span class="flex-1 text-left">{{ $t('search.placeholder') }}</span>
          <kbd class="hidden rounded border border-border px-1.5 text-xs lg:inline-flex">⌘K</kbd>
        </button>
      </div>

      <!-- i18n Toggle -->
      <Button variant="ghost" size="sm" class="ml-auto shrink-0 font-semibold lg:ml-0" as-child>
        <NuxtLink
          :to="switchLocalePath(locale === 'id' ? 'en' : 'id')"
          :title="locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'"
        >
          {{ locale === 'id' ? 'EN' : 'ID' }}
        </NuxtLink>
      </Button>
    </div>

    <!-- Search Command -->
    <SharedSearchCommand v-model:open="showSearch" />
  </header>
</template>
