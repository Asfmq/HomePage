<template>
  <div class="admin-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <button
        class="navbar-toggler"
        :class="{ collapsed: !mobileMenuOpen }"
        type="button"
        @click="toggleMobileMenu"
      >
        <IconComponent icon="#icon-menus" size="24" />
        <span v-if="mobileMenuOpen">
          <IconComponent icon="#icon-closes" size="24" />
        </span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }" id="navbarsExample05">
        <ul class="navbar-nav mr-auto" id="nav-items">
          <li v-for="item in config.links.navItems" :key="item.id" class="nav-item">
            <a class="nav-link" :href="item.url" :id="item.id">{{ item.name }}</a>
          </li>
        </ul>
        <div class="navbar-nav-right">
          <div class="nav-item">
            <a class="nav-link" href="javascript:void(0)" @click="showSiteInfoModal = true">
              <IconComponent icon="#icon-setting" size="16" />
              网站信息
            </a>
          </div>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="javascript:void(0)" id="adminDropdown" @click="adminDropdownOpen = !adminDropdownOpen">
              <IconComponent icon="#icon-admin" size="16" />
              管理员
            </a>
            <div class="dropdown-menu" :class="{ show: adminDropdownOpen }" v-if="adminDropdownOpen">
              <a class="dropdown-item" href="#" @click.prevent="showChangePasswordModal = true">修改密码</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" @click.prevent="logout">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container" style="margin-top:10vh;">
      <div id="main">
        <div id="show_time">{{ currentTime }}</div>
        <div id="show_date">{{ currentDate }}</div>
      </div>

      <!-- Search Box Component -->
      <SearchBox
        :search-engines="config.links.searchEngines"
        :initial-engine="config.links.searchEngines?.[0]"
        @search="handleSearch"
      />

      <!-- Categories -->
      <div id="categories">
        <template v-for="(category, categoryIndex) in config.links.categories" :key="category.title">
          <div class="category-container">
            <div class="category-title">
              <IconComponent :icon="category.icon" type="title" size="20" class="title-icon" />
              <span>{{ category.title }}</span>
              <span class="edit-tools">
                <a href="javascript:void(0)" @click="editCategory(categoryIndex)" class="btn btn-sm btn-link">
                  <IconComponent icon="#icon-edit" size="16" />
                </a>
              </span>
            </div>
            <ul class="category-links">
              <li v-for="(link, linkIndex) in category.links" :key="linkIndex" class="lylme-3">
                <a href="javascript:void(0)" @click="openLinkModal(categoryIndex, linkIndex)">
                  <IconComponent :icon="link.icon" type="link" size="45" class="link-icon" loading="lazy" />
                  <span>{{ link.name }}</span>
                </a>
              </li>
              <li class="lylme-3 add-link">
                <a href="javascript:void(0)" @click="addNewLink(categoryIndex)">
                  <IconComponent icon="#icon-addlink" size="45" class="link-icon" />
                  <span>添加链接</span>
                </a>
              </li>
            </ul>
          </div>
        </template>

        <!-- Add Category Button -->
        <div class="category-container">
          <div class="category-title add-category" @click="showAddCategoryModal = true">
            <IconComponent icon="#icon-add" type="title" size="20" class="title-icon" />
            <span>添加分类</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-5 mb-3 footer text-muted text-center">
        <p v-html="copyrightHtml" id="copyright"></p>
      </footer>
    </main>

  
    <!-- Modals -->
    <!-- Site Info Modal -->
    <div v-if="showSiteInfoModal" class="modal-backdrop" @click.self="showSiteInfoModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">网站信息设置</h5>
            <button type="button" class="close" @click="showSiteInfoModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>网站标题</label>
              <input v-model="tempConfig.title" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>网站描述</label>
              <textarea v-model="tempConfig.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>关键词</label>
              <input v-model="tempConfig.keywords" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>作者</label>
              <input v-model="tempConfig.author" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>网站图标</label>
              <input v-model="tempConfig.favicon" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>背景图片</label>
              <input v-model="tempConfig.backgroundImage" type="text" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showSiteInfoModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="saveSiteInfo">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="modal-backdrop" @click.self="showChangePasswordModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">修改密码</h5>
            <button type="button" class="close" @click="showChangePasswordModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>当前密码</label>
              <input v-model="passwordForm.current" type="password" class="form-control" placeholder="输入当前密码">
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input v-model="passwordForm.new" type="password" class="form-control" placeholder="输入新密码">
            </div>
            <div class="form-group">
              <label>确认新密码</label>
              <input v-model="passwordForm.confirm" type="password" class="form-control" placeholder="再次输入新密码">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showChangePasswordModal = false">取消</button>
            <button type="button" class="btn btn-warning" @click="changePassword" :disabled="changingPassword">
              {{ changingPassword ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Engine Modal -->
    <div v-if="showAddEngineModal" class="modal-backdrop" @click.self="showAddEngineModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加搜索引擎</h5>
            <button type="button" class="close" @click="showAddEngineModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>搜索引擎名称</label>
              <input v-model="engineForm.name" type="text" class="form-control" placeholder="如：Google">
            </div>
            <div class="form-group">
              <label>搜索URL</label>
              <input v-model="engineForm.url" type="text" class="form-control" placeholder="如：https://www.google.com/search?q=">
            </div>
            <div class="form-group">
              <label>占位符文字</label>
              <input v-model="engineForm.placeholder" type="text" class="form-control" placeholder="如：Google搜索">
            </div>
            <div class="form-group">
              <label>图标</label>
              <input v-model="engineForm.icon" type="text" class="form-control" placeholder="图标URL或SVG代码">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddEngineModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="addSearchEngine">添加</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddCategoryModal" class="modal-backdrop" @click.self="showAddCategoryModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加新分类</h5>
            <button type="button" class="close" @click="showAddCategoryModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>分类名称</label>
              <input v-model="categoryForm.title" type="text" class="form-control" placeholder="输入分类名称">
            </div>
            <div class="form-group">
              <label>分类图标</label>
              <input v-model="categoryForm.icon" type="text" class="form-control" placeholder="图标SVG代码">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddCategoryModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="addCategory">添加</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Link Modal -->
    <div v-if="showAddLinkModal" class="modal-backdrop" @click.self="showAddLinkModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">添加新链接</h5>
            <button type="button" class="close" @click="showAddLinkModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>网站名称</label>
              <input v-model="linkForm.name" type="text" class="form-control" placeholder="输入网站名称">
            </div>
            <div class="form-group">
              <label>
                网站URL
              </label>
              <input v-model="linkForm.url" type="url" class="form-control" placeholder="输入网站URL">
            </div>
            <div class="form-group">
              <label>图标URL</label>
              <input v-model="linkForm.icon" type="text" class="form-control" placeholder="输入图标URL">
              <button type="button" class="btn btn-sm btn-info mt-2" @click="autoFetchSiteInfo">自动获取网站信息</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddLinkModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="addLink">添加</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Link Modal -->
    <div v-if="showEditLinkModal" class="modal-backdrop" @click.self="showEditLinkModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">编辑链接</h5>
            <button type="button" class="close" @click="showEditLinkModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>网站名称</label>
              <input v-model="linkForm.name" type="text" class="form-control" placeholder="输入网站名称">
            </div>
            <div class="form-group">
              <label>
                网站URL
                <span class="url-link-text" @click="visitLink" title="访问链接">
                  <svg width="12" height="12" viewBox="0 0 1024 1024" fill="#007bff" style="display: inline-block; vertical-align: middle;">
                    <path d="M853.333 170.667 570.667 453.333l60.333 60.333L913.333 231.333 913.333 384 960 384 960 128 704 128 704 174.667 853.333 170.667zM896 384 896 896c0 35.346-28.654 64-64 64L192 960c-35.346 0-64-28.654-64-64L128 128c0-35.346 28.654-64 64-64l384 0L576 192 192 192 192 896l640 0L832 384 896 384z"/>
                  </svg>
                </span>
              </label>
              <input v-model="linkForm.url" type="url" class="form-control" placeholder="输入网站URL">
            </div>
            <div class="form-group">
              <label>图标URL</label>
              <input v-model="linkForm.icon" type="text" class="form-control" placeholder="输入图标URL">
              <button type="button" class="btn btn-sm btn-info mt-2" @click="autoFetchSiteInfo">自动获取网站信息</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="deleteCurrentLink">删除</button>
            <button type="button" class="btn btn-primary" @click="updateLink">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Modal -->
    <div v-if="showCopyrightModal" class="modal-backdrop" @click.self="showCopyrightModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">版权设置</h5>
            <button type="button" class="close" @click="showCopyrightModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>
                <input v-model="tempConfig.copyright.show" type="checkbox"> 显示版权信息
              </label>
            </div>
            <div class="form-group">
              <label>版权文字</label>
              <input v-model="tempConfig.copyright.text" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>版权链接目标</label>
              <input v-model="tempConfig.copyright.target" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>
                <input v-model="tempConfig.copyright.showRecord" type="checkbox"> 显示备案信息
              </label>
            </div>
            <div class="form-group">
              <label>备案号</label>
              <input v-model="tempConfig.copyright.record" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>备案链接</label>
              <input v-model="tempConfig.copyright.recordUrl" type="text" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCopyrightModal = false">取消</button>
            <button type="button" class="btn btn-primary" @click="saveCopyright">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="notification.show" class="toast-notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <!-- Test Modal for debugging -->
    <div v-if="false" class="modal-backdrop" @click.self="">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">测试弹窗</h5>
            <button type="button" class="close" @click="">×</button>
          </div>
          <div class="modal-body">
            <p>这是一个测试弹窗，用于验证样式是否生效。</p>
            <div class="form-group">
              <label>测试输入框</label>
              <input type="text" class="form-control" placeholder="测试输入">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteConfig, SearchEngine } from '~/types/config'
import { defaultConfig } from '~/utils/config'
import IconComponent from '~/components/IconComponent.vue'
import SearchBox from '~/components/SearchBox.vue'

// Middleware for authentication
definePageMeta({
  middleware: 'auth'
})

// State
const config = ref<SiteConfig>(defaultConfig)
const mobileMenuOpen = ref(false)
const adminDropdownOpen = ref(false)
const currentTime = ref('')
const currentDate = ref('')

// Modal states
const showSiteInfoModal = ref(false)
const showChangePasswordModal = ref(false)
const showAddEngineModal = ref(false)
const showAddCategoryModal = ref(false)
const showAddLinkModal = ref(false)
const showEditLinkModal = ref(false)

// Form states
const tempConfig = ref(JSON.parse(JSON.stringify(defaultConfig)))
const passwordForm = ref({ current: '', new: '', confirm: '' })
const engineForm = ref({ name: '', url: '', placeholder: '', icon: '' })
const categoryForm = ref({ title: '', icon: '' })
const linkForm = ref({ name: '', url: '', icon: '' })

// Loading states
const loading = ref(false)
const changingPassword = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })

// Current editing link tracking
const currentEditingLink = ref<{ categoryIndex: number; linkIndex: number } | null>(null)


// Computed
const copyrightHtml = computed(() => {
  if (!config.value.copyright.show) return ''

  let html = `<span style="color: #ffffff;">Copyright ©${config.value.copyright.text} <a href='/' target='_blank' style="color: #87CEEB;">${config.value.copyright.target}</a>. All Rights Reserved.</span>`

  if (config.value.copyright.showRecord) {
    html += `<br><span style="color: #87CEEB;"><a href="${config.value.copyright.recordUrl}" target="_blank" style="color: #87CEEB;">${config.value.copyright.record}</a></span>`
  }

  return html
})

// Load config on mount
onMounted(async () => {
  // Load configuration first
  await loadConfig()

  // Set background
  if (config.value.backgroundImage) {
    document.body.style.backgroundImage = `url(${config.value.backgroundImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundAttachment = 'fixed'
  }

  updateTime()
  setInterval(updateTime, 1000)
})

// Methods
const loadConfig = async () => {
  try {
    loading.value = true
    const data = await $fetch<SiteConfig>('/api/config')
    config.value = data
    tempConfig.value = JSON.parse(JSON.stringify(data))
  } catch (error) {
    showNotification('加载配置失败', 'error')
  } finally {
    loading.value = false
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleSearch = (query: string, engine: SearchEngine) => {
  // This event handler is called by the SearchBox component
  // Could be extended to track search analytics or show notifications
  console.log('Search triggered:', { query, engine: engine.name, url: engine.url })

  // Optional: Add search history or analytics here
  try {
    // Store recent searches (if localStorage is available)
    if (typeof localStorage !== 'undefined') {
      const recentSearches = JSON.parse(localStorage.getItem('recent_searches') || '[]')
      const newSearches = [{ query, engine: engine.name, timestamp: Date.now() }, ...recentSearches].slice(0, 10)
      localStorage.setItem('recent_searches', JSON.stringify(newSearches))
    }
  } catch (error) {
    // Silently fail analytics/storage
  }
}

const logout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('admin_token')
  }
  // Clear cookie as well
  const cookie = useCookie('admin_token')
  cookie.value = null
  navigateTo('/login')
}

// Site info methods
const saveSiteInfo = async () => {
  try {
    loading.value = true

    // Get authentication token from localStorage or cookie
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') :
                   useCookie('admin_token').value

    if (!token) {
      showNotification('未找到认证令牌，请重新登录', 'error')
      await logout()
      return
    }

    await $fetch('/api/config', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: tempConfig.value
    })
    config.value = JSON.parse(JSON.stringify(tempConfig.value))
    showSiteInfoModal.value = false
    showNotification('网站信息保存成功')
  } catch (error: any) {
    showNotification(error.data?.statusMessage || '保存失败', 'error')
  } finally {
    loading.value = false
  }
}

// Password change methods
const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    showNotification('两次输入的密码不一致', 'error')
    return
  }

  try {
    changingPassword.value = true
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new
      }
    })
    showChangePasswordModal.value = false
    showNotification('密码修改成功')
    passwordForm.value = { current: '', new: '', confirm: '' }
    // 3秒后退出登录
    setTimeout(() => {
      logout()
    }, 3000)
  } catch (error: any) {
    showNotification(error.data?.statusMessage || '密码修改失败', 'error')
  } finally {
    changingPassword.value = false
  }
}

// Search engine methods
const addSearchEngine = async () => {
  if (!engineForm.value.name || !engineForm.value.url) {
    showNotification('请填写搜索引擎名称和URL', 'error')
    return
  }

  try {
    const newEngine = {
      name: engineForm.value.name,
      url: engineForm.value.url,
      placeholder: engineForm.value.placeholder || '',
      icon: engineForm.value.icon || '',
      color: ''
    }

    config.value.links.searchEngines.push(newEngine)
    await saveConfig()

    showAddEngineModal.value = false
    engineForm.value = { name: '', url: '', placeholder: '', icon: '' }
    showNotification('搜索引擎添加成功')
  } catch (error) {
    showNotification('添加失败', 'error')
  }
}

// Category methods
const addCategory = async () => {
  if (!categoryForm.value.title) {
    showNotification('请填写分类名称', 'error')
    return
  }

  try {
    const newCategory = {
      title: categoryForm.value.title,
      icon: categoryForm.value.icon || '',
      links: []
    }

    config.value.links.categories.push(newCategory)
    await saveConfig()

    showAddCategoryModal.value = false
    categoryForm.value = { title: '', icon: '' }
    showNotification('分类添加成功')
  } catch (error) {
    showNotification('添加失败', 'error')
  }
}

const editCategory = (index: number) => {
  const category = config.value.links.categories[index]
  categoryForm.value = {
    title: category.title,
    icon: category.icon
  }
  // TODO: Implement edit category modal
}

// Link methods
const addNewLink = (categoryIndex: number) => {
  linkForm.value = { name: '', url: '', icon: '' }
  showAddLinkModal.value = true
  // Store category index for later use
  ;(window as any).currentCategoryIndex = categoryIndex
}

const addLink = async () => {
  if (!linkForm.value.name || !linkForm.value.url) {
    showNotification('请填写网站名称和URL', 'error')
    return
  }

  try {
    const categoryIndex = (window as any).currentCategoryIndex
    const newLink = {
      name: linkForm.value.name,
      url: linkForm.value.url,
      icon: linkForm.value.icon || ''
    }

    config.value.links.categories[categoryIndex].links.push(newLink)
    await saveConfig()

    showAddLinkModal.value = false
    linkForm.value = { name: '', url: '', icon: '' }
    showNotification('链接添加成功')
  } catch (error) {
    showNotification('添加失败', 'error')
  }
}

const openLinkModal = (categoryIndex: number, linkIndex: number) => {
  const link = config.value.links.categories[categoryIndex].links[linkIndex]
  linkForm.value = { ...link }
  currentEditingLink.value = { categoryIndex, linkIndex }
  showEditLinkModal.value = true
}

const updateLink = async () => {
  if (!linkForm.value.name || !linkForm.value.url) {
    showNotification('请填写网站名称和URL', 'error')
    return
  }

  if (!currentEditingLink.value) return

  try {
    const { categoryIndex, linkIndex } = currentEditingLink.value
    config.value.links.categories[categoryIndex].links[linkIndex] = {
      name: linkForm.value.name,
      url: linkForm.value.url,
      icon: linkForm.value.icon || ''
    }
    await saveConfig()

    showEditLinkModal.value = false
    currentEditingLink.value = null
    linkForm.value = { name: '', url: '', icon: '' }
    showNotification('链接更新成功')
  } catch (error) {
    showNotification('更新失败', 'error')
  }
}

const deleteCurrentLink = async () => {
  if (!currentEditingLink.value) return

  if (confirm('确定要删除这个链接吗？')) {
    try {
      const { categoryIndex, linkIndex } = currentEditingLink.value
      config.value.links.categories[categoryIndex].links.splice(linkIndex, 1)
      await saveConfig()

      showEditLinkModal.value = false
      currentEditingLink.value = null
      linkForm.value = { name: '', url: '', icon: '' }
      showNotification('链接删除成功')
    } catch (error) {
      showNotification('删除失败', 'error')
    }
  }
}

const visitLink = () => {
  if (linkForm.value.url) {
    window.open(linkForm.value.url, '_blank')
  }
}

const autoFetchSiteInfo = async () => {
  if (!linkForm.value.url) {
    showNotification('请先输入网站URL', 'error')
    return
  }

  try {
    const data = await $fetch('/api/fetch-site-info', {
      params: { url: linkForm.value.url }
    })

    if (data.title) linkForm.value.name = data.title
    if (data.favicon) linkForm.value.icon = data.favicon

    showNotification('获取网站信息成功')
  } catch (error) {
    showNotification('获取网站信息失败', 'error')
  }
}

// Copyright methods
const saveCopyright = async () => {
  try {
    loading.value = true
    await saveConfig()
    showCopyrightModal.value = false
    showNotification('版权设置保存成功')
  } catch (error) {
    showNotification('保存失败', 'error')
  } finally {
    loading.value = false
  }
}

const saveConfig = async () => {
  // Get authentication token from localStorage or cookie
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') :
                 useCookie('admin_token').value

  if (!token) {
    showNotification('未找到认证令牌，请重新登录', 'error')
    await logout()
    return
  }

  await $fetch('/api/config', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: config.value
  })
}

// Utility methods
const isImageUrl = (icon: string): boolean => {
  return icon && (icon.startsWith('http') || icon.startsWith('/') || icon.endsWith('.ico') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.svg'))
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Handle dropdown closing on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.dropdown')) {
      adminDropdownOpen.value = false
    }
  })
})

// Close dropdowns when clicking outside
onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>

<style scoped>
/* Import the existing styles */
@import url('~/assets/css/style.css');
@import url('~/assets/css/index.css');

/* Admin specific styles */
.edit-tools {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-title:hover .edit-tools {
  opacity: 1;
}

.edit-tools .btn {
  padding: 2px 6px;
  font-size: 12px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.7) !important;
  text-decoration: none;
}

.edit-tools .btn:hover {
  color: rgba(255, 255, 255, 1) !important;
}

/* Admin navigation styles */
.navbar-nav .nav-link svg,
.navbar-nav-right .nav-link svg {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: text-bottom;
}

/* Ensure navbar collapse uses flex layout */
.navbar-collapse {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Right-aligned navigation container */
.navbar-nav-right {
  display: flex !important;
  align-items: center;
  margin-left: auto;
  margin-right: 2rem;  /* 向左移动一点，减小与左侧的距离 */
  flex-shrink: 0;
  /* Override global styles from index.css */
  float: none !important;
  flex-direction: row !important;
  position: relative;
  z-index: 1000;
}

/* Override global navbar-nav styles for our custom container */
.navbar-nav-right .nav-item {
  display: flex !important;
  float: none !important;
  margin-right: 1rem !important;  /* 与左侧保持相同的margin */
  margin-left: 0 !important;
  align-items: center;
}

.navbar-nav-right .nav-item:last-child {
  margin-right: 0 !important;
}

.navbar-nav-right .nav-link {
  color: #fff !important;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0px 1px 0px #000;
  padding: 0;  /* 完全移除padding，让margin控制间距 */
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.navbar-nav-right .nav-link:hover {
  opacity: 0.8;
}

/* Dropdown positioning for right nav */
.navbar-nav-right .dropdown {
  position: relative;
}

.navbar-nav-right .dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  min-width: 120px;
  padding: 8px 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: dropdownFadeIn 0.2s ease-out;
  transform-origin: top right;
}

.navbar-nav-right .dropdown-menu .dropdown-item {
  padding: 8px 20px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.2s ease;
  text-align: center;
  font-weight: 500;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}

.navbar-nav-right .dropdown-menu .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
}

.navbar-nav-right .dropdown-menu .dropdown-divider {
  border-top: 0.1px solid rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Mobile responsive */
@media screen and (max-width: 992px) {
  .navbar-collapse {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .navbar-nav-right {
    margin-left: 0;
    margin-top: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    order: 2;
  }

  .navbar-nav-right .nav-link {
    padding: 0.5rem 1rem;
    width: 100%;
  }

  .navbar-nav-right .dropdown-menu {
    position: static;
    margin-top: 0;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0;
  }
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 1000px;  /* 从500px增大到600px */
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 使用更高优先级的选择器 */
div.modal-backdrop > .modal-dialog,
.modal-backdrop .modal-dialog {
  max-width: 1000px !important;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #333;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-sizing: border-box;  /* 确保border和padding包含在width内 */
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;  /* 确保padding包含在尺寸内 */
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.close {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close:hover {
  opacity: 1;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  box-sizing: border-box;  /* 确保padding包含在尺寸内 */
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  box-sizing: border-box;  /* 确保padding包含在尺寸内 */
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-link {
  font-weight: 400;
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
  border: none;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.url-link-text {
  margin-left: 10px;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: opacity 0.2s ease;
}

.url-link-text:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.url-link-text svg {
  fill: #007bff !important;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;  /* 确保padding和border包含在width内 */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: block;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  right: 0;
  left: auto;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #16181b;
  background-color: #f8f9fa;
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #e9ecef;
}

/* Toast notification */
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

/* Link actions */
.link-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lylme-3:hover .link-actions {
  opacity: 1;
}

.link-actions .btn {
  padding: 2px 6px;
  font-size: 12px;
  line-height: 1;
}

</style>