<template>
  <div class="admin-layout">
    <!-- Admin Navigation -->
    <nav class="admin-nav">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">管理后台</h4>
          <div class="d-flex align-items-center">
            <NuxtLink to="/" class="btn btn-outline-light mr-3">
              <i class="fas fa-home"></i> 返回首页
            </NuxtLink>
            <button @click="handleLogout" class="btn btn-outline-danger">
              <i class="fas fa-sign-out-alt"></i> 退出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Admin Content -->
    <div class="admin-content">
      <div class="container-fluid">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3 admin-sidebar">
            <div class="sidebar-menu">
              <div class="menu-item" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">
                <i class="fas fa-cog"></i>
                <span>基本设置</span>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'nav' }" @click="activeTab = 'nav'">
                <i class="fas fa-bars"></i>
                <span>导航设置</span>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'search' }" @click="activeTab = 'search'">
                <i class="fas fa-search"></i>
                <span>搜索引擎</span>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">
                <i class="fas fa-folder"></i>
                <span>网址分类</span>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'footer' }" @click="activeTab = 'footer'">
                <i class="fas fa-copyright"></i>
                <span>页脚设置</span>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
                <i class="fas fa-shield-alt"></i>
                <span>安全设置</span>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-md-9 admin-main">
            <div class="admin-panel">
              <!-- Basic Settings -->
              <div v-if="activeTab === 'basic'" class="panel-section">
                <h5>基本设置</h5>
                <div class="form-group">
                  <label>网站标题</label>
                  <input v-model="config.title" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>网站描述</label>
                  <textarea v-model="config.description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>关键词</label>
                  <input v-model="config.keywords" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>作者</label>
                  <input v-model="config.author" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>网站图标</label>
                  <input v-model="config.favicon" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>背景图片</label>
                  <input v-model="config.backgroundImage" type="text" class="form-control">
                </div>
              </div>

              <!-- Navigation Settings -->
              <div v-if="activeTab === 'nav'" class="panel-section">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5>导航设置</h5>
                  <button @click="addNavItem" class="btn btn-primary">
                    <i class="fas fa-plus"></i> 添加导航
                  </button>
                </div>
                <div class="nav-items-list">
                  <div v-for="(item, index) in config.links.navItems" :key="index" class="nav-item-card">
                    <div class="form-row">
                      <div class="col-md-3">
                        <input v-model="item.name" type="text" class="form-control" placeholder="名称">
                      </div>
                      <div class="col-md-4">
                        <input v-model="item.url" type="text" class="form-control" placeholder="链接">
                      </div>
                      <div class="col-md-3">
                        <input v-model="item.id" type="text" class="form-control" placeholder="ID">
                      </div>
                      <div class="col-md-2">
                        <button @click="removeNavItem(index)" class="btn btn-danger btn-sm">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search Engines -->
              <div v-if="activeTab === 'search'" class="panel-section">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5>搜索引擎设置</h5>
                  <button @click="addSearchEngine" class="btn btn-primary">
                    <i class="fas fa-plus"></i> 添加搜索引擎
                  </button>
                </div>
                <div class="search-engines-list">
                  <div v-for="(engine, index) in config.links.searchEngines" :key="index" class="engine-card">
                    <div class="form-row">
                      <div class="col-md-2">
                        <input v-model="engine.name" type="text" class="form-control" placeholder="名称">
                      </div>
                      <div class="col-md-4">
                        <input v-model="engine.url" type="text" class="form-control" placeholder="搜索URL">
                      </div>
                      <div class="col-md-3">
                        <input v-model="engine.placeholder" type="text" class="form-control" placeholder="提示文字">
                      </div>
                      <div class="col-md-2">
                        <input v-model="engine.icon" type="text" class="form-control" placeholder="图标">
                      </div>
                      <div class="col-md-1">
                        <button @click="removeSearchEngine(index)" class="btn btn-danger btn-sm">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Categories -->
              <div v-if="activeTab === 'categories'" class="panel-section">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h5>网址分类设置</h5>
                  <button @click="addCategory" class="btn btn-primary">
                    <i class="fas fa-plus"></i> 添加分类
                  </button>
                </div>
                <div class="categories-list">
                  <div v-for="(category, categoryIndex) in config.links.categories" :key="categoryIndex" class="category-card">
                    <div class="category-header">
                      <div class="form-row">
                        <div class="col-md-4">
                          <input v-model="category.title" type="text" class="form-control" placeholder="分类名称">
                        </div>
                        <div class="col-md-2">
                          <input v-model="category.icon" type="text" class="form-control" placeholder="图标">
                        </div>
                        <div class="col-md-2">
                          <button @click="addLink(categoryIndex)" class="btn btn-success btn-sm">
                            <i class="fas fa-plus"></i> 添加链接
                          </button>
                        </div>
                        <div class="col-md-2">
                          <button @click="removeCategory(categoryIndex)" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> 删除分类
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="links-section">
                      <div v-for="(link, linkIndex) in category.links" :key="linkIndex" class="link-item">
                        <div class="form-row">
                          <div class="col-md-3">
                            <input v-model="link.name" type="text" class="form-control" placeholder="名称">
                          </div>
                          <div class="col-md-4">
                            <input v-model="link.url" type="text" class="form-control" placeholder="链接">
                          </div>
                          <div class="col-md-3">
                            <input v-model="link.icon" type="text" class="form-control" placeholder="图标">
                          </div>
                          <div class="col-md-2">
                            <button @click="fetchSiteInfo(link)" class="btn btn-info btn-sm mr-2" title="自动获取信息">
                              <i class="fas fa-magic"></i>
                            </button>
                            <button @click="removeLink(categoryIndex, linkIndex)" class="btn btn-danger btn-sm">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Settings -->
              <div v-if="activeTab === 'footer'" class="panel-section">
                <h5>页脚设置</h5>
                <div class="form-group">
                  <label>
                    <input v-model="config.copyright.show" type="checkbox"> 显示版权信息
                  </label>
                </div>
                <div class="form-group">
                  <label>版权文字</label>
                  <input v-model="config.copyright.text" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>版权链接目标</label>
                  <input v-model="config.copyright.target" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>
                    <input v-model="config.copyright.showRecord" type="checkbox"> 显示备案信息
                  </label>
                </div>
                <div class="form-group">
                  <label>备案号</label>
                  <input v-model="config.copyright.record" type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>备案链接</label>
                  <input v-model="config.copyright.recordUrl" type="text" class="form-control">
                </div>
              </div>

              <!-- Security Settings -->
              <div v-if="activeTab === 'security'" class="panel-section">
                <h5>安全设置</h5>
                <div class="form-group">
                  <label>当前密码</label>
                  <input v-model="passwordChange.current" type="password" class="form-control" placeholder="输入当前密码">
                </div>
                <div class="form-group">
                  <label>新密码</label>
                  <input v-model="passwordChange.new" type="password" class="form-control" placeholder="输入新密码">
                </div>
                <div class="form-group">
                  <label>确认新密码</label>
                  <input v-model="passwordChange.confirm" type="password" class="form-control" placeholder="再次输入新密码">
                </div>
                <button @click="changePassword" class="btn btn-warning" :disabled="changingPassword">
                  <span v-if="changingPassword" class="spinner-border spinner-border-sm mr-2"></span>
                  {{ changingPassword ? '修改中...' : '修改密码' }}
                </button>
              </div>

              <!-- Save Button -->
              <div class="save-section">
                <button @click="saveConfig" class="btn btn-success btn-lg" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm mr-2"></span>
                  {{ saving ? '保存中...' : '保存配置' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="notification.show" class="toast-notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteConfig, NavLink, SearchEngine, Category, SiteLink } from '~/types/config'

// Define middleware for authentication
definePageMeta({
  middleware: 'auth'
})

// State
const activeTab = ref('basic')
const saving = ref(false)
const changingPassword = ref(false)
const config = ref<SiteConfig>({
  title: '',
  keywords: '',
  description: '',
  author: '',
  favicon: '',
  backgroundImage: '',
  links: {
    navItems: [],
    searchEngines: [],
    categories: []
  },
  copyright: {
    show: true,
    text: '',
    target: '',
    showRecord: true,
    record: '',
    recordUrl: ''
  }
})

const passwordChange = ref({
  current: '',
  new: '',
  confirm: ''
})

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// Load config
onMounted(async () => {
  try {
    const data = await $fetch<SiteConfig>('/api/config')
    config.value = data
  } catch (error) {
    showNotification('加载配置失败', 'error')
  }
})

// Methods
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const saveConfig = async () => {
  saving.value = true
  try {
    await $fetch('/api/config', {
      method: 'POST',
      body: config.value
    })
    showNotification('配置保存成功')
  } catch (error) {
    showNotification('保存配置失败', 'error')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordChange.value.new !== passwordChange.value.confirm) {
    showNotification('两次输入的密码不一致', 'error')
    return
  }

  changingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordChange.value.current,
        newPassword: passwordChange.value.new
      }
    })
    showNotification('密码修改成功，服务器将重启')
    passwordChange.value = { current: '', new: '', confirm: '' }
  } catch (error: any) {
    showNotification(error.data?.message || '密码修改失败', 'error')
  } finally {
    changingPassword.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  navigateTo('/login')
}

// Navigation management
const addNavItem = () => {
  config.value.links.navItems.push({
    name: '',
    url: '',
    id: ''
  })
}

const removeNavItem = (index: number) => {
  config.value.links.navItems.splice(index, 1)
}

// Search engine management
const addSearchEngine = () => {
  config.value.links.searchEngines.push({
    name: '',
    url: '',
    placeholder: '',
    icon: '',
    color: ''
  })
}

const removeSearchEngine = (index: number) => {
  config.value.links.searchEngines.splice(index, 1)
}

// Category management
const addCategory = () => {
  config.value.links.categories.push({
    title: '',
    icon: '',
    links: []
  })
}

const removeCategory = (categoryIndex: number) => {
  config.value.links.categories.splice(categoryIndex, 1)
}

const addLink = (categoryIndex: number) => {
  config.value.links.categories[categoryIndex].links.push({
    name: '',
    url: '',
    icon: ''
  })
}

const removeLink = (categoryIndex: number, linkIndex: number) => {
  config.value.links.categories[categoryIndex].links.splice(linkIndex, 1)
}

// Auto fetch site info
const fetchSiteInfo = async (link: SiteLink) => {
  if (!link.url) {
    showNotification('请先输入网址', 'error')
    return
  }

  try {
    const data = await $fetch('/api/fetch-site-info', {
      params: { url: link.url }
    })

    if (data.title) link.name = data.title
    if (data.favicon) link.icon = data.favicon

    showNotification('获取网站信息成功')
  } catch (error) {
    showNotification('获取网站信息失败', 'error')
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.admin-content {
  padding: 0;
}

.admin-sidebar {
  background: white;
  min-height: calc(100vh - 70px);
  box-shadow: 2px 0 10px rgba(0,0,0,0.05);
  padding: 0;
}

.sidebar-menu {
  padding: 20px 0;
}

.menu-item {
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.menu-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.admin-main {
  padding: 30px;
}

.admin-panel {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.panel-section {
  padding: 30px;
  border-bottom: 1px solid #eee;
}

.panel-section:last-child {
  border-bottom: none;
}

.panel-section h5 {
  color: #333;
  margin-bottom: 25px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.nav-item-card,
.engine-card,
.category-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.category-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.links-section {
  margin-top: 15px;
}

.link-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  border: 1px solid #e9ecef;
}

.btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.btn-danger {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
  color: white;
}

.btn-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.save-section {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast-notification.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.toast-notification.error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.spinner-border {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .admin-sidebar {
    min-height: auto;
    margin-bottom: 20px;
  }

  .admin-main {
    padding: 15px;
  }

  .panel-section {
    padding: 20px;
  }
}
</style>