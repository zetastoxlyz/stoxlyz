<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useI18n()

useHead({ title: computed(() => `${t('auth.createAccount')} - StoxLyz`) })

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-sm py-8">
    <div class="mb-8 text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <span class="text-lg font-bold text-primary-foreground">SX</span>
      </div>
      <h1 class="text-2xl font-bold">{{ $t('auth.createAccount') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ $t('auth.createAccountSubtitle') }}</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ $t('auth.name') }}</label>
        <Input
          v-model="name"
          type="text"
          :placeholder="$t('auth.namePlaceholder')"
          required
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ $t('auth.email') }}</label>
        <Input
          v-model="email"
          type="email"
          :placeholder="$t('auth.emailPlaceholder')"
          required
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">{{ $t('auth.password') }}</label>
        <div class="relative">
          <Input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.createPasswordPlaceholder')"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="absolute right-0 top-0 h-full w-10"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="h-4 w-4" />
            <Eye v-else class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
      </Button>
    </form>

    <p class="mt-4 text-center text-sm text-muted-foreground">
      {{ $t('auth.haveAccount') }}
      <NuxtLink to="/auth/login" class="font-medium text-blue-500 hover:text-blue-400">
        {{ $t('auth.signInLink') }}
      </NuxtLink>
    </p>
  </div>
</template>
