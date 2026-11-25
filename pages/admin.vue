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
      <div id="navbarsExample05" class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }">
        <ul id="nav-items" class="navbar-nav mr-auto">
          <li v-for="item in config.links.navItems" :key="item.id" class="nav-item">
            <a :id="item.id" class="nav-link" :href="item.url">{{ item.name }}</a>
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
            <a
              id="adminDropdown"
              class="nav-link dropdown-toggle"
              href="javascript:void(0)"
              @click="adminDropdownOpen = !adminDropdownOpen"
            >
              <IconComponent icon="#icon-admin" size="16" />
              管理员
            </a>
            <div
              v-if="adminDropdownOpen"
              class="dropdown-menu"
              :class="{ show: adminDropdownOpen }"
            >
              <a class="dropdown-item" href="#" @click.prevent="showChangePasswordModal = true"
                >修改密码</a
              >
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" @click.prevent="logout">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container" style="margin-top: 10vh">
      <div v-if="!configLoaded" class="config-warning" role="alert">
        配置加载失败，已禁用保存以避免覆盖线上数据。请检查网络或七牛配置后刷新页面重试。
      </div>
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
        <template
          v-for="(category, categoryIndex) in config.links.categories"
          :key="category.title"
        >
          <div
            class="category-container"
            draggable="true"
            :class="{ dragging: isCategoryDragging(categoryIndex) }"
            @dragstart="onCategoryDragStart($event, categoryIndex)"
            @dragover.prevent="onCategoryDragOver($event, categoryIndex)"
            @dragenter.prevent="onCategoryDragEnter($event, categoryIndex)"
            @drop="onCategoryDrop($event, categoryIndex)"
          >
            <div class="category-title">
              <IconComponent :icon="category.icon" type="title" size="20" class="title-icon" />
              <span
                style="cursor: pointer"
                title="点击编辑分类"
                @click="editCategory(categoryIndex)"
                >{{ category.title }}</span
              >
              <span class="edit-tools">
                <a
                  href="javascript:void(0)"
                  class="btn btn-sm btn-link"
                  @click="editCategory(categoryIndex)"
                >
                  <IconComponent icon="#icon-edit" size="16" />
                </a>
              </span>
            </div>
            <ul class="category-links" @dragover.prevent="onDragOverContainer($event)">
              <li
                v-for="(link, linkIndex) in category.links"
                :key="link.url"
                class="lylme-3"
                draggable="true"
                :class="{ dragging: isLinkDragging(categoryIndex, linkIndex) }"
                @dragstart.stop="onLinkDragStart($event, categoryIndex, linkIndex)"
                @dragover.prevent="onLinkDragOver($event, categoryIndex)"
                @dragenter.prevent="onLinkDragEnter($event, categoryIndex, linkIndex)"
                @drop.stop="onLinkDrop($event, categoryIndex, linkIndex)"
              >
                <a href="javascript:void(0)" @click="openLinkModal(categoryIndex, linkIndex)">
                  <IconComponent
                    :icon="link.icon"
                    type="link"
                    size="45"
                    class="link-icon"
                    loading="lazy"
                  />
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
        <p
          v-if="config.copyright.show"
          id="copyright"
          style="cursor: pointer"
          title="点击编辑版权信息"
          @click="showCopyrightModal = true"
        >
          <span class="copyright-text">
            Copyright ©{{ config.copyright.text }}
            <a href="/" target="_blank" class="copyright-link">{{ config.copyright.target }}</a>.
            All Rights Reserved.
          </span>
          <template v-if="config.copyright.showRecord">
            <br />
            <span class="copyright-record">
              <a :href="config.copyright.recordUrl" target="_blank" class="copyright-link">{{
                config.copyright.record
              }}</a>
            </span>
          </template>
        </p>
      </footer>
    </main>

    <!-- Modals -->
    <SiteInfoModal
      v-model="showSiteInfoModal"
      :config="config"
      :saving="saving"
      @save="handleSaveSiteInfo"
    />

    <ChangePasswordModal
      v-model="showChangePasswordModal"
      :saving="saving"
      @change-password="handleChangePassword"
    />

    <AddEngineModal v-model="showAddEngineModal" @add="handleAddEngine" />

    <AddCategoryModal
      v-model="showAddCategoryModal"
      :initial-data="
        editingCategoryIndex !== null ? config.links.categories[editingCategoryIndex] : null
      "
      @submit="handleCategorySubmit"
    />

    <LinkModal
      v-model="showLinkModal"
      :initial-data="currentLinkData"
      :is-edit="linkModalMode === 'edit'"
      @save="handleSaveLink"
      @delete="handleDeleteLink"
      @fetch-info="handleFetchLinkInfo"
    />

    <CopyrightModal
      v-model="showCopyrightModal"
      :copyright="config.copyright"
      @save="handleSaveCopyright"
    />

    <!-- Toast Notification -->
    <ToastNotification
      v-model:show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
  </div>
</template>

<script setup lang="ts">
import type { SiteConfig, SearchEngine } from '~/types/config'
import { defaultConfig } from '~/utils/config'
import IconComponent from '~/components/IconComponent.vue'
import SearchBox from '~/components/SearchBox.vue'
import SiteInfoModal from '~/components/admin/SiteInfoModal.vue'
import ChangePasswordModal from '~/components/admin/ChangePasswordModal.vue'
import AddEngineModal from '~/components/admin/AddEngineModal.vue'
import AddCategoryModal from '~/components/admin/CategoryModal.vue'
import LinkModal from '~/components/admin/LinkModal.vue'
import CopyrightModal from '~/components/admin/CopyrightModal.vue'
import ToastNotification from '~/components/ToastNotification.vue'

// Middleware for authentication
definePageMeta({
  middleware: 'auth'
})

// 首屏配置：SSR 阶段取到并直出背景，避免进入后台时背景突变
const { data: initialConfig, error: initialConfigError } = await useAsyncData(
  'site-config',
  () => $fetch<SiteConfig>('/api/config'),
  { default: () => defaultConfig }
)

// State
const config = ref<SiteConfig>(initialConfig.value ?? defaultConfig)
// 配置是否已成功从服务端加载：未加载成功时禁止保存，否则会用内置默认值覆盖线上配置
const configLoaded = ref(!initialConfigError.value)

// 背景随配置直出，避免挂载后再设置造成闪变
useHead(() => ({
  bodyAttrs: {
    style: config.value.backgroundImage
      ? `background-image:url(${config.value.backgroundImage});background-size:cover;background-position:center;background-repeat:no-repeat;background-attachment:fixed;`
      : ''
  }
}))
// 保存中的全局状态，用于驱动弹窗按钮的 loading 表现
const saving = ref(false)
let timerId: number | null = null
const mobileMenuOpen = ref(false)
const adminDropdownOpen = ref(false)
const currentTime = ref('')
const currentDate = ref('')

// Modal states
const showSiteInfoModal = ref(false)
const showChangePasswordModal = ref(false)
const showAddEngineModal = ref(false)
const showAddCategoryModal = ref(false)
const showLinkModal = ref(false)
const showCopyrightModal = ref(false)

// Category Edit State
const editingCategoryIndex = ref<number | null>(null)

// Link Modal State
const linkModalMode = ref<'add' | 'edit'>('add')
const currentLinkData = ref({ name: '', url: '', icon: '' })
const activeCategoryIndex = ref(-1)
const activeLinkIndex = ref(-1)

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info' | 'warning'
})

// Lifecycle
onMounted(async () => {
  // 首屏数据已由 useAsyncData 取到；只有在初始加载失败时才重试一次
  if (initialConfigError.value) {
    await loadConfig()
  }
  updateTime()
  timerId = window.setInterval(updateTime, 1000)

  // Close dropdowns when clicking outside
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  if (timerId !== null) {
    window.clearInterval(timerId)
    timerId = null
  }
})

// Methods
const loadConfig = async () => {
  try {
    const data = await $fetch<SiteConfig>('/api/config')
    config.value = data
    configLoaded.value = true
  } catch {
    // 保持「禁止保存」状态：此时 config 还是内置默认值，保存会覆盖线上真实配置
    configLoaded.value = false
    showNotification('加载配置失败，已禁用保存以避免覆盖线上配置，请刷新重试', 'error')
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

const closeDropdowns = (e: Event) => {
  if (!(e.target as HTMLElement).closest('.nav-item.dropdown')) {
    adminDropdownOpen.value = false
  }
}

const handleSearch = (query: string, engine: SearchEngine) => {
  console.log('Search triggered:', { query, engine: engine.name })
}

const logout = async () => {
  try {
    // 清除服务端的 httpOnly cookie
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // 登出接口异常也继续跳转，避免用户卡在后台
  }
  await navigateTo('/login')
}

const saveConfig = async () => {
  if (!configLoaded.value) {
    throw new Error('配置尚未成功加载，已阻止保存以避免覆盖线上配置，请刷新重试')
  }

  saving.value = true
  try {
    // 已登录状态由 httpOnly cookie 自动携带，无需手动加 Authorization
    await $fetch('/api/config', {
      method: 'POST',
      body: config.value
    })
  } catch (error: any) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      showNotification('登录已过期，请重新登录', 'error')
      await logout()
    }
    throw error
  } finally {
    saving.value = false
  }
}

// Modal Handlers
const handleSaveSiteInfo = async (newConfig: SiteConfig) => {
  try {
    // Optimistically update
    config.value = { ...config.value, ...newConfig }
    await saveConfig()
    showSiteInfoModal.value = false
    showNotification('网站信息保存成功')
  } catch (error: any) {
    showNotification(
      error?.data?.message || error?.data?.statusMessage || error?.message || '保存失败',
      'error'
    )
  }
}

const handleChangePassword = async (data: any) => {
  if (data.error) {
    showNotification(data.error, 'error')
    return
  }

  try {
    saving.value = true
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: data.current,
        newPassword: data.new
      }
    })
    showChangePasswordModal.value = false
    showNotification('密码修改成功，即将退出登录')
    setTimeout(() => {
      void logout()
    }, 3000)
  } catch (error: any) {
    showNotification(error?.data?.message || error?.data?.statusMessage || '密码修改失败', 'error')
  } finally {
    saving.value = false
  }
}

const handleAddEngine = async (data: any) => {
  if (data.error) {
    showNotification(data.error, 'error')
    return
  }

  try {
    config.value.links.searchEngines.push({
      name: data.name,
      url: data.url,
      placeholder: data.placeholder || '',
      icon: data.icon || '',
      color: ''
    })
    await saveConfig()
    showAddEngineModal.value = false
    showNotification('搜索引擎添加成功')
  } catch {
    showNotification('添加失败', 'error')
  }
}

const handleCategorySubmit = async (categoryData: any) => {
  if (categoryData.error) {
    showNotification(categoryData.error, 'error')
    return
  }

  if (editingCategoryIndex.value !== null) {
    // Update existing category
    config.value.links.categories[editingCategoryIndex.value].title = categoryData.title
    config.value.links.categories[editingCategoryIndex.value].icon = categoryData.icon
    showNotification('分类更新成功', 'success')
  } else {
    // Add new category
    config.value.links.categories.push({
      title: categoryData.title,
      icon: categoryData.icon,
      links: []
    })
    showNotification('分类添加成功', 'success')
  }

  try {
    await saveConfig()
    showAddCategoryModal.value = false
    editingCategoryIndex.value = null // Reset editing index
  } catch (error: any) {
    showNotification(error?.message || '分类保存失败', 'error')
  }
}

// Reset editing index when modal is closed
watch(showAddCategoryModal, (newVal) => {
  if (!newVal) {
    editingCategoryIndex.value = null
  }
})

const editCategory = (index: number) => {
  editingCategoryIndex.value = index
  showAddCategoryModal.value = true
}

const addNewLink = (categoryIndex: number) => {
  activeCategoryIndex.value = categoryIndex
  linkModalMode.value = 'add'
  currentLinkData.value = { name: '', url: '', icon: '' }
  showLinkModal.value = true
}

const openLinkModal = (categoryIndex: number, linkIndex: number) => {
  activeCategoryIndex.value = categoryIndex
  activeLinkIndex.value = linkIndex
  linkModalMode.value = 'edit'
  currentLinkData.value = { ...config.value.links.categories[categoryIndex].links[linkIndex] }
  showLinkModal.value = true
}

const handleSaveLink = async (data: any) => {
  if (data.error) {
    showNotification(data.error, 'error')
    return
  }

  try {
    const newLink = {
      name: data.name,
      url: data.url,
      icon: data.icon || ''
    }

    if (linkModalMode.value === 'add') {
      config.value.links.categories[activeCategoryIndex.value].links.push(newLink)
    } else {
      config.value.links.categories[activeCategoryIndex.value].links[activeLinkIndex.value] =
        newLink
    }

    await saveConfig()
    showLinkModal.value = false
    showNotification(linkModalMode.value === 'add' ? '链接添加成功' : '链接更新成功')
  } catch {
    showNotification('保存失败', 'error')
  }
}

const handleDeleteLink = async () => {
  try {
    config.value.links.categories[activeCategoryIndex.value].links.splice(activeLinkIndex.value, 1)
    await saveConfig()
    showLinkModal.value = false
    showNotification('链接删除成功')
  } catch {
    showNotification('删除失败', 'error')
  }
}

const handleFetchLinkInfo = (result: any) => {
  if (result.error) {
    showNotification(result.error, 'error')
  } else if (result.success) {
    showNotification('获取网站信息成功')
  }
}

const handleSaveCopyright = async (data: any) => {
  try {
    config.value.copyright = data
    await saveConfig()
    showCopyrightModal.value = false
    showNotification('版权设置保存成功')
  } catch {
    showNotification('保存失败', 'error')
  }
}

const showNotification = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success'
) => {
  notification.value = { show: true, message, type }
}

// Drag and Drop Logic
interface DraggedItemState {
  type: 'link' | 'category'
  categoryIndex: number
  linkIndex?: number
}

const draggedItem = ref<DraggedItemState | null>(null)

// Link Drag Handlers
const onLinkDragStart = (event: DragEvent, categoryIndex: number, linkIndex: number) => {
  draggedItem.value = { type: 'link', categoryIndex, linkIndex }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.stopPropagation() // Prevent category drag start
  }
}

const onLinkDragOver = (event: DragEvent, categoryIndex: number) => {
  if (draggedItem.value?.type === 'link' && draggedItem.value.categoryIndex === categoryIndex) {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
}

const onDragOverContainer = (event: DragEvent) => {
  if (draggedItem.value?.type === 'link' && event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onLinkDragEnter = (
  event: DragEvent,
  targetCategoryIndex: number,
  targetLinkIndex: number
) => {
  if (!draggedItem.value || draggedItem.value.type !== 'link') return

  const { categoryIndex: sourceCategoryIndex, linkIndex: sourceLinkIndex } = draggedItem.value

  if (sourceLinkIndex === undefined) return
  if (sourceCategoryIndex !== targetCategoryIndex) return
  if (sourceLinkIndex === targetLinkIndex) return

  const category = config.value.links.categories[sourceCategoryIndex]
  const links = [...category.links]

  const [movedItem] = links.splice(sourceLinkIndex, 1)
  links.splice(targetLinkIndex, 0, movedItem)

  config.value.links.categories[sourceCategoryIndex].links = links
  draggedItem.value.linkIndex = targetLinkIndex
}

const onLinkDrop = async (
  _event: DragEvent,
  _targetCategoryIndex: number,
  _targetLinkIndex: number
) => {
  if (!draggedItem.value || draggedItem.value.type !== 'link') return

  try {
    await saveConfig()
    showNotification('链接排序已更新')
  } catch {
    showNotification('排序保存失败', 'error')
  }

  draggedItem.value = null
}

const isLinkDragging = (categoryIndex: number, linkIndex: number) => {
  return (
    draggedItem.value?.type === 'link' &&
    draggedItem.value.categoryIndex === categoryIndex &&
    draggedItem.value.linkIndex === linkIndex
  )
}

// Category Drag Handlers
const onCategoryDragStart = (event: DragEvent, categoryIndex: number) => {
  draggedItem.value = { type: 'category', categoryIndex }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
  }
}

const onCategoryDragOver = (event: DragEvent, _categoryIndex: number) => {
  if (draggedItem.value?.type === 'category') {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
}

const onCategoryDragEnter = (event: DragEvent, targetCategoryIndex: number) => {
  if (!draggedItem.value || draggedItem.value.type !== 'category') return

  const sourceCategoryIndex = draggedItem.value.categoryIndex

  if (sourceCategoryIndex === targetCategoryIndex) return

  const categories = [...config.value.links.categories]

  const [movedCategory] = categories.splice(sourceCategoryIndex, 1)
  categories.splice(targetCategoryIndex, 0, movedCategory)

  config.value.links.categories = categories
  draggedItem.value.categoryIndex = targetCategoryIndex
}

const onCategoryDrop = async (_event: DragEvent, _targetCategoryIndex: number) => {
  if (!draggedItem.value || draggedItem.value.type !== 'category') return

  try {
    await saveConfig()
    showNotification('分类排序已更新')
  } catch {
    showNotification('排序保存失败', 'error')
  }

  draggedItem.value = null
}

const isCategoryDragging = (categoryIndex: number) => {
  return draggedItem.value?.type === 'category' && draggedItem.value.categoryIndex === categoryIndex
}
</script>

<style scoped>
@import url('~/assets/css/variables.css');

#copyright {
  color: #ffffff;
}

.copyright-link {
  color: #87ceeb;
}

.config-warning {
  max-width: 1200px;
  margin: 0 auto 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 193, 7, 0.95);
  color: #212529;
  font-size: 14px;
  text-align: center;
}
@import url('~/assets/css/style.css');
@import url('~/assets/css/index.css');

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Right-aligned navigation container */
.navbar-nav-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1000;
}

.navbar-nav-right .nav-item {
  display: flex;
  margin-right: 1rem;
  margin-left: 0;
  align-items: center;
}

.navbar-nav-right .nav-item:last-child {
  margin-right: 0;
}

.navbar-nav-right .nav-link {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0px 1px 0px #000;
  padding: 0;
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
  background: var(--bg-glass, rgba(255, 255, 255, 0.15));
  border: none;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.2));
  backdrop-filter: blur(10px);
  animation: dropdownFadeIn 0.2s ease-out;
  transform-origin: top right;
}

.navbar-nav-right .dropdown-menu .dropdown-item {
  padding: 8px 20px;
  color: #208be4;
  font-size: 14px;
  transition: all 0.2s ease;
  text-align: center;
  font-weight: 500;
  text-shadow: 0px 1px 2px rgba(23, 69, 170, 0.164);
}

.navbar-nav-right .dropdown-menu .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.993);
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

.edit-tools {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-title:hover .edit-tools {
  opacity: 1;
}

.category-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 
/* Responsive adjustments */
@media (max-width: 768px) {
  .category-links {
    justify-content: space-between;
  }

  .lylme-3 {
    width: 30%;
    height: auto;
    aspect-ratio: 1;
  }
}
</style>
