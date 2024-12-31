
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install --production && npm cache clean --force
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
