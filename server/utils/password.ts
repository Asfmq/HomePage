import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import { useConfigStorage } from './config-store'

/**
 * 密码层。
 *
 * 支持两种来源：
 * 1. 环境变量 NUXT_ADMIN_PASSWORD（明文，向后兼容）
 * 2. 配置文件中保存的 bcrypt 哈希（通过「修改密码」写入，优先级更高）
 *
 * 哈希存放在站点配置的 _admin 字段中，因此会跟随 STORAGE_TYPE 一起持久化
 * （生产环境即写入七牛云），从而在 serverless 多实例下保持一致。
 */

const BCRYPT_ROUNDS = 10
const MIN_PASSWORD_LENGTH = 8

export function isHashed(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value)
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

function getEnvPassword(event: H3Event): string {
  const runtimeConfig = useRuntimeConfig(event)
  return String(runtimeConfig.adminPassword ?? '')
}

/** 校验密码：优先比对配置文件中的哈希，其次回退到环境变量明文 */
export async function verifyAdminPassword(event: H3Event, plain: string): Promise<boolean> {
  let storedHash: string | undefined

  try {
    const storage = useConfigStorage()
    const config: any = await storage.read(event)
    const candidate = config?._admin?.passwordHash
    if (typeof candidate === 'string' && isHashed(candidate)) {
      storedHash = candidate
    }
  } catch (error) {
    // 配置文件读取失败时退回环境变量校验
    console.error('[password] 读取密码哈希失败，回退到环境变量:', error)
  }

  if (storedHash) {
    return bcrypt.compare(plain, storedHash)
  }

  const envPassword = getEnvPassword(event)
  if (!envPassword) return false
  return plain === envPassword
}

export function validateNewPassword(newPassword: string): void {
  if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `新密码长度至少为 ${MIN_PASSWORD_LENGTH} 位`
    })
  }
}

/**
 * 持久化新密码哈希。
 * 会先读出当前完整配置再合并写回，避免覆盖站点内容。
 */
export async function persistPassword(event: H3Event, newPassword: string): Promise<void> {
  const storage = useConfigStorage()
  const config: any = await storage.read(event)
  const passwordHash = await hashPassword(newPassword)

  config._admin = { ...(config._admin || {}), passwordHash, updatedAt: new Date().toISOString() }
  await storage.write(event, config)
}
