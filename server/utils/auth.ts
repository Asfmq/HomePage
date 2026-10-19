import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface AdminTokenPayload {
  admin?: boolean
  iat?: number
  exp?: number
}

/**
 * 从请求中提取 token。
 * 优先 Authorization: Bearer，其次 query.token（兼容旧调用方式）。
 */
export function extractToken(event: H3Event): string | undefined {
  const header = getHeader(event, 'authorization')
  const bearer = header?.replace(/^Bearer\s+/i, '').trim()
  if (bearer) return bearer

  const queryToken = getQuery(event).token
  return typeof queryToken === 'string' && queryToken ? queryToken : undefined
}

/**
 * 校验管理员身份，失败时抛出对应状态码的错误。
 */
export function requireAdmin(event: H3Event): AdminTokenPayload {
  const token = extractToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未授权' })
  }

  const runtimeConfig = useRuntimeConfig(event)

  let decoded: AdminTokenPayload
  try {
    decoded = jwt.verify(token, runtimeConfig.jwtSecret as string) as AdminTokenPayload
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      throw createError({ statusCode: 401, statusMessage: '登录已过期，请重新登录' })
    }
    throw createError({ statusCode: 403, statusMessage: '无效的 token' })
  }

  if (!decoded?.admin) {
    throw createError({ statusCode: 403, statusMessage: '权限不足' })
  }

  return decoded
}
