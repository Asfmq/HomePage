const express = require('express');
const fs = require('fs');
const path = require('path');
let fetch;
let cheerio;
const { URL } = require('url');

// 动态导入依赖
async function importDependencies() {
    try {
        fetch = require('node-fetch');
        cheerio = require('cheerio');
    } catch (error) {
        console.error('请先安装必要的依赖：');
        console.error('npm install node-fetch@2 cheerio');
        process.exit(1);
    }
}

// 启动前导入依赖
importDependencies();

const app = express();
const port = 3000;

// 添加获取网站信息的接口 - 需要放在静态文件中间件之前
app.get('/fetch-site-info', async (req, res) => {
    const urlString = req.query.url;
    if (!urlString) {
        return res.status(400).json({ error: '请提供URL' });
    }

    try {
        // 使用 URL 类处理 URL
        const url = new URL(urlString);
        const response = await fetch(url.toString());
        const html = await response.text();
        const $ = cheerio.load(html);

        // 获取网站标题
        const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';

        // 获取网站图标
        let favicon = '';
        // 尝试不同的图标位置
        const faviconSelectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ];

        for (const selector of faviconSelectors) {
            const faviconEl = $(selector).first();
            if (faviconEl.length) {
                favicon = faviconEl.attr('href');
                break;
            }
        }

        // 如果找到的是相对路径，转换为绝对路径
        if (favicon && !favicon.startsWith('http')) {
            favicon = favicon.startsWith('/') 
                ? new URL(favicon, url).toString()
                : new URL(favicon, url).toString();
        }

        // 如果没有找到图标，使用默认的 favicon.ico
        if (!favicon) {
            favicon = new URL('/favicon.ico', url).toString();
        }

        res.json({ title, favicon });
    } catch (error) {
        console.error('获取网站信息失败:', error);
        res.status(500).json({ error: '获取网站信息失败' });
    }
});

// 静态文件中间件
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// 允许前端发送 JSON 数据
app.use(express.json());

// 读取 config.js
app.get('/config', (req, res) => {
    fs.readFile(path.join(__dirname, 'config.js'), 'utf-8', (err, data) => {
        if (err) {
            console.error('读取配置文件失败:', err);
            return res.status(500).send('无法读取配置文件');
        }

        try {
            const config = eval(data);
            res.json(config);
        } catch (e) {
            console.error('解析配置文件失败:', e);
            res.status(500).send('解析配置文件失败');
        }
    });
});

// 更新 config.js
app.post('/config', (req, res) => {
    const newConfig = req.body;

    // 验证配置数据
    if (!newConfig || !newConfig.links) {
        return res.status(400).send('无效的配置数据');
    }

    try {
        // 格式化配置数据
        const configContent = `const config = ${JSON.stringify(newConfig, null, 4)};\n\nmodule.exports = config;`;
        
        // 同步写入文件以确保写入完成
        fs.writeFileSync(path.join(__dirname, 'config.js'), configContent, 'utf8');
        
        // 清除 require 缓存，确保下次读取时获取最新内容
        delete require.cache[require.resolve('./config.js')];
        
        res.send('配置文件已更新');
    } catch (error) {
        console.error('保存配置文件失败:', error);
        res.status(500).send(`保存配置文件失败: ${error.message}`);
    }
});

// 根路由 - 返回 admin.html
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, './admin/index.html'));
});

// 处理 404 错误
app.use((req, res) => {
    console.log('404 Not Found:', req.url);
    res.status(404).send('404 Not Found');
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Internal Server Error');
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}/admin.html`);
});

