import jwt from 'jsonwebtoken'
import { extractToken } from '~~/server/utils/auth'

/**
 * 校验当前请求是否持有有效的管理员 token。
 * 注意：这里不能要求已登录，否则未登录访客会拿到 401 而非 false。
 */
export default defineEventHandler(async (event) => {
  const token = extractToken(event)
  if (!token) return false

  try {
    const runtimeConfig = useRuntimeConfig(event)
    const decoded = jwt.verify(token, runtimeConfig.jwtSecret as string) as { admin?: boolean }
    return decoded?.admin === true
  } catch {
    return false
  }
})
