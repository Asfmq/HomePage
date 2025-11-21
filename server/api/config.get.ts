import fs from 'fs/promises'
import path from 'path'
import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

export default defineEventHandler(async (event) => {
  try {
    const configPath = path.join(process.cwd(), 'site-config.json')
    const data = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(data) as SiteConfig
  } catch (error) {
    // If file doesn't exist or error reading, return default config
    return defaultConfig
  }
})