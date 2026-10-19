<template>
  <div>
    <!-- 首屏背景由服务端内联渲染，避免挂载后再设置导致闪动 -->
    <div
      v-if="config.backgroundImage"
      class="page-background"
      :style="{ backgroundImage: `url(${config.backgroundImage})` }"
      aria-hidden="true"
    />
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <button
        class="navbar-toggler"
        :class="{ collapsed: !isMenuOpen }"
        type="button"
        @click="toggleMenu"
      >
        <IconComponent icon="#icon-menus" size="24" />
        <span v-if="isMenuOpen">
          <IconComponent icon="#icon-closes" size="24" />
        </span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }" id="navbarsExample05">
        <ul class="navbar-nav mr-auto" id="nav-items">
          <li v-for="item in config.links.navItems" :key="item.id" class="nav-item">
            <a class="nav-link" :href="item.url" :id="item.id">{{ item.name }}</a>
          </li>
        </ul>
        <div id="he-plugin-simple"></div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container" style="margin-top:10vh;">
      <div id="main">
        <!-- Time Display -->
        <div class="time-display">
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
          <div v-for="category in config.links.categories" :key="category.title" class="category-container">
            <div class="category-title">
              <IconComponent :icon="category.icon" type="title" size="20" class="title-icon" />
              <span>{{ category.title }}</span>
            </div>
            <ul class="category-links">
              <li v-for="link in category.links" :key="link.url" class="lylme-3">
                <a :href="link.url" target="_blank" rel="nofollow">
                  <IconComponent :icon="link.icon" type="link" size="45" class="link-icon" loading="lazy" />
                  <span>{{ link.name }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Back to Top -->
    <div v-show="showBackToTop" class="back-to" id="toolBackTop">
      <a title="返回顶部" @click="scrollToTop" class="back-top"></a>
    </div>

    <!-- Footer -->
    <footer class="mt-5 mb-3 footer text-muted text-center">
      <p v-html="copyrightHtml" id="copyright"></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { SiteConfig, SearchEngine } from '~/types/config'
import { defaultConfig } from '~/utils/config'
import IconComponent from '~/components/IconComponent.vue'
import SearchBox from '~/components/SearchBox.vue'

// 关键：在服务端渲染阶段就取到真实配置。
// 之前是 ref(defaultConfig) + onMounted 里 $fetch，
// 导致首屏 SSR 输出的是内置默认配置，客户端挂载后才被替换 —— 这就是刷新时闪一下旧配置的原因。
// useAsyncData 的结果会随 SSR payload 一起下发，首屏即为最新配置。
const { data: initialConfig } = await useAsyncData<SiteConfig>(
  'site-config',
  () => $fetch<SiteConfig>('/api/config'),
  { default: () => defaultConfig }
)

// State
const config = ref<SiteConfig>(initialConfig.value ?? defaultConfig)
const currentTime = ref('')
const currentDate = ref('')
const isMenuOpen = ref(false)
const showBackToTop = ref(false)
let timerId: number | null = null

// SEO 头信息：使用函数形式，配置加载/变更后自动更新
useHead(() => ({
  title: config.value.title,
  meta: [
    { name: 'description', content: config.value.description },
    { name: 'keywords', content: config.value.keywords },
    { name: 'author', content: config.value.author }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: config.value.favicon }
  ]
}))

// SVG icons are loaded by plugin

// Computed
const copyrightHtml = computed(() => {
  if (!config.value.copyright.show) return ''

  let html = `<span style="color: #ffffff;">Copyright ©${config.value.copyright.text} <a href='/' target='_blank' style="color: #87CEEB;">${config.value.copyright.target}</a>. All Rights Reserved.</span>`

  if (config.value.copyright.showRecord) {
    html += `<br><span style="color: #87CEEB;"><a href="${config.value.copyright.recordUrl}" target="_blank" style="color: #87CEEB;">${config.value.copyright.record}</a></span>`
  }

  return html
})

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 100
}

// Time display
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

// Lifecycle
onMounted(async () => {
  // 配置已在 setup 阶段（含 SSR）取到，这里不再重复请求

  // 背景已由模板中的 .page-background 内联渲染，无需在此设置

  // Load weather widget with error handling
  if (typeof window !== 'undefined') {
    // Extend Window interface for weather widget
    ;(window as any).WIDGET = {
      "CONFIG": {
        "modules": "12043",
        "background": "5",
        "tmpColor": "FFFFFF",
        "tmpSize": "16",
        "cityColor": "FFFFFF",
        "citySize": "18",
        "aqiColor": "FFFFFF",
        "aqiSize": "16",
        "weatherIconSize": "24",
        "alertIconSize": "18",
        "padding": "0px 0px 0px 0px",
        "shadow": "0",
        "language": "auto",
        "fixed": "false",
        "vertical": "center",
        "horizontal": "center",
        "right": "0",
        "top": "0",
        "key": "9d714f8dd6b94c7696f9cea8dc3ed1c5"
      }
    }

    // Load weather widget script with error handling
    const weatherScript = document.createElement('script')
    weatherScript.src = 'https://apip.weatherdt.com/view/staticJS/rain.jsv2.js'
    weatherScript.onload = () => {
      console.log('Weather widget loaded successfully')
    }
    weatherScript.onerror = () => {
      console.warn('Weather widget failed to load - this is expected due to SSL/network issues')
      // Hide weather widget container if script fails to load
      const weatherContainer = document.getElementById('he-plugin-simple')
      if (weatherContainer) {
        weatherContainer.style.display = 'none'
      }
    }
    document.head.appendChild(weatherScript)
  }

  // Initialize time
  updateTime()
  timerId = window.setInterval(updateTime, 1000)

  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (timerId !== null) {
    window.clearInterval(timerId)
    timerId = null
  }
})
</script>


<style scoped>
/* 首屏背景层：固定定位铺满视口，位于内容之下 */
.page-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  pointer-events: none;
}
</style>
