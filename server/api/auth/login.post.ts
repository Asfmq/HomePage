import jwt from 'jsonwebtoken'
import { verifyAdminPassword } from '~~/server/utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: '请提供密码' })
  }

  const runtimeConfig = useRuntimeConfig(event)

  // 缺少密钥配置时明确报错，而不是静默使用弱默认值
  if (!runtimeConfig.jwtSecret || !runtimeConfig.adminPassword) {
    console.error('[auth] 缺少 NUXT_JWT_SECRET 或 NUXT_ADMIN_PASSWORD 环境变量，拒绝登录')
    throw createError({
      statusCode: 503,
      statusMessage: '服务端未完成安全配置，请联系管理员'
    })
  }

  const ok = await verifyAdminPassword(event, password)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: '密码错误' })
  }

  const token = jwt.sign(
    { admin: true },
    runtimeConfig.jwtSecret as string,
    { expiresIn: '24h' }
  )

  return { success: true, token }
})
