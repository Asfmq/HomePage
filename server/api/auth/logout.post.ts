/**
 * 退出登录：清除 httpOnly cookie。
 *
 * 幂等接口：未登录时调用也返回成功，前端可以直接跳转登录页。
 */
export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_token', { path: '/' })
  return { success: true }
})
