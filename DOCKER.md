# Docker 部署指南

本文档介绍如何使用 Docker 部署 fmq 的主页项目。

## 🐋 快速开始

### 1. 环境准备

确保已安装以下软件：
- [Docker](https://www.docker.com/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/) 2.0+

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（生产环境请务必修改安全配置）
nano .env
```

### 3. 启动服务

```bash
# 构建并启动应用
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f homepage

# 访问应用
curl http://localhost:3000/api/health
```

## 🔧 单独构建镜像

```bash
# 构建镜像
docker build -t asfmqi/homepage:latest .

# 查看镜像大小
docker images | grep asfmqi/homepage
```

## 🚀 部署方案

### 基础部署

```bash
# 启动应用
docker-compose up -d

# 访问地址
http://localhost:3000
```

### 自定义端口部署

```bash
# 修改 .env 文件中的端口
HOMEPAGE_PORT=8080

# 启动应用
docker-compose up -d

# 访问地址
http://localhost:8080
```

## 🔍 监控和日志

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f homepage

# 查看资源使用
docker stats homepage-nuxt
```

## 🔄 更新应用

```bash
# 重新构建并部署
docker-compose up -d --build

# 或拉取新镜像
docker-compose pull && docker-compose up -d
```

## 🛠 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 修改 .env 文件中的端口
   HOMEPAGE_PORT=8080
   docker-compose up -d
   ```

2. **构建失败**
   ```bash
   # 清理缓存并重新构建
   docker builder prune -f
   docker-compose build --no-cache
   ```

3. **查看详细错误**
   ```bash
   docker-compose logs homepage
   ```

---

## 📞 支持

如遇问题请检查 [GitHub Issues](https://github.com/Asfmq/HomePage/issues)