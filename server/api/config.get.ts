import type { SiteConfig } from '~/types/config'

/**
 * 读取站点配置。公开接口（首页需要）。
 *
 * 注意：必须剥离 _admin 等内部字段，
 * 否则密码哈希会随公开配置一起返回给任何访客。
 */
function toPublicConfig(config: any): SiteConfig {
  const { _admin, ...rest } = config || {}
  return rest as SiteConfig
}

export default defineEventHandler(async (event) => {
  const storage = useConfigStorage()
  try {
    return toPublicConfig(await storage.read(event))
  } catch (error) {
    console.error(`[config] 读取失败 (storage=${storage.type}):`, error)
    return toPublicConfig(await loadSiteConfig(event))
  }
})
