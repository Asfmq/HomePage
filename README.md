# fmq的主页 | Asfmq's Homepage

一个基于 Nuxt 3 构建的现代化个人主页，具有搜索功能、分类链接管理和响应式设计。

A modern personal homepage built with Nuxt 3, featuring search functionality, categorized links management, and responsive design.

## ✨ 特性 | Features

### 🎯 核心功能 | Core Features
- **🔍 智能搜索** - 支持多个搜索引擎（必应、百度、搜狗）
- **📱 响应式设计** - 完美适配桌面和移动设备
- **🎨 现代化界面** - 毛玻璃效果和平滑动画
- **⚡ 高性能** - 基于 Nuxt 3 的 SSR 和代码分割
- **🌐 SVG 图标系统** - 统一的图标管理和显示
- **🖱️ 拖拽排序** - 支持链接和分类的实时拖拽排序
- **☁️ 云端存储** - 支持七牛云对象存储，实现配置持久化

### 🛠 技术特性 | Technical Features
- **Vue 3 Composition API** - 现代化的组件开发
- **TypeScript 支持** - 类型安全和更好的开发体验
- **组件化架构** - 可重用的 Vue 组件
- **服务端渲染 (SSR)** - 更好的 SEO 和首屏加载速度
- **热模块替换** - 快速的开发体验
- **API 后端** - 完整的配置管理和认证系统
- **多存储支持** - 支持本地文件系统和七牛云存储切换

## 🚀 技术栈 | Tech Stack

### 前端 | Frontend
- **[Nuxt 3](https://nuxt.com/)** - Vue.js 全栈框架
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架

### 后端 | Backend
- **Nuxt Server** - 内置的服务器端 API
- **JWT 认证** - 安全的用户认证系统
- **配置管理 API** - 动态配置管理
- **[Qiniu SDK](https://developer.qiniu.com/kodo/sdk/nodejs)** - 七牛云对象存储集成

### 开发工具 | Development Tools
- **[Vite](https://vitejs.dev/)** - 快速的构建工具
- **Nuxt DevTools** - 强大的开发调试工具

## 📁 项目结构 | Project Structure

```
HomePage/
├── 📂 assets/              # 静态资源文件
│   ├── css/               # 样式文件
│   └── js/                # JavaScript 文件
├── 📂 components/          # Vue 组件
│   ├── IconComponent.vue  # 图标组件
│   ├── SearchBox.vue      # 搜索框组件
│   └── IconDebug.vue      # 图标调试组件
├── 📂 composables/         # Vue 组合式函数
├── 📂 middleware/          # Nuxt 中间件
├── 📂 pages/              # 页面文件
│   ├── index.vue          # 主页
│   └── admin.vue          # 管理页面
├── 📂 plugins/            # Nuxt 插件
│   └── svg-icons.client.ts # SVG 图标加载插件
├── 📂 public/             # 公共静态资源
│   ├── img/               # 图片资源
│   └── icons.svg          # SVG 图标精灵
├── 📂 server/             # 服务端 API
│   └── api/               # API 路由
│       ├── config.get.ts  # 获取配置
│       ├── config.post.ts # 更新配置
│       └── auth/          # 认证相关 API
├── 📂 types/              # TypeScript 类型定义
├── 📂 utils/              # 工具函数
│   └── config.ts          # 默认配置
├── 📄 app.vue             # 根组件
├── 📄 nuxt.config.ts      # Nuxt 配置文件
├── 📄 package.json        # 项目依赖和脚本
└── 📄 .env                # 环境变量配置
```

## 🛠 安装和使用 | Installation & Usage

### 环境要求 | Prerequisites
- **Node.js** 18.0.0 或更高版本
- **npm** 或 **yarn** 包管理器
- 或 **Docker** 20.10+ & Docker Compose 2.0+

### 方式一：传统部署 | Traditional Deployment

#### 安装依赖 | Install Dependencies
```bash
# 克隆项目 | Clone the repository
git clone <repository-url>
cd HomePage

# 安装依赖 | Install dependencies
npm install
```

#### 开发模式 | Development Mode
```bash
# 启动开发服务器 | Start development server
npm run dev

# 访问 http://localhost:3000
```

#### 构建部署 | Build & Deploy
```bash
# 构建生产版本 | Build for production
npm run build

# 预览生产版本 | Preview production build
npm run preview

# 生成静态站点 | Generate static site (可选)
npm run generate
```

### 方式二：Docker 部署 | Docker Deployment

```bash
# 配置环境变量
cp .env.example .env
# 编辑 .env 文件设置安全参数

# 启动应用
docker-compose up -d

# 访问 http://localhost:3000
```

### 📋 Docker 文档
详细的 Docker 部署指南请查看 [DOCKER.md](./DOCKER.md)

## ⚙️ 配置 | Configuration

### 环境变量 | Environment Variables

请参考 `.env.example` 创建 `.env` 文件。


### 站点配置 | Site Configuration
通过 `utils/config.ts` 或管理后台配置站点：

```typescript
export const defaultConfig: SiteConfig = {
  title: "你的主页",
  backgroundImage: "your-background-image-url",
  links: {
    navItems: [
      { name: "主页", url: "/", id: "home-link" },
      { name: "博客", url: "/blog", id: "blog-link" }
    ],
    searchEngines: [
      { name: "Bing", url: "https://www.bing.com/search?q=", icon: "#icon-bing" }
    ],
    categories: [
      {
        title: "常用工具",
        icon: "#icon-home",
        links: [
          { name: "GitHub", url: "https://github.com", icon: "#icon-ai" }
        ]
      }
    ]
  }
}
```

## 🎨 自定义 | Customization

### 添加新的搜索引擎 | Add Search Engines
在 `utils/config.ts` 中添加：
```typescript
{
  name: "Google",
  url: "https://www.google.com/search?q=",
  icon: "#icon-google"
}
```

### 添加新的分类链接 | Add Category Links
```typescript
{
  title: "开发工具",
  icon: "#icon-code",
  links: [
    { name: "VS Code", url: "https://code.visualstudio.com", icon: "#icon-vscode" }
  ]
}
```

### 自定义图标 | Custom Icons
1. 将 SVG 图标添加到 `public/icons.svg`
2. 使用 `<symbol>` 元素定义图标：
```xml
<symbol id="icon-custom" viewBox="0 0 1024 1024">
  <path d="..." fill="#ffffff"/>
</symbol>
```

## 🔧 API 接口 | API Endpoints

### 配置管理 | Configuration Management
```http
GET  /api/config     # 获取站点配置
POST /api/config     # 更新站点配置 (需要认证)
```

### 认证 | Authentication
```http
POST /api/auth/login    # 用户登录
GET  /api/auth/check    # 检查认证状态
```

### 站点信息 | Site Information
```http
GET /api/fetch-site-info?url={url}  # 获取网站信息
GET /api/health                      # 健康检查
```

## 🎯 组件说明 | Components Documentation

### SearchBox 搜索框组件
- **功能**: 多搜索引擎切换，搜索建议
- **Props**: `searchEngines`, `initial-engine`
- **Events**: `search`

### IconComponent 图标组件
- **功能**: 支持 SVG、图片和文本图标
- **Props**: `icon`, `type`, `size`
- **自动识别**: SVG (#)、图片 (http/)、文本图标

## 🌟 主要特性详解 | Feature Details

### 搜索功能
- 支持 3 个默认搜索引擎：必应、百度、搜狗
- 实时搜索建议（带防抖）
- 搜索历史记录
- 键盘快捷键支持

### 响应式设计
- 移动优先设计理念
- 平滑的动画过渡效果
- 毛玻璃背景效果
- 自适应布局

### 性能优化
- 图标懒加载
- 组件代码分割
- CSS 优化和压缩
- 静态资源缓存

## 🐛 故障排除 | Troubleshooting

### 常见问题 | Common Issues

**图标不显示？**
1. 检查 `public/icons.svg` 文件是否存在
2. 确认图标 ID 格式正确（如 `#icon-home`）
3. 验证 SVG 图标 fill 属性设置

**样式问题？**
1. 清除浏览器缓存
2. 重新构建项目：`npm run build`
3. 检查 Tailwind CSS 配置

**API 错误？**
1. 检查环境变量设置
2. 确认服务器端口未被占用
3. 查看控制台错误信息

## 🤝 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证 | License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢 | Acknowledgments

- [Nuxt.js](https://nuxt.com/) - 强大的 Vue.js 框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Font Awesome](https://fontawesome.com/) - 图标库

---

**Author**: [Asfmq](https://github.com/Asfmq)
**Version**: 1.0.0
**Last Updated**: 2025-11-21

⭐ 如果这个项目对你有帮助，请给个 Star！