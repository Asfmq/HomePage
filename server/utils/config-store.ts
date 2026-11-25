import fs from 'fs/promises'
import path from 'path'
import type { H3Event } from 'h3'
import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

/**
 * 统一配置存储层。
 *
 * 支持两种后端：
 * - qiniu：七牛云对象存储（生产/Vercel 使用，文件系统只读所以必须用这个）
 * - local：本地文件（仅用于本地开发）
 */

export interface ConfigStorage {
  read: (event: H3Event) => Promise<SiteConfig>
  write: (event: H3Event, config: SiteConfig) => Promise<void>
  type: string
}

function getStorageType(): string {
  return process.env.STORAGE_TYPE || 'local'
}

function localConfigPath(): string {
  // CONFIG_FILE_PATH 允许把配置放到持久化目录（如 Docker 卷）或镜像只读目录之外的位置
  return process.env.CONFIG_FILE_PATH || path.join(process.cwd(), 'site-config.json')
}

/**
 * 从七牛云读取配置。
 * 注意：七牛是静态资源托管，这里用带时间戳的 query 绕过 CDN 缓存。
 */
async function readFromQiniu(event: H3Event): Promise<SiteConfig> {
  const runtimeConfig = useRuntimeConfig(event)
  const domain = (runtimeConfig.qiniuDomain as string) || process.env.NUXT_QINIU_DOMAIN || ''
  const configKey =
    (runtimeConfig.qiniuConfig as string) ||
    process.env.NUXT_QINIU_CONFIG ||
    'homepage/site-config.json'

  if (!domain) {
    throw new Error('未配置 NUXT_QINIU_DOMAIN，无法从七牛云读取配置')
  }

  const configUrl = `${domain.replace(/\/$/, '')}/${configKey}?t=${Date.now()}`
  return await $fetch<SiteConfig>(configUrl)
}

/**
 * 写入七牛云。
 * qiniu SDK 在需要时才动态导入，避免七牛包缺失时导致整个接口在模块加载阶段就崩溃。
 */
async function writeToQiniu(event: H3Event, config: SiteConfig): Promise<void> {
  const runtimeConfig = useRuntimeConfig(event)

  const accessKey =
    (runtimeConfig.qiniuAccessKey as string) || process.env.NUXT_QINIU_ACCESS_KEY || ''
  const secretKey =
    (runtimeConfig.qiniuSecretKey as string) || process.env.NUXT_QINIU_SECRET_KEY || ''
  const bucket = (runtimeConfig.qiniuBucket as string) || process.env.NUXT_QINIU_BUCKET || ''
  const key =
    (runtimeConfig.qiniuConfig as string) ||
    process.env.NUXT_QINIU_CONFIG ||
    'homepage/site-config.json'

  if (!accessKey || !secretKey || !bucket) {
    throw new Error(
      '七牛云配置不完整，请检查 NUXT_QINIU_ACCESS_KEY / NUXT_QINIU_SECRET_KEY / NUXT_QINIU_BUCKET'
    )
  }

  // 动态导入：仅在真正写七牛时才加载，local 模式下即使没装 qiniu 也不影响
  const { default: qiniu } = await import('qiniu')

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({ scope: `${bucket}:${key}` })
  const uploadToken = putPolicy.uploadToken(mac)

  const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config())
  const putExtra = new qiniu.form_up.PutExtra()

  await new Promise<void>((resolve, reject) => {
    formUploader.put(
      uploadToken,
      key,
      JSON.stringify(config, null, 2),
      putExtra,
      (respErr: any, respBody: any, respInfo: any) => {
        if (respErr) {
          reject(respErr)
          return
        }
        if (respInfo?.statusCode === 200) {
          resolve()
          return
        }
        reject(new Error(`七牛上传失败: ${respInfo?.statusCode} ${respBody}`))
      }
    )
  })
}

async function readFromLocal(): Promise<SiteConfig> {
  const data = await fs.readFile(localConfigPath(), 'utf-8')
  return JSON.parse(data) as SiteConfig
}

async function writeToLocal(config: SiteConfig): Promise<void> {
  // .output 下的文件系统在 serverless 平台是只读的，提前给出清晰错误
  await fs.writeFile(localConfigPath(), JSON.stringify(config, null, 2))
}

export function useConfigStorage(): ConfigStorage {
  const type = getStorageType()

  if (type === 'qiniu') {
    return { read: readFromQiniu, write: (event, cfg) => writeToQiniu(event, cfg), type }
  }

  return { read: () => readFromLocal(), write: (_event, cfg) => writeToLocal(cfg), type }
}

/**
 * 判断是否为「配置尚未创建」（首次部署），而不是读取故障。
 *
 * - local 模式：文件不存在 → ENOENT
 * - qiniu 模式：对象不存在 → 404
 */
function isConfigMissing(error: any): boolean {
  return (
    error?.code === 'ENOENT' ||
    error?.statusCode === 404 ||
    error?.status === 404 ||
    error?.response?.status === 404
  )
}

/**
 * 读取配置。
 *
 * - 配置尚不存在（首次部署）：返回内置默认配置，允许后台保存完成初始化；
 * - 读取故障（网络 / 权限 / JSON 损坏）：抛出 503，而不是回退默认值。
 *   否则后台会把默认配置当成真实配置再写回，覆盖线上数据。首页由
 *   useAsyncData 的 default 兜底渲染，不会白屏。
 */
export async function loadSiteConfig(event: H3Event): Promise<SiteConfig> {
  const storage = useConfigStorage()

  try {
    return await storage.read(event)
  } catch (error: any) {
    if (isConfigMissing(error)) {
      console.info(`[config] 尚未创建配置文件 (storage=${storage.type})，使用内置默认配置`)
      return defaultConfig
    }

    console.error(
      `[config] 读取失败 (storage=${storage.type})，拒绝回退以避免覆盖线上配置。原因: ${error?.message || error}`
    )
    throw createError({
      statusCode: 503,
      message: '配置读取失败，请检查存储服务或环境变量'
    })
  }
}
