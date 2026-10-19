import type { SiteConfig } from '~/types/config'

/**
 * 保存站点配置。需要管理员身份。
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = (await readBody(event)) as SiteConfig

  if (!body || typeof body !== 'object' || !body.links || !Array.isArray(body.links.categories)) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的配置数据'
    })
  }

  const storage = useConfigStorage()

  try {
    // 保留服务端内部字段（如 _admin 密码哈希），
    // 前端拿到的公开配置不含这些字段，整体覆盖会误删。
    let existing: any = null
    try {
      existing = await storage.read(event)
    } catch {
      existing = null
    }

    if (existing?._admin) {
      ;(body as any)._admin = existing._admin
    }

    await storage.write(event, body)
  } catch (error: any) {
    console.error(`[config] 保存失败 (storage=${storage.type}):`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `配置保存失败: ${error?.message || '未知错误'}`
    })
  }

  return {
    success: true,
    storage: storage.type,
    message: storage.type === 'qiniu' ? '配置已更新并同步至七牛云' : '配置已更新至本地文件'
  }
})
