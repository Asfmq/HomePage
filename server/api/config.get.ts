import fs from 'fs/promises'
import path from 'path'
import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

export default defineEventHandler(async (event) => {
  const storageType = process.env.STORAGE_TYPE || 'local'

  try {
    if (storageType === 'qiniu') {
      // Fetch config from Qiniu Cloud Storage
      // Add timestamp to prevent caching
      const domain = process.env.NUXT_QINIU_DOMAIN || 'http://qnimg.asfmq.cn'
      const configKey = process.env.NUXT_QINIU_CONFIG || 'homepage/site-config.json'
      const configUrl = `${domain}/${configKey}?t=${Date.now()}`
      const config = await $fetch<SiteConfig>(configUrl)
      return config
    } else {
      // Read from local file system
      const configPath = path.join(process.cwd(), 'site-config.json')
      const data = await fs.readFile(configPath, 'utf-8')
      return JSON.parse(data) as SiteConfig
    }
  } catch (error) {
    // If fetch fails or file doesn't exist, return default config
    console.error(`Failed to fetch config (${storageType}):`, error)
    return defaultConfig
  }
})