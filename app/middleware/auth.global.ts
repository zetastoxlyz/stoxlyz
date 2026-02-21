export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()
  const localePath = useLocalePath()

  const isAuthPage = to.path.includes('/auth/')

  if (!userStore.isLoggedIn && !isAuthPage) {
    return navigateTo(localePath('/auth/login'))
  }

  // Redirect logged-in users away from auth pages
  if (userStore.isLoggedIn && isAuthPage) {
    return navigateTo(localePath('/'))
  }
})
