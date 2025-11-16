# ==========================================
# fmq的主页 | Asfmq's Homepage
# 精简生产环境 Dockerfile
# ==========================================

# 使用官方 Node.js 20 Alpine 镜像作为基础镜像
FROM node:20-alpine AS builder

# 设置构建参数
ARG NODE_ENV=production

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_PROGRESS=false

# 安装构建依赖（仅安装必要的包）
RUN apk add --no-cache libc6-compat

# 复制 package 文件（利用 Docker 缓存层）
COPY package*.json ./

# 安装所有依赖（包括 devDependencies，构建需要）
RUN npm ci --include=dev && npm cache clean --force

# 复制项目源文件
COPY . .

# 生成 .nuxt 目录并构建应用
RUN npm run prepare && npm run build

# 清理不需要的文件以减小镜像大小
RUN npm prune --production && \
    rm -rf node_modules/.cache && \
    rm -rf .nuxt/.cache && \
    rm -rf .nuxt/.nitro

# ==========================================
# 生产环境阶段
FROM node:20-alpine AS production

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxtjs -u 1001

# 设置工作目录
WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NUXT_APP_PORT=3000

# 安装运行时必需的系统依赖
RUN apk add --no-cache \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# 从构建阶段复制文件
COPY --from=builder --chown=nuxtjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nuxtjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/public ./public

# 创建必要的目录并设置权限
RUN mkdir -p /app/.output/logs && \
    chown -R nuxtjs:nodejs /app

# 切换到非 root 用户
USER nuxtjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# 启动命令
CMD ["node", ".output/server/index.mjs"]