<template>
  <div class="admin-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <button class="navbar-toggler collapsed" type="button" @click="toggleMobileMenu">
        <svg class="icon" width="200" height="200">
          <use href="#icon-menus"></use>
        </svg>
        <span>
          <svg class="bi bi-x" fill="currentColor" id="x">
            <use href="#icon-closes"></use>
          </svg>
        </span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }" id="navbarsExample05">
        <ul class="navbar-nav mr-auto" id="nav-items">
          <li v-for="item in config.links.navItems" :key="item.id" class="nav-item">
            <a class="nav-link" :href="item.url">{{ item.name }}</a>
          </li>
        </ul>
        <button class="btn nav-link text-white" style="border: none; background: none;" @click="showSiteInfoModal = true">
          <svg class="icon" aria-hidden="true">
            <use href="#icon-setting"></use>
          </svg>
          网站信息
        </button>
        <div class="nav-item dropdown">
          <button class="btn nav-link text-white" style="border: none; background: none;" type="button" @click="adminDropdownOpen = !adminDropdownOpen">
            <svg class="icon" aria-hidden="true">
              <use href="#icon-admin"></use>
            </svg>
            管理员
          </button>
          <div class="dropdown-menu" :class="{ show: adminDropdownOpen }" v-if="adminDropdownOpen">
            <a class="dropdown-item" href="#" @click.prevent="showChangePasswordModal = true">修改密码</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" @click.prevent="logout">退出登录</a>
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

      <!-- Search Box -->
      <div id="search" class="s-search s-curren">
        <div id="search-list" class="hide-type-list">
          <div class="search-group group-a">
            <div class="search-box">
              <div id="search-lylme">
                <form :action="currentSearchEngine.url" method="get" target="_blank" id="super-search-fm">
                  <div id="checke-so" @click="toggleSearchList">
                    <svg class="lylme" aria-hidden="true" v-html="currentSearchEngine.icon"></svg>
                    <svg class="sw" id="lylme-up" :style="{ display: searchListOpen ? 'inline' : 'none' }" aria-hidden="true">
                      <use href="#icon-up"></use>
                    </svg>
                    <svg class="sw" id="lylme-down" :style="{ display: searchListOpen ? 'none' : 'inline' }" aria-hidden="true">
                      <use href="#icon-down"></use>
                    </svg>
                  </div>
                  <input type="text" id="search-text" :placeholder="currentSearchEngine.placeholder" style="outline:0" autocomplete="off">
                  <button class="submit" id="search-submit" type="submit">
                    <svg style="width: 22px; height: 22px; margin: 0 20px; color: #fff;" class="icon" aria-hidden="true">
                      <use href="#icon-sousuo"></use>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Engine Selection -->
        <ul class="search-type" :class="{ 'show-type-list': searchListOpen }" id="chso">
          <li v-for="(engine, index) in config.links.searchEngines" :key="index">
            <input hidden="" type="radio" name="type" :id="engine.name" :value="engine.url"
                   :data-placeholder="engine.placeholder" v-model="currentSearchEngineIndex">
            <label :for="engine.name" @click="selectSearchEngine(index)" style="font-weight:600">
              <span v-html="engine.icon" v-if="engine.icon"></span>
              <span style="color:#0c498c">{{ engine.name }}</span>
            </label>
          </li>
          <li class="add-engine">
            <input hidden="" type="radio" name="type" id="add-engine">
            <label for="add-engine" @click="showAddEngineModal = true" style="font-weight:600">
              <svg class="icon" aria-hidden="true">
                <use href="#icon-add"></use>
              </svg>
              <span style="color:#0c498c">添加搜索引擎</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- Categories -->
      <ul class="mylist row" id="categories">
        <template v-for="(category, categoryIndex) in config.links.categories" :key="category.title">
          <li class="title">
            <svg class="icon" aria-hidden="true" v-html="category.icon"></svg>
            <span>{{ category.title }}</span>
            <span class="edit-tools">
              <a href="javascript:void(0)" @click="editCategory(categoryIndex)" class="btn btn-sm btn-link">
                <svg class="icon" aria-hidden="true">
                  <use href="#icon-edit"></use>
                </svg>
              </a>
            </span>
          </li>
          <li v-for="(link, linkIndex) in category.links" :key="linkIndex" class="lylme-3">
            <a :href="link.url" target="_blank">
              <div class="lylme-cl">
                <div class="img-box">
                  <img v-if="isImageUrl(link.icon)" :src="link.icon" :alt="link.name" class="img-icon">
                  <div v-else-if="link.icon" v-html="link.icon" class="svg-icon"></div>
                </div>
              </div>
              <div class="sSiteInfo">
                <span class="site-name">{{ link.name }}</span>
              </div>
            </a>
            <div class="link-actions">
              <a href="javascript:void(0)" @click="editLink(categoryIndex, linkIndex)" class="btn btn-sm btn-link">
                <svg class="icon" aria-hidden="true">
                  <use href="#icon-edit"></use>
                </svg>
              </a>
              <a href="javascript:void(0)" @click="deleteLink(categoryIndex, linkIndex)" class="btn btn-sm btn-link text-danger">
                <svg class="icon" aria-hidden="true">
                  <use href="#icon-delete"></use>
                </svg>
              </a>
            </div>
          </li>
          <li class="lylme-3 add-link">
            <a href="javascript:void(0)" @click="addNewLink(categoryIndex)">
              <svg class="icon" aria-hidden="true">
                <use href="#icon-addlink"></use>
              </svg>
              <span>添加链接</span>
            </a>
          </li>
        </template>

        <!-- Add Category Button -->
        <li class="title" @click="showAddCategoryModal = true">
          <svg class="icon" aria-hidden="true">
            <use href="#icon-add"></use>
          </svg>
          <span>添加分类</span>
        </li>
      </ul>

      <!-- Copyright -->
      <div id="copyright">
        <div class="text-center">
          <span class="copyright-wrapper d-inline-block" @click="showCopyrightModal = true">
            {{ config.copyright.show ?
              `Copyright ©${config.copyright.text} <span class="copyright-link">${config.copyright.target}</span>. All Rights Reserved.` +
              (config.copyright.showRecord ? `<br><span class="record-link">${config.copyright.record}</span>` : '')
              : '<span class="text-muted">点击开启版权信息显示</span>'
            }}
          </span>
        </div>
      </div>
    </main>

    <!-- SVG Icons (hidden) -->
    <div style="display: none;">
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="icon-menus" viewBox="0 0 1024 1024">
          <path d="M64 320h896v128H64z"></path>
          <path d="M64 576h896v128H64z"></path>
          <path d="M64 832h896v128H64z"></path>
        </symbol>
        <symbol id="icon-closes" viewBox="0 0 1024 1024">
          <path d="M816 832l-416-416-416 416L64 712l416-416L64 288l160-160 416 416 416-416 160 160L632 512l416 416z"></path>
        </symbol>
        <!-- Add more symbols as needed -->
      </svg>
    </div>

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
              <label>网站URL</label>
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
  </div>
</template>

<script setup lang="ts">
import type { SiteConfig } from '~/types/config'
import { defaultConfig } from '~/utils/config'

// Middleware for authentication
definePageMeta({
  middleware: 'auth'
})

// State
const config = ref<SiteConfig>(defaultConfig)
const mobileMenuOpen = ref(false)
const adminDropdownOpen = ref(false)
const searchListOpen = ref(false)
const currentSearchEngineIndex = ref(0)
const currentTime = ref('')
const currentDate = ref('')

// Modal states
const showSiteInfoModal = ref(false)
const showChangePasswordModal = ref(false)
const showAddEngineModal = ref(false)
const showAddCategoryModal = ref(false)
const showAddLinkModal = ref(false)
const showCopyrightModal = ref(false)

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

// Computed properties
const currentSearchEngine = computed(() => {
  return config.value.links.searchEngines[currentSearchEngineIndex.value] || config.value.links.searchEngines[0]
})

// Load config on mount
onMounted(async () => {
  await loadConfig()
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

const toggleSearchList = () => {
  searchListOpen.value = !searchListOpen.value
}

const selectSearchEngine = (index: number) => {
  currentSearchEngineIndex.value = index
  searchListOpen.value = false
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
    await $fetch('/api/config', {
      method: 'POST',
      body: tempConfig.value
    })
    config.value = JSON.parse(JSON.stringify(tempConfig.value))
    showSiteInfoModal.value = false
    showNotification('网站信息保存成功')
  } catch (error) {
    showNotification('保存失败', 'error')
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

const editLink = (categoryIndex: number, linkIndex: number) => {
  const link = config.value.links.categories[categoryIndex].links[linkIndex]
  linkForm.value = { ...link }
  showAddLinkModal.value = true
  ;(window as any).currentCategoryIndex = categoryIndex
  ;(window as any).currentLinkIndex = linkIndex
}

const deleteLink = async (categoryIndex: number, linkIndex: number) => {
  if (confirm('确定要删除这个链接吗？')) {
    try {
      config.value.links.categories[categoryIndex].links.splice(linkIndex, 1)
      await saveConfig()
      showNotification('链接删除成功')
    } catch (error) {
      showNotification('删除失败', 'error')
    }
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
  await $fetch('/api/config', {
    method: 'POST',
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
  max-width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
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
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

/* Search type list */
.search-type {
  display: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  list-style: none;
  padding-left: 0;
}

.search-type.show-type-list {
  display: block;
}

.search-type li {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
}

.search-type li:hover {
  background: rgba(0, 0, 0, 0.1);
}

.search-type input[type="radio"] {
  margin-right: 8px;
}
</style>