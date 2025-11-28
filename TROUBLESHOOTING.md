# EdgeOne Pages 部署问题排查指南

## 🔍 404 错误排查步骤

如果部署到 EdgeOne Pages 后出现 404 错误，请按以下步骤排查：

### 1. 检查部署日志

在 EdgeOne Pages 控制台查看构建和部署日志：

1. 进入你的项目
2. 点击 **"部署"** 标签
3. 查看最新部署的详细日志

**关键检查点：**
- ✅ 构建是否成功完成
- ✅ 是否有错误或警告信息
- ✅ 输出目录是否正确（应该是 `.output`）
- ✅ 是否正确识别为 Nuxt 项目

### 2. 验证构建配置

确认 EdgeOne Pages 控制台中的配置：

| 配置项 | 正确值 |
|--------|--------|
| **框架** | Nuxt.js 或 Nuxt 3 |
| **构建命令** | `npm run build` |
| **输出目录** | `.output` |
| **安装命令** | `npm install` |
| **Node 版本** | 18.x 或 20.x |

### 3. 检查环境变量

确保在 EdgeOne Pages 控制台配置了必需的环境变量：

```bash
NUXT_ADMIN_PASSWORD=your-password
NUXT_JWT_SECRET=your-secret
```

**注意：** 环境变量修改后需要重新部署才能生效！

### 4. 检查路由配置

#### 问题：所有页面都 404

**可能原因：**
- Nitro preset 配置不正确
- 输出目录配置错误
- EdgeOne Pages 没有正确识别 Nuxt 应用

**解决方案：**
1. 确保 `nuxt.config.ts` 中**不要**指定 `nitro.preset`，让 EdgeOne 自动检测
2. 确保 `edgeone.json` 中的 `outputDirectory` 是 `.output`
3. 重新部署项目

#### 问题：API 路由 404

**可能原因：**
- API 路由没有正确部署
- serverless functions 配置问题

**解决方案：**
1. 检查 `server/api` 目录下的文件是否存在
2. 查看部署日志确认 API 路由是否被识别
3. 确保没有在 `edgeone.json` 中配置冲突的路由规则

### 5. 本地测试

在部署前，先在本地测试生产构建：

```bash
# 1. 构建项目
npm run build

# 2. 预览生产版本
npm run preview
```

访问 `http://localhost:3000` 确认应用正常工作。

### 6. 常见问题和解决方案

#### 问题 1: 首页 404

**症状：** 访问根路径 `/` 显示 404

**解决方案：**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // 不要指定 preset
    // preset: 'node-server', // ❌ 删除这行
    
    prerender: {
      crawlLinks: true,
      routes: ['/']  // ✅ 确保预渲染首页
    }
  }
})
```

#### 问题 2: 静态资源 404

**症状：** CSS、JS、图片等静态资源加载失败

**解决方案：**
1. 检查 `public` 目录下的文件是否正确
2. 确认构建输出中包含静态资源
3. 检查 EdgeOne Pages 的 CDN 配置

#### 问题 3: 动态路由 404

**症状：** 如 `/admin` 等页面 404

**解决方案：**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/admin']  // 添加需要预渲染的路由
    }
  }
})
```

或者确保 SSR 模式正确启用（默认已启用）。

#### 问题 4: 部署后环境变量不生效

**症状：** 应用无法读取环境变量

**解决方案：**
1. 在 EdgeOne Pages 控制台重新检查环境变量配置
2. 确保变量名以 `NUXT_` 开头
3. 重新部署项目（修改环境变量后必须重新部署）

### 7. 推荐配置

#### nuxt.config.ts（推荐配置）

```typescript
export default defineNuxtConfig({
  // 基础配置
  devtools: { enabled: true },
  
  // 运行时配置
  runtimeConfig: {
    adminPassword: process.env.NUXT_ADMIN_PASSWORD || '1235',
    jwtSecret: process.env.NUXT_JWT_SECRET || 'your-jwt-secret',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  
  // Nitro 配置
  nitro: {
    // 不指定 preset，让 EdgeOne 自动检测
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
```

#### edgeone.json（推荐配置）

```json
{
  "$schema": "https://pages.edgeone.ai/schema.json",
  "framework": {
    "name": "nuxt",
    "version": "3"
  },
  "build": {
    "command": "npm run build",
    "outputDirectory": ".output",
    "installCommand": "npm install"
  },
  "env": {
    "NODE_VERSION": "18"
  }
}
```

### 8. 高级解决方案

如果以上方法都不行，可以尝试：

#### 方案 A: 使用 EdgeOne Nuxt 模块

```bash
# 安装 EdgeOne Nuxt 模块
npm install @edgeone/nuxt-pages
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@edgeone/nuxt-pages'],
  // ... 其他配置
})
```

#### 方案 B: 使用静态生成

如果不需要 SSR，可以改用静态生成：

```bash
# 使用 generate 命令
npm run generate
```

然后在 EdgeOne Pages 配置：
- 构建命令: `npm run generate`
- 输出目录: `.output/public`

### 9. 获取帮助

如果问题仍未解决：

1. **查看 EdgeOne Pages 文档**
   - https://edgeone.cloud.tencent.com/pages/document

2. **联系 EdgeOne 技术支持**
   - 在控制台提交工单
   - 提供详细的错误信息和部署日志

3. **检查 Nuxt 文档**
   - https://nuxt.com/docs/getting-started/deployment

## ✅ 部署检查清单

部署前请确认：

- [ ] 本地 `npm run build` 成功
- [ ] 本地 `npm run preview` 可以正常访问
- [ ] `nuxt.config.ts` 中没有指定 `nitro.preset`
- [ ] `edgeone.json` 配置正确
- [ ] 环境变量已在 EdgeOne Pages 控制台配置
- [ ] Git 仓库代码已推送
- [ ] 构建日志没有错误
- [ ] 输出目录是 `.output`

---

**记住：** 每次修改配置后，都需要重新部署才能生效！
