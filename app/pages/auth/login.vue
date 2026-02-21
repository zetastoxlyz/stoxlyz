<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'

definePageMeta({ layout: false })

const { t } = useI18n()
useHead({ title: computed(() => `${t('auth.signIn')} - StoxLyz`) })

const localePath = useLocalePath()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const DUMMY_USERS = [
  { email: 'super@stoxlyz.id', password: 'super123', name: 'Super Admin', role: 'superadmin' as const },
  { email: 'budi@stoxlyz.id', password: 'password123', name: 'Budi Santoso', role: 'admin' as const },
  { email: 'demo@stoxlyz.id', password: 'demo123', name: 'Demo User', role: 'user' as const },
]

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false

  const match = DUMMY_USERS.find(
    u => u.email === email.value && u.password === password.value,
  )

  if (!match) {
    error.value = t('auth.invalidCredentials')
    return
  }

  await userStore.setProfile({ name: match.name, email: match.email, role: match.role })
  navigateTo(localePath('/'))
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm py-8">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary" aria-hidden="true">
          <span class="text-lg font-bold text-primary-foreground">SX</span>
        </div>
        <h1 class="text-2xl font-bold">{{ $t('auth.welcomeBack') }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ $t('auth.signInSubtitle') }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-2">
          <label for="login-email" class="text-sm font-medium">{{ $t('auth.email') }}</label>
          <Input
            id="login-email"
            v-model="email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            required
            autocomplete="email"
          />
        </div>

        <div class="space-y-2">
          <label for="login-password" class="text-sm font-medium">{{ $t('auth.password') }}</label>
          <div class="relative">
            <Input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('auth.passwordPlaceholder')"
              required
              autocomplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              class="absolute right-0 top-0 h-full w-10"
              :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" aria-hidden="true" />
              <Eye v-else class="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <p v-if="error" role="alert" aria-live="assertive" class="text-sm text-destructive">{{ error }}</p>

        <Button type="submit" class="w-full gap-2" :disabled="loading">
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin" aria-hidden="true" />
          {{ loading ? $t('auth.signingIn') : $t('auth.signIn') }}
        </Button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ $t('auth.noAccount') }}
        <NuxtLink :to="localePath('/auth/register')" class="font-medium text-blue-500 hover:text-blue-400">
          {{ $t('auth.register') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
