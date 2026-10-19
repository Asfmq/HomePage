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
  // 配置随时可能被后台修改，禁止 CDN / 浏览器缓存，
  // 否则修改后刷新仍会读到旧配置。
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

  // loadSiteConfig 内部已处理读取失败时回退默认配置
  const config = await loadSiteConfig(event)
  return toPublicConfig(config)
})
