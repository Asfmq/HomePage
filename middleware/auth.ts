export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // For server-side rendering, we need to handle authentication differently
  // We'll rely on client-side validation for now
  if (process.client) {
    // Client-side check
    const token = localStorage.getItem('admin_token')

    if (!token) {
      return navigateTo('/login')
    }

    try {
      // Verify token client-side
      const response = await $fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response) {
        localStorage.removeItem('admin_token')
        return navigateTo('/login')
      }
    } catch (error) {
      localStorage.removeItem('admin_token')
      return navigateTo('/login')
    }
  }
  // For server-side, we'll let the component handle authentication
})