export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const urlString = query.url as string

    if (!urlString) {
      throw createError({
        statusCode: 400,
        statusMessage: '请提供URL'
      })
    }

    // Validate URL format
    try {
      new URL(urlString)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: '无效的URL格式'
      })
    }

    // Fetch the website
    const response = await fetch(urlString, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: 500,
        statusMessage: '无法获取网站信息'
      })
    }

    const html = await response.text()
    const url = new URL(urlString)

    // Parse HTML to extract title and favicon
    let title = ''
    let favicon = ''

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    if (titleMatch) {
      title = titleMatch[1].trim()
    }

    // If no title, try Open Graph title
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i)
      if (ogTitleMatch) {
        title = ogTitleMatch[1].trim()
      }
    }

    // Extract favicon
    const faviconSelectors = [
      /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["'][^>]*>/i,
      /<link[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']*)["'][^>]*>/i,
      /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']*)["'][^>]*>/i,
      /<link[^>]*rel=["']apple-touch-icon-precomposed["'][^>]*href=["']([^"']*)["'][^>]*>/i
    ]

    for (const selector of faviconSelectors) {
      const match = html.match(selector)
      if (match) {
        favicon = match[1]
        break
      }
    }

    // Convert relative favicon URL to absolute
    if (favicon) {
      if (!favicon.startsWith('http')) {
        if (favicon.startsWith('/')) {
          favicon = new URL(favicon, url).toString()
        } else {
          favicon = new URL(favicon, url).toString()
        }
      }
    } else {
      // Default favicon
      favicon = new URL('/favicon.ico', url).toString()
    }

    return {
      title,
      favicon
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '获取网站信息失败'
    })
  }
})