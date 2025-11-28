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
    // 使用 node-server preset 以支持 SSR 和 API 路由
    preset: 'node-server',

    // 压缩配置
    compressPublicAssets: true,

    // 预渲染配置 - 预渲染静态页面以提升性能
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      // 如果有其他静态页面，可以添加到这里
      // routes: ['/', '/about', '/contact']
    },

    // 环境变量配置
    runtimeConfig: {
      // 确保环境变量正确传递
      adminPassword: process.env.NUXT_ADMIN_PASSWORD,
      jwtSecret: process.env.NUXT_JWT_SECRET,
    }
  },

  // 构建优化
  build: {
    // 启用 CSS 代码分割
    // extractCSS: true, // Nuxt 3 默认已启用
  },

  // 实验性功能（可选）
  experimental: {
    // 启用 payload 提取以优化性能
    payloadExtraction: true,
  },

  // 路由配置
  routeRules: {
    // API 路由启用 CORS
    '/api/**': { cors: true },
  }
})