import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

export default defineEventHandler(async (event) => {
  // For now, return default config
  // In a real implementation, you would read from a file or database
  return defaultConfig
})