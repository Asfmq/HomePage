# EdgeOne Pages 部署完整指南（官方文档版）

## 🚨 重要发现

根据 EdgeOne Pages 官方文档，我发现了之前配置的问题：

### ❌ 之前的错误配置
1. 使用了 `nitro.preset: 'node-server'` - 这不适合 EdgeOne Pages
2. 在 `edgeone.json` 中手动指定了构建命令和输出目录
3. 添加了过多的自定义配置

### ✅ 正确的配置方式
**EdgeOne Pages 会自动识别 Nuxt 项目并配置所有必要的设置！**

## 📋 当前配置（已优化）

### 1. `nuxt.config.ts` - 极简配置

```typescript
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
  }
})
```

**关键点：**
- ❌ 不要添加 `nitro` 配置
- ❌ 不要添加 `modules: ['@edgeone/nuxt-pages']`（会导致构建失败）
- ✅ 让 EdgeOne Pages 自动处理所有部署配置

### 2. `edgeone.json` - 极简配置

```json
{
  "framework": "nuxt"
}
```

**就这么简单！** EdgeOne Pages 会自动：
- 检测 Nuxt 版本
- 选择正确的构建命令
- 配置输出目录
- 设置 Nitro preset

## 🚀 部署步骤

### 方式一：通过 EdgeOne Pages 控制台（推荐）

1. **访问控制台**
   https://console.cloud.tencent.com/edgeone/pages

2. **导入 Git 仓库**
   - 点击"新建项目" → "导入 Git 仓库"
   - 授权并选择你的 `HomePage` 仓库

3. **配置项目（重要！）**
   
   EdgeOne Pages 会自动检测配置，但请**确认**以下设置：
   
   | 配置项 | 推荐值 | 说明 |
   |--------|--------|------|
   | **框架预设** | Nuxt.js | 自动检测 |
   | **构建命令** | 留空或 `npm run build` | 让平台自动选择 |
   | **输出目录** | 留空或 `.output` | 让平台自动选择 |
   | **Node 版本** | 18.x 或 20.x | 推荐 18.x |
   | **根目录** | `/` | 如果项目在仓库根目录 |

   **⚠️ 关键：不要手动指定太多配置，让 EdgeOne Pages 自动处理！**

4. **配置环境变量**
   
   在"环境变量"部分添加：
   
   ```bash
   NUXT_ADMIN_PASSWORD=你的强密码
   NUXT_JWT_SECRET=至少32个字符的密钥
   ```
   
   可选（如果使用七牛云）：
   ```bash
   STORAGE_TYPE=qiniu
   NUXT_QINIU_ACCESS_KEY=你的AccessKey
   NUXT_QINIU_SECRET_KEY=你的SecretKey
   NUXT_QINIU_BUCKET=你的Bucket名称
   NUXT_QINIU_DOMAIN=https://你的域名
   NUXT_QINIU_CONFIG=配置路径
   ```

5. **部署**
   - 点击"部署"按钮
   - 等待构建完成（2-5分钟）
   - 获取部署 URL

### 方式二：通过 EdgeOne CLI

```bash
# 1. 安装 CLI（版本 ≥ 1.2.4）
npm install -g @edgeone/cli

# 2. 登录
edgeone login

# 3. 在项目目录初始化
edgeone init

# 4. 部署
edgeone deploy
```

## 🔍 部署后检查

### 1. 查看部署日志

在 EdgeOne Pages 控制台：
1. 进入项目
2. 点击"部署"标签
3. 查看最新部署的日志

**检查要点：**
- ✅ 是否识别为 Nuxt 项目
- ✅ 构建命令是什么（应该是 `npm run build` 或自动检测）
- ✅ 输出目录是什么（应该是 `.output`）
- ✅ 是否有错误信息

### 2. 测试部署的应用

访问 EdgeOne Pages 提供的 URL，测试：
- ✅ 首页是否正常显示
- ✅ 静态资源（CSS、JS、图片）是否加载
- ✅ API 路由是否工作（如 `/api/xxx`）
- ✅ 管理页面是否可访问（如 `/admin`）

## 🐛 如果还是 404

### 检查清单

1. **检查构建日志**
   - 是否有构建错误？
   - 是否正确识别为 Nuxt 项目？
   - 输出目录是否正确？

2. **检查 EdgeOne Pages 控制台配置**
   - 框架是否选择了 Nuxt？
   - 构建命令是否正确？
   - 环境变量是否配置？

3. **本地测试**
   ```bash
   # 本地构建测试
   npm run build
   
   # 本地预览
   npm run preview
   ```
   
   如果本地预览正常，但部署后 404，问题在于 EdgeOne Pages 配置。

4. **检查 package.json**
   
   确保有正确的脚本：
   ```json
   {
     "scripts": {
       "build": "nuxt build",
       "dev": "nuxt dev",
       "generate": "nuxt generate",
       "preview": "nuxt preview"
     }
   }
   ```

5. **尝试使用 generate 命令**
   
   如果 SSR 部署有问题，可以尝试静态生成：
   
   在 EdgeOne Pages 控制台修改：
   - 构建命令: `npm run generate`
   - 输出目录: `.output/public`

## 📊 EdgeOne Pages 自动配置说明

根据官方文档，EdgeOne Pages 对 Nuxt 项目会自动：

1. **检测 Nuxt 版本**（支持 3.16.0+）
2. **选择构建命令**
   - SSR: `npm run build`
   - SSG: `npm run generate`
3. **配置 Nitro preset**（自动适配 EdgeOne 平台）
4. **设置输出目录**
   - SSR: `.output`
   - SSG: `.output/public` 或 `dist`
5. **配置 serverless functions**（用于 API 路由）

**所以你不需要在 `nuxt.config.ts` 中手动配置这些！**

## 🎯 最佳实践

### DO ✅

1. ✅ 使用最简化的 `nuxt.config.ts`
2. ✅ 让 EdgeOne Pages 自动检测和配置
3. ✅ 在 EdgeOne Pages 控制台配置环境变量
4. ✅ 使用 Git 集成实现自动部署
5. ✅ 定期查看部署日志

### DON'T ❌

1. ❌ 不要手动配置 `nitro.preset`
2. ❌ 不要在 `edgeone.json` 中过度配置
3. ❌ 不要在代码中硬编码敏感信息
4. ❌ 不要使用不兼容的 Nuxt 版本（< 3.16.0）
5. ❌ 不要忽略构建日志中的警告

## 📚 相关资源

- [EdgeOne Pages 官方文档](https://edgeone.cloud.tencent.com/pages/document)
- [EdgeOne Pages Nuxt 指南](https://pages.edgeone.ai/document/nuxt)
- [Nuxt 3 部署文档](https://nuxt.com/docs/getting-started/deployment)
- [EdgeOne CLI 文档](https://www.npmjs.com/package/@edgeone/cli)

## 🆘 获取帮助

如果问题仍未解决：

1. 在 EdgeOne Pages 控制台提交工单
2. 提供详细的部署日志
3. 说明具体的错误信息
4. 提供项目的 Git 仓库链接（如果可以）

---

**记住：简单就是最好的！让 EdgeOne Pages 自动处理配置。** 🎉
