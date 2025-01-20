import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    throw createError({ statusCode: 503, statusMessage: 'Forbidden' })
  }
})
