import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface AdminTokenPayload {
  admin?: boolean
  iat?: number
  exp?: number
}

/** 管理员 token 有效期：2 小时（与登录 cookie 的 maxAge 保持一致） */
export const ADMIN_TOKEN_TTL_SECONDS = 2 * 60 * 60

/**
 * 从请求中提取 token。
 *
 * 只认 httpOnly cookie 和 Authorization 头：
 * - 不再接受 ?token=，避免 token 出现在访问日志、Referer 里；
 * - cookie 由服务端下发（HttpOnly），前端 JS 读不到，XSS 无法直接窃取。
 */
export function extractToken(event: H3Event): string | undefined {
  const cookieToken = getCookie(event, 'admin_token')
  if (cookieToken) return cookieToken

  const header = getHeader(event, 'authorization')
  const bearer = header?.replace(/^Bearer\s+/i, '').trim()
  return bearer || undefined
}

/**
 * 校验管理员身份，失败时抛出对应状态码的错误。
 */
export function requireAdmin(event: H3Event): AdminTokenPayload {
  const token = extractToken(event)

  if (!token) {
    throw createError({ statusCode: 401, message: '未授权' })
  }

  const runtimeConfig = useRuntimeConfig(event)

  let decoded: AdminTokenPayload
  try {
    decoded = jwt.verify(token, runtimeConfig.jwtSecret as string) as AdminTokenPayload
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      throw createError({ statusCode: 401, message: '登录已过期，请重新登录' })
    }
    throw createError({ statusCode: 403, message: '无效的 token' })
  }

  if (!decoded?.admin) {
    throw createError({ statusCode: 403, message: '权限不足' })
  }

  return decoded
}
