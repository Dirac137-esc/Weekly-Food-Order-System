export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  if (userStore.user?.role !== 'admin') {
    return navigateTo('/')
  }
})