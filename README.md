# HomePage

## 项目概述
该项目基于[六零导航页](https://gitee.com/LyLme/lylme_spage)的lylme主题制作的纯静态个人导航页

### 优点
1. 可以在在config.json中直接配置网站信息，静态部署
2. 使用node.js搭建后台界面，也可以在后台中便捷的配置网站信息。配置完成后也可关闭node.js，静态部署前端

### 后台管理界面功能
1. 网站信基本息配置（网站名称，描述，关键词，作者， logo， 背景图片）
2. 支持添加、删除、修改导航页，搜索引擎，网址分组和网址链接
3. 支持拖拽排序，支跨分组拖拽
4. 支持自动获取添加网站的标题和图标
5. 支持编辑或隐藏网站版权和备案信息
6. 各种图标直接支持[svg代码](https://www.iconfont.cn/)
7. 支持管理员密码登陆

### 前端及后台演示
[后台演示](https://test.asfmq.cn/admin.html)

[前端演示](https://test.asfmq.cn)

## 静态使用
### 下载项目
```bash:copy
git clone https://github.com/Asfmq/HomePage.git
```
下载完成后使用nginx等web服务器部署即可

## 后台安装和运行
### 普通安装
1. 确保已安装Node.js环境
2. 安装项目依赖：
```bash:copy
npm install
```
3. 启动服务器：
```bash:copy
node server.js
```
4. 在浏览器中访问后台管理界面：http://localhost:3000/admin.html
### 使用docker安装
1. 下载docker-compose.yml文件
```bash:copy
wget https://raw.githubusercontent.com/Asfmq/HomePage/refs/heads/main/docker-compose.yml
```
2. 创建html目录并启动docker
```bash:copy
mkdir html
docker-compose up -d
```
3. 在浏览器中访问后台管理界面：http://localhost:3000/admin.html
4. 配置完网页信息后，可以直接在浏览器中访问前端：http://localhost:3000，
也可以停止docker后，使用nginx等web服务器部署在html目录即可

