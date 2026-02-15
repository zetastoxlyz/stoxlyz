<script setup lang="ts">
import { Search, Bell, Settings } from 'lucide-vue-next'

const showSearch = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border/50 glass-card">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span class="text-sm font-bold text-primary-foreground">SL</span>
        </div>
        <span class="text-lg font-bold tracking-tight">
          Stox<span class="text-blue-500">Lyz</span>
        </span>
      </NuxtLink>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9"
          @click="showSearch = true"
        >
          <Search class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9"
          as-child
        >
          <NuxtLink to="/settings">
            <Settings class="h-4 w-4" />
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Search Command -->
    <SharedSearchCommand v-model:open="showSearch" />
  </header>
</template>
