<template>
  <div>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="/">{{ config.title }}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto" id="nav-items">
            <li v-for="item in config.links.navItems" :key="item.id" class="nav-item">
              <a class="nav-link" :href="item.url" :id="item.id">{{ item.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div id="main" class="container">
      <!-- Time Display -->
      <div class="time-display">
        <div id="show_time">{{ currentTime }}</div>
        <div id="show_date">{{ currentDate }}</div>
      </div>

      <!-- Search Section -->
      <div class="search-container">
        <div class="search-engine-selector">
          <select id="checke-so" v-model="selectedSearchEngine" class="form-control">
            <option v-for="engine in config.links.searchEngines" :key="engine.name" :value="engine">
              {{ engine.name }}
            </option>
          </select>
        </div>
        <form id="search-lylme" @submit.prevent="performSearch" class="search-box">
          <input
            id="search-text"
            v-model="searchQuery"
            type="text"
            :placeholder="selectedSearchEngine.placeholder || selectedSearchEngine.name"
            class="form-control"
            required
          >
          <button id="search-submit" type="submit">
            <i class="fas fa-search"></i>
          </button>
        </form>
      </div>

      <!-- Categories -->
      <div class="categories-container">
        <div v-for="category in config.links.categories" :key="category.title" class="category-section">
          <h3 class="category-title">
            <i v-if="category.icon" :class="getIconClass(category.icon)"></i>
            {{ category.title }}
          </h3>
          <div class="links-grid">
            <a
              v-for="link in category.links"
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
            >
              <div class="link-icon">
                <img v-if="isImageUrl(link.icon)" :src="link.icon" :alt="link.name" class="icon-img">
                <i v-else-if="link.icon" :class="getIconClass(link.icon)"></i>
              </div>
              <span class="link-name">{{ link.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer v-if="config.copyright.show" class="footer">
      <div class="container text-center">
        <p>&copy; {{ config.copyright.text }} {{ config.copyright.target }}</p>
        <p v-if="config.copyright.showRecord" class="icp">
          <a :href="config.copyright.recordUrl" target="_blank" rel="noopener noreferrer">
            {{ config.copyright.record }}
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { SiteConfig, SearchEngine } from '~/types/config'
import { defaultConfig } from '~/utils/config'

// State
const config = ref<SiteConfig>(defaultConfig)
const currentTime = ref('')
const currentDate = ref('')
const searchQuery = ref('')
const selectedSearchEngine = ref<SearchEngine>(defaultConfig.links.searchEngines[0])

// Load config
const { data: siteConfig } = await $fetch<SiteConfig>('/api/config').catch(() => ({ data: defaultConfig }))
if (siteConfig) {
  config.value = siteConfig
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

// Set background
onMounted(() => {
  if (config.value.backgroundImage) {
    document.body.style.backgroundImage = `url(${config.value.backgroundImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundAttachment = 'fixed'
  }
})

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

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

// Search functionality
const performSearch = () => {
  if (searchQuery.value.trim() && selectedSearchEngine.value) {
    const searchUrl = selectedSearchEngine.value.url + encodeURIComponent(searchQuery.value.trim())
    window.open(searchUrl, '_blank')
  }
}

// Utility functions
const isImageUrl = (icon: string): boolean => {
  return icon.startsWith('http') || icon.startsWith('/') || icon.endsWith('.ico') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.svg')
}

const getIconClass = (icon: string): string => {
  // Handle FontAwesome icons or other icon classes
  if (icon.startsWith('#')) {
    // Handle SVG icon references or custom icon mapping
    return 'fas fa-external-link-alt' // Default fallback
  }
  return icon
}
</script>

<style scoped>
.navbar {
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

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

.search-container {
  max-width: 600px;
  margin: 40px auto;
}

.search-engine-selector {
  margin-bottom: 15px;
}

#checke-so {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

#checke-so option {
  background: #333;
  color: #fff;
}

.search-box {
  position: relative;
  backdrop-filter: saturate(100%) blur(10px);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 0px 2px 12px 0px rgb(34 34 38 / 10%);
  overflow: hidden;
}

#search-text {
  border: none;
  background: transparent;
  font-size: 18px;
  padding: 15px 50px 15px 20px;
  width: 100%;
  color: #222226;
  outline: none;
}

#search-text::placeholder {
  color: #555666;
}

#search-submit {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  padding: 15px 20px;
  color: #222226;
  cursor: pointer;
  outline: none;
}

#search-submit:hover {
  background-color: rgba(255, 255, 255, 0.342);
}

.categories-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.category-section {
  margin-bottom: 50px;
}

.category-title {
  color: #fff;
  font-size: 24px;
  margin-bottom: 25px;
  text-align: center;
  text-shadow: 0px 1px 0px #252525;
}

.category-title i {
  margin-right: 10px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.link-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  color: #fff;
  text-decoration: none;
}

.link-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.link-name {
  font-size: 14px;
  text-align: center;
  line-height: 1.2;
  text-shadow: 0px 1px 0px #252525;
}

.footer {
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  padding: 30px 0;
  margin-top: 60px;
  backdrop-filter: blur(10px);
}

.footer p {
  margin: 5px 0;
  color: #fff;
  text-shadow: 0px 1px 0px #252525;
}

.footer a {
  color: #fff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  #show_time {
    font-size: 50px;
  }

  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
  }

  .search-container {
    margin: 20px;
  }
}
</style>