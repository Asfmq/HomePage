# HomePage

## 项目概述
该项目基于[六零导航页](https://gitee.com/LyLme/lylme_spage)的lylme主题制作的纯静态个人导航页

### 优点
1. 可以在在config.json中便捷的配置网站信息
2. 使用node.js搭建个后台界面，也可以在后台界面中便捷的配置网站信息

### 在线演示
[点击查看演示站点](https://home.asfmq.com)

## 后台安装和运行
1. 确保已安装Node.js环境
2. 安装项目依赖：
```bash:copy
npm install
```
3. 启动服务器：
```bash:copy
node server.js
```
4. 在浏览器中访问：[后台管理界面](http://localhost:3000/admin.html)：http://localhost:3000/admin.html

## 后台管理界面功能
1. 网站信基本息配置（网站名称，描述，关键词，作者， logo， 背景图片）
2. 支持添加、删除、修改导航页，搜索引擎，网址分组和网址链接
3. 支持拖拽排序，支跨分组拖拽
4. 支持自动获取添加网站的标题和图标
5. 支持编辑或隐藏网站版权和备案信息