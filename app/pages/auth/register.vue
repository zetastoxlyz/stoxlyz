<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";

definePageMeta({ layout: "blank" });

const { t } = useI18n();
useHead({ title: computed(() => `${t("auth.createAccount")} - StoxLyz`) });

const localePath = useLocalePath();
const userStore = useUserStore();
const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

async function handleRegister() {
	error.value = "";
	loading.value = true;

	if (password.value.length < 6) {
		error.value = t("auth.weakPassword");
		loading.value = false;
		return;
	}

	const result = await userStore.registerWithFirebase(
		email.value,
		password.value,
		name.value,
	);

	if (!result.success) {
		error.value = result.error || t("auth.registerError");
		loading.value = false;
		return;
	}

	navigateTo(localePath("/home"));
}

async function handleGoogleRegister() {
	error.value = "";
	loading.value = true;

	const result = await userStore.loginWithGoogle();

	if (!result.success) {
		error.value = result.error || t("auth.googleSignInFailed");
		loading.value = false;
		return;
	}

	navigateTo(localePath("/home"));
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm py-8">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500" aria-hidden="true">
          <span class="text-lg font-bold text-primary-foreground">SL</span>
        </div>
        <h1 class="text-2xl font-bold">{{ $t('auth.createAccount') }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ $t('auth.createAccountSubtitle') }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-2">
          <label for="register-name" class="text-sm font-medium">{{ $t('auth.name') }}</label>
          <Input
            id="register-name"
            v-model="name"
            type="text"
            :placeholder="$t('auth.namePlaceholder')"
            required
            autocomplete="name"
          />
        </div>

        <div class="space-y-2">
          <label for="register-email" class="text-sm font-medium">{{ $t('auth.email') }}</label>
          <Input
            id="register-email"
            v-model="email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            required
            autocomplete="email"
          />
        </div>

        <div class="space-y-2">
          <label for="register-password" class="text-sm font-medium">{{ $t('auth.password') }}</label>
          <div class="relative">
            <Input
              id="register-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('auth.createPasswordPlaceholder')"
              required
              autocomplete="new-password"
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
          {{ loading ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
        </Button>
      </form>

      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">{{ $t('auth.orContinueWith') }}</span>
        </div>
      </div>

      <Button type="button" variant="outline" class="w-full gap-2" @click="handleGoogleRegister" :disabled="loading">
        <svg class="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {{ $t('auth.signInWithGoogle') }}
      </Button>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ $t('auth.haveAccount') }}
        <NuxtLink :to="localePath('/auth/login')" class="font-medium text-blue-500 hover:text-blue-400">
          {{ $t('auth.signInLink') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
