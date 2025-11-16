import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

export default defineEventHandler(async (event) => {
  try {
    // Return public configuration (excluding sensitive data)
    return {
      backgroundImage: defaultConfig.backgroundImage,
      favicon: defaultConfig.favicon,
      title: defaultConfig.title,
      description: defaultConfig.description,
      keywords: defaultConfig.keywords,
      author: defaultConfig.author
    }
  } catch (error) {
    console.error('Error fetching public config:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch public configuration'
    })
  }
})