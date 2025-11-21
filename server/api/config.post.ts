import fs from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'
import type { SiteConfig } from '~/types/config'

export default defineEventHandler(async (event) => {
  // Get token from Authorization header or query
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '') ||
    getQuery(event).token

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权'
    })
  }

  try {
    // Verify JWT token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)

    if (!decoded.admin) {
      throw createError({
        statusCode: 403,
        statusMessage: '权限不足'
      })
    }

    // Get request body
    const body = await readBody(event)
    const newConfig = body as SiteConfig

    // Validate config
    if (!newConfig || !newConfig.links) {
      throw createError({
        statusCode: 400,
        statusMessage: '无效的配置数据'
      })
    }

    // Save to file
    await fs.writeFile(
      path.join(process.cwd(), 'site-config.json'),
      JSON.stringify(newConfig, null, 2)
    )

    return {
      message: '配置已更新'
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 403,
        statusMessage: '无效的 token'
      })
    }
    throw error
  }
})