<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Home', icon: 'Home', to: '/' },
  { label: 'Watchlist', icon: 'Star', to: '/watchlist' },
  { label: 'News', icon: 'Newspaper', to: '/news' },
  { label: 'Indicators', icon: 'BarChart3', to: '/indicators' },
]

const isActiveRoute = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <LayoutAppHeader />

    <div class="flex">
      <!-- Desktop Sidebar -->
      <LayoutAppSidebar class="hidden lg:flex" />

      <!-- Main Content -->
      <main class="flex-1 pb-20 lg:pb-4">
        <div class="mx-auto max-w-4xl px-4 py-4 lg:px-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <LayoutAppBottomNav class="lg:hidden" />
  </div>
</template>
