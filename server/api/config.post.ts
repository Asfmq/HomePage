import fs from 'fs/promises'
import path from 'path'
import qiniu from 'qiniu'
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

    const storageType = process.env.STORAGE_TYPE || 'local'

    if (storageType === 'qiniu') {
      // Qiniu Configuration
      const accessKey = process.env.NUXT_QINIU_ACCESS_KEY || 'vf63aPF-QIFbyzULtHaSx9JgiVSS3zRuy0zmBACE'
      const secretKey = process.env.NUXT_QINIU_SECRET_KEY || 'JlQvHevHSAgilNYaH0UxQoX68rb4m9VflpaXtYL1'
      const bucket = process.env.NUXT_QINIU_BUCKET || 'asfmq-img'
      const key = process.env.NUXT_QINIU_CONFIG || 'homepage/site-config.json'

      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: `${bucket}:${key}`
      })
      const uploadToken = putPolicy.uploadToken(mac)

      const configStr = JSON.stringify(newConfig, null, 2)

      // Upload to Qiniu
      const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config())
      const putExtra = new qiniu.form_up.PutExtra()

      await new Promise((resolve, reject) => {
        formUploader.put(uploadToken, key, configStr, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr)
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody)
          } else {
            reject(new Error(`Qiniu upload failed: ${respInfo.statusCode} ${respBody}`))
          }
        })
      })

      return {
        message: '配置已更新并同步至七牛云'
      }
    } else {
      // Save to local file
      await fs.writeFile(
        path.join(process.cwd(), 'site-config.json'),
        JSON.stringify(newConfig, null, 2)
      )

      return {
        message: '配置已更新至本地文件'
      }
    }

  } catch (error: any) {
    console.error('Config save error:', error)
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 403,
        statusMessage: '无效的 token'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: '配置保存失败: ' + error.message
    })
  }
})