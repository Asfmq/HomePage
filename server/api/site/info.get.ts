/**
 * 站点公开元信息（供未登录访客 / 外部使用）。
 * 读取真实配置而非内置默认值，保证后台修改后即时生效。
 */
export default defineEventHandler(async (event) => {
  const config = await loadSiteConfig(event)

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    author: config.author,
    favicon: config.favicon,
    backgroundImage: config.backgroundImage
  }
})
