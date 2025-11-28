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

  // 运行时配置
  runtimeConfig: {
    adminPassword: process.env.NUXT_ADMIN_PASSWORD || '1235',
    jwtSecret: process.env.NUXT_JWT_SECRET || 'your-jwt-secret',
    qiniuAccessKey: process.env.NUXT_QINIU_ACCESS_KEY || '',
    qiniuSecretKey: process.env.NUXT_QINIU_SECRET_KEY || '',
    qiniuBucket: process.env.NUXT_QINIU_BUCKET || '',
    qiniuDomain: process.env.NUXT_QINIU_DOMAIN || '',
    qiniuConfig: process.env.NUXT_QINIU_CONFIG || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // adapter: process.env.NODE_ENV === 'production' ? 
  //   require('@edgeone/nuxt') : undefined,
  
  // // 确保SSR启用
  // ssr: true,
  
  // // Nitro配置
  // nitro: {
  //   // 指定输出目录为EO平台期望的目录
  //   output: {
  //     dir: '.output',
  //     serverDir: '.output/server',
  //     publicDir: '.output/public'
  //   },
  //   // 路由规则配置
  //   routeRules: {
  //     // 静态资源缓存
  //     '/_nuxt/**': { 
  //       headers: { 
  //         'cache-control': 'public, max-age=31536000, immutable' 
  //       } 
  //     },
  //     // API路由
  //     '/api/**': { cors: true, swr: 60 }
  //   }
  // }
})