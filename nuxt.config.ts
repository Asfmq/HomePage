export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/style.css',
    '~/assets/css/performance.css',
    '~/assets/css/index.css'
  ],

  app: {
    head: {
      title: 'fmq的主页',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'fmq的个人主页' },
        { name: 'keywords', content: 'fmq,个人主页,homepage' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' }
      ]
    }
  },

  // 运行时配置 - 使用环境变量
  runtimeConfig: {
    // 服务端私有配置（不会暴露给客户端）
    adminPassword: process.env.NUXT_ADMIN_PASSWORD || '1235',
    jwtSecret: process.env.NUXT_JWT_SECRET || 'your-jwt-secret',

    // 七牛云配置（如果使用）
    qiniuAccessKey: process.env.NUXT_QINIU_ACCESS_KEY || '',
    qiniuSecretKey: process.env.NUXT_QINIU_SECRET_KEY || '',
    qiniuBucket: process.env.NUXT_QINIU_BUCKET || '',
    qiniuDomain: process.env.NUXT_QINIU_DOMAIN || '',
    qiniuConfig: process.env.NUXT_QINIU_CONFIG || '',

    // 公共配置（会暴露给客户端）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // Nitro 配置 - EdgeOne Pages 部署优化
  nitro: {
    // EdgeOne Pages 会自动检测并使用合适的 preset
    // 压缩配置
    compressPublicAssets: true,

    // 预渲染配置
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  // 实验性功能
  experimental: {
    payloadExtraction: true,
  },

  // 路由配置
  routeRules: {
    '/api/**': { cors: true },
  }
})