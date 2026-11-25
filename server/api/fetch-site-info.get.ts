import { isIP } from 'net'
import dns from 'dns/promises'
import { requireAdmin } from '~~/server/utils/auth'

/**
 * 抓取目标站点的标题与 favicon（供后台「添加链接」自动填充使用）。
 *
 * 安全：这是服务端发起请求，必须防 SSRF。
 * 禁止访问内网 / 回环 / 链路本地 / 云元数据地址，并只允许 http(s)。
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata',
  'instance-data'
])

/** 判断某个 IP 是否属于内网 / 保留地址 */
function isPrivateIp(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) {
    const p = ip.split('.').map(Number)
    if (p.some((n) => Number.isNaN(n))) return true
    const [a, b] = p
    if (a === 0 || a === 10 || a === 127) return true
    if (a === 169 && b === 254) return true // 链路本地 / 云元数据
    if (a === 172 && b >= 16 && b <= 31) return true // 私有网段
    if (a === 192 && b === 168) return true // 私有网段
    if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
    if (a >= 224) return true // 组播/保留
    return false
  }

  if (family === 6) {
    const v6 = ip.toLowerCase()
    if (v6 === '::1' || v6 === '::') return true
    if (v6.startsWith('fe80')) return true // 链路本地
    if (v6.startsWith('fc') || v6.startsWith('fd')) return true // 唯一本地
    // IPv4 映射地址（::ffff:192.168.1.1）
    const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isPrivateIp(mapped[1])
    return false
  }

  return true
}

/** 校验 URL 是否可安全访问，返回规范化后的 URL */
async function assertSafeUrl(raw: string): Promise<URL> {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw createError({ statusCode: 400, message: '无效的URL格式' })
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw createError({ statusCode: 400, message: '仅支持 http/https 协议' })
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw createError({ statusCode: 400, message: '不允许访问该地址' })
  }

  // 字面量 IP：直接判断
  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw createError({ statusCode: 400, message: '不允许访问内网地址' })
    }
    return url
  }

  // 域名：解析后逐个校验，防止 DNS rebinding 到内网
  let addresses: { address: string }[]
  try {
    addresses = await dns.lookup(hostname, { all: true })
  } catch {
    throw createError({ statusCode: 400, message: '无法解析该域名' })
  }

  if (!addresses.length) {
    throw createError({ statusCode: 400, message: '无法解析该域名' })
  }

  if (addresses.some((a) => isPrivateIp(a.address))) {
    throw createError({ statusCode: 400, message: '不允许访问内网地址' })
  }

  return url
}

function pickMeta(html: string, patterns: RegExp[]): string {
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1]) return m[1].trim()
  }
  return ''
}

const MAX_HTML_BYTES = 200_000
const MAX_REDIRECTS = 5
const FETCH_TIMEOUT_MS = 8000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

/**
 * 跟随重定向，但每一跳都重新做安全校验。
 *
 * 只校验初始 URL 是不够的：公网域名可以 302 到 169.254.169.254 等内网地址，
 * 直接用 redirect: 'follow' 会绕过前面的 SSRF 检查。
 */
async function fetchSafely(startUrl: URL): Promise<Response> {
  let currentUrl = startUrl

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(currentUrl.toString(), {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': USER_AGENT }
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      await response.body?.cancel().catch(() => {})
      if (!location) {
        throw createError({ statusCode: 502, message: '目标站点返回了无效的重定向' })
      }
      currentUrl = await assertSafeUrl(new URL(location, currentUrl).toString())
      continue
    }

    return response
  }

  throw createError({ statusCode: 502, message: '重定向次数过多' })
}

/** 按字节上限读取响应体，避免被超大页面拖垮内存。 */
async function readTextLimited(response: Response, maxBytes: number): Promise<string> {
  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let received = 0

  try {
    while (received < maxBytes) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    await reader.cancel().catch(() => {})
  }

  return text
}

export default defineEventHandler(async (event) => {
  // 仅管理员可用，避免被当作公开代理滥用
  requireAdmin(event)

  const query = getQuery(event)
  const rawUrl = query.url

  if (typeof rawUrl !== 'string' || !rawUrl) {
    throw createError({ statusCode: 400, message: '请提供URL' })
  }

  const url = await assertSafeUrl(rawUrl)

  // 重定向必须逐跳校验，详见 fetchSafely
  let response: Response
  try {
    response = await fetchSafely(url)
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, message: '无法访问目标网站' })
  }

  if (!response.ok) {
    throw createError({ statusCode: 502, message: '无法获取网站信息' })
  }

  // 限制读取体积，避免被超大页面拖垮
  const html = (await readTextLimited(response, MAX_HTML_BYTES)).slice(0, MAX_HTML_BYTES)

  const title = pickMeta(html, [
    /<title[^>]*>([^<]*)<\/title>/i,
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i,
    /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i
  ])

  let favicon = pickMeta(html, [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i,
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']*)["']/i
  ])

  favicon = favicon ? new URL(favicon, url).toString() : new URL('/favicon.ico', url).toString()

  return { title, favicon }
})
