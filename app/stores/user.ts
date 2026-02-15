import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const theme = ref<'dark' | 'light' | 'system'>('system')
  const language = ref<'id' | 'en'>('id')
  const notifications = ref<boolean>(true)

  const loadFromStorage = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('StoxLyz-user-prefs')
      if (stored) {
        try {
          const prefs = JSON.parse(stored)
          theme.value = prefs.theme ?? 'system'
          language.value = prefs.language ?? 'id'
          notifications.value = prefs.notifications ?? true
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
        })
      )
    }
  }

  if (import.meta.client) {
    watch([theme, language, notifications], persist, { deep: true })
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

  return {
    theme,
    language,
    notifications,
    setTheme,
    setLanguage,
    toggleNotifications,
  }
})
