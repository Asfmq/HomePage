<template>
  <div>
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
          :initial-engine="config.links.searchEngines[0]"
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

// State
const config = ref<SiteConfig>(defaultConfig)
const currentTime = ref('')
const currentDate = ref('')
const isMenuOpen = ref(false)
const showBackToTop = ref(false)

// Load config
try {
  const siteConfig = await $fetch<SiteConfig>('/api/config')
  if (siteConfig) {
    config.value = siteConfig
  }
} catch (error) {
  console.warn('Failed to load site config, using default:', error)
  // Keep using defaultConfig
}

// Update head based on config
useHead({
  title: config.value.title,
  meta: [
    { name: 'description', content: config.value.description },
    { name: 'keywords', content: config.value.keywords },
    { name: 'author', content: config.value.author }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: config.value.favicon }
  ]
})

// SVG icons are loaded by plugin

// Computed
const copyrightHtml = computed(() => {
  if (!config.value.copyright.show) return ''

  let html = `Copyright ©${config.value.copyright.text} <a href='/' target='_blank'>${config.value.copyright.target}</a>. All Rights Reserved.`

  if (config.value.copyright.showRecord) {
    html += `<br><a href="${config.value.copyright.recordUrl}" target="_blank">${config.value.copyright.record}</a>`
  }

  return html
})

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleSearch = (query: string, engine: SearchEngine) => {
  // This event handler is called by the SearchBox component
  console.log('Search triggered:', query, engine.name)
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
onMounted(() => {
  // Set background
  if (config.value.backgroundImage) {
    document.body.style.backgroundImage = `url(${config.value.backgroundImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundAttachment = 'fixed'
  }

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
  setInterval(updateTime, 1000)

  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Time Display */
.time-display {
  margin: 40px 0;
  text-align: center;
}

#show_time {
  font-size: 80px;
  font-weight: bold;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.7);
}

#show_date {
  font-size: 18px;
  color: #fff;
  margin-top: 10px;
  text-shadow: 0px 1px 0px #252525;
}

/* Search Box - styles moved to SearchBox component */

/* Search Engine Selection */
.search-type {
  white-space: nowrap;
  margin: 0;
  padding: 10px 0;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.search-type li {
  margin: 0;
  padding: 8px 15px;
  display: block;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-type li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Search Suggestions */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  margin: 0;
  padding: 0;
  list-style: none;
}

.search-suggestions li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-suggestions li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Categories */
.category-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 30px auto;
  padding: 0 20px;
}

.category-title {
  width: 100%;
  height: 35px;
  line-height: 33px;
  margin-bottom: 10px;
  margin-top: 20px;
  font-size: 17px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
  text-align: left !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-title:hover {
  opacity: 0.8;
}

.category-title .title-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.category-links {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lylme-3 {
  width: 100px;
  transition: 0.3s all linear;
  font-size: 14px;
  overflow: hidden;
  padding: 10px 2px;
  box-shadow: 2px 2px 10px 0px rgb(0 0 0 / 40%);
  backdrop-filter: saturate(100%) blur(30px);
  margin: 10px;
  display: flex;
  flex-direction: row;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
}

.lylme-3:hover {
  backdrop-filter: blur(0px);
  transform: translateY(5px);
}

.lylme-3 svg,
.lylme-3 img {
  display: block;
  width: 45px;
  height: 45px;
  padding: 4px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eee;
  margin: 0 auto 0.3rem;
}

.lylme-3 span {
  width: 100%;
  text-align: center;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lylme-3 a {
  width: 100%;
  color: #fff;
  display: block;
  text-decoration: none;
}

/* Navigation */
.navbar-light .navbar-nav .nav-link {
  color: #fff !important;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0px 1px 0px #000;
}

li.nav-item a {
  color: #fff !important;
}

/* Force navbar items to be horizontal */
#nav-items {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

#nav-items .nav-item {
  display: block !important;
  float: left !important;
  margin-right: 1rem !important;
}

#nav-items .nav-link {
  display: block !important;
  float: left !important;
}

/* Bootstrap override fix */
.navbar-expand-lg .navbar-nav {
  flex-direction: row !important;
}

.navbar-expand-lg .navbar-nav .nav-item {
  float: left !important;
}

.navbar-expand-lg .navbar-nav .nav-link {
  float: left !important;
}

/* Ensure navbar nav items are horizontally aligned */
.navbar-nav {
  flex-direction: row !important;
  display: flex !important;
}

.navbar-nav .nav-item {
  display: inline-block !important;
}

.navbar-nav .nav-link {
  display: inline-block !important;
}

/* Force horizontal layout for all screen sizes */
@media (min-width: 1px) {
  .navbar-nav {
    flex-direction: row !important;
  }

  .navbar-nav .nav-item {
    display: inline-block !important;
    margin-right: 1rem;
  }

  .navbar-nav .nav-link {
    display: inline-block !important;
  }
}

/* Footer */
.footer {
  margin-top: 60px;
  text-align: center;
}

.footer p {
  margin: 5px 0;
  color: #fff !important;
  text-shadow: 0px 1px 0px #252525;
}

.footer a {
  color: #fff !important;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

/* Back to Top */
.back-to {
  position: fixed;
  bottom: 66px;
  right: 10px;
  z-index: 999;
}

.back-top {
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWBAMAAADZWBo2AAAALVBMVEUAAAB5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl4rtNiAAAADnRSTlMARHe7Zu7dMxGIIqqZzHSj3DwAAAB/SURBVVBjTYwADPgYk8OABgs2HLPUAjBA6+JAk4FJ8UJLqYLKxsQNTXhIDs/GWBoZCPcEFeop6CnyKvhMYGOQYGJIYmBL4BBgfgDjsrxi4nvMJsCSAOCChh3yHjjqAZV4wcDznO6TFANYTwsASwCfAAOFMFRCdAOd0v3vdAOIAANnHHKk0/kXuAAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.back-top:hover {
  opacity: 1;
}

/* SVG Icons */
.svg-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
}

.engine-icon,
.link-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  #show_time {
    font-size: 50px;
  }

  .category-links {
    justify-content: center;
  }

  .lylme-3 {
    width: 80px;
  }

  .lylme-3 svg,
  .lylme-3 img {
    width: 35px;
    height: 35px;
  }

  div#navbarsExample05 {
    background: rgba(0,0,0,0.8);
    padding: 10px 30px;
    border-radius: 20px;
  }

  #he-plugin-simple {
    display: none !important;
  }
}
</style>