<script setup lang="ts">
import { LogIn, Shield, User, Copy, Check, ExternalLink } from 'lucide-vue-next'
import { roleVariant } from '~/composables/useRoleVariant'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
useHead({ title: computed(() => `${t('demo.title')} - StoxLyz`) })

const localePath = useLocalePath()
const userStore = useUserStore()

const accounts = [
  { email: 'super@stoxlyz.id', password: 'super123', name: 'Super Admin', role: 'superadmin' as const },
  { email: 'budi@stoxlyz.id', password: 'password123', name: 'Budi Santoso', role: 'admin' as const },
  { email: 'demo@stoxlyz.id', password: 'demo123', name: 'Demo User', role: 'user' as const },
]

const features = [
  { route: '/', labelKey: 'nav.home', access: 'all' },
  { route: '/news', labelKey: 'nav.news', access: 'all' },
  { route: '/watchlist', labelKey: 'nav.watchlist', access: 'all' },
  { route: '/indicators', labelKey: 'nav.indicators', access: 'all' },
  { route: '/settings', labelKey: 'nav.settings', access: 'all' },
  { route: '/profile', labelKey: 'nav.profile', access: 'auth' },
  { route: '/admin', labelKey: 'nav.adminPanel', access: 'admin' },
]

const copiedField = ref<string | null>(null)

async function copyText(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copiedField.value = key
  setTimeout(() => { copiedField.value = null }, 1500)
}

async function loginAs(account: typeof accounts[number]) {
  await userStore.setProfile({ name: account.name, email: account.email, role: account.role })
  navigateTo(localePath('/'))
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8 p-4 lg:p-6">
    <div>
      <h1 class="text-2xl font-bold">{{ $t('demo.title') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ $t('demo.subtitle') }}</p>
    </div>

    <!-- Demo Accounts -->
    <section class="space-y-3">
      <h2 class="text-base font-semibold">{{ $t('demo.accounts') }}</h2>
      <div class="space-y-3">
        <Card v-for="acc in accounts" :key="acc.email">
          <CardContent class="pt-4">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm">{{ acc.name }}</span>
                  <Badge :variant="roleVariant(acc.role)" class="capitalize text-xs">{{ acc.role }}</Badge>
                </div>
                <!-- Email row -->
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <span class="font-mono">{{ acc.email }}</span>
                  <button
                    class="text-muted-foreground/60 hover:text-foreground transition-colors"
                    :aria-label="$t('demo.copy')"
                    @click="copyText(acc.email, acc.email)"
                  >
                    <Check v-if="copiedField === acc.email" class="h-3.5 w-3.5 text-green-500" />
                    <Copy v-else class="h-3.5 w-3.5" />
                  </button>
                </div>
                <!-- Password row -->
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <span class="font-mono">{{ acc.password }}</span>
                  <button
                    class="text-muted-foreground/60 hover:text-foreground transition-colors"
                    :aria-label="$t('demo.copy')"
                    @click="copyText(acc.password, acc.email + '-pw')"
                  >
                    <Check v-if="copiedField === acc.email + '-pw'" class="h-3.5 w-3.5 text-green-500" />
                    <Copy v-else class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <Button size="sm" variant="outline" class="shrink-0 gap-1.5" @click="loginAs(acc)">
                <LogIn class="h-3.5 w-3.5" aria-hidden="true" />
                {{ $t('demo.loginAs') }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Routes -->
    <section class="space-y-3">
      <h2 class="text-base font-semibold">{{ $t('demo.routes') }}</h2>
      <Card>
        <CardContent class="pt-4">
          <div class="divide-y divide-border/50">
            <div
              v-for="f in features"
              :key="f.route"
              class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{{ f.route }}</code>
                <span class="text-sm text-muted-foreground">{{ $t(f.labelKey) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge
                  v-if="f.access === 'admin'"
                  variant="destructive"
                  class="text-xs"
                >
                  <Shield class="mr-1 h-3 w-3" />
                  {{ $t('demo.accessAdmin') }}
                </Badge>
                <Badge
                  v-else-if="f.access === 'auth'"
                  variant="secondary"
                  class="text-xs"
                >
                  <User class="mr-1 h-3 w-3" />
                  {{ $t('demo.accessAuth') }}
                </Badge>
                <Badge
                  v-else
                  variant="outline"
                  class="text-xs"
                >
                  {{ $t('demo.accessAll') }}
                </Badge>
                <NuxtLink :to="localePath(f.route)">
                  <ExternalLink class="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Current session info -->
    <section v-if="userStore.isLoggedIn" class="space-y-3">
      <h2 class="text-base font-semibold">{{ $t('demo.currentSession') }}</h2>
      <Card>
        <CardContent class="pt-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {{ userStore.initials }}
            </div>
            <div>
              <p class="text-sm font-medium">{{ userStore.profile?.name }}</p>
              <p class="text-xs text-muted-foreground">{{ userStore.profile?.email }}</p>
            </div>
            <Badge :variant="roleVariant(userStore.profile?.role)" class="ml-auto capitalize">
              {{ userStore.profile?.role }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
