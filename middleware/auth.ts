import { useUserStore } from "../stores/user"
import { defineNuxtRouteMiddleware, navigateTo, useRouter } from "#imports"

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const userStore = useUserStore()
    const user = localStorage.getItem("user")

    if (!user) {
      return navigateTo('/auth')
    }

    try {
      const data = JSON.parse(user)
      userStore.user = data  // update store user data
    } catch {
      return navigateTo('/auth') // invalid user data => redirect
    }
  }
})
