/**
 * 管理页登录校验。
 *
 * token 放在 httpOnly cookie 里，前端 JS 读不到，所以只能在请求时让服务端判断：
 * - SSR 阶段把浏览器的 cookie 转发给内部 /api/auth/verify；
 * - 客户端阶段浏览器会自动携带同源 cookie。
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    const authenticated = await $fetch<boolean>('/api/auth/verify', { headers })
    if (!authenticated) {
      return navigateTo('/login')
    }
  } catch {
    // 校验接口异常时按未登录处理，避免把后台页面暴露给匿名访客
    return navigateTo('/login')
  }
})
