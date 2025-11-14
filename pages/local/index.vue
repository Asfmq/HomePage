<template>
  <div class="local-container">
    <div class="local-header">
      <h1>本地服务</h1>
      <p>这里是您本地服务的聚合页面</p>
    </div>

    <div class="local-content">
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-folder"></i>
          </div>
          <h3>文件管理</h3>
          <p>管理本地文件和资源</p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <h3>系统设置</h3>
          <p>配置系统参数和选项</p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <h3>数据统计</h3>
          <p>查看系统使用统计</p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>安全中心</h3>
          <p>管理安全设置和权限</p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-database"></i>
          </div>
          <h3>数据库管理</h3>
          <p>管理数据库连接和查询</p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-terminal"></i>
          </div>
          <h3>终端访问</h3>
          <p>命令行终端访问</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: '本地服务',
  meta: [
    { name: 'description', content: '本地服务管理页面' }
  ]
})
</script>

<style scoped>
.local-container {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
  color: white;
  padding: 40px 20px;
}

.local-header {
  text-align: center;
  margin-bottom: 60px;
}

.local-header h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 0px 2px 4px rgba(0,0,0,0.3);
}

.local-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.local-content {
  max-width: 1200px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.service-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: white;
}

.service-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .local-header h1 {
    font-size: 2rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .service-card {
    padding: 30px 20px;
  }
}
</style>