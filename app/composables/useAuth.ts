import { ref, computed } from 'vue'

interface AuthUser {
  name: string
  email: string
}

const user = ref<AuthUser | null>(null)

const loadUser = () => {
  if (import.meta.client) {
    const stored = localStorage.getItem('StoxLyz-auth-user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        user.value = null
      }
    }
  }
}

const persistUser = () => {
  if (import.meta.client) {
    if (user.value) {
      localStorage.setItem('StoxLyz-auth-user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('StoxLyz-auth-user')
    }
  }
}

export const useAuth = () => {
  loadUser()

  const isAuthenticated = computed(() => user.value !== null)

  const login = (email: string, _password: string) => {
    user.value = {
      name: email.split('@')[0],
      email,
    }
    persistUser()
  }

  const register = (name: string, email: string, _password: string) => {
    user.value = {
      name,
      email,
    }
    persistUser()
  }

  const logout = () => {
    user.value = null
    persistUser()
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
