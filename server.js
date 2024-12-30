const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
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
const port = process.env.PORT || 3000;

// 设置密码和 JWT 密钥
const ADMIN_PASSWORD = '123'; // 修改为你的密码
const JWT_SECRET = 'your-jwt-secret'; // 修改为你的 JWT 密钥

// 允许前端发送 JSON 数据
app.use(express.json());

// 登录接口 - 需要在认证中间件之前
app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: '密码错误' });
    }
});

// 验证中间件
const authenticateToken = (req, res, next) => {
    // 如果是登录页面，直接通过
    if (req.path === '/login.html') {
        return next();
    }

    // 从 URL 参数或 Authorization header 获取 token
    const token = req.query.token || (req.headers['authorization'] || '').split(' ')[1];

    if (!token) {
        // 如果是 admin.html 或其他 HTML 请求，重定向到登录页面
        if (req.accepts('html') || req.path.endsWith('.html')) {
            return res.redirect('/login.html');
        }
        // 如果是 API 请求，返回 JSON 响应
        return res.status(401).json({ message: '未授权' });
    }

    try {
        // 验证 token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // 如果是 admin.html 或其他 HTML 请求，重定向到登录页面
        if (req.accepts('html') || req.path.endsWith('.html')) {
            return res.redirect('/login.html');
        }
        // 如果是 API 请求，返回 JSON 响应
        return res.status(403).json({ message: '无效的 token' });
    }
};

// 确保中间件的顺序正确
app.use(express.json());

// 确保 login.html 可以访问
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 添加公开路由
app.get('/public-config', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, 'config.js'), 'utf-8');
        const config = eval(data);
        // 只返回安全的公开信息
        res.json({
            title: config.title,
            backgroundImage: config.backgroundImage,
            favicon: config.favicon
        });
    } catch (err) {
        console.error('读取配置文件失败:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 添加重启服务器的函数
function restartServer() {
    console.log('正在重启服务器...');
    
    // 启动新的服务器进程
    const newProcess = spawn(process.argv[0], [process.argv[1]], {
        detached: true,
        stdio: 'inherit'
    });

    // 解除对新进程的引用，让它独立运行
    newProcess.unref();

    // 退出当前进程
    process.exit();
}

// 修改密码接口
app.post('/api/change-password', authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: '请提供当前密码和新密码' });
    }

    if (currentPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: '当前密码错误' });
    }

    try {
        // 读取 server.js 文件
        const filePath = __filename;
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 使用更精确的正则表达式
        const passwordRegex = /const\s+ADMIN_PASSWORD\s*=\s*['"].*?['"];/;
        const newPasswordLine = `const ADMIN_PASSWORD = '${newPassword}';`;
        
        if (!passwordRegex.test(content)) {
            throw new Error('未找到密码配置行');
        }
        
        // 替换密码
        const newContent = content.replace(passwordRegex, newPasswordLine);
        
        // 验证替换是否成功
        if (content === newContent) {
            throw new Error('密码替换失败');
        }
        
        // 写入文件
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        // 验证文件写入
        const verifyContent = fs.readFileSync(filePath, 'utf8');
        if (!verifyContent.includes(newPasswordLine)) {
            throw new Error('密码写入验证失败');
        }
        
        console.log('密码修改成功');
        res.json({ success: true, message: '密码修改成功，服务器将在3秒后重启' });
        
        // 延迟3秒后重启服务器，确保响应能够发送到客户端
        setTimeout(restartServer, 3000);
    } catch (error) {
        console.error('修改密码失败:', error);
        res.status(500).json({ 
            success: false, 
            message: '修改密码失败: ' + error.message
        });
    }
});

// 保护 admin.html 和相关资源
app.use(['/admin.html', '/admin/*', '/api/*'], authenticateToken);

// 静态文件中间件
app.use(express.static(path.join(__dirname)));

// 添加获取网站信息的接口
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

// 保持原有的完整配置路由（需要认证）
app.get('/config', async (req, res) => {
    // 获取 token
    const token = req.query.token || (req.headers['authorization'] || '').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未授权' });
    }

    try {
        // 验证 token
        jwt.verify(token, JWT_SECRET);

        // 读取配置文件
        const data = await fs.promises.readFile(path.join(__dirname, 'config.js'), 'utf-8');
        const config = eval(data);
        res.json(config);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: '无效的 token' });
        }
        console.error('读取配置文件失败:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 更新配置
app.post('/config', async (req, res) => {
    // 获取 token
    const token = req.query.token || (req.headers['authorization'] || '').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未授权' });
    }

    try {
        // 验证 token
        jwt.verify(token, JWT_SECRET);

        const newConfig = req.body;
        if (!newConfig || !newConfig.links) {
            return res.status(400).json({ message: '无效的配置数据' });
        }

        // 格式化配置数据
        const configContent = `const config = ${JSON.stringify(newConfig, null, 4)};\n\nmodule.exports = config;`;
        
        // 写入文件
        await fs.promises.writeFile(path.join(__dirname, 'config.js'), configContent, 'utf8');
        
        // 清除 require 缓存
        delete require.cache[require.resolve('./config.js')];
        
        res.json({ message: '配置已更新' });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: '无效的 token' });
        }
        console.error('保存配置失败:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 错误处理
app.use((req, res) => {
    console.log('404 Not Found:', req.url);
    res.status(404).send('404 Not Found');
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Internal Server Error');
});

// 添加 token 验证接口
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.json({ valid: true });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}/admin.html`);
});

