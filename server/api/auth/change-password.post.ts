import { requireAdmin } from '~~/server/utils/auth'
import {
  verifyAdminPassword,
  validateNewPassword,
  persistPassword
} from '~~/server/utils/password'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: '请提供当前密码和新密码' })
  }

  validateNewPassword(newPassword)

  if (newPassword === currentPassword) {
    throw createError({ statusCode: 400, statusMessage: '新密码不能与当前密码相同' })
  }

  const ok = await verifyAdminPassword(event, currentPassword)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: '当前密码错误' })
  }

  await persistPassword(event, newPassword)

  return {
    success: true,
    message: '密码修改成功，请重新登录'
  }
})
