export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // Check if user is authenticated
  const token = localStorage.getItem('admin_token')

  if (!token) {
    return navigateTo('/login')
  }

  // For server-side, we need to verify the token
  if (process.server) {
    // Server-side verification will be handled by API routes
    return
  }
})