import jwt from 'jsonwebtoken'
import { ADMIN_TOKEN_TTL_SECONDS } from '~~/server/utils/auth'
import { verifyAdminPassword } from '~~/server/utils/password'

/**
 * 判断当前请求是否走 HTTPS。
 *
 * Vercel / Nginx 反代会带 x-forwarded-proto；直连 Docker 的 http 访问则为 false，
 * 此时不能加 Secure，否则浏览器会拒绝保存 cookie，导致无法登录。
 */
function isHttpsRequest(event: any): boolean {
  const forwarded = getHeader(event, 'x-forwarded-proto')
  if (forwarded) return forwarded.split(',')[0].trim() === 'https'
  return getRequestURL(event).protocol === 'https:'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!password) {
    throw createError({ statusCode: 400, message: '请提供密码' })
  }

  const runtimeConfig = useRuntimeConfig(event)

  // 缺少密钥配置时明确报错，而不是静默使用弱默认值
  if (!runtimeConfig.jwtSecret || !runtimeConfig.adminPassword) {
    console.error('[auth] 缺少 NUXT_JWT_SECRET 或 NUXT_ADMIN_PASSWORD 环境变量，拒绝登录')
    throw createError({
      statusCode: 503,
      message: '服务端未完成安全配置，请联系管理员'
    })
  }

  const ok = await verifyAdminPassword(event, password)
  if (!ok) {
    throw createError({ statusCode: 401, message: '密码错误' })
  }

  const token = jwt.sign({ admin: true }, runtimeConfig.jwtSecret as string, {
    expiresIn: ADMIN_TOKEN_TTL_SECONDS
  })

  // token 只放在 httpOnly cookie 里：前端 JS 读不到，XSS 无法窃取，
  // 也不再返回给前端，避免被写进 localStorage。
  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: isHttpsRequest(event),
    sameSite: 'lax',
    maxAge: ADMIN_TOKEN_TTL_SECONDS,
    path: '/'
  })

  return { success: true, expiresIn: ADMIN_TOKEN_TTL_SECONDS }
})
