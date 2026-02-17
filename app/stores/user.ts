import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

export const useUserStore = defineStore('user', () => {
  const theme = ref<'dark' | 'light' | 'system'>('system')
  const language = ref<'id' | 'en'>('id')
  const notifications = ref<boolean>(true)
  const profile = ref<UserProfile | null>(null)

  const isLoggedIn = computed(() => profile.value !== null)

  const loadFromStorage = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('StoxLyz-user-prefs')
      if (stored) {
        try {
          const prefs = JSON.parse(stored)
          theme.value = prefs.theme ?? 'system'
          language.value = prefs.language ?? 'id'
          notifications.value = prefs.notifications ?? true
          profile.value = prefs.profile ?? null
        } catch {
          // keep defaults
        }
      }
    }
  }

  loadFromStorage()

  const persist = () => {
    if (import.meta.client) {
      localStorage.setItem(
        'StoxLyz-user-prefs',
        JSON.stringify({
          theme: theme.value,
          language: language.value,
          notifications: notifications.value,
          profile: profile.value,
        })
      )
    }
  }

  if (import.meta.client) {
    watch([theme, language, notifications, profile], persist, { deep: true })
  }

  const setTheme = (value: 'dark' | 'light' | 'system') => {
    theme.value = value
  }

  const setLanguage = (value: 'id' | 'en') => {
    language.value = value
  }

  const toggleNotifications = () => {
    notifications.value = !notifications.value
  }

  const setProfile = (value: UserProfile | null) => {
    profile.value = value
  }

  const logout = () => {
    profile.value = null
  }

  return {
    theme,
    language,
    notifications,
    profile,
    isLoggedIn,
    setTheme,
    setLanguage,
    toggleNotifications,
    setProfile,
    logout,
  }
})
