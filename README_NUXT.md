# HomePage - Nuxt.js 版本

基于 Nuxt.js 3 构建的现代化个人导航主页，支持后台管理和静态部署。

## 特性

- 🚀 **现代化架构**: 基于 Nuxt.js 3 + Vue 3 + TypeScript
- 🎨 **美观界面**: 响应式设计，支持自定义背景和主题
- 🔐 **安全管理**: JWT 认证的管理后台
- ⚙️ **灵活配置**: 可视化配置导航链接、搜索引擎和网站分类
- 🌐 **SEO 优化**: 完整的 SEO 元数据支持
- 📱 **移动端适配**: 完美支持移动设备
- 🔍 **智能搜索**: 多搜索引擎支持，自动获取网站信息
- 💾 **数据持久化**: 配置数据本地存储
- 🐳 **容器化部署**: 支持 Docker 部署

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看首页
访问 http://localhost:3000/admin 进入管理后台（默认密码：1235）

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 生成静态文件
npm run generate
```

## 功能特性

### 前台功能
- 🕐 实时时间显示
- 🔍 多搜索引擎切换
- 📚 网址分类管理
- 🎯 快速导航
- 📱 响应式设计

### 后台功能
- ⚙️ 网站基本信息配置
- 🧭 导航菜单管理
- 🔎 搜索引擎配置
- 📂 网址分类管理
- 🔐 安全设置和密码修改
- 🎨 背景图片和图标设置
- 📄 页脚信息配置

## 项目结构

```
HomePage/
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   ├── img/               # 图片资源
│   └── js/                # JavaScript 文件
├── components/             # Vue 组件
├── layouts/               # 布局模板
├── pages/                 # 页面路由
│   ├── index.vue          # 首页
│   ├── admin.vue          # 管理后台
│   ├── login.vue          # 登录页
│   └── local/             # 本地服务页面
├── server/api/            # API 路由
│   ├── auth/              # 认证相关
│   ├── config.ts          # 配置管理
│   └── fetch-site-info.ts # 网站信息获取
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── middleware/            # Nuxt 中间件
├── public/                # 公共静态文件
├── nuxt.config.ts         # Nuxt 配置文件
└── package.json           # 项目配置
```

## 配置说明

### 环境变量

创建 `.env` 文件：

```env
NUXT_ADMIN_PASSWORD=your_password
NUXT_JWT_SECRET=your_jwt_secret
```

### 默认配置

项目提供了完整的默认配置，包括：
- 网站基本信息
- 导航菜单
- 搜索引擎
- 网址分类和链接
- 版权信息

## API 接口

### 认证接口

- `POST /api/auth/login` - 管理员登录
- `GET /api/auth/verify` - 验证 token
- `POST /api/auth/change-password` - 修改密码

### 配置接口

- `GET /api/config` - 获取配置
- `POST /api/config` - 更新配置（需认证）

### 工具接口

- `GET /api/fetch-site-info` - 获取网站信息

## 部署方案

### 1. 传统部署

```bash
# 构建项目
npm run build

# 启动服务器
npm run start
```

### 2. 静态部署

```bash
# 生成静态文件
npm run generate

# 部署 .output/public 目录到 Web 服务器
```

### 3. Docker 部署

```bash
# 构建镜像
docker build -t homepage-nuxt .

# 运行容器
docker run -p 3000:3000 homepage-nuxt
```

### 4. Docker Compose

```bash
docker-compose up -d
```

## 开发指南

### 添加新的配置项

1. 在 `types/config.ts` 中定义类型
2. 在 `utils/config.ts` 中添加默认值
3. 在管理页面 `admin.vue` 中添加编辑界面
4. 在首页 `index.vue` 中使用配置

### 添加新的 API

1. 在 `server/api/` 目录下创建文件
2. 遵循 RESTful API 设计规范
3. 添加适当的错误处理和认证

### 自定义样式

1. 在 `assets/css/` 目录下修改样式文件
2. 使用 Tailwind CSS 进行快速样式开发
3. 保持响应式设计原则

## 安全注意事项

- 🔒 默认密码请及时修改
- 🛡️ JWT 密钥建议使用强随机字符串
- 🌐 生产环境请使用 HTTPS
- 🔧 定期更新依赖包

## 技术栈

- **前端框架**: Nuxt.js 3
- **UI 框架**: Vue 3 + TypeScript
- **样式方案**: Tailwind CSS + SCSS
- **认证方案**: JWT
- **构建工具**: Vite
- **部署方案**: Docker + Nginx

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 致谢

- [Nuxt.js](https://nuxt.com/) - 现代化的 Vue.js 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [FontAwesome](https://fontawesome.com/) - 图标库
- 原始项目基于 [六零导航页](https://gitee.com/LyLme/lylme_spage) 的 lylme 主题