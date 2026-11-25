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

# 编辑环境变量
nano .env
```

**必填项**（compose 会强制校验，缺失时直接报错，避免误用弱默认口令）：

| 变量                  | 说明                                   |
| --------------------- | -------------------------------------- |
| `NUXT_ADMIN_PASSWORD` | 后台管理员登录密码                     |
| `NUXT_JWT_SECRET`     | JWT 签名密钥，建议 32 位以上随机字符串 |

**存储方式**：

- `STORAGE_TYPE=local`（默认）：配置写入 `CONFIG_FILE_PATH`，compose 已挂载命名卷 `homepage-data:/app/data`，容器重建后配置不丢。
- `STORAGE_TYPE=qiniu`：需同时配置 `NUXT_QINIU_ACCESS_KEY` / `NUXT_QINIU_SECRET_KEY` / `NUXT_QINIU_BUCKET` / `NUXT_QINIU_DOMAIN`，适合无状态或文件系统只读的部署平台。

`.env` 示例：

```bash
NUXT_ADMIN_PASSWORD=换成你自己的强密码
NUXT_JWT_SECRET=至少32位的随机字符串
STORAGE_TYPE=local
HOMEPAGE_PORT=3000
```

> 注意：变量名必须是 `NUXT_` 前缀。旧版文档里的 `ADMIN_PASSWORD` / `JWT_SECRET` 不会被应用读取，会导致登录接口返回 503。

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
