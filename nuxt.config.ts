export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/style.css'
  ],
  app: {
    head: {
      title: 'fmq的主页',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'keywords', content: '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    adminPassword: '1235',
    jwtSecret: 'your-jwt-secret',
    public: {
      apiBase: '/api'
    }
  }
})